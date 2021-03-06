import Db from './core/Db';
import squel from './squelConfig';
import ParamDb from './core/ParamDb';
import { isAuth } from '../Auth';
import { cmds } from './OrderDbSqls';
import deviceInfo from '../DeviceInfo';
//import { currentDeviceData } from '../../../config';

let _db = null;

class OrderDb {
  static async create() {
    return new Promise(async (resolve, reject) => {
      if (_db === null) {
        const deviceId = await deviceInfo.getDeviceId();

        _db = new Db('order', deviceId);
        _db.param = new ParamDb(_db);

        // _db.on('DB_AFTER_UPSERT', () => {
        //   if (currentDeviceData['order'] !== undefined)
        //     currentDeviceData['order'].run();
        // });

        await Promise.all(cmds.map(async cmd => {
          console.log(`>>> OrderDb [schema] >>> view >>> ${cmd.name}`);
          await _db.execQueue([cmd.down, cmd.up]);
        }));
      }

      resolve(_db);
    });
  }
}

export const queryBuilder = squel;

export const repository = async function () {
  if (await isAuth()) {
    return await OrderDb.create();
  }
}

export const dropRepo = async function () {
  const deviceId = await deviceInfo.getDeviceId();
  return await Db.wipe('order', deviceId);
}