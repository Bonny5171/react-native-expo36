import { Platform, AsyncStorage } from 'react-native';
import { repository, queryBuilder as query } from '../Repository/OrderDb';
import { repository as prodRepo } from '../Repository/ProductDb';
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import SrvProduct from '../../services/Product';
import { asyncForEach, agrupaProdutosNoCarrinho, calcDesconto } from '../../utils/CommonFns';

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

class Order {
  static async saveParameter(name, value) {
    const repo = await repository();
    return repo.param.set(name, value);
  }

  /* CARRINHO */

  // Cria carrinho.
  static async addCarrinho({
    sf_name,
    sf_carrinho_selecionado__c,
    sf_account_id,
    sf_conta__c,
    sf_nome_cliente__c,
    sf_pricebook2id,
    sf_pricebook2_name__c,
    sf_previsao_embarque__c,
  }) {
    const repo = await repository();
    const uuid = uuidv4();
    const userId = await getUserId();
    const sf_owner_id = userId;

    const carrinho = {
      id: uuid,
      is_active: true,
      is_deleted: false,
      sf_sfa_guid__c: uuid,
      sf_status: 'Em aberto',
      sf_name: sf_name,
      sf_carrinho_selecionado__c,
      sf_account_id,
      sf_conta__c,
      sf_nome_cliente__c,
      sf_pricebook2id,
      sf_pricebook2_name__c,
      sf_previsao_embarque__c: sf_previsao_embarque__c,
      sf_owner_id,
    };
    return repo.upsert('sf_quote', carrinho);
  }

  // Exclui um carrinho.
  static async removeCarrinho(id) {
    const repo = await repository();

    const carrinho = {
      id,
      is_deleted: true
    };

    repo.upsert('sf_quote', carrinho);
  }

  // Obtem lista de carrinhos.
  static async getCarrinhos(filtros = [], orderBy, isDesc = false) {
    const repo = await repository();

    let select = query
      .select()
      .field('id')
      .field('sf_name')
      .field('sf_account_id')
      .field('sf_nome_cliente__c')
      .field('sf_carrinho_selecionado__c')
      .field('sf_pricebook2id')
      .field('sf_pricebook2_name__c')
      .field('updated_at')
      .field("COALESCE(sf_previsao_embarque__c, '[NULO]')", 'sf_previsao_embarque__c')
      .field('COALESCE(sf_grand_total, 0)', 'sf_grand_total')
      .field("COALESCE(sf_ordem_compra__c, '[NULO]')", 'sf_ordem_compra__c')
      .field("COALESCE(sf_prazo_adicional__c, '[NULO]')", 'sf_prazo_adicional__c')
      .field("COALESCE(sf_desconto_adicional__c, '[NULO]')", 'sf_desconto_adicional__c')
      .field("COALESCE(sf_condicoes_pagamento__c, '[NULO]')", 'sf_condicoes_pagamento__c')
      .field("COALESCE(sf_pre_data_entrega__c, '[NULO]')", 'sf_pre_data_entrega__c')
      .field("COALESCE(sf_periodo_entrega__c, '[NULO]')", 'sf_periodo_entrega__c')
      .field("COALESCE(sf_reposicao__c, '[NULO]')", 'sf_reposicao__c')
      .field("COALESCE(sf_codigo_totvs__c, '[NULO]')", 'sf_codigo_totvs__c')
      .field("COALESCE(sf_status, '[NULO]')", 'sf_status')
      .from('sf_quote')
      .where('is_deleted = ?', false)
      .where('sf_status = ?', 'Em aberto');

    if (!orderBy) {
      select.order('sf_nome_cliente__c');
    } else {
      orderBy.forEach(field => {
        select.order(field, isDesc);
      });
    }

    filtros.map(filtro => {
      select = select.where(`${Object.keys(filtro)[0]} = ?`, `${Object.values(filtro)[0]}`);
    });

    const carrinhos = await repo.query(select);
    return this.mapToCarts(carrinhos._array);
  }

