import { queryBuilder as query } from '../../Repository/AccountDb';
import AccountDB from '../../Account';

// Query base das Pgs. Assistente e Cliente
export const queryGetClients = async (appName) => {
  const select = await query.select()
    .distinct()
    .field('a.id', 'id')
    .field('a.sf_id', 'sf_id')
    .field('a.sf_name', 'sf_name')
    .field('a.sf_nome_fantasia__c', 'sf_nome_fantasia__c')
    .field('a.sf_codigo_totvs__c', 'sf_codigo_totvs__c')
    .field('a.sf_phone', 'sf_phone')
    .field('a.sf_photo_url', 'sf_photo_url')
    .field('a.sf_photo1__c', 'sf_photo1__c')
    .field('a.sf_telefone_adicional__c', 'sf_telefone_adicional__c')
    .field('a.sf_legal_number__c', 'sf_legal_number__c')    
    .field('a.sf_photo1__c', 'sf_photo1__c')
    .field('a.sf_person_email', 'sf_person_email')
    .field('a.sf_rua_cobranca__c', 'sf_rua_cobranca__c')
    .field('a.sf_estado_cobranca__c', 'sf_estado_cobranca__c')
    .field('a.sf_cepcobranca__c', 'sf_cepcobranca__c')
    .field('a.sf_rua__c', 'sf_rua__c')
    .field('a.sf_estado__c', 'sf_estado__c')
    .field('a.sf_cep__c', 'sf_cep__c')
    .field('a.sf_cidade_texto__c', 'sf_cidade_texto__c')
    .field('a.sf_rua_entrega__c', 'sf_rua_entrega__c')
    .field('a.sf_estado_entrega__c', 'sf_estado_entrega__c')
    .field('a.sf_cepentrega__c', 'sf_cepentrega__c')
    .field('a.sf_cidade_entrega_texto__c', 'sf_cidade_entrega_texto__c')
    .field('a.sf_cidade_cobranca_texto__c', 'sf_cidade_cobranca_texto__c')
    .field('a.sf_parent_id', 'sf_parent_id')
    .field('a.sf_type', 'sf_type')
    // .field('a.sf_motivo_bloqueio__c', 'sf_motivo_bloqueio__c')
    .field('a.sf_frequencia__c', 'sf_frequencia__c')
    .field('a.sf_pontualidade__c', 'sf_pontualidade__c')
    .field('a.sf_confirmacao__c', 'sf_confirmacao__c')
    .field('a.sf_encartes__c', 'sf_encartes__c')
    .field('a.sf_centralizador_cobranca__c', 'sf_centralizador_cobranca__c')
    .field('a.sf_centralizador_pagamentos__c', 'sf_centralizador_pagamentos__c')
    .field(`a.sf_setor_atividade_${appName.toLowerCase()}__c`, 'sf_sector')
    .field(`COALESCE(a.sf_ordem_compra_${appName.toLowerCase()}__c, '')`, 'sf_ordem_compra__c')
    .field(`a.sf_situacao_${appName.toLowerCase()}__c`, 'sf_situacao__c')
    .field(`COALESCE(a.sf_saldo_limite_${appName.toLowerCase()}__c, 'NULO')`, 'sf_saldo_limite__c')
    .field(`COALESCE(a.sf_limite_adicional_${appName.toLowerCase()}__c, 'NULO')`, 'sf_limite_adicional__c')
    .field(`COALESCE(a.sf_motivo_bloqueio_${appName.toLowerCase()}__c, 'NULO')`, 'sf_motivo_bloqueio__c')
    .field(`COALESCE(a.sf_situacao_${appName.toLowerCase()}__c, 'NULO')`, 'sf_situacao__c')
    .field(`COALESCE(a.sf_saldo_duplicatas_vencidas_${appName.toLowerCase()}__c, 'NULO')`, 'sf_saldo_duplicatas_vencidas__c')
    .field(`COALESCE(a.sf_saldo_duplicatas_avencer_${appName.toLowerCase()}__c, 'NULO')`, 'sf_saldo_duplicatas_avencer__c')
    .field(`COALESCE(a.sf_saldo_despesas_vencidas_${appName.toLowerCase()}__c, 'NULO')`, 'sf_saldo_despesas_vencidas__c')
    .field(`COALESCE(a.sf_saldo_despesas_avencer_${appName.toLowerCase()}__c, 'NULO')`, 'sf_saldo_despesas_avencer__c')
    .field(`COALESCE(a.sf_pedidos_faturados_${appName.toLowerCase()}__c, 'NULO')`, 'sf_pedidos_faturados__c')
    .field(`COALESCE(a.sf_pedidos_aprovados_${appName.toLowerCase()}__c, 'NULO')`, 'sf_pedidos_aprovados__c')
    .field(`COALESCE(a.sf_pedidos_aprovar_${appName.toLowerCase()}__c, 'NULO')`, 'sf_pedidos_aprovar__c')
    .field("COALESCE(e.sf_tipo_embalamento__c, 'NULO')", 'sf_tipo_embalamento__c')
    .field("COALESCE(e.sf_classificador_tipo_embalamento__c, 'NULO')", 'sf_classificador_tipo_embalamento__c')
    .field('a.sf_developer_name', 'sf_developer_name')    
    .from('vw_account', 'a')
    .left_join('sf_embalamento_cliente__c', 'e', 'a.sf_id = e.sf_id')
    .where('a.sf_developer_name in ("Matriz", "Loja")')
    .order('a.sf_name');
  return select;
};


export const getClients = async (appName) => {
  const select = await queryGetClients(appName);
  const result = await AccountDB.customQuery(select);
  // console.log('RESULT', result);
  return result;
};