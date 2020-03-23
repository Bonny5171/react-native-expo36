import { services as config } from '../../../../config';
import Db from './Db';
import squel from '../squelConfig';
import { getToken } from '../../Auth';
import ParamDb from './ParamDb';
import DeviceInfo from '../../DeviceInfo';
/* eslint-disable */
let DeviceData = (function () {
    let __sym = Symbol('DeviceDataClass');

    class DeviceDataClass {
        constructor(repository, userId, deviceId) {
            this[__sym] = {};
            this.repository = repository;
            this.isRunning = false;
            this.currentExec = null;

            this.cfg = config.find(srv => srv.nome === repository);
            if (!this.cfg) {
                throw new Error(`Oooops! para o serviço ${service} não foi localizado sua configuração para prosseguir.`);
            }

            this.db = new Db(this.repository, deviceId);
            this.param = new ParamDb(this.db);
            this.paramValues = null;

            this.userId = userId;
            this.deviceId = deviceId;
        }

        on(event, callback) {
            this[__sym][event] = { callback: callback };
        }

        setEventProcess(status, message, percent) {
            const event = this[__sym].progress;

            if (event && event.callback) {

                const obj = {
                    status: status,
                    percent: percent,
                    message: message,
                    repository: `${this.repository}`
                };

                event.callback(obj);
                //console.log(`>>> DD >>> ${this.repository}: setEventProcess() >>> ${JSON.stringify(obj)}`);
            }
        }

        async processAllChanges(checkNext = true) {
            return new Promise(async (resolve, reject) => {
                this.isRunning = true;

                try {
                    this.setEventProcess('processAllChanges', 'Sincronizando', 0);
                    console.log(`>>> DD >>> ${this.repository}: processAllChanges...`);

                    const data = await this.getCurrentDeviceData();
                    console.log(`>>> DD >>> ${this.repository}: [${data.length} rows to send]`);

                    this.setEventProcess('processAllChanges', 'Sincronizando', 50);
                    if (data.length > 0) {
                        if (await this.processRemoteChanges(data)) {
                            if (checkNext) {
                                await this.processAllChanges();
                            }
                        }
                    } else {
                        this.setEventProcess('processAllChanges', 'Sincronizando', 100);
                        this.param.set('DEVICE_DATA_LATEST_STATUS', 'success');
                        this.param.set('DEVICE_DATA_LATEST_DATE', this.param.LOCAL_DATE_TIME);
                    }

                    this.isRunning = false;
                    resolve();
                } catch (err) {
                    console.log(`REPO: ${this.repository} >>>`, err);
                    this.isRunning = false;
                    resolve();
                }
            }).catch((err) => {
                this.param.set('DEVICE_DATA_LATEST_STATUS', 'error|' + err);
                console.log(err);
            });
        }

        async getCurrentDeviceData() {
            const limit = this.paramValues ? this.paramValues.DEVICE_DATA_LIMIT_REQUEST : 5;
            return await this.db.query(
                squel
                    .select()
                    .field('id')
                    .field('tenant_id')
                    .field('coalesce(app_id, \'\')', 'app_id')
                    .field(`coalesce(user_id, '${this.userId}')`, 'user_id')
                    .field(`coalesce(device_id, '${this.deviceId}')`, 'device_id')
                    .field('0', 'sequential')
                    .field('device_created_at')
                    .field("'public'", 'schema_name')
                    .field('table_name')
                    .field('pk')
                    .field('sf_id')
                    .field('json_data')
                    .from('device_data')
                    .order('device_created_at')

                    .limit(limit)
            );
        }

        async processRemoteChanges(data) {
            return new Promise(async (resolve, reject) => {
                if (await DeviceInfo.isOnline() === true) {
                    // console.log(`>>> DD >>> ${this.repository}: ${item.table_name} [local_id: ${item.DEVICE_DATA_id}, remote_length: ${remoteChanges.length}]`);
                    const r = await this.fetchDeviceData(data);
                    if (r.length > 0) {
                        await this.removeData(r);
                    } else {
                        resolve(false);
                    }
                } else {
                    console.log(`>>> DD >>> ${this.repository}: device is off-line...`);
                    resolve(false);
                }

                resolve(true);
            }).catch((err) => {
                console.log(err);
            });
        }

        async fetchDeviceData(data) {
            try {
                const { host, version, path } = this.cfg;
                const noCache = `&nocache=${new Date().getTime()}`;

                const response = await fetch(`${host}${version}${path.deviceData}?${noCache}`, {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + (await getToken()),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0,
                    }),
                    body: JSON.stringify(data._array)
                });


                if (response.ok) {
                    return response.json();
                }

                const r = await response.json();
                if (r.error) {
                    const dataIds = [];
                    r.error.details.forEach(d => {
                        if (d.message.indexOf('device_data_pkey') > -1) {
                            const key = d.detail.split(' ')[1].split('=');
                            const value = key[1].replace('(', '').replace(')', '');

                            dataIds.push({
                                id: value
                            });
                        }
                    });
                    return dataIds;
                }


                // throw new Error(`Fetch device data error: [${response.status}] ${response.statusText}`);
            } catch (error) {
                console.error(error);
                return [];
            }
        }

        async removeData(data) {
            const ids = data.map(a => a.id.toUpperCase());
            const rowsAffected = await this.db.exec(
                squel
                    .delete()
                    .from('device_data')
                    .where('id in ?', ids)
                    .toString()
            );

            console.log(`>>> DD >>> ${this.repository}: [${rowsAffected} rows deleted]`);
        }

        async start(startSetInterval = true) {
            if (startSetInterval) {
                if (this.currentExec !== null)
                    return;
            }
            await this.checkDb();

            this.paramValues = await this.param.getAll([
                'DEVICE_DATA_CHECK_INTERVAL',
                'DEVICE_DATA_LIMIT_REQUEST',
                'DEVICE_DATA_CHANGE_ENABLED'
            ]);
            const waitFor = (this.paramValues.TRACKING_CHANGE_CHECK_INTERVAL || 1) * 1000 * 60;

            console.log(`>>> DD >>> ${this.repository}: start (${waitFor})`);
            if (!this.isRunning) { await this.processAllChanges(); }

            if (startSetInterval) {
                console.log(`>>> DD >>> ${this.repository}: wait for ${waitFor} ms`);

                this.currentExec = setInterval(() => {
                    console.log(`>>> DD >>> ${this.repository}: start ${waitFor} ms`);
                    if (!this.isRunning) { this.processAllChanges(); }
                }, waitFor);
            }

        }

        async stop() {
            if (this.currentExec !== null) {
                console.log(`>>> DD >>> ${this.repository}: stop()`);
                clearInterval(this.currentExec);
                this.currentExec = null;
                this.isRunning = false;
            }
        }

        async run() {
            if (!this.isRunning)
                this.start(false);
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

    return DeviceDataClass;
}());

export default DeviceData;