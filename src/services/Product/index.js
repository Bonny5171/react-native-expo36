import { repository, queryBuilder as query, squelPostgres } from '../Repository/ProductDb';
import { mapProductList, queryProductCat } from '../Pages/Catalog/Queries';
import { getLocalStorage } from '../Auth';

class Product {
  static async saveParameter(name, value) {
    const repo = await repository();
    return repo.param.set(name, value);
  }

  static async filter(param = {
    name: '',
    arquetipo: '',
    grupo: '',
    status: '',
    tamanho: '',
    marca: '',
    genero: '',
    mesLancamento: '',
    tag: '',
    colors: [],
  }, pricebookId, orderBy, isDesc = true, clientId, isCompleteCat) {
    if (!this.appName) this.appName = await getLocalStorage('appDevName');
    const repo = await repository();

    const selectAtt = query
      .select()
      .distinct()
      .field('ref1')
      .from('sfa_product_att');

    if (param.name) {
      selectAtt.where('name1 LIKE ? OR ref1 LIKE ?', `%${param.name}%`, `%${param.name}%`);
    }

    if (param.arquetipo) {
      selectAtt.where('sf_arquetipo__c LIKE ?', `%${param.arquetipo}%`);
    }

    if (param.genero) {
      selectAtt.where('sf_genero__c LIKE ?', `%${param.genero}%`);
    }

    if (param.marca) {
      selectAtt.where('sf_marca_grendene__c LIKE ?', `%${param.marca}%`);
    }

    if (param.mesLancamento) {
      selectAtt.where('sfa_data_lancamento_value LIKE ?', `%${param.mesLancamento}%`);
    }
    const selectCat = query
    .select()
    .distinct()
    .field('cat.ref1', 'ref1')
    .field('cat.sfa_ref2_list', 'sfa_ref2_list')
    .field('cat.sfa_labels_list', 'sfa_labels_list')
    .field('cat.sfa_labels_arr', 'sfa_labels_arr')
    .field('cat.sfa_prices_arr', 'sfa_prices_arr')
    .field('cat.name1', 'name1')
    .field('cat.sf_preco_sugerido__c', 'sf_preco_sugerido__c')
    .from('sfa_product_cat', 'cat')
    .join(selectAtt, 'att', 'cat.ref1 = att.ref1')
    .where('sfa_division_name = ?', this.appName);
    if (param.tag) {
      selectCat.where('cat.sfa_labels_list LIKE ? ', `%${param.tag}%`);
    }

    if (!isCompleteCat)  {
      selectCat.where('sf_accountid = ?', clientId);
    }
    selectCat.where('sfa_record_type = ?', isCompleteCat ? 'all' : 'account');

    if (pricebookId) {
      selectCat.where('cat.sf_pricebook2id = ?', pricebookId);
    }

    if (!orderBy) {
      selectCat.order('name1');
    } else {
      orderBy.forEach(field => {
        selectCat.order(field, isDesc);
      });
    }

    const products = (await repo.query(selectCat))._array;
    const data = [
      {
        key: '0',
        exhibition: '',
        products: (await mapProductList(products)),
      }
    ];

    return data;
  }

