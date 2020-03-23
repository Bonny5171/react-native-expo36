import Db from './core/Db';
import squel from './squelConfig';
import ParamDb from './core/ParamDb';
import { isAuth } from '../Auth';
import { cmds } from './ResourceDbSqls';
import deviceInfo from '../DeviceInfo';

let _db = null;

class ResourceDb {
  static async create() {
    return new Promise(async (resolve, reject) => {
      if (_db === null) {

        const deviceId = await deviceInfo.getDeviceId();
        _db = new Db('resource', deviceId);
        _db.param = new ParamDb(_db);

        await ResourceDb.execCmds();
      }
      resolve(_db);
    });
  }

  static async execCmds () {
    return await Promise.all(cmds.map(async cmd => {
      console.log(`>>> ResourceDb [schema] >>> view >>> ${cmd.name}`);
      await _db.execQueue([cmd.down, cmd.up]);
    }));
  }
}

export const queryBuilder = squel;

export const repository = async function (removeInstanceDb = false) {
  if (removeInstanceDb){
    _db = null;
  }
   
  if (await isAuth()) {
    return await ResourceDb.create();
  }
}

export const dropRepo = async function () {
  const deviceId = await deviceInfo.getDeviceId();
  return await Db.wipe('resource', deviceId);
}
