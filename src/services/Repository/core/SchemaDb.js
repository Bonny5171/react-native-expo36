import axios from 'axios';
import { services as config } from '../../../../config';
import squel from '../squelConfig';
import DeviceInfo from '../../DeviceInfo';
import { getToken } from '../../Auth';
/* eslint-disable */
let SchemaDb = (function () {
    let __sym = Symbol('SchemaDbClass');

    class SchemaDbClass {
        constructor(repository, db) {
            this[__sym] = {};
            this.repository = repository;

            this.cfg = config.find(srv => srv.nome === repository);
            if (!this.cfg) {
                throw new Error(`Oooops! para o serviço ${service} não foi localizado sua configuração para prosseguir.`);
            }

            this.db = db;
        }

        on(event, callback) {
            this[__sym][event] = { callback: callback }
        }

        async processRemote() {
            return new Promise(async (resolve, reject) => {
                if (await DeviceInfo.isOnline() === true) {
                    try {
                        const remoteChanges = await this.fetchRemote();

                        await Promise.all(remoteChanges.map(async item => {
                            await this.processTableAndColumns(item);
                            if (item['triggers']) {
                                await this.processTriggers(item);
                            }
                        }));

                        setTimeout(() => {
                            resolve();
                        }, 3000);

                    } catch (error) {
                        reject(error)
                    }
                }
                else {
                    console.log(`>>> ${this.repository} [schema] >>> device is off-line...`);
                    resolve();
                }
            });
        }

        async processTableAndColumns(tbl) {
            return new Promise(async (resolve, reject) => {
                const localDb = await this.exists(tbl.table_name, 'table');

                if (localDb.rows === 0) {
                    await this.executeCmds([{ ddl: tbl.ddl }]);
                    await this.executeCmds(tbl.columns);
                    console.log(`>>> ${this.repository} [schema] >>> table (new) >>> ${tbl.table_name}`);
                }
                else {
                    await Promise.all(tbl.columns.map(async item => {
                        if (localDb.sql.indexOf(item.column_name) === -1) {
                            await this.executeCmd(item.ddl);
                            console.log(`>>> ${this.repository} [schema] >>> table >>> column (new) >>> ${tbl.table_name}.${item.column_name}`);
                        }
                    }));
                }

                resolve();
            });
        }

        async processTriggers(trg) {
            return await Promise.all(trg.triggers.map(async item => {
                const localDb = await this.exists(item.name, 'trigger');

                if (localDb.rows === 0) {
                    await this.db.execQueueTran([
                        item.command_down,
                        item.command_up.replace('BEGIN', 'BEGIN /*' + item.hash + '*/ ')
                    ]);
                    console.log(`>>> ${this.repository} [schema] >>> table >>> ${trg.table_name} >>> trigger (new) >>> ${item.name}`);
                }
                else {
                    if (localDb.sql.indexOf(item.hash) === -1) {
                        await this.db.execQueueTran([
                            item.command_down,
                            item.command_up.replace('BEGIN', 'BEGIN /*' + item.hash + '*/ ')
                        ]);
                        console.log(`>>> ${this.repository} [schema] >>> table >>> ${trg.table_name} >>> trigger (change) >>> ${item.name}`);
                    } 
                }
            }));
        }

        async fetchRemote() {
            const { host, version } = this.cfg;
            const noCache = `&nocache=${new Date().getTime()}`;
            const response = await axios.get(`${host}${version}/db-schema?${noCache}`,{
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

            throw new Error(`Fetch schema db ${host}`);
        }

        async exists(name, type) {
            return await this.db.queryOne(
                squel
                    .select()
                    .field('count(*) as rows')
                    .field('sql')
                    .from('sqlite_master')
                    .where('type = ?', type)
                    .where('name = ?', name)
            );
        }

        async executeCmds(cmds) {
            return await Promise.all(cmds.map(async item => {
                if (item.ddl.indexOf('CREATE TABLE') > -1) {
                    await this.executeCmd(item.ddl.replace('CREATE TABLE', 'CREATE TABLE IF NOT EXISTS'));
                } else if (item.ddl.indexOf('PRIMARY KEY') === -1) {
                    await this.executeCmd(item.ddl);
                }
            }));
        }

        async executeCmd(cmd) {
            const ddl = cmd.replace('NOT NULL', 'NULL');
            //console.log(`>>> ${this.repository} [schema] >>> ddl >>> ${ddl}`);

            return await this.db.exec(ddl);
        }

    }
    return SchemaDbClass;
}());

export default SchemaDb;