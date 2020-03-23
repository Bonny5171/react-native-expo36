import { queryBuilder as query } from '../../../services/Repository/AccountDb';
import SrvAccount from '../../../services/Account';

export const getClientForCart = async (sfId, appDevName) => {
  const select = query.select()
    .field('sf_id')
    .field('sf_name')
    .field("COALESCE(sf_codigo_totvs__c, '') AS sf_codigo_totvs__c")
    .field('sf_rua_cobranca__c')
    .field('sf_estado_cobranca__c')
    .field('sf_cepcobranca__c')
    .field('sf_rua__c')
    .field('sf_estado__c')
    .field('sf_cep__c')
    .field('sf_cidade_texto__c')
    .field('sf_rua_entrega__c')
    .field('sf_estado_entrega__c')
    .field('sf_cepentrega__c')
    .field('sf_cidade_entrega_texto__c')
    .field('sf_cidade_cobranca_texto__c')
    .field(`COALESCE(sf_ordem_compra_${appDevName.toLowerCase()}__c, '')`, 'sf_ordem_compra__c')
  .from('vw_account')
  .where('sf_id = ?', sfId);
  const result = await SrvAccount.customQuery(select, true);
  // console.log('result', result);
  return result;
};