  static async getPedidos(filtros = [], orderBy, isDesc = false) {
    const repo = await repository();

    let select = query
      .select()
      .field('id')
      .field('sf_name')
      .field('sf_account_id')
      .field('sf_nome_cliente__c')
      .field('sf_carrinho_selecionado__c')
      .field('sf_pricebook2id')
      .field('sf_pricebook2_name__c')
      .field('updated_at')
      .field("COALESCE(sf_previsao_embarque__c, '[NULO]')", 'sf_previsao_embarque__c')
      // .field('COALESCE(sf_total_amount, 0)', 'sf_total_amount')
      .field('COALESCE(sf_grand_total, 0)', 'sf_grand_total')
      .field("COALESCE(sf_ordem_compra__c, '[NULO]')", 'sf_ordem_compra__c')
      .field("COALESCE(sf_prazo_adicional__c, '[NULO]')", 'sf_prazo_adicional__c')
      .field("COALESCE(sf_desconto_adicional__c, '[NULO]')", 'sf_desconto_adicional__c')
      .field("COALESCE(sf_condicoes_pagamento__c, '[NULO]')", 'sf_condicoes_pagamento__c')
      .field("COALESCE(sf_pre_data_entrega__c, '[NULO]')", 'sf_pre_data_entrega__c')
      .field("COALESCE(sf_periodo_entrega__c, '[NULO]')", 'sf_periodo_entrega__c')
      .field("COALESCE(sf_reposicao__c, '[NULO]')", 'sf_reposicao__c')
      .field("COALESCE(sf_codigo_totvs__c, '[NULO]')", 'sf_codigo_totvs__c')
      .field("COALESCE(sf_status, '[NULO]')", 'sf_status')
      .from('sf_quote')
      .where('is_deleted = ?', false)
      .where('sf_status = ?', 'Em validação');

    if (!orderBy) {
      select.order('sf_nome_cliente__c');
    } else {
      orderBy.forEach(field => {
        select.order(field, isDesc);
      });
    }

    filtros.map(filtro => {
      select = select.where(`${Object.keys(filtro)[0]} = ?`, Object.values(filtro)[0]);
    });

    const carrinhos = await repo.query(select);
    return this.mapToCarts(carrinhos._array);
  }

  // Cria carrinho padrão
  static async criarCarrinhoPadrao(client, currentTable) {
    const carrinhoPadrao = 'Carrinho Padrão';

    const filtro = [
      { sf_account_id: client.sf_id },
      { sf_pricebook2id: currentTable.code },
      { sf_name: carrinhoPadrao },
    ];

    const carrinhos = await this.getCarrinhos(filtro);

    if (carrinhos.length === 0) {
      this.resetCarrinhoPadrao(filtro);
      const cart = await this.addCarrinho({
        sf_name: carrinhoPadrao,
        sf_carrinho_selecionado__c: 'true',
        sf_account_id: client.sf_id,
        sf_conta__c: client.sf_id,
        sf_nome_cliente__c: client.fantasyName,
        sf_pricebook2id: currentTable.code,
        sf_pricebook2_name__c: currentTable.name,
        sf_previsao_embarque__c: currentTable.mesFatur,
      });
      return this.mapToCarts(cart);
    }

    const carrinhoDefault = carrinhos[0];
    carrinhoDefault.isDefault = true;

    await this.updateCarrnho({
      id: carrinhoDefault.key,
      sf_carrinho_selecionado__c: 'true',
    });

    return carrinhoDefault;
  }

  // Atualiza um carrinho.
  static async updateCarrnho({ id, sf_carrinho_selecionado__c, }, fields) {
    const repo = await repository();

    let carrinho = { id };
    if (fields) carrinho = { id, ...fields };
    if (sf_carrinho_selecionado__c) {
      carrinho.sf_carrinho_selecionado__c = sf_carrinho_selecionado__c;
    }

    let carUpdate = await repo.upsert('sf_quote', carrinho);

    return {
      key: carUpdate.id,
      name: carUpdate.sf_name,
      clientName: carUpdate.sf_nome_cliente__c,
      isDefault: carUpdate.sf_carrinho_selecionado__c,
    };
  }

  // Deixa todos os carrinhos ativos de um cliente sem carrinho selecionado "Default".
  static async resetCarrinhoPadrao(filtro) {
    const carrinhos = await this.getCarrinhos(filtro);
    await asyncForEach(carrinhos, async (c) => {
      await this.updateCarrnho({
        id: c.key,
        sf_carrinho_selecionado__c: 'false',
      });
    });

    return 'Definido todos os carrinhos ativos sem default';
  }

