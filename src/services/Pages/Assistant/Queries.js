import AccountDB from '../../Account';
import { queryBuilder as query } from '../../Repository/AccountDb';
import { queryGetClients } from '../Common/Queries';
import { getLocalStorage } from '../../../services/Auth';

// Pega clientes para lista de cards "Passo 2 Def.Cliente"
export const getClients = async (appName) => {
  const select = await queryClients(appName);
  const result = await AccountDB.customQuery(select);
  // console.log('result', result);
  return result;
};

// Pega as Filiais de um(a) matriz/representante
export const getBranches = async (id) => {
  const select = await queryBranches(id);
  const result = await AccountDB.customQuery(select);
  return result;
};

export const queryBranches = async (id) => {
  const appName = await getLocalStorage('appDevName');
  const select = query
    .select()
    .field('sf_id')
    .field('sf_name')
    .field('sf_nome_fantasia__c')
    .field('sf_photo_url')
    .field('sf_codigo_totvs__c')
    .field(`sf_situacao_${appName.toLowerCase()}__c`, 'sf_situacao__c')
    .field('sf_legal_number__c')
    .field('sf_rua__c')
    .field('sf_estado__c')
    .field('sf_cep__c')
    .field('sf_developer_name')
    .field('sf_parent_id')
    .from('vw_account')
    .where('sf_parent_id = ?', id)
    .order('sf_name');
  return select;
};

export const queryClients = async (appName) => {
  const select = await queryGetClients(appName);
  select
    .field('sf_developer_name')
    .field(
      query.select()
        .field("COUNT('sf_name')")
        .from('vw_account')
        .where('sf_parent_id = sf_id'),
      'total_branches'
    )
    .order('sf_name');
  return select;
};