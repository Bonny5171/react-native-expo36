import axios from 'axios';
import { services as config } from '../../../../config';
import Db from './Db';
import squel from '../squelConfig';
import { getToken, getUserId } from '../../Auth';
import ParamDb from './ParamDb';
import DeviceInfo from '../../DeviceInfo';
import SchemaDb from './SchemaDb';
/* eslint-disable */
let TrackingChange = (function () {
    let __sym = Symbol('TrackingChangeClass');

    class TrackingChangeClass {
        constructor(repository, deviceId) {
            this[__sym] = {};
            this.repository = repository;
            this.isRunning = false;
            this.currentExec = null;
            this.percent = 0;
            this.remoteChangesLength = 0;
            this.testDbFunc = null;

            this.cfg = config.find(srv => srv.nome === repository);
            if (!this.cfg) {
                throw new Error(`Oooops! para o serviço ${service} não foi localizado sua configuração para prosseguir.`);
            }

            this.db = new Db(repository, deviceId);
            this.param = new ParamDb(this.db);
            this.schemaDb = new SchemaDb(repository, this.db);

            this.paramValues = null;
        }

        on(event, callback) {
            this[__sym][event] = { callback };
        }

        setEventProcess(status, message, percent, count = 0, total = 0, tableName = '') {
            const event = this[__sym].progress;
            let userPercent = 0;

            if (event && event.callback) {
                if (percent === null) {
                    userPercent = this.percent + (((count * 100) / total));

                    if (userPercent > 100) { userPercent = 100; }
                } else {
                    userPercent = this.percent = percent;
                }
                let p2 = 0
                if (userPercent) {
                    p2 = userPercent !== 100 ? Number(userPercent).toFixed(2) : userPercent;
                }
                const obj = {
                    status: status,
                    percent: p2,
                    message: message,
                    repository: `${this.repository}`,
                    tableName: tableName
                };
                event.callback(obj);
                //console.log(`>>> ${this.repository}: setEventProcess() >>> ${JSON.stringify(obj)}`);
            }
        }

        async processAllChanges() {
            return new Promise(async (resolve, reject) => {
                this.isRunning = true;
                this.percent = 0;
                this.remoteChangesLength = 0;
                try {
                    this.setEventProcess('processAllChanges', 'Preparando', 0);
                    console.log(`>>> ${this.repository}: processDbSchemaChanges...`);
                    await this.schemaDb.processRemote();

                    console.log(`>>> ${this.repository}: processAllChanges...`);
                    const tables = await this.getCurrentTrackingChanges();
                    let count = 0;

                    await Promise.all(tables.map(async item => {
                        await this.processRemoteChanges(item);
                        count++;
                        this.setEventProcess('processRemoteChanges', 'Sincronizado', null, count, tables.length, item.table_name);
                    }));

                    this.setEventProcess('processAllChanges', 'Finalizado', 100);
                    this.param.set('TRACKING_CHANGE_LATEST_STATUS', 'success');
                    this.param.set('TRACKING_CHANGE_LATEST_DATE', this.param.LOCAL_DATE_TIME);

                    this.isRunning = false;
                    resolve();
                } catch (err) {
                    this.param.set('TRACKING_CHANGE_LATEST_STATUS', 'error|' + err);
                    // console.error(err)
                    this.isRunning = false;
                    resolve();
                }
            }).catch((err) => {
                this.param.set('TRACKING_CHANGE_LATEST_STATUS', 'error|' + err);
                console.log(err);
            });
        }

        async getAllTables() {
            return await this.db.query(
                squel
                    .select()
                    .field('tbl_name', 'table_name')
                    .field('0', 'tracking_change_id')
                    .from('sqlite_master')
                    .where('type = ?', 'table')
                    .where('sql like ?', '%tracking_change_id%')
            );
        }

        async getCurrentTrackingChanges() {
            const tables = await this.getAllTables();

            return await Promise.all(tables._array.map(async table => {
                const item = await this.db.queryOne(
                    squel
                        .select()
                        .field('ifnull(max(abs(tracking_change_id) ), 0)', 'tracking_change_id')
                        .from(table.table_name)
                );

                table.tracking_change_id = item.tracking_change_id;
                return table;
            }));
        }

        async processRemoteChanges(item) {
            return new Promise(async (resolve, reject) => {
                const queuePendingChanges = [];
                const limit = this.paramValues.TRACKING_CHANGE_LIMIT_REQUEST || 1000;
                console.log(`>>> ${this.repository}: ${item.table_name} [local_id: ${item.tracking_change_id}]`);

                if (await DeviceInfo.isOnline() === true) {
                    const remoteChanges = await this.fetchTrackingChanges(item.table_name, item.tracking_change_id, limit);
                    console.log(`>>> ${this.repository}: ${item.table_name} [remote_length: ${remoteChanges.length}]`);

                    if (remoteChanges.length > 0) {
                        this.remoteChangesLength++;

                        queuePendingChanges.push({
                            tableName: item.table_name,
                            remoteChanges
                        });

                        await Promise.all(queuePendingChanges.map(async item => {
                            await this.computeTableChanges(item.tableName, item.remoteChanges);
                        }));

                        if (remoteChanges.length === limit) {
                            await this.processRemoteChanges({
                                table_name: item.table_name,
                                tracking_change_id: remoteChanges[limit - 1].id
                            });
                        }
                        resolve();
                    }
                    else {
                        resolve();
                    }
                } else {
                    console.log(`>>> ${this.repository}: device is off-line...`);
                    resolve();
                }
            });
        }

        async fetchTrackingChanges(tableName, id, limit) {
            const { host, version, path } = this.cfg;
            const noCache = `&bust${new Date().getTime()}${tableName}${id}=${new Date().getTime()}${tableName}${id}`;
            let filterWhere = `&filter[where][id][gt]=${id}&filter[where][table_name]=${tableName}&filter[where][schema_name]=public&filter[where][tenant_id]=1`;

            if (tableName === 'sf_share') {
                const userId = await getUserId();
                filterWhere += `&filter[where][user_id]=${userId}`;
            }

            const filterFields = '&filter[fields][id]=true&filter[fields][changed_fields_statement]=true&filter[fields][action]=true&filter[fields][pk]=true'; // &filter[fields][changed_fields]=true`;
            const filterOrder = '&filter[order]=id';
            const filterLimit = `&filter[limit]=${limit}`;

            const response = await axios.get(`${host}${version}${path.trackingChanges}?${noCache}${filterWhere}${filterFields}${filterOrder}${filterLimit}`, {
                cache: 'no-cache',
                headers: {
                    'authorization': 'Bearer ' + (await getToken()),
                    'Content-Encoding': 'gzip, deflate',
                    'cache-control': 'no-cache, no-store, must-revalidate',
                    'pragma': 'no-cache',
                    'expires': 0,
                },
            });
            if (response.status === 200) {
                return await response.data;
            }

            throw new Error(`Fetch tracking changes ${tableName}[${id}]`);
        }

        async computeTableChanges(tableName, remoteChanges) {
            const arrSql = [];

            for (const item of remoteChanges) {
                //this.setEventProcess('computeAllChanges', 'Processando...', null, count, remoteChanges.length, tableName, this.remoteChangesLength);
                // console.log(`>>> ${this.repository}: ${tableName} [id: ${item.id}, action: ${item.action}, pk: ${item.pk}]`);
                // console.log(change);

                if (item.action == 'D') {
                    arrSql.push(squel
                        .update()
                        .table(tableName)
                        .set('tracking_change_id', item.id)
                        .set('is_deleted', true)
                        .set('deleted_at', "strftime('%Y-%m-%dT%H:%M:%fZ','now', 'localtime')", { dontQuote: true })
                        .where('id = ?', item.pk)
                        .toString());
                } else if (item.action == 'T') {
                    arrSql.push(squel
                        .delete()
                        .from(tableName)
                        .where('tracking_change_id < ?', item.id)
                        .where('tracking_change_id > 0')
                        .toString());
                } else if (item.action == 'I') {
                    arrSql.push(item.changed_fields_statement.replace('INSERT INTO', 'INSERT OR REPLACE INTO').replace(",E'", ",'"));
                } else {
                    arrSql.push(item.changed_fields_statement);

                    // let rowsAffected = await this.db.exec(item.changed_fields_statement);
                    // if (item.action == 'U' && rowsAffected === 0) {
                    //     console.warn(`>>> ${this.repository}: ${tableName} [id: ${item.id}, action: ${item.action}, pk: ${item.pk}, rowsAffected: ${rowsAffected}]`);
                    //     // const arr = [];
                    //     // arr.push(item.changed_fields);

                    //     // rowsAffected = await this.db.exec(squel
                    //     //   .insert()
                    //     //   .into(tableName)
                    //     //   .setFieldsRows(arr).toString()
                    //     // )
                    // }
                }
            }

            return await this.db.execQueue(arrSql);
        }

        async removeAllData() {
            const tables = await this.getAllTables();

            await Promise.all(tables._array.map(async item => {
                const rowsAffected = await this.db.exec(
                    squel
                        .delete()
                        .from(item.table_name)
                        .toString()
                );

                console.log(`>>> ${this.repository}: ${item.table_name} [rows deleted: ${rowsAffected}]`);
            }));
        }

        async removeAllSchemaAndData() {
            const tables = await this.db.query(
                squel
                    .select()
                    .field('tbl_name', 'table_name')
                    .from('sqlite_master')
                    .where('type = ?', 'table')
            );

            await Promise.all(tables._array.map(async item => {
                await this.db.exec(`DROP TABLE ${item.table_name}`);
            }));

            const views = await this.db.query(
                squel
                    .select()
                    .field('tbl_name', 'view_name')
                    .from('sqlite_master')
                    .where('type = ?', 'view')
            );

            await Promise.all(views._array.map(async item => {
                await this.db.exec(`DROP VIEW ${item.view_name}`);
            }));

            await this.db.exec('CREATE TABLE [parameter] ([id] TEXT PRIMARY KEY NOT NULL COLLATE NOCASE, type TEXT NOT NULL COLLATE NOCASE, value TEXT NOT NULL COLLATE NOCASE) WITHOUT ROWID;');
            console.log(`>>> ${this.repository}: remove all schema and data >>> OK`);
        }

        async start(startSetInterval = true) {
            if (startSetInterval) {
                if (this.currentExec !== null)
                    return;
            }
            await this.checkDb();

            this.paramValues = await this.param.getAll([
                'TRACKING_CHANGE_CHECK_INTERVAL',
                'TRACKING_CHANGE_LIMIT_REQUEST',
                'TRACKING_CHANGE_ENABLED'
            ]);
            const waitFor = (this.paramValues.TRACKING_CHANGE_CHECK_INTERVAL || 1) * 1000 * 60;

            console.log(`>>> TC >>> ${this.repository}: start ()`);
            if (!this.isRunning) { await this.processAllChanges(); }

            if (startSetInterval) {
                console.log(`>>> TC >>> ${this.repository}: wait for ${waitFor} ms`);

                this.currentExec = setInterval(() => {
                    console.log(`>>> TC >>> ${this.repository}: start ${waitFor} ms`);
                    if (!this.isRunning) { this.processAllChanges(); }
                }, waitFor);
            }

        }

        async run() {
            if (!this.isRunning)
                this.start(false);
        }

        async stop() {
            if (this.currentExec !== null) {
                console.log(`>>> ${this.repository}: stop()`);
                clearInterval(this.currentExec);
                this.currentExec = null;
                this.isRunning = false;
            }
        }

        async checkDb() {
            return new Promise(async (resolve, reject) => {
                const testDbFunc = setInterval(() => {
                    this.db.isReady().then((r) => {
                        if (r === 1) {
                            clearTimeout(testDbFunc);
                            resolve();
                        }
                    });
                }, 3000);
            });
        }
    }

    return TrackingChangeClass;
}());

export default TrackingChange;