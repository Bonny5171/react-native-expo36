import SrvProduct from '../../Product';
import SrvOrder from '../../Order';
import { queryBuilder as query } from '../../Repository/ProductDb';
import { repository, queryBuilder as qOrder } from '../../Repository/OrderDb';
import { getClientForCart } from '../Client/Queries';


export const FORM_FECHAMENTO = {
  ORDEM_COMPRA: 'sf_ordem_compra__c',
  PREVISAO_EMBARQUE: 'sf_previsao_embarque__c',
  PRAZO_ADD: 'sf_prazo_adicional__c',
  DESCONTO_ADD: 'sf_desconto_adicional__c',
  COND_PAGAMENTO: 'sf_condicoes_pagamento__c',
  PRE_DATA_ENTREGA: 'sf_pre_data_entrega__c',
  PERIODO_ENTREGA: 'sf_periodo_entrega__c',
  REPOSICAO: 'sf_reposicao__c',
  OBSERVACOES: 'sf_description',
};

export const getEmbalamentos = async (modelo) => {
  const DESCRIPTION = 'ref4';
  const NAME = 'ref4';

  const select = query
    .select()
    .distinct()
    .field(NAME)
    // .field(DESCRIPTION)
    .field('ref4')
    .from('sfa_product_var4')
    .where('ref1 = ?', modelo);
  // console.log('select EMBA', select.toString());
  const array = await SrvProduct.customQuery(select);
  const mappedArray = array.map((obj) => ({
    'name': obj[NAME],
    // 'description': obj[DESCRIPTION],
  }));
  return mappedArray;
};


export const getTotalGrades = async (pricebookId, cartId) => {
  const select = query
    .select()
    .field('COUNT(ref3)', 'total')
    .from('sf_quote_line_item')
    .where('is_deleted = ?', 'false')
    .where('sf_pricebook_entry_id = ?', pricebookId)
    .where('quote_sfa_guid__c = ?', cartId);
    const totalGrades = await SrvOrder.customQuery(select);

  return totalGrades[0].total;
};

export const getTotalPairs = async (pricebookId, cartId) => {
  const select = query
    .select()
    .field('sf_quantity', 'qt')
    .field('sf_sum_of_pairs__c', 'total')
    .from('sf_quote_line_item')
    .where('is_deleted = ?', 'false')
    .where('sf_sum_of_pairs__c IS NOT NULL')
    .where('sf_pricebook_entry_id = ?', pricebookId)
    .where('quote_sfa_guid__c = ?', cartId);
  const result = await SrvOrder.customQuery(select);
  let sum = 0;
  result.forEach(({ total, qt }) => { sum += total * (qt || 0); });
  return sum;
};

export const upsertFechamentoPE = async (id, field) => {
  const repo = await repository();
  const property = Object.keys(field)[0];
  // Preparando objeto com campos novos para realizar upsert
  const newCart = {
    id,
    ...{ [property]: field[property] },
  };
  // console.log('newCart', newCart)
  repo.upsert('sf_quote', newCart);
};

export const getFormFechamento = async (id) => {
  const select = qOrder
    .select()
    .field("COALESCE(sf_ordem_compra__c, '')", 'ordemCompra')
    .field("COALESCE(sf_condicoes_pagamento__c,'')", 'condPag')
    .field("COALESCE(sf_prazo_adicional__c,'')", 'prazoAdd')
    .field("COALESCE(sf_desconto_adicional__c,'')", 'descontoAdd')
    .field("COALESCE(sf_pre_data_entrega__c,'')", 'preData')
    .field("COALESCE(sf_periodo_entrega__c,'')", 'periodoEntrega')
    .field("COALESCE(sf_description,'')", 'observacoes')
    .field("COALESCE(sf_reposicao__c,'')", 'reposicao')
    .from('sf_quote')
    .where('id = ?', id);
  const result = await SrvOrder.customQuery(select, true);
  // Separando periodo de entrega
  if (result.periodoEntrega !== '') {
    const splited = result.periodoEntrega.split('-');
    if (splited[0] || splited[1]) {
      result.de = splited[0];
      result.a = splited[1];
      // Transformando reposição para true/false
      result.reposicao = result.reposicao === '1';
    }
  } else {
    result.de = '';
    result.a = '';
  }
  result.reposicao = result.reposicao === '1';
  // Propriedade deletada para nao atrapalhar a verificao de form de fechamento concluido
  // case 'check_form_state', Linha 240, cart.js (reducer)
  delete result.periodoEntrega;
  // console.log('result', result);
  return result;
};

// Define carrinho atual e cliente atual (dados usados na pgCarrinho e Pedido)
export const cartBoxClicked = async (carts, cartKey, acSetDropdownCarts, acCurrentClient, appDevName) => {
    const cartDefault = carts.find(car => car.key === cartKey);
    // Recuperando do BD e definindo o carrinho "atual"
    cartDefault.products = await SrvOrder.getProdutos([{ quote_sfa_guid__c: cartDefault.key }]);
    acSetDropdownCarts({ current: cartDefault, isVisible: false });
    // Recuperando cliente e definindo como atual
    // console.log('cartDefault.clientId', cartDefault.clientId);
    const client = await getClientForCart(cartDefault.clientId, appDevName);
    await acCurrentClient(client);
};
