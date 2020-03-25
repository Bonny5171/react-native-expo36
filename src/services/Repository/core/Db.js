import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import uuidv4 from 'uuid/v4';
import squel from '../squelConfig';
import { log } from '../../../../config';

/* eslint-disable */
let _dbInstance = {};
let Db = (function () {
  let __sym = Symbol('DbClass');

  class DbClass {
    constructor(service, deviceId) {
      this[__sym] = {};
      this.service = service;
      this.nameDb = Platform.OS === 'web'
        ? `userId/sfa-${service}.db`
        : `${deviceId}_sfa-${service}.db`;

      this.dbSqlite = Platform.OS === 'web'
        ? window.SQLite
        : SQLite;

      if (!_dbInstance[this.nameDb]) {
        _dbInstance[this.nameDb] = this.dbSqlite.openDatabase(this.nameDb);
        console.log(`>>> Db >>> ${service} >>> constructor() >>> openDatabase() >>> ${this.nameDb}`);
      }

      this.db = _dbInstance[this.nameDb];
    }

    on(event, callback) {
      this[__sym][event] = { callback };
    }

    fireEvent(name, payLoad) {
      const event = this[__sym][name];
      if (event && event.callback) {
        event.callback(payLoad);
      }
    }

    static async deleteFile(path) {
      return new Promise(async (resolve, reject) => {
        try {
          await FileSystem.deleteAsync(path);
          console.log('>>> Db >>> deleteFile() >>> ' + path + ' >>> OK');
        } catch (err) {
          console.log('>>> Db >>> deleteFile() >>> ' + path + ' >>> err >>> ' + err);
        }
        resolve();
      }).catch((err) => {
        console.log(err);
      });
    }

    static async size(service, deviceId) {
      return new Promise(async (resolve, reject) => {
        let size = 0;
        console.log('>>> Db >>> ' + service + ' >>> size()');

        if (Platform.OS !== 'web') {
          try {
            const fileInfo = (await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/${deviceId}_sfa-${service}.db`, { size: true }));
            size = fileInfo.size || 0;
          } catch (err) {
            console.log('>>> Db >>> ' + service + ' >>> size() >>> err >>> ' + err);
          }
        }
        else {
          size = window.webSqlManager.size(`sfa-${service}`, 'userId');
        }

        resolve(size);
      }).catch((err) => {
        console.log(err);
      });
    }

    static async wipe(service, deviceId) {
      return new Promise(async (resolve, reject) => {
        console.log('>>> Db >>> ' + service + ' >>> wipe()');

        try {
          if (Platform.OS === 'android') {
            await Db.deleteFile(`${FileSystem.documentDirectory}SQLite/${deviceId}_sfa-${service}.db-shm`);
            await Db.deleteFile(`${FileSystem.documentDirectory}SQLite/${deviceId}_sfa-${service}.db-wal`);
          }

          await Db.deleteFile(`${FileSystem.documentDirectory}SQLite/${deviceId}_sfa-${service}.db`);
          await Db.deleteFile(`${FileSystem.documentDirectory}SQLite/${deviceId}_sfa-${service}.db-journal`);
        } catch (err) {
          console.log('>>> Db >>> ' + service + ' >>> wipe() >>> err >>> ' + err);
        }

        resolve();
      }).catch((err) => {
        console.log(err);
      });
    }

    static async closeAll() {
      return new Promise(async (resolve, reject) => {
        console.log('>>> Db >>> closeAll()');

        for (let dbInstance of Object.values(_dbInstance)) {
          try {
            dbInstance._db._db.close();
            console.log('>>> Db >>> closeAll() >>> ' + dbInstance._db._db.filename + '  >>> close()');

          } catch (err) {
            console.log('>>> Db >>> closeAll() >>> err >>> ' + err);
          }
        }

        _dbInstance = {};
        console.log('>>> Db >>> closeAll() >>> OK');

        setTimeout(() => resolve(), 1500);
      }).catch((err) => {
        console.log(err);
      });
    }

    async isReady() {
      return new Promise((resolve, reject) => {
        console.log('>>> Db >>> ' + this.service + ' >>> isReady()');

        this.db.readTransaction(async tx => {
          tx.executeSql(
            'select 1 as status from sqlite_master limit 1',
            [],
            async (tx, results) => {
              console.log('>>> Db >>> ' + this.service + ' >>> isReady() >>> OK');
              resolve(1);
            },
            async (tx, err) => {
              console.error('>>> Db >>> ' + this.service + ' >>> isReady() >>> ERR >>> ' + err);
              resolve(0);
            }
          );
        });
      }).catch((err) => {
        console.log(err);
      });
    }

    async exec(sql, transaction = null, showSql = log.showSql) {
      if (showSql) { console.log('>>> ' + this.service + ' >>> exec() >>> ' + sql); }

      return new Promise((resolve, reject) => {
        if (transaction === null) {
          this.db.transaction(tx => {
            tx.executeSql(
              sql,
              [],
              (tx, results) => {
                //console.log('>>> Db >>> ' + this.service + ' >>> exec() >>> rowsAffected >>> ' + results.rowsAffected);
                resolve(results.rowsAffected);
              },
              (tx, err) => {
                console.error('>>> Db >>> ' + this.service + ' >>> exec() >>> ERR >>> ' + err + ' >>> SQL >>> ' + sql);
                reject(err);
              }
            );
          }, /* onerr */(err) => {
            console.error('>>> Db >>> ' + this.service + ' >>> exec() >>> ERR >>> ' + err);
            reject(err);
          }, /* onReadyTransaction */() => {
            resolve();
          });
        } else {
          transaction.executeSql(
            sql,
            [],
            (tx, results) => {
              //console.log('>>> Db >>> ' + this.service + ' >>> exec() >>> rowsAffected >>> ' + results.rowsAffected);
              resolve(results.rowsAffected);
            },
            (tx, err) => {
              console.error('>>> Db >>> ' + this.service + ' >>> exec() >>> ERR >>> ' + err + ' >>> SQL >>> ' + sql);
              reject(err);
            }
          );
        }
      }).catch((err) => {
        console.log(err);
      });
    }

    execNestedTran(arrSql, tx, showSql = log.showSql) {
      if (showSql) { console.log('>>> Db >>> ' + this.service + ' >>> execSequencial() >>> ' + sql); }

      const sql = arrSql.shift();
      tx.executeSql(
        sql,
        [],
        (tx, results) => {
          //console.log('>>> Db >>> ' + this.service + ' >>> execSequencial() >>> rowsAffected >>> ' + results.rowsAffected);

          if (arrSql.length > 0)
            this.execNestedTran(arrSql, tx)
        },
        (tx, err) => {
          console.error('>>> Db >>> ' + this.service + ' >>> execNestedTran() >>> ERR >>> ' + err + ' >>> SQL >>> ' + sql);
        }
      );

    }

    async execQueueTran(arrSql, showSql = log.showSql) {
      return new Promise((resolve, reject) => {
        //console.log(`>>> Db >>> ${this.service} >>> sql queue: ${arrSql.length}`);

        this.db.transaction(tx => {
          this.execNestedTran(arrSql, tx, showSql)
        })

        console.log(`>>> Db >>> ${this.service} >>> sql queue: ${arrSql.length} >>> OK`);
        resolve();
      }).catch((err) => {
        console.log(err);
      });
    }

    async execQueue(arrSql, showSql = log.showSql) {
      return new Promise((resolve, reject) => {
        this.db.transaction(async tx => {
          // console.log(`>>> Db >>> ${this.service} >>> sql queue: ${arrSql.length}`);

          await Promise.all(arrSql.map(async sql => {
            //console.log(sql);
            if (sql.length > 0) {
              await this.exec(sql, tx, showSql);
            }
          }));
        }, /* onerr */(err) => {
          console.error('>>> Db >>> ' + this.service + ' >>> execQueue() >>> ERR >>> ' + err);
          reject(err);
        }, /* onReadyTransaction */() => {
          console.log(`>>> Db >>> ${this.service} >>> sql queue: ${arrSql.length} >>> OK`);
          resolve();
        });
      });
    }

    async query(squel, topOne = false, showSql = log.showSql) {
      const sql = typeof squel === 'string' ? squel : squel.toString();

      if (showSql) { console.log('>>> Db >>> ' + this.service + ' >>> query() >>> begin'); }

      return new Promise((resolve, reject) => {
        this.db.readTransaction(async tx => {
          tx.executeSql(
            sql,
            [],
            async (tx, results) => {
              //console.log(results.rows);

              if (topOne) {
                if (results.rows && results.rows.length > 0) {
                  resolve(results.rows.item(0));
                } else {
                  resolve(null);
                }
              }
              if (showSql) {
                console.log('>>> Db >>> ' + this.service + ' >>> query() >>> rows: ' + results.rows.length + ' >>> ' + sql);
                //console.log(results.rows);
              }
              resolve(results.rows);
            },
            async (tx, err) => {
              console.error('>>> Db >>> ' + this.service + ' >>> query() >>> ERR >>> ' + err + ' >>> SQL >>> ' + sql);
              reject(err);
            }
          );
        });
      }).catch((err) => {
        console.log(err);
      });
    }

    async queryOne(squel, showSql = log.showSql) {
      return this.query(squel.limit(1), true, showSql);
    }

    async queryQueue(arrSquel, topOne = false, showSql = log.showSql) {
      
      return new Promise((resolve, reject) => {
        const arrResults = [];
        this.db.readTransaction(async tx => {
          // console.log(`>>> Db >>> ${this.service} >>> sql queue: ${arrSql.length}`);

          await Promise.all(arrSquel.map(async squel => {
            let sql = null;

            if (topOne) {
              sql = squel.limit(1).toString();
            }
            else{
              sql = squel.toString();
            }

            tx.executeSql(
              sql,
              [],
              async (tx, results) => {
                //console.log(results.rows);
  
                if (topOne) {
                  if (results.rows && results.rows.length > 0) {
                    arrResults.push(results.rows.item(0));
                  }
                }
                else{
                  arrResults.push(results.rows.length);
                }

                if (showSql) {
                  console.log('>>> Db >>> ' + this.service + ' >>> queryQueue() >>> rows: ' + results.rows.length + ' >>> ' + sql);
                  //console.log(results.rows);
                }
                
              },
              async (tx, err) => {
                console.error('>>> Db >>> ' + this.service + ' >>> queryQueue() >>> ERR >>> ' + err + ' >>> SQL >>> ' + sql);
                reject(err);
              }
            );

          }));
        }, /* onerr */(err) => {
          console.error('>>> Db >>> ' + this.service + ' >>> queryQueue() >>> ERR >>> ' + err);
          reject(err);
        }, /* onReadyTransaction */() => {
          console.log(`>>> Db >>> ${this.service} >>> queryQueue() >>> sql queue: ${arrSquel.length} >>> OK`);
          resolve(arrResults);
        });
      });
    }

    async upsert(tableName, rowData, showSql = log.showSql) {
      const event = this[__sym]['after_upsert'];
      return new Promise((resolve, reject) => {
        rowData['tenant_id'] = 1;

        if (!rowData['is_deleted']) {
          rowData['is_deleted'] = false;
        }

        if (!rowData['is_active']) {
          rowData['is_active'] = true;
        }

        if (!rowData['id']) {
          rowData['id'] = uuidv4();
        }

        this.db.transaction(async (transaction) => {
          const sql = squel
            .update()
            .table(tableName)
            .setFields(rowData)
            .set('tracking_change_id', 'abs(tracking_change_id) * -1', { dontQuote: true })
            .set('updated_at', "strftime('%Y-%m-%dT%H:%M:%fZ','now', 'localtime')", { dontQuote: true })
            .where('id = ?', rowData.id);

          if (rowData['is_deleted'] === true) {
            sql.set('deleted_at', "strftime('%Y-%m-%dT%H:%M:%fZ','now', 'localtime')", { dontQuote: true })
          }

          // UPDATE
          transaction.executeSql(
            sql.toString(),
            [],
            async (nextTransaction, results) => {
              console.log('>>> Db >>> ' + this.service + ' >>> upsert() >>> update >>> rowsAffected >>> ' + results.rowsAffected + (showSql ? ' >>> ' + sql : ''));
              if (results.rowsAffected === 0) {
                const sql = squel
                  .insert()
                  .into(tableName)
                  .setFields(rowData)
                  .set('tracking_change_id', '-1', { dontQuote: true })
                  .set('created_at', "strftime('%Y-%m-%dT%H:%M:%fZ','now', 'localtime')", { dontQuote: true })
                  .set('updated_at', "strftime('%Y-%m-%dT%H:%M:%fZ','now', 'localtime')", { dontQuote: true });

                // INSERT
                nextTransaction.executeSql(
                  sql.toString(),
                  [],
                  async (tx, results) => {
                    console.log('>>> Db >>> ' + this.service + ' >>> upsert() >>> insert >>> rowsAffected >>> ' + results.rowsAffected + (showSql ? ' >>> ' + sql : ''));
                    this.fireEvent('DB_AFTER_UPSERT', {
                      service: this.service,
                      tableName: tableName,
                      rowsAffected: results.rowsAffected,
                      type: 'Insert'
                    })

                  }
                );
              }
              else {
                this.fireEvent('DB_AFTER_UPSERT', {
                  service: this.service,
                  tableName: tableName,
                  rowsAffected: results.rowsAffected,
                  type: 'Update'
                })
              }
            }
          );
        }, /* onerr */ async (tx, err) => {
          console.error('>>> Db >>> ' + this.service + ' >>> upsert() >>> ERR >>> ' + err);
          reject(err);

        }, /* onReadyTransaction */ async () => {
          //console.log(`>>> Db >>> ${this.service} >>> upsert() >>> OK`);
          resolve(rowData);
        });
      }).catch((err) => {
        console.log(err);
      });
    }

  }

  return DbClass;
}());

export default Db;