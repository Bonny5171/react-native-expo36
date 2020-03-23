import { Platform, AsyncStorage } from 'react-native';
import Fingerprint2 from 'fingerprintjs2';
import { Constants } from 'expo';
import { services as config } from '../../config';
import { getToken, getClientInfo } from './Auth';
import pkg from '../../package.json'

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
    const cfg = config.find(srv => srv.nome === 'setup');
    const { host, version, path } = cfg;

    Constants.clientInfo = await getClientInfo();
    const opts = {
      platform_device_id: await this.getPlatformDeviceId(),
      platform_type: Constants.platformType,
      platform_version: Constants.platformVersion,
      platform_properties: Constants
    };

    // Realiza o post de registro.
    const response = await fetch(`${host}${version}${path.devices}?&nocache=${new Date().getTime()}`, {
      method: 'POST',
      headers: new Headers({
        Authorization: 'Bearer ' + (await getToken()),
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0
      }),
      body: JSON.stringify(opts)
    });

    if (response.ok) {
      const json = await response.json();
      await AsyncStorage.setItem('deviceInfo', json.id);

      console.log(`Device register successful! [device_id: ${json.id}] ${response.statusText}`);
      return json.id;
    }

    console.error(`Fetch device info error: [${response.status}] ${response.statusText}`);
    return false;
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
