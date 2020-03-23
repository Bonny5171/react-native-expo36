import Db from './core/Db';
import squel from './squelConfig';
import ParamDb from './core/ParamDb';
import { isAuth } from '../Auth';
import { cmds } from './ProductDbSqls';
import deviceInfo from '../DeviceInfo';
let withFlavour = squel.useFlavour('postgres');
let _db = null;

class ProductDb {
  static async create() {
    return new Promise(async (resolve, reject) => {
      if (_db === null) {
        console.log('create product');
        const deviceId = await deviceInfo.getDeviceId();
        _db = new Db('product', deviceId);
        _db.param = new ParamDb(_db);

        await Promise.all(cmds.map(async cmd => {
          console.log(`>>> ProductDb [schema] >>> view >>> ${cmd.name}`);
          await _db.execQueue([cmd.down, cmd.up]);
        }));
      }
      resolve(_db);
    });
  }
}

export const queryBuilder = squel;
export const squelPostgres = withFlavour;

export const repository = async function () {
  if (await isAuth()) {
    return await ProductDb.create();
  }
};

export const dropRepo = async function () {
  const deviceId = await deviceInfo.getDeviceId();
  return await Db.wipe('product', deviceId);
};

