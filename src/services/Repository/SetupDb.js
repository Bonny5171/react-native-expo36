import Db from './core/Db';
import squel from './squelConfig';
import ParamDb from './core/ParamDb';
import { isAuth } from '../Auth';
import { cmds } from './SetupDbSqls';
import deviceInfo from '../DeviceInfo';

let _db = null;

class SetupDb {
  static async create() {
    return new Promise(async (resolve, reject) => {
      if (_db === null) {
        const deviceId = await deviceInfo.getDeviceId();
        _db = new Db('setup', deviceId);
        _db.param = new ParamDb(_db);

        await Promise.all(cmds.map(async cmd => {
          console.log(`>>> SetupDb [schema] >>> view >>> ${cmd.name}`);
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
    return await SetupDb.create();
  }
}

export const dropRepo = async function () {
  const deviceId = await deviceInfo.getDeviceId();
  return await Db.wipe('setup', deviceId);
}