  static async customQuery(query, queryOne) {
    const repo = await repository();
    let result = null;
    if (queryOne) {
      result = await repo.queryOne(query);
    } else {
      result = (await repo.query(query))._array;
    }
    // console.log('query', query.toString());
    return result;
  }

  /* PRODUTO */
  // Adiciona produto dentro de um carrinho.
  static async addProduto({
    quote_sfa_guid__c,
    ref1,
    ref2,
    ref3,
    ref4,
    sf_quantity,
    sf_description,
    sf_photo_file_name__c,
    sf_pricebook_entry_id,
    sf_list_price,
    sf_sum_of_pairs__c,
    sf_unit_price,
    sf_prazo__c,
    sf_desconto_item__c,
    sf_product2id,
  }) {
    const repo = await repository();

    const uuid = uuidv4();

    const produto = {
      id: uuid,
      is_active: true,
      is_deleted: false,
      sf_sfa_guid__c: uuid,
    };

    if (quote_sfa_guid__c) produto.quote_sfa_guid__c = quote_sfa_guid__c;
    if (ref1) produto.ref1 = ref1;
    if (ref2) produto.ref2 = ref2;
    if (ref3) produto.ref3 = ref3;
    if (ref4) produto.ref4 = ref4;
    if (sf_quantity) produto.sf_quantity = sf_quantity;
    if (sf_description) produto.sf_description = sf_description;
    if (sf_photo_file_name__c) produto.sf_photo_file_name__c = sf_photo_file_name__c;
    if (sf_pricebook_entry_id) produto.sf_pricebook_entry_id = sf_pricebook_entry_id;
    if (sf_list_price) produto.sf_list_price = sf_list_price;
    if (sf_sum_of_pairs__c) produto.sf_sum_of_pairs__c = sf_sum_of_pairs__c;
    if (sf_unit_price) produto.sf_unit_price = sf_unit_price;
    if (sf_prazo__c) produto.sf_prazo__c = sf_prazo__c;
    if (sf_desconto_item__c) produto.sf_desconto_item__c = sf_desconto_item__c;
    // if (sf_product2id) produto.sf_product2id = sf_product2id;
    produto.sf_product2id = '01t6C000000PySZQA0';

    const item = await repo.upsert('sf_quote_line_item', produto);

    return {
      key: item.id,
      name: item.sf_description,
      code: item.ref1,
      ref1: item.ref1,
      ref2: item.ref2,
      ref3: item.ref3,
      ref4: item.ref4,
      quantity: item.sf_quantity,
      embalamento: item.ref4,
      prazo: item.sf_prazo__c,
      desconto: item.sf_desconto_item__c,
      sf_pricebook_entry_id: item.sf_pricebook_entry_id,
      sf_unit_price: item.sf_unit_price,
      sf_list_price: item.sf_list_price,
      sf_total_price: item.sf_total_price,
      createdAt: new Date(item.created_at),
      uri: item.sf_photo_file_name__c,
      sf_sum_of_pairs__c: item.sf_sum_of_pairs__c,
      totalPrice: 0,
    };
  }

  // Atualiza produto dentro de um carrinho.
  static async updateProduto(produto) {
    const repo = await repository();
    let newProduct = await repo.upsert('sf_quote_line_item', produto);
    return {
      key: newProduct.id,
      name: newProduct.sf_description,
      code: newProduct.id,
      quantity: newProduct.sf_quantity,
      ref1: newProduct.ref1,
      ref2: newProduct.ref2,
      ref3: newProduct.ref3,
      ref4: newProduct.ref4,
    };
  }

