import SrvClients from '../../Account';
import { queryBuilder as query } from '../../Repository/AccountDb';
import { getLocalStorage } from '../../../services/Auth';

export const getSituations = async () => {
  const appName = await getLocalStorage('appDevName');
  const SITUATION  = `sf_situacao_${appName.toLowerCase()}__c`;
  const select = query
  .select()
  .distinct()
  .field(SITUATION)
  .from('vw_account')
  .where(`${SITUATION} IS NOT NULL`)
  .where(`${SITUATION} <> ''`);
  const results = await SrvClients.customQuery(select, null, true);
  const situations = results.map((r, index) => ({
    option: r[SITUATION],
    key: index.toString(),
  }));
  return situations;
};
