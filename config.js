const authWeb = false;

const path = {
  db: '/db/download',
  schema: '/db-schema',
  trackingChanges: '/db-tracking-changes',
  deviceData: '/device-data',
  devices: '/devices'
};

const services = [
  {
    nome: 'setup',
    version: '/v1',
    apiUrl: 'https://api-setup-dev-dot-crmgrendene.appspot.com',
    jobUrl: 'https://api-job-dev-dot-crmgrendene.appspot.com/setup',
    host: 'http://api-setup-dev-dot-crmgrendene.appspot.com/api',
    host_mount: 'https://pushjob-dev-setup-dot-crmgrendene.appspot.com/org/{ORG_ID}/job/name/job_gen_app_db/push',
    storageDb: 'https://storage.googleapis.com/grensfadbs/dev',
    syncTranckingChange: true,
    syncDeviceData: false,
    path: path,
  },
  {
    nome: 'account',
    version: '/v1',
    apiUrl: 'https://api-account-dev-dot-crmgrendene.appspot.com',
    jobUrl: 'https://api-job-dev-dot-crmgrendene.appspot.com/account',
    host: 'http://api-account-dev-dot-crmgrendene.appspot.com/api',
    host_mount: 'https://pushjob-dev-account-dot-crmgrendene.appspot.com/org/{ORG_ID}/job/name/job_gen_app_db/push',
    storageDb: 'https://storage.googleapis.com/grensfadbs/dev',
    syncTranckingChange: true,
    syncDeviceData: false,
    path: path,
  },
  {
    nome: 'product',
    version: '/v1',
    apiUrl: 'https://api-product-dev-dot-crmgrendene.appspot.com',
    jobUrl: 'https://api-job-dev-dot-crmgrendene.appspot.com/product',
    host: 'http://api-product-dev-dot-crmgrendene.appspot.com/api',
    host_mount: 'https://pushjob-dev-product-dot-crmgrendene.appspot.com/org/{ORG_ID}/job/name/job_gen_app_db/push',
    storageDb: 'https://storage.googleapis.com/grensfadbs/dev',
    syncTranckingChange: true,
    syncDeviceData: false,
    path: path,
  },
  {
    nome: 'order',
    version: '/v1',
    apiUrl: 'https://api-order-dev-dot-crmgrendene.appspot.com',
    jobUrl: 'https://api-job-dev-dot-crmgrendene.appspot.com/order',
    host: 'http://api-order-dev-dot-crmgrendene.appspot.com/api',
    host_mount: 'https://pushjob-dev-order-dot-crmgrendene.appspot.com/org/{ORG_ID}/job/name/job_gen_app_db/push',
    storageDb: 'https://storage.googleapis.com/grensfadbs/dev',
    syncTranckingChange: true,
    syncDeviceData: true,
    path: path,
  },
  {
    nome: 'resource',
    version: '/v1',
    apiUrl: 'https://api-resource-dev-dot-crmgrendene.appspot.com',
    jobUrl: 'https://api-job-dev-dot-crmgrendene.appspot.com/resource',
    host: 'http://api-resource-dev-dot-crmgrendene.appspot.com/api',
    host_mount: 'https://pushjob-dev-resource-dot-crmgrendene.appspot.com/org/{ORG_ID}/job/name/job_gen_app_db/push',
    storageDb: 'https://storage.googleapis.com/grensfadbs/dev',
    syncTranckingChange: false,
    syncDeviceData: false,
    path: path,
  }
];

const auth = {
          dev: 'https://auth-dev-dot-crmgrendene.appspot.com/',
       client: 'https://auth-dev-dot-crmgrendene.appspot.com/',
   standalone: 'https://auth-dev-dot-crmgrendene.appspot.com/'
};

const log = {
  showSql: false
};

// const orgId = '00Dg0000006I4Ha'; // QA
const orgId = '00D6C0000008lo3'; // DEV

const locales = 'pt-BR';

export {
    services,
    authWeb,
    auth,
    orgId,
    locales,
    log
};

// console.log('.env: %j', process.env);
