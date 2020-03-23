import { Platform, AsyncStorage } from 'react-native';
import { FileSystem } from 'expo-file-system';
import { services as config } from '../../config';
import deviceInfo from './DeviceInfo';

import TrackingChange from './Repository/core/TrackingChange';
import DeviceData from './Repository/core/DeviceData';

const isAuth = async () => {
    if (Platform.OS !== 'web') {
        if (await AsyncStorage.getItem('clientInfo')) {
            // console.log('Logado na plataforma NATIVA');
            return true;
        }
    } else if (window.localStorage.clientInfo) {
        // console.log('Logado na plataforma  ELETRON');
        return true;
    }

    console.log('NÃO LOGADO! ');
    return false;
};

const getLocalStorage = async (name) => {
    let obj = null;
    
    if (Platform.OS !== 'web') {
        const result = await AsyncStorage.getItem(name);
        obj = typeof result === 'object' ? JSON.parse(result) : result;
    } else {
        obj = typeof window.localStorage[name] === 'object' ? JSON.parse(window.localStorage[name]) : window.localStorage[name];
    }

    if (obj) {
        return obj;
    }

    return null;
};

const getAppId = async () => {
    let clientInfo = null;

    if (Platform.OS !== 'web') {
        clientInfo = JSON.parse(await AsyncStorage.getItem('clientInfo'));
    } else {
        clientInfo = JSON.parse(window.localStorage.clientInfo);
    }

    if (clientInfo) {
        return clientInfo.AppID;
    }

    return null;
};

const getUserId = async () => {
    let clientInfo = null;

    if (Platform.OS !== 'web') {
        clientInfo = JSON.parse(await AsyncStorage.getItem('clientInfo'));
    } else {
        clientInfo = JSON.parse(window.localStorage.clientInfo);
    }

    if (clientInfo) {
        return clientInfo.Id;
    }

    return null;
};

const getToken = async () => {
    let clientInfo = null;

    if (Platform.OS !== 'web') {
        clientInfo = JSON.parse(await AsyncStorage.getItem('clientInfo'));
    } else if (window.localStorage.clientInfo) {
        clientInfo = JSON.parse(window.localStorage.clientInfo);
    }

    if (clientInfo) {
        return clientInfo.Token;
    }

    return null;
};

const getClientInfo = async () => {
    let clientInfo = null;

    if (Platform.OS !== 'web') {
        clientInfo = JSON.parse(await AsyncStorage.getItem('clientInfo'));
    } else if (window.localStorage.clientInfo) {
        clientInfo = JSON.parse(window.localStorage.clientInfo);
    }

    if (clientInfo) {
        return clientInfo;
    }

    return null;
};

const isAllDbsLocal = async (deviceId) => {

    if (Platform.OS === 'web') {
        if (!window.webSqlManager) return false;

        const isDbAccount   = window.webSqlManager.exists('sfa-account', 'userId');
        const isDbProduct   = window.webSqlManager.exists('sfa-product', 'userId');
        const isDbSetup     = window.webSqlManager.exists('sfa-setup', 'userId');
        const isDbOrder     = window.webSqlManager.exists('sfa-order', 'userId');
        const isDbResource  = window.webSqlManager.exists('sfa-resource', 'userId');

        return isDbAccount
            && isDbResource
            && isDbProduct
            && isDbOrder
            && isDbSetup;
    }

    const isDbAccount   = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/${deviceId}_sfa-account.db`);
    const isDbProduct   = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/${deviceId}_sfa-product.db`);
    const isDbSetup     = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/${deviceId}_sfa-setup.db`);
    const isDbOrder     = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/${deviceId}_sfa-order.db`);
    const isDbResource  = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/${deviceId}_sfa-resource.db`);

    return isDbAccount.exists
        && isDbProduct.exists
        && isDbSetup.exists
        && isDbOrder.exists
        && isDbResource.exists;
};

const isDbLocal = async (db, deviceId) => {
    let local = false;
    if (Platform.OS === 'web') {
        local = window.webSqlManager.exists(`sfa-${db}`, 'userId');
    } else {
        console.log('<><<<<<<<', `${FileSystem.documentDirectory}SQLite/${deviceId}_sfa-${db}.db`);
        const file = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/${deviceId}_sfa-${db}.db`);
        local = file.exists;
    }
    return local;
};

const currentTrackingChange = {};
const currentDeviceData = {};

// services.forEach(cfg => {
//   if (cfg.syncTranckingChange) {
//     if (currentTrackingChange[cfg.nome] === undefined) {
//       currentTrackingChange[cfg.nome] = new TrackingChange(cfg.nome);
//       currentTrackingChange[cfg.nome].start();
//     }
//   }

//   if (cfg.syncDeviceData) {
//     if (currentDeviceData[cfg.nome] === undefined) {
//       currentDeviceData[cfg.nome] = new DeviceData(cfg.nome);
//       currentDeviceData[cfg.nome].start();
//     }
//   }
// });


const getInitialRouteName = async () => {
    const deviceId = await deviceInfo.getDeviceId();
    const auth = await isAuth();
    const dbLocal = await isAllDbsLocal(deviceId);

    if (dbLocal) {
        console.log('JÁ TEM O BANCOS DE DADOS');
    } else {
        console.log('NÃO TEM BANCOS DE DADOS');
    }

    const flow
        = (!dbLocal)
            ? 'setup'
            : 'assistant';

    return (!auth)
        ? 'main'
        : flow;
};

export {
    getInitialRouteName,
    isAuth,
    getToken,
    getUserId,
    getClientInfo,
    isDbLocal,
    getAppId,
    getLocalStorage,
};