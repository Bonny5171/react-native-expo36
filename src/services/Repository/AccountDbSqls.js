const cmds = [
  // vw_account
  {
    name: 'vw_account',
    down: 'DROP VIEW IF EXISTS vw_account;',
    up:
      `
  CREATE VIEW vw_account AS
    SELECT
      a.id,
      a.sf_id,
      a.sf_parent_id,
      a.sf_record_type_id,
      COALESCE(a.sf_name, '') AS sf_name,
      COALESCE(a.sf_nome_fantasia__c, '') AS sf_nome_fantasia__c,
      COALESCE(a.sf_codigo_totvs__c, '') AS sf_codigo_totvs__c,
      COALESCE(a.sf_phone, '') AS sf_phone,
      COALESCE(a.sf_photo_url, '') AS sf_photo_url,
      '[404]' AS sf_sector__c,
      COALESCE(a.sf_telefone_adicional__c, '') AS sf_telefone_adicional__c,
      COALESCE(a.sf_legal_number__c, '') AS sf_legal_number__c,
      
      COALESCE(a.sf_photo1__c, '') AS sf_photo1__c,
      COALESCE(a.sf_person_email, '') AS sf_person_email,
      COALESCE(a.sf_rua_cobranca__c, '') AS sf_rua_cobranca__c,
      COALESCE(a.sf_estado_cobranca__c, '') AS sf_estado_cobranca__c,
      COALESCE(a.sf_cepcobranca__c, '') AS sf_cepcobranca__c,
      COALESCE(a.sf_rua__c, '') AS sf_rua__c,
      COALESCE(a.sf_estado__c, '') AS sf_estado__c,
      COALESCE(a.sf_cep__c, '') AS sf_cep__c,
      COALESCE(a.sf_cidade_texto__c, '') AS sf_cidade_texto__c,
      COALESCE(a.sf_rua_entrega__c, '') AS sf_rua_entrega__c,
      COALESCE(a.sf_estado_entrega__c, '') AS sf_estado_entrega__c,
      COALESCE(a.sf_cepentrega__c, '') AS sf_cepentrega__c,
      COALESCE(a.sf_cidade_entrega_texto__c, '') AS sf_cidade_entrega_texto__c,
      COALESCE(a.sf_cidade_cobranca_texto__c, '') AS sf_cidade_cobranca_texto__c,
      COALESCE(a.sf_type, '') AS sf_type,
      COALESCE(a.sf_frequencia__c, 'NULO') AS sf_frequencia__c,
      COALESCE(a.sf_pontualidade__c, 'NULO') AS sf_pontualidade__c,
      COALESCE(a.sf_confirmacao__c, 'NULO') AS sf_confirmacao__c,
      COALESCE(a.sf_encartes__c, 'NULO') AS sf_encartes__c,
      COALESCE(a.sf_centralizador_cobranca__c, '') AS sf_centralizador_cobranca__c,
      COALESCE(a.sf_centralizador_pagamentos__c, '') AS sf_centralizador_pagamentos__c,
      COALESCE(a.sf_setor_atividade_div1__c, 'NULO') AS sf_setor_atividade_div1__c,
      COALESCE(a.sf_setor_atividade_dve__c, 'NULO') AS sf_setor_atividade_dve__c,
      COALESCE(a.sf_ordem_compra_div1__c, '') AS sf_ordem_compra_div1__c,
      COALESCE(a.sf_ordem_compra_dve__c, '') AS sf_ordem_compra_dve__c,  

      COALESCE(a.sf_saldo_limite_div1__c, '0') AS sf_saldo_limite_div1__c,
      COALESCE(a.sf_saldo_limite_dve__c, '0') AS sf_saldo_limite_dve__c,
      COALESCE(a.sf_limite_adicional_div1__c, '0') AS sf_limite_adicional_div1__c,
      COALESCE(a.sf_limite_adicional_dve__c, '0') AS sf_limite_adicional_dve__c,
      COALESCE(a.sf_motivo_bloqueio_div1__c, 'NULO') AS sf_motivo_bloqueio_div1__c,
      COALESCE(a.sf_motivo_bloqueio_dve__c, 'NULO') AS sf_motivo_bloqueio_dve__c,
      COALESCE(a.sf_situacao_div1__c, 'NULO') AS sf_situacao_div1__c,
      COALESCE(a.sf_situacao_dve__c, 'NULO') AS sf_situacao_dve__c,
      COALESCE(a.sf_saldo_duplicatas_vencidas_div1__c, '0') AS sf_saldo_duplicatas_vencidas_div1__c,
      COALESCE(a.sf_saldo_duplicatas_vencidas_dve__c, '0') AS sf_saldo_duplicatas_vencidas_dve__c,
      COALESCE(a.sf_saldo_duplicatas_avencer_div1__c, '0') AS sf_saldo_duplicatas_avencer_div1__c,
      COALESCE(a.sf_saldo_duplicatas_avencer_dve__c, '0') AS sf_saldo_duplicatas_avencer_dve__c,
      COALESCE(a.sf_saldo_despesas_vencidas_div1__c, '0') AS sf_saldo_despesas_vencidas_div1__c,
      COALESCE(a.sf_saldo_despesas_vencidas_dve__c, '0') AS sf_saldo_despesas_vencidas_dve__c,
      COALESCE(a.sf_saldo_despesas_avencer_div1__c, '0') AS sf_saldo_despesas_avencer_div1__c,
      COALESCE(a.sf_saldo_despesas_avencer_dve__c, '0') AS sf_saldo_despesas_avencer_dve__c,
      COALESCE(a.sf_pedidos_faturados_div1__c, '0') AS sf_pedidos_faturados_div1__c,
      COALESCE(a.sf_pedidos_faturados_dve__c, '0') AS sf_pedidos_faturados_dve__c,
      COALESCE(a.sf_pedidos_aprovados_div1__c, '0') AS sf_pedidos_aprovados_div1__c,
      COALESCE(a.sf_pedidos_aprovados_dve__c, '0') AS sf_pedidos_aprovados_dve__c,
      COALESCE(a.sf_pedidos_aprovar_div1__c, '0') AS sf_pedidos_aprovar_div1__c,
      COALESCE(a.sf_pedidos_aprovar_dve__c, '0') AS sf_pedidos_aprovar_dve__c,

      COALESCE(b.sf_developer_name, '') AS sf_developer_name
    FROM 
      sf_account a
    --INNER JOIN
    --(
    --  SELECT DISTINCT 
    --    s.sf_id AS sf_id,
    --    s.is_deleted AS is_deleted
    --  FROM 
    --    sf_share s
    --  WHERE 
    --    s.sf_object_name = 'Account' AND 
    --    s.user_id = (SELECT value FROM parameter WHERE id = 'CURRENT_USER_ID' AND is_active = 'true' AND is_deleted = 'false') AND 
    --    s.is_deleted = 'false' AND
    --    s.is_active = 'true'
    --) s ON (s.sf_id = a.sf_id) 
    INNER JOIN
      sf_record_type b ON (a.sf_record_type_id = b.sf_id)
    WHERE 
      a.is_deleted = 'false' AND
      a.is_active = 'true'
    ;      
    `
  },
  // {
  //   name: 'add_coll_sfa_campanha__c',
  //   down: '',
  //   up:
  //     `
  //     ALTER TABLE sf_politica_comercial__c
  //     ADD sfa_campanha__c TEXT;         
  //   `
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //     `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'Victoria’s Real Secret.' WHERE id = '03c4182d-55b9-9144-9c83-bfe04d648bea';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //     `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'Don’t be a loser, be a chooser' WHERE id = '220e3a64-40fb-22d5-0a20-cf3d75985fb1';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //     `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'Just Do It. Vote for teste' WHERE id = '30929476-53b0-0542-622f-205b583972d8';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //     `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'I Promise I Will Never Promise Anything.' WHERE id = '434fca5c-2abd-48cf-9255-b07af6716f75';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //     `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'I Look Good Don’t I.' WHERE id = '495a93ac-4e0e-f373-1882-a7dd0fde8fd4';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //     `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'When the going gets tough, I won’t have internal affair' WHERE id = '61309598-8942-7786-d21e-1d7a1b6c1f49';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //   `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'If Bush can do it' WHERE id = '617527b0-a392-e7d4-f7dd-cdcb55c1755e';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //   `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'Restore the bathroom.' WHERE id = '6637b8b5-b68a-1e49-9846-0bec6ae030b7';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //   `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'I’ve upped my standards. Up yours.' WHERE id = '68a50a03-18d5-09e5-b171-710d484d71c5';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //   `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'My opponent likes Ricky Martin.' WHERE id = '69debf3d-150a-778d-2146-503c0cec7a3b';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //   `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'I Already Told My Mom I Won!' WHERE id = '7dd20cf3-16bb-5981-363b-2a73b61c7ae2';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //   `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'Yes we can!' WHERE id = '90d817e6-6e7e-99d4-f218-add9c0d91e21';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //   `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'Vote for change' WHERE id = 'b9eddc0b-5734-442b-1b51-d8ec18565b5b';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //   `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'One people, one empire, one leader' WHERE id = 'c100f3b4-6085-95c7-3dfc-30633c48e790';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //   `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'Make love not war' WHERE id = 'c6323abd-d4de-a2c5-5834-76af2015a8e4';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //   `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'Labor is not working' WHERE id = 'd7cd0723-f325-8fb6-f7cf-55821df06489';`
  // },
  // {
  //   name: 'set_campanha',
  //   down: '',
  //   up:
  //   `UPDATE sf_politica_comercial__c SET sfa_campanha__c = 'No war but class war' WHERE id = 'e351faf4-bdb9-7cea-15ec-f056be5f8bae';`
  // },
];

export { cmds };