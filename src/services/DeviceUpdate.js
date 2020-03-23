import { Platform } from 'react-native';
import { Updates } from 'expo';

import { services as config } from '../../config';
import Db from '../services/Repository/core/Db';
import ParamDb from '../services/Repository/core/ParamDb';

class DeviceUpdate {
  constructor(deviceId) {
    this.repository = 'setup';
    this.isRunning = false;
    this.currentExec = null;
    this.cfg = config.find(srv => srv.nome === this.repository);
    if (!this.cfg) {
      throw new Error(`Oooops! para o serviço ${service} não foi localizado sua configuração para prosseguir.`);
    }

    this.db = new Db(this.repository, deviceId);
    this.param = new ParamDb(this.db);

    this.paramValues = null;
  }

  async checkForUpdate() {
    this.isRunning = true;
    const r = {
      isAvailable: false,
      newVersion: null,
      message: null
    }

    return new Promise(async (resolve, reject) => {
      try {
        if (Platform.OS === 'web') {
          console.log(`>>> APP_UPDATE >>> checkForUpdate...`);
          const update = await window.updaterManager.checkForUpdate();
          console.log(`>>> APP_UPDATE >>> checkForUpdate >>> success: ${update.success} type: ${update.type} `);

          console.log(JSON.stringify(update.payload));
          
          if (update.success) {
            if (update.type === 'update-downloaded') {
              r.isAvailable = true;
              r.newVersion = update.payload.version;
            }
          } else {
            console.log(`>>> APP_UPDATE >>> checkForUpdate >>> error >>> ${update.message}`);
            r.message = update.message;
          }
        } else {
          console.log(`>>> APP_UPDATE >>> checkForUpdate...`);
          const update = await Updates.checkForUpdateAsync();

          console.log(`>>> APP_UPDATE >>> checkForUpdate >>> isAvailable: ${update.isAvailable} `);
          if (update.isAvailable) {
            console.log(`>>> APP_UPDATE >>> checkForUpdate >>> fetchUpdateAsync...`);
            await Updates.fetchUpdateAsync();

            console.log(`>>> APP_UPDATE >>> checkForUpdate >>> fetchUpdateAsync >> OK`);
            r.isAvailable = true;
            r.newVersion = update.manifest.version;
          }
        }

        this.isRunning = false;

        resolve(r);
      } catch (error) {
        this.isRunning = false;
        const message = error == null ? "unknown" : (error.message || error).toString();

        console.log(`>>> APP_UPDATE >>> checkForUpdate >>> error >>> ${message}`);
        r.message = message;
        resolve(r);
      }
    });
  }

  static reload() {
    if (Platform.OS === 'web') {
      window.updaterManager.quitAndInstall();
    } else {
      Updates.reloadFromCache();
    }
  }

  async start() {
    this.paramValues = await this.param.getAll([
      'APP_UPDATE_CHECK_INTERVAL'
    ]);
    const waitFor = (this.paramValues.APP_UPDATE_CHECK_INTERVAL || 15) * 1000 * 60;

    console.log(`>>> APP_UPDATE: start ()`);
    if (!this.isRunning) {
      this.checkForUpdate();
    }

    console.log(`>>> APP_UPDATE: wait for ${waitFor} ms`);
    this.currentExec = setInterval(async () => {
      console.log(`>>> APP_UPDATE: start ${waitFor} ms`);
      if (!this.isRunning) {
        await this.checkForUpdate();
      }
    }, waitFor);

  }

  async run() {
    if (!this.isRunning) {
      return await this.checkForUpdate();
    }
  }

  async stop() {
    if (this.currentExec !== null) {
      console.log(`>>> APP_UPDATE: stop()`);
      clearInterval(this.currentExec);
      this.currentExec = null;
      this.isRunning = false;
    }
  }
}

export default DeviceUpdate;
