import Db from './core/Db';
import squel from './squelConfig';
import ParamDb from './core/ParamDb';
import { isAuth } from '../Auth';
import { cmds } from './AccountDbSqls';
import deviceInfo from '../DeviceInfo';

let _db = null;

class AccountDb {
  static async create() {
    return new Promise(async (resolve, reject) => {
      if (_db === null) {
        console.log('create account')
        const deviceId = await deviceInfo.getDeviceId();
        _db = new Db('account', deviceId);
        _db.param = new ParamDb(_db);

        await Promise.all(cmds.map(async cmd => {
          console.log(`>>> AccountDb [schema] >>> view >>> ${cmd.name}`);
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
    return await AccountDb.create();
  }
}

export const dropRepo = async function () {
  const deviceId = await deviceInfo.getDeviceId();
  return await Db.wipe('account', deviceId);
}