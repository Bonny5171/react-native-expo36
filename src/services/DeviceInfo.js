import { Platform, AsyncStorage } from 'react-native';
import Fingerprint2 from 'fingerprintjs2';
import Constants from 'expo-constants';
import { services as config } from '../../config';
import { getToken, getClientInfo } from './Auth';
import pkg from '../../package.json'
import uuidv4 from 'uuid/v4';
import Axios from 'axios';

const optionsWeb = {
  excludes: {
    screenResolution: true,
    availableScreenResolution: true,
    fonts: true,
    fontsFlash: true,
    timezoneOffset: true,
    timezone: true,
    canvas: true,
    webgl: true,
    userAgent: true,
    language: true
  }
};
let _platformProperties = null;
let _platformPropertiesArray = null;
let _deviceId = null;

class DeviceInfo {
  static async getDeviceId() {
    let deviceInfo = null;

    if (Platform.OS === 'web') {
      if (window.localStorage['deviceInfo']) {
        deviceInfo = window.localStorage.deviceInfo;
      }
    } else {
      deviceInfo = await AsyncStorage.getItem('deviceInfo');
    }

    if (deviceInfo) {
      return deviceInfo;
    }

    return null;
  }

  static async getPlatformPropertiesWeb() {
    if (_platformProperties === null) {
      _platformProperties = await this.getWebInfo();
    }
    return _platformProperties;
  }

  static async getPlatformPropertiesWebArray() {
    if (_platformPropertiesArray === null) {
      _platformPropertiesArray = await this.getWebInfo(false);
    }
    return _platformPropertiesArray;
  }

  static async getPlatformDeviceId() {
    await this.getPlatformProperties();
    return Constants.deviceId;
  }

  static async getAppVersion() {
    if (Platform.OS === 'web') {
      return pkg.version;
    }
    else {
      return Constants.manifest.revisionId || Constants.manifest.version;
    }
  }

  static async getPlatformProperties() {
    if (Platform.OS === 'web') {
      const values = await this.getPlatformPropertiesWeb();
      if (_deviceId === null) {
        _deviceId = Fingerprint2.x64hash128(values.join(''), 31);
      }
      Constants.deviceId = _deviceId;
      Constants.platformType = Platform.OS;
      Constants.platformVersion = Constants.platform[Constants.platformType].os.name + ' ' + Constants.platform[Constants.platformType].os.version;
      Constants.platformForUser = `${Constants.platform[Constants.platformType].os.name} ${Constants.platform[Constants.platformType].os.version}`;
      Constants.platformName = `${Constants.platform[Constants.platformType].os.name}`;
      Constants.userAgent = Constants.platform[Constants.platformType].ua;
      Constants.webInfo = await this.getPlatformPropertiesWebArray();
    } else {
      Constants.platformType = `${Platform.OS} ${Constants.platform[Platform.OS].userInterfaceIdiom || ''}`;
      Constants.platformVersion = Constants.platform[Platform.OS].systemVersion || Constants.systemVersion;
      Constants.platformForUser = `${Platform.OS} ${Constants.platformVersion} ${Constants.deviceName ? `- ${Constants.deviceName}` : ``}`;
      Constants.platformName = `${Platform.OS}`;
    }

    return Constants;
  }

  static async getWebInfo(returnArray = true) {
    return new Promise((resolve, reject) => {
      Fingerprint2.get(optionsWeb, async components => {
        const values = components.map(component => {
          if (returnArray) return component.value;
          return component;
        });
        resolve(values);
      });
    });
  }

  static async registerDevice() {
    debugger
    const cfg = config.find(srv => srv.nome === 'setup');
    const { apiUrl } = cfg;

    const installation_id = await AsyncStorage.getItem('deviceInfo');
    Constants.clientInfo = await getClientInfo();

    // const url = `${apiUrl}/rpc/device`;
    const url = 'https://api-dev-dot-crmgrendene.appspot.com/setup/rpc/device'
    // const url = '';
    // Realiza o post de registro.
    console.log('POST: registra o device:', `${url}`);
    debugger
    try {
      debugger
      const payload = {
        id: (installation_id === null ? uuidv4() : installation_id),
        platform_device_id: await this.getPlatformDeviceId(),
        platform_type: Constants.platformType ? Constants.platformType : Platform.OS,
        platform_version: Constants.platformVersion ? Constants.platformVersion : Constants.systemVersion,
        platform_properties: { ...Constants }
      };
      debugger
      if (payload.platform_properties.systemFonts) {
        delete payload.platform_properties.systemFonts;
      }
      debugger
      /* Sentry.io >>> begin */
      if (!__DEV__) {
        // Sentry.setTags({
        //   installationId: payload.id
        // });
        // console.log('configuring Sentry.io tags...');

        // Sentry.setExtras(payload);
        // console.log('configuring Sentry.io extras...');
        // //Sentry.captureException(new Error('Oops metadata!'));

        const bugsnagClient = bugsnag();
        bugsnagClient.metaData = {
          platform: {
            installationId: payload.id,
            properties: payload
          }
        };

        console.log('configuring bugsnag metadata...');
        // bugsnagClient.notify(new Error('Test error metadata'));
        /* Sentry.io >>> end */
      }


      debugger
      const TT = await getToken();
      console.log('TOKEN', TT);
      // console.log((await getToken()));

      debugger
      const response = await Axios.post(url, payload, {
        headers: {
          'Authorization': 'Bearer ' + (await getToken()),
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': 0
        }
      });
      debugger
      if (response.status === 200) {
        console.log(`Device register successful! [device_id: ${response.data.id}] ${response.status}`);

        if (installation_id === null) {
          await AsyncStorage.setItem('deviceInfo', response.data.id);
          await AsyncStorage.setItem('devicePlatform', JSON.stringify({
            installation_id: response.data.id,
            platform_device_id: Constants.deviceId,
            platform: Constants.platformForUser
          }));

          return {
            registered: true,
            register: response.data.id,
            message: 'Device register successful!'
          };
        }
      }

      return {
        registered: false,
        message: `Erro ao registrar device: ${response.status}`
      };
    } catch (e) {
      debugger
      console.log(e);
      console.log(`Fetch device info error: [${e.status}] ${e.status}`);

      return {
        registered: false,
        message: `Erro ao registrar device: ${e.status}`
      };
    }
  }

  static async isOnline() {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'web') {
        resolve(window.navigator.onLine);
      } else {
        resolve(true);
        // NetInfo.getConnectionInfo()
        //   .then()
        //   .done(() => {
        //     NetInfo.getConnectionInfo().then(connectionInfo => {
        //       switch (connectionInfo.type) {
        //         case 'none':
        //           console.log('aa', 'none');
        //           break;
        //         case 'wifi':
        //           console.log('aa', 'wifi');
        //           break;
        //         case 'cellular':
        //           if (connectionInfo.effectiveType !== 'unknown') {
        //             console.log('aa', `cellular ${connectionInfo.effectiveType}`);
        //           } else {
        //             console.log('aa', 'cellular unknown');
        //           }
        //           break;
        //         case 'unknown':
        //           console.log('aa', 'unknown');
        //           break;
        //         default:
        //           console.log('aa', 'default');
        //           break;
        //       }
        //     });
        //   });

        // NetInfo.isConnected.fetch().then(() => {
        //   NetInfo.isConnected.fetch().then(isConnected => {
        //     // erro IOS
        //     resolve(true)
        //   });
        // });
      }
    });
  }
}

export default DeviceInfo;