  static async updatePriceAllByModel({ quote_sfa_guid__c, ref1, ref4, sf_desconto_item__c, }) {
    const repo = await repository();

    const todosProtudos = await this.getProdutos([{ ref1 }, { quote_sfa_guid__c }]);

    await asyncForEach(todosProtudos, async (produto) => {
      const { key, ref2, quantity, sf_pricebook_entry_id } = produto;
      if (ref2) {
        const prices = await SrvProduct.getPriceProduct(sf_pricebook_entry_id, ref1, ref2);
        const price = prices.find(p => p.ref4 === ref4);
        if (quantity && price) {
          const { sf_unit_price } = price;
          const sf_total_price = quantity * sf_unit_price;
          let totalComDesconto = null;
          if (sf_desconto_item__c) {
            totalComDesconto = calcDesconto(sf_total_price, sf_desconto_item__c);
          }

          const update = query
            .update()
            .table('sf_quote_line_item')
            .where('id = ?', key);

          if (sf_unit_price) update.set('sf_unit_price', sf_unit_price);
          if (totalComDesconto) {
            update.set('sf_total_price', totalComDesconto);
          } else if (sf_total_price) {
            update.set('sf_total_price', sf_total_price);
          }

          await repo.exec(update.toString(), null);
        }
      }
    });
  }

  static async updatePrazoAllByModel({ quote_sfa_guid__c, ref1, sf_prazo__c, }) {
    const repo = await repository();

    const update = query
      .update()
      .table('sf_quote_line_item')
      .where('quote_sfa_guid__c = ?', quote_sfa_guid__c)
      .where('ref1 = ?', ref1);

    if (sf_prazo__c) {
      update.set('sf_prazo__c', sf_prazo__c);
    } else {
      update.set('sf_prazo__c', null);
    }

    await repo.exec(update.toString(), null);
  }

  static async updateDescontoAllByModel({ quote_sfa_guid__c, ref1, sf_desconto_item__c, sf_total_price, }) {
    const repo = await repository();

    const update = query
      .update()
      .table('sf_quote_line_item')
      .where('quote_sfa_guid__c = ?', quote_sfa_guid__c)
      .where('ref1 = ?', ref1);

    if (sf_desconto_item__c) {
      update.set('sf_desconto_item__c', sf_desconto_item__c);
    } else {
      update.set('sf_desconto_item__c', null);
    }

    if (sf_total_price) {
      update.set('sf_total_price', sf_total_price);
    } else {
      update.set('sf_total_price', null);
    }

    await repo.exec(update.toString(), null);
  }

  static async updateEmbalamentoAllByModel({ quote_sfa_guid__c, ref1, ref4, sf_unit_price, }) {
    const repo = await repository();

    const update = query
      .update()
      .table('sf_quote_line_item')
      .where('quote_sfa_guid__c = ?', quote_sfa_guid__c)
      .where('ref1 = ?', ref1);

    if (ref4) {
      update.set('ref4', ref4);
    } else {
      update.set('ref4', null);
    }

    if (sf_unit_price) {
      update.set('sf_unit_price', sf_unit_price);
    } else {
      update.set('sf_unit_price', null);
    }

    await repo.exec(update.toString(), null);
  }

  // Remove produtos dentro de um carrinho.
  static async removerProduto(id) {
    const repo = await repository();

    const produto = {
      id,
      is_deleted: true
    };

    repo.upsert('sf_quote_line_item', produto);
  }

  static async removerCarrinho(id) {
    const repo = await repository();

    const carrinho = {
      id,
      is_deleted: true
    };

    repo.upsert('sf_quote', carrinho);
  }

  static async removerProdutosByModel(ref1, quote_sfa_guid__c) {
    const produtos = await this.getProdutos([
      { ref1 },
      { quote_sfa_guid__c },
    ]);

    await asyncForEach(produtos, async (p) => {
      await this.removerProduto(p.key);
    });

    return 'Produtos removidos por grade';
  }

  static async removerProdutosByGrade(ref1, ref3, quote_sfa_guid__c) {
    const produtos = await this.getProdutos([
      { ref1 },
      { ref3 },
      { quote_sfa_guid__c }
    ]);

    await asyncForEach(produtos, async (p) => {
      await this.removerProduto(p.key);
    });

    return 'Produtos removidos por grade';
  }

  static async removerProdutosByCor(ref1, ref2, quote_sfa_guid__c) {
    const produtos = await this.getProdutos([
      { ref1 },
      { ref2 },
      { quote_sfa_guid__c }
    ]);

    await asyncForEach(produtos, async (p) => {
      await this.removerProduto(p.key);
    });

    return 'Produtos removidos pela cor';
  }

