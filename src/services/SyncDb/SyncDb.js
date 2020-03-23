import { FileSystem } from 'expo-file-system';
import { Platform } from 'react-native';
import { services, orgId, } from '../../../config';
import { getToken, isDbLocal, getUserId, } from '../Auth';
import axios from 'axios';

import Product from '../../services/Product';
import Account from '../../services/Account';
import Setup from '../../services/Setup';
import Resource from '../../services/Resource';
import Order from '../../services/Order';

const servicesInstance = {
  product: Product,
  account: Account,
  setup: Setup,
  order: Order,
  resource: Resource
};

const onSync = async ({ service, changePorcent, changeIndeterminate, changeRetry, deviceId, userId, appId }) => {

  let tentativas = 0;

  const nMaxtentativas = 10;

  const timeout = 60000;

  const hasFileSystemPath = async () => {
    // Valida se tem o local para salvar os bancos.
    const fileUri = `${FileSystem.documentDirectory}SQLite`;
    const pathStore = await FileSystem.getInfoAsync(fileUri, {});

    console.log('VALIDANDO SE TENHO O PATH PARA SALVAR O BANCO.', pathStore.exists);
    if (pathStore.exists !== 1) {
      console.log('Cria a pasta para salvar os bancos: ', fileUri);

      try {
        await FileSystem.makeDirectoryAsync(fileUri, {});
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  const register = async (nome, cfg) => {
    servicesInstance[nome].saveParameter('CURRENT_DEVICE_ID', deviceId);
    servicesInstance[nome].saveParameter('CURRENT_USER_ID', userId);
    servicesInstance[nome].saveParameter('CURRENT_APP_ID', appId);
  };

  const processDownload_NATIVO = async (cfg, nome, url, options) => {
    tentativas++;

    console.log(`TENTATIVA "${tentativas}" - INICIANDO PROCESSO DOWNLOAD NO NATIVO NA URL: ${url}`);

    const nameDb = `sfa-${nome}.db`;

    // Verifica se tem o path onde sera salvo os Dbs, e os cria se não existir.
    await hasFileSystemPath();

    let percentInt = 0;

    // Progresso do download.
    global.downloadResumable = FileSystem.createDownloadResumable(
      url,
      FileSystem.documentDirectory + 'SQLite/' + deviceId + '_' + nameDb,
      options,
      (downloadProgress) => {
        const percent = (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100;
        const hasError = percent === 100 && percentInt === 0;
        if (hasError) {
          return false;
        }

        if (parseInt(percent, 10) > percentInt) {
          percentInt = parseInt(percent, 10);
          console.log(`Status download: ${nameDb} ${percentInt}%`);

          const obj = {};
          obj[nome] = percentInt;
          changePorcent(obj);

          const objIndeterminate = {};
          objIndeterminate[nome] = false;
          changeIndeterminate(objIndeterminate);
        }
      },
    );

    // Start downlodad;
    const { uri, status } = await global.downloadResumable.resumeAsync();

    if (status === 200) {
      console.log('SUCESS', uri, status);

      // REGISTRANDO DEVICE COM EXCEÇÃO DO ANDROID.
      // register(nome, cfg);
      setTimeout(() => {
        register(nome, cfg);
      }, 3000);
    } else {
      if (tentativas < nMaxtentativas) {
        const { nome, host_mount } = cfg;
        const userId = await getUserId();
        const newUrl = host_mount.replace('{ORG_ID}', orgId);
        const db_name = `sfa-${nome}`;
        const token = await getToken();

        try {
          let response = { status: 500 };
          if (tentativas === 1) {
            console.log(` - SOLICITA CONSTRUÇÃO DO BANCO DE DADOS PARA ESTE USUARIO: ${newUrl}`);
            const opts = {
              db_name: db_name,
              data_page_size: 1000,
              user_id: userId,
            };
            response = await axios({
              url: newUrl,
              method: 'POST',
              headers: {
                'authorization': 'Bearer ' + token,
                'content-type': 'application/json'
              },
              body: JSON.stringify(opts)
            });

            if (response.status === 200) {
              setTimeout(async () => {
                await processDownload_NATIVO(cfg, nome, url, options);
              }, timeout);
            }
          } else {
            setTimeout(async () => {
              await processDownload_NATIVO(cfg, nome, url, options);
            }, timeout);
          }
        } catch (error) {
          console.log('ERRO AO SOLICITAR CONTRIÇÃO DO BANCO', error);
        }
      } else {
        console.log(`NUMERO DE TENTATIVAS ESGOTADA, HABILITADO BOTÃO RETRY PARA O DB "${nome}"`);
        const retry = {};
        retry[nome] = true;
        changeRetry(retry);
      }
    }
  };

  const processDownload_ELETRON = async (cfg, nome, url, token) => {
    tentativas++;

    console.log(`TENTATIVA "${tentativas}" - INICIANDO PROCESSO DOWNLOAD NO ELETRON NA URL: ${url}`);

    const nameDb = `sfa-${nome}`;

    // Progresso do download.
    window.webSqlManager.on(`${nameDb}::downloadProgress`, (status) => {
      const obj = {};
      obj[nome] = status.percent;
      changePorcent(obj);

      const objIndeterminate = {};
      objIndeterminate[nome] = false;
      changeIndeterminate(objIndeterminate);
    });

    // GET DE FATO.
    window.webSqlManager.load(nameDb, 'userId', url, token).then(
      // Success
      async (r) => {
        console.log('SUCESS', r.message);

        // REGISTRANDO DEVICE COM EXCEÇÃO DO ANDROID.
        setTimeout(() => {
          register(nome, cfg);
        }, 3000);
      },
      // Error
      async (r) => {
        console.log('ERROR', r.message);
        if (tentativas < nMaxtentativas) {
          const { nome, host_mount } = cfg;
          const userId = await getUserId();
          const newUrl = host_mount.replace('{ORG_ID}', orgId);
          const db_name = `sfa-${nome}`;

          try {
            let response = { status: 500 };
            if (tentativas === 1) {
              console.log(`SOLICITA CONSTRUÇÃO DO BANCO DE DADOS PARA ESTE USUARIO: ${newUrl}`);
              const opts = {
                db_name: db_name,
                data_page_size: 1000,
                user_id: userId,
              };
              response = await axios({
                url: newUrl,
                method: 'POST',
                headers: {
                  'authorization': 'Bearer ' + await getToken(),
                  'content-type': 'application/json'
                },
                body: JSON.stringify(opts)
              });

              if (response.status === 200) {
                setTimeout(async () => {
                  await processDownload_ELETRON(cfg, nome, url, '');
                }, timeout);
              }
            } else {
              setTimeout(async () => {
                await processDownload_ELETRON(cfg, nome, url, '');
              }, timeout);
            }
          } catch (error) {
            console.log('ERRO AO SOLICITAR CONTRIÇÃO DO BANCO', error);
          }
        } else {
          console.log(`NUMERO DE TENTATIVAS ESGOTADA, HABILITADO BOTÃO RETRY PARA O DB "${nome}"`);
          const retry = {};
          retry[nome] = true;
          changeRetry(retry);
        }
      }
    );
  };

  try {
    const cfg = services.find(srv => srv.nome === service);
    if (!cfg) {
      throw new Error(`Oooops! para o serviço ${service} não foi localizado sua configuração para prosseguir.`);
    }

    if (await isDbLocal(cfg.nome, deviceId)) {
      const obj = {};
      obj[cfg.nome] = 100;
      changePorcent(obj);

      const objIndeterminate = {};
      objIndeterminate[cfg.nome] = false;
      changeIndeterminate(objIndeterminate);

      return console.log('BANCO JA EXISTENTE, NÃO SERA FEITO O DOWNLOAD NOVAMENTE.');
    }

    if (Platform.OS === 'web') {
      const { nome, storageDb } = cfg;
      const url = `${storageDb}/${userId}/sfa-${nome}.zip?&nocache=${new Date().getTime()}`;
      const token = '';
      await processDownload_ELETRON(cfg, nome, url, token);
    } else {
      const { nome, storageDb } = cfg;
      const url = `${storageDb}/${userId}/sfa-${nome}.db?&nocache=${new Date().getTime()}`;
      const options = {};
      await processDownload_NATIVO(cfg, nome, url, options);
    }

    console.log('PROCESSO FINALIZADO');
  } catch (error) {
    console.log(`ERRO: ${error}.`);
  }
};

export {
  onSync
};