  static async getCatalogo(priceBookId, clientId, isCompleteCat) {
    if (!this.appName) this.appName = await getLocalStorage('appDevName');
    // func auxiliares
    const groupBy = (items, key) => items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [
          ...(result[item[key]] || []),
          item,
        ],
      }),
      {},
    );

    const repo = await repository();
    const select = queryProductCat(clientId, priceBookId, this.appName, isCompleteCat);
    const products = (await repo.query(select))._array;

    const DATA = await mapProductList(products);

    const detaques = groupBy(DATA, 'destaque');
    const data = [];

    for (const prop in detaques) {
      data.push({
        key: prop,
        exhibition: prop,
        products: detaques[prop],
      });
    }

    return data;
  }

  static async getProduto(id) {
    const repo = await repository();
    const name = await repo.queryOne(
      query.select()
        .from('sfa_product_att')
        .where(`ref1 = '${id.toString()}'`)
    );
    return name;
  }

  static async getSelectPriceBook(currentTable, clientId, isCompleteCat) {
    if (!this.appName) this.appName = await getLocalStorage('appDevName');
    const select = query.select()
    .field('pp.ref1', 'ref1')
    .from('sfa_product_price', 'pp')
    .where('pp.sf_pricebook2id = ?', currentTable.code)
    .where('sfa_division_name = ?', this.appName)
    .distinct();
    if (!isCompleteCat) select.where('sf_accountid = ?', clientId);
      // console.log('PRICE', select.toString());
    return select;
  }
  static async getArquetipos(currentTable, clientId, isCompleteCat) {
    // console.log('>>>>>>>>>>>', currentTable);
    const repo = await repository();
    const arquetipos = await repo.query(
      query.select()
        .field('att.sf_arquetipo__c', 'key')
        .field('att.sf_arquetipo__c', 'option')
        .from('sfa_product_att', 'att')
        .join(await this.getSelectPriceBook(currentTable, clientId, isCompleteCat), 'pp', 'pp.ref1 = att.ref1')
        .where('sf_arquetipo__c <> ?', 'NULO')
        .order('att.sf_arquetipo__c')
        .distinct()
    );
    return arquetipos._array;
  }

  static async getGrupos(currentTable, clientId, isCompleteCat) {
    const repo = await repository();
    const grupos = await repo.query(
      query.select()
        .field('att.sf_marca_terceiros__c', 'key') // gruopo4_cc
        .field('att.sf_marca_terceiros__c', 'option')
        .from('sfa_product_att', 'att')
        .join(await this.getSelectPriceBook(currentTable, clientId, isCompleteCat), 'pp', 'pp.ref1 = att.ref1')
        .where('sf_marca_terceiros__c <> ?', 'NULO')
        .order('att.sf_marca_terceiros__c')
        .distinct()
    );
    return grupos._array;
  }

  static async getStatus(currentTable) {
    // const repo = await repository();
    // const status = await repo.query(
    //   query.select()
    //     .field('sf_product2_sf_marca', 'key')
    //     .field('sf_product2_sf_marca', 'option')
    //    .order('2')
    //     .from('sfa_product_att')
    //     .distinct()
    // );
    // return status;
    return {
      _array: [],
    };
  }

  static async getTamanhos(currentTable) {
    // const repo = await repository();
    // const tamanhos = await repo.query(
    //   query.select()
    //     .field('sf_product2_sf_marca', 'key')
    //     .field('sf_product2_sf_marca', 'option')
    //     .from('sfa_product_att')
    //     .order('2')
    //     .distinct()
    // );
    // return tamanhos;
    return {
      _array: [],
    };
  }

  static async getMarcas(currentTable, clientId, isCompleteCat) {
    const repo = await repository();
    const marcas = await repo.query(
      query.select()
        .field('att.sf_marca_grendene__c', 'key')
        .field('att.sf_marca_grendene__c', 'option')
        .from('sfa_product_att', 'att')
        .join(await this.getSelectPriceBook(currentTable, clientId, isCompleteCat), 'pp', 'pp.ref1 = att.ref1')
        .where('sf_marca_grendene__c <> ?', 'NULO')
        .order('att.sf_marca_grendene__c')
        .distinct()
    );
    return marcas._array;
  }

  static async getMesLancamento(currentTable, clientId, isCompleteCat) {
    const repo = await repository();
    const mesesDeLancamento = await repo.query(
      query.select()
        .field('att.sfa_data_lancamento_key', 'key')
        .field('att.sfa_data_lancamento_value', 'option')
        .from('sfa_product_att', 'att')
        .join(await this.getSelectPriceBook(currentTable, clientId, isCompleteCat), 'pp', 'pp.ref1 = att.ref1')
        .where('att.sfa_data_lancamento_key is not null')
        .order('att.sfa_data_lancamento_key', 'desc')
        .distinct()
    );
    return mesesDeLancamento._array;
  }

  static async getTags(currentTable, clientId, isCompleteCat) {
    const repo = await repository();
    const select = query
    .select()
    .field('ValueSplit', 'key')
    .field('ValueSplit', 'option')
    .from('vw_product_tags');
    const tags = await repo.query(select);
    return tags._array;
  }

  static async getCores(filters) {
    const repo = await repository();
    const select = query.select()
      .field('ref2', 'key')
      .field('name2', 'option')
      .from('sfa_product_var2')
      .distinct()
      .order('2');

    if (filters.length) filters.forEach(({ column, value }) => select.where(`${column} = ?`, value));
    const cores = await repo.query(select);

    const coresObj = cores._array.map(item => {
      return {
        key: item.key,
        option: `${item.key} - ${item.option}`,
        isChosen: false,
      };
    });

    return coresObj;
  }

  static async getGeneros(currentTable, clientId, isCompleteCat) {
    const repo = await repository();
    const select = query.select()
      .distinct()
      .field('att.sf_genero__c', 'key')
      .field('att.sf_genero__c', 'option')
      .from('sfa_product_att', 'att')
      .join(await this.getSelectPriceBook(currentTable, clientId, isCompleteCat), 'pp', 'pp.ref1 = att.ref1')
      .order('2');

    const generos = (await repo.query(select))._array;
    return generos;
  }

  static async getColorsGallery(productCode) {
    const repo = await repository();

    const colorsGallery = await repo.query(
      query.select()
        .field('ref1', 'product_code')
        .field('ref2', 'color_code')
        .field('name2', 'color_name')
        .field('photo_file_name', 'original_file_name')
        .from('sfa_product_var2')
        .where(`ref1 = '${productCode}'`)
        .order('color_code')
    );

    return colorsGallery;
  }

  static async getGrades(productCode, colorCode) {
    const repo = await repository();

    /* Nova implementação direto na vw_product_var3_values */
    let select = query.select()
      .field('AAA.ref3', 'grade_code')
      .field('AAA.sf_size__c', 'sf_size__c')
      .field('AAA.sf_amount__c', 'sf_amount__c')
      .field('BBB.sfa_sum_of_pairs', 'sfa_sum_of_pairs')
      .from('sfa_product_var3_values', 'AAA')
      .join('sfa_product_var3', 'BBB', 'AAA.ref1 = BBB.ref1 AND AAA.ref3 = BBB.ref3')
      .where(`AAA.ref1 = '${productCode}'`)
      .order('1')
      .order('2')
      .order('3')
      .distinct();

    if (colorCode) {
      select = select.where(`ref2 = '${colorCode}'`);
    }

    const gradesDb = await repo.query(select);

    const grades = [];
    gradesDb._array.forEach((gradeObj) => {
      const grd = grades.find(g => g.key === gradeObj.grade_code);
      const grade = grd !== undefined
        ? grd
        : {
          key: gradeObj.grade_code,
          code: parseInt(gradeObj.grade_code),
          isChosen: false,
          name: gradeObj.grade_code,
          pairs: 0,
          sizes: [],
          totalPairs: gradeObj.sfa_sum_of_pairs,
        };

      const quantity = gradeObj.sf_amount__c;
      const value = gradeObj.sf_size__c;
      grade.sizes.push({ value, quantity });
      if (!grades.find(g => g.key === gradeObj.grade_code)) {
        grades.push(grade);
      }
    });

    const gradesSorted = grades.sort((a, b) => a.code - b.code);
    return gradesSorted;
  }

  static async getQtdGrades(productCode) {
    const repo = await repository();

    const nGrades = await repo.query(
      query.select()
        .field('ref3', 'grade_code')
        .from('sfa_product_var3')
        .where(`ref1 = '${productCode}'`)
        .distinct()
    );

    return nGrades;
  }

  static async getQtdParesPorGrades(productCode, gradeCode) {
    const repo = await repository();

    const select = query.select()
      .field('sfa_sum_of_pairs')
      .from('sfa_product_var3')
      .where(`ref1 = '${productCode}'`)
      .where(`ref3 = '${gradeCode}'`)
      .distinct();

    const nParesGrades = await repo.queryOne(select);
    return nParesGrades;
  }

  static async customQuery(query, queryOne, withParam = []) {
    const repo = await repository();
    if (withParam.length > 0) {
      // Exemplo de withParam filtrando a sfa_product_menu pelo app_id
      //  [{ param: 'CURRENT_APP_ID', column: 'sf_sfa_app__c' }]
      const params = withParam.map(obj => obj.param);
      const obj = await repo.param.getAll(params);
      withParam.forEach(({ column, param }, index) => query.where(`${column} = ?`, obj[param]));
    }
    // console.log('REPO', await repo.param.getAll());
    let result = null;
    if (queryOne) {
      result = await repo.queryOne(query);
    } else {
      result = (await repo.query(query))._array;
      // console.log('resultQUERY', result);
    }
    // console.log('query', query);
    return result;
  }

  static async getPriceList() {
    const repo = await repository();

    const prices = await repo.query(
      query.select()
        .field('sf_name', 'name')
        .field('sf_id', 'code')
        // .field('sfa_max_desconto', 'max_desconto')
        .field("COALESCE(sf_previsao_embarque__c, '[NULO]')", 'mesFatur')
        .from('sfa_product_price_book')
        .order('name')
    );

    return prices._array;
  }

  static async getPrice(
    ref1,
    ref2,
    ref4,
    sf_pricebook2id,
    sf_accountid,
  ) {
    if (!this.appName) this.appName = await getLocalStorage('appDevName');
    const repo = await repository();
    const prices = await repo.queryOne(
      query.select()
      .field('ref1')
      .field('ref2')
      .field('ref4')
      .field('name4')
      .field('sf_unit_price')
      .field('sf_pricebook_entry_id')
      .from('sfa_product_price')
      .where(`ref1 = '${ref1}'`)
      .where(`ref2 = '${ref2}'`)
      .where(`ref4 = '${ref4}'`)
      .where(`sf_pricebook2id = '${sf_pricebook2id}'`)
      .where(`sf_accountid = '${sf_accountid}'`)
      .where('sfa_division_name = ?', this.appName)
      .where('sf_pricebook_entry_id is not null')
    );
    return prices;
  }


  static async getPriceProduct(
    priceTableCode,
    productCode,
    colorCode
  ) {
    if (!this.appName) this.appName = await getLocalStorage('appDevName');
    const repo = await repository();
    const prices = await repo.query(
      query.select()
        .from('sfa_product_price')
        .where(`sf_pricebook2id = '${priceTableCode}'`)
        .where(`ref1 = '${productCode}'`)
        .where(`ref2 = '${colorCode}'`)
        .where('sfa_division_name = ?', this.appName)
    );
    return prices._array;
  }

  static async getEmbalamentoPadrao(priceTableCode, productCode) {
    const repo = await repository();
    if (!this.appName) this.appName = await getLocalStorage('appDevName');

    const prices = await repo.query(
      query.select()
        .distinct()
        .field('ref1')
        .field('ref4')
        .from('sfa_product_price')
        .where(`sf_pricebook2id = '${priceTableCode}'`)
        .where(`ref1 = '${productCode}'`)
        .where('sfa_division_name = ?', this.appName)
    );

    return prices._array;
  }

  static async getEmbalamentoPadraoDoCliente(clientId) {
      const repo = await repository();

      const embalamentos = await repo.query(
        query.select()
          .distinct()
          .field('id')
          .field('sf_classificador_tipo_embalamento__c')
          .from('sf_embalamento_cliente__c')
          .where(`sf_conta__c = '${clientId}'`)
      );

      return embalamentos._array;
  }

  static async getPrices(
    priceTableCode,
    productCode,
  ) {
    if (!this.appName) this.appName = await getLocalStorage('appDevName');
    const repo = await repository();
    const select = query.select()
      .distinct()
      .field('name4')
      .field('sf_unit_price')
      .from('sfa_product_price')
      .where(`sf_pricebook2id = '${priceTableCode}'`)
      .where(`ref1 = '${productCode}'`)
      .where('sfa_division_name = ?', this.appName)
      .order('1');
    const prices = await repo.query(select);
    return prices._array;
  }
}

export default Product;