  static async removerProdutosByModeloCorGrade(ref1, ref2, ref3, quote_sfa_guid__c) {
    const produtos = await this.getProdutos([
      { ref1 },
      { ref2 },
      { ref3 },
      { quote_sfa_guid__c }
    ]);

    await asyncForEach(produtos, async (p) => {
      await this.removerProduto(p.key);
    });

    return 'Produtos removidos por grade';
  }

  static async removerProdutosComGradesNulas(quote_sfa_guid__c, ref1, ref2) {
    const repo = await repository();

    let select = query
      .select()
      .field('id')
      .from('sf_quote_line_item')
      .where('is_deleted = ?', false)
      .where('quote_sfa_guid__c = ?', quote_sfa_guid__c)
      .where('ref1 = ?', ref1)
      .where('ref3 IS NULL');

    if (ref2) {
      select = select.where('ref2 = ?', ref2);
    }

    const produtos = await repo.query(select);

    await asyncForEach(produtos._array, async (p) => {
      await this.removerProduto(p.id);
    });

    return 'Produtos removidos por grade';
  }

  static async removerProdutosComCoresNulas(quote_sfa_guid__c, ref1) {
    const repo = await repository();

    let select = query
      .select()
      .field('id')
      .from('sf_quote_line_item')
      .where('is_deleted = ?', false)
      .where('quote_sfa_guid__c = ?', quote_sfa_guid__c)
      .where('ref1 = ?', ref1)
      .where('ref2 IS NULL');

    const produtos = await repo.query(select);

    await asyncForEach(produtos._array, async (p) => {
      await this.removerProduto(p.id);
    });

    return 'Produtos removidos por grade';
  }

  static async removerProdutosComCoresGradesNulas(quote_sfa_guid__c, ref1) {
    const repo = await repository();

    let select = query
      .select()
      .field('id')
      .from('sf_quote_line_item')
      .where('is_deleted = ?', false)
      .where('quote_sfa_guid__c = ?', quote_sfa_guid__c)
      .where('ref1 = ?', ref1)
      .where('ref2 IS NULL')
      .where('ref3 IS NULL');

    const produtos = await repo.query(select);

    await asyncForEach(produtos._array, async (p) => {
      await this.removerProduto(p.id);
    });

    return 'Produtos removidos por grade';
  }

  static async removerProdutosByCorGrade(ref1, ref2, ref3, quote_sfa_guid__c) {
    const produtos = await this.getProdutos([
      { ref1 },
      { ref2 },
      { ref3 },
      { quote_sfa_guid__c },
    ]);

    await asyncForEach(produtos, async (p) => {
      await this.removerProduto(p.key);
    });

    return 'Produtos removidos por grade';
  }

  static async getProdutos(filtros = [], queryAttributes) {
    const repo = await repository();

    let select = query
      .select()
      .field('id')
      .field('sf_description')
      .field('created_at')
      .field('ref1')
      .field('ref2')
      .field('ref3')
      .field('ref4')
      .field('sf_unit_price')
      .field('sf_list_price')
      .field('sf_total_price')
      .field('sf_quantity')
      .field('sf_prazo__c')
      .field('sf_desconto_item__c')
      .field('sf_photo_file_name__c')
      .field('sf_pricebook_entry_id')
      .field('sf_sum_of_pairs__c')
      .from('sf_quote_line_item')
      .where('is_deleted = ?', false)
      .order('sf_description')
      .order('ref1')
      .order('ref2')
      .order('ref3');
    filtros.map(filtro => {
      select = select
        .where(`${Object.keys(filtro)[0]} = '${Object.values(filtro)[0]}'`);
    });

    const produtos = await repo.query(select);

    let atts = null;
    const ref1s = [];
    produtos._array.forEach(({ ref1 }) => {
      ref1s.push(ref1);
    });

    if (queryAttributes && ref1s.length > 0) {
      const selectAtts = query.select().field('ref1').from('sfa_product_att').order('ref1');
      selectAtts.where('ref1 IN ?', ref1s);
      queryAttributes.fields.forEach(field => selectAtts.field(field));
      const pRepo = await prodRepo();
      atts = (await pRepo.query(selectAtts))._array;
    }

    return this.mapToProducts(produtos._array, atts);
  }

  static async atualizaProduto({ ref1, sf_prazo__c, ref4 }) {
    const repo = await repository();

    let select = query
      .select()
      .from('sf_quote_line_item')
      .where('is_deleted = ?', false)
      .where('ref1 = ?', ref1);

    const p = await repo.queryOne(select);
    if (ref4) p.ref4 = ref4;
    p.sf_prazo__c = sf_prazo__c;

    const produtoAtualizado = await repo.upsert('sf_quote_line_item', p);

    return {
      key: produtoAtualizado.id,
      name: produtoAtualizado.sf_description,
      code: produtoAtualizado.ref1,
      ref1: produtoAtualizado.ref1,
      ref4: produtoAtualizado.ref4,
      prazo: produtoAtualizado.sf_prazo__c,
    };
  }

  // Mappers
  static mapToCarts(obj) {
    const isArray = Array.isArray(obj);
    let mappedCarts = null;

    // Senão for um vetor de carrinhos, mapeamos diretamente somente um objeto
    if (isArray) {
      mappedCarts = obj.map(this.mapToCart);
    } else {
      mappedCarts = this.mapToCart(obj);
    }
    return mappedCarts;
  }

  static mapToProducts(arr, atts) {
    const groupedProducts = agrupaProdutosNoCarrinho(arr);
    return arr.map((item, index) => {
      const p = groupedProducts.find(p => item.ref1 === p.code);
      let prod = {
        key: item.id,
        name: item.sf_description,
        code: item.ref1,
        ref1: item.ref1,
        ref2: item.ref2,
        ref3: item.ref3,
        ref4: item.ref4,
        quantity: item.sf_quantity,
        embalamento: item.ref4,
        prazo: item.sf_prazo__c,
        desconto: item.sf_desconto_item__c,
        sf_pricebook_entry_id: item.sf_pricebook_entry_id,
        sf_unit_price: item.sf_unit_price,
        sf_list_price: item.sf_list_price,
        sf_total_price: item.sf_total_price,
        createdAt: new Date(item.created_at),
        uri: item.sf_photo_file_name__c,
        sf_sum_of_pairs__c: item.sf_sum_of_pairs__c,
        totalPrice: p.totalPrice || 0,
      };


      if (atts) {
        // Encontra o atributo de acordo com o código do produto
        // Como a modelagem do order_item permite multiplos registros com o mesmo código,
        // Todos devem receber os atributos.
        const attIndex = atts.findIndex(({ ref1 }) => ref1 === item.ref1);
        if (attIndex > -1) {
          prod = { ...prod, segmento: atts[attIndex].sf_segmento_negocio__c, };
        }
      }

      return prod;
    });
  }

  static mapToCart = (item) => {
    return {
      key: item.id,
      name: item.sf_name,
      products: [],
      standard: item.sf_carrinho_selecionado__c === 'true',
      isDefault: item.sf_carrinho_selecionado__c === 'true',
      isChosen: item.sf_carrinho_selecionado__c === 'true',
      client: item.sf_nome_cliente__c,
      clientId: item.sf_account_id,
      sf_pricebook2id: item.sf_pricebook2id,
      sf_pricebook2_name__c: item.sf_pricebook2_name__c,
      sf_account_id: item.sf_account_id,
      updateAt: item.updated_at,
      nItens: 0,
      valor: '0',
      totalAmount: item.sf_grand_total ? item.sf_grand_total.toString() : '0',
      created: {
        day: moment().day(),
        month: moment()
          .format('MMMM')
          .substring(0, 3)
          .toUpperCase(),
        year: moment().year()
      },
      previsaoEmbarque: item.sf_previsao_embarque__c,
      orderDeCompra: item.sf_ordem_compra__c,
      prazoAdicional: item.sf_prazo_adicional__c,
      descontoAdicional: item.sf_desconto_adicional__c,
      condicoesPagamento: item.sf_condicoes_pagamento__c,
      preDataEntrega: item.sf_pre_data_entrega__c,
      periodoEntrega: item.sf_periodo_entrega__c,
      reposicao: item.sf_reposicao__c,
      codigoTotvs: item.sf_codigo_totvs__c,
      status: item.sf_status,

    };
  }
}

export default Order;