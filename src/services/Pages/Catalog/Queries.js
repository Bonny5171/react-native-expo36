import SrvProduct from '../../Product';
import SrvResource from '../../Resource';
import { queryBuilder as query } from '../../Repository/ProductDb';
import { asyncForEach, ativaCores } from '../../../utils/CommonFns';
import { getRandomInt } from '../../../redux/reducers/pages/common/functions';

export const getMenu = async () => {
  const select = query
    .select()
    .field('UPPER(sf_level1label__c)', 'label1')
    .field('sf_level1field_api_name__c', 'api1')
    .field('sf_is_expanded__c')
    .field('UPPER(sf_level2label__c)', 'label2')
    .field('sf_level2field_api_name__c', 'api2')
    .field('UPPER(sf_level3label__c)', 'label3')
    .field('sf_level3field_api_name__c', 'api3')
    .from('sfa_product_menu')
    .order('1');

  const result = await SrvProduct.customQuery(select, false, [{ param: 'CURRENT_APP_ID', column: 'sf_sfa_app__c' }]);
  return result;
};

export const getChildsOfMenu = async (column) => {
  const select = query
    .select()
    .distinct()
    .from('sfa_product_att')
    .field(`UPPER(${column})`, 'label')
    .where(`${column} IS NOT NULL`)
    .where(`${column} != 'NULO'`)
    .order('1');

  const result = await SrvProduct.customQuery(select);
  return result;
};

export const getListByHamburguer = async (columns, priceBookId, appDevName, clientId, isCompleteCat) => {
  const select = query
    .select()
    .field('ref1')
    .distinct()
    .from('sfa_product_att');

  Object.keys(columns).forEach((key) => {
    const lv = columns[key];
    if (lv !== null) {
      const { label, api } = lv;
      if (api !== null && label !== 'TODOS') {
        select.where(`${api} = '${label}' COLLATE NOCASE`);
      }
    }
  });

  const codes = await SrvProduct.customQuery(select);
  let mappedCodes = '';
  codes.map(({ ref1 }, index) => {
    mappedCodes += `'${ref1}'${index < codes.length - 1 ? ', ' : ''}`;
  });
  // console.log('mappedCodes', mappedCodes);
  const where = `ref1 IN (${mappedCodes})`;
  // console.log('where', where);
  const selectCAT = queryProductCat(clientId, priceBookId, isCompleteCat)
  .where(where)
  .order('2');
  // console.log('selectCAT.toString()', selectCAT.toString());
  const results = await SrvProduct.customQuery(selectCAT);
  // console.log('results', results);
  const mappedResults = mapProductList(results);
  return mappedResults;
};

export const mapProductList = async (products) => {
  // console.log('products', products);
  const list = [];

  await asyncForEach(products, async (item, index) => {
    const objPrice = JSON.parse(item.sfa_prices_arr);
    const prices = objPrice.map(obj => ({
      price: obj.sf_unit_price,
      label: obj.ref4,
      ref1: obj.ref1,
      ref2: obj.ref2,
    }));

  // Vetor que contém embalamentos
  const distinctPrices = [];
  prices.forEach((e) => {
    let isInserted = distinctPrices.find((embalamento) => embalamento.label === e.label);
    // Se o embalamento não foi inserido,
    // Inserimos este embalamento para ser exibido
    if (!isInserted) {
      distinctPrices.push(e);
    }
  });
  // TAGS
  const tags = mapTags(item.sfa_labels_arr);
  // console.log('tags', tags);
  // Geração aleatório da cor exibida
  const colors = item.sfa_ref2_list.split(';');
  const photo_file_name = item.ref1 + colors[getRandomInt(0, colors.length)] + '00';
  list.push({
    key: `${item.ref1}_${item.photo_file_name}_${index}`,
    name: item.name1,
    code: item.ref1,
    destaque: item.grupo_destaque,
    photo_file_name: photo_file_name,
    prices: distinctPrices,
    tags,
    precoSugerido: item.sf_preco_sugerido__c,
  });
  });
  return list;
};


export const queryProductCat = (clientId, priceBookId, appName, isCompleteCat) => {
  let select = null;
  select = query
  .select()
  .from('sfa_product_cat')
  .where('sf_pricebook2id = ?', priceBookId)
  .where('sfa_division_name = ?', appName)
  .order('grupo_destaque_ordem')
  .order('grupo_destaque')
  .order('name1');

  if (!isCompleteCat)  {
    select.where('sf_accountid = ?', clientId);
  }
  select.where('sfa_record_type = ?', isCompleteCat ? 'all' : 'account');

  return select;
};
export const getDetailProduct = async (product, products) => {
  const produto = await SrvProduct.getProduto(product.code);
  const cores = await getColorGallery(product);
  const colors = ativaCores(cores, products, product.code);
  const pointerGallery = getCurrGallery(colors, product);
  return {
    usedInCampaign: true,
    currentGallery: '0000',
    currentColor: '',
    regionalRanking: '',
    regionalSales: '',
    nationalRanking: '',
    nationalSales: '',
    price: 0,
    line: '',
    sizes: [],
    key: '0',
    selected: false,
    isHidden: false,
    isExpanded: false,
    tags: product.tags,
    colors,
    gallery: [],
    galleries: [],
    pointerGallery,
    uri: product.photo_file_name,
    prices: product.prices || [],
    // Atributos com tratamento
    name: produto.name1 || 'NULO',
    code: produto.ref1 || 'NULO',
    argumentoDeVenda: produto.sf_descricao_foco_vendedor__c || 'NULO',
    sf_estabelecimento_prod__c: produto.sf_estabelecimento_prod__c || 'NULO',
    precoSugerido: produto.sf_preco_sugerido__c || 'NULO',
    ncm: produto.sf_classificacao_fiscal__c || 'NULO',
    group: produto.sf_grupos_vendas__c || 'NULO',
    category: produto.sf_arquetipo__c || 'NULO',
    sf_segmento_negocio__c: produto.sf_segmento_negocio__c || 'NULO',
    sf_genero__c: produto.sf_genero__c || 'NULO',
    sola: produto.sf_sola__c || 'NULO',
    palmilha: produto.sf_palmilha__c || 'NULO',
    forro: produto.sf_forro__c || 'NULO',
    cabedal: produto.sf_cabedal__c || 'NULO',
  };
};


const getColorGallery = async ({ code, photo_file_name }) => {
  const colors = [];
  const colorsGallery = await SrvProduct.getColorsGallery(code);
  const nGrades = await SrvProduct.getQtdGrades(code);

  await asyncForEach(colorsGallery._array, async element => {
    const isImgThumb = element.original_file_name.indexOf(photo_file_name) > -1;
    colors.push({
      productCode: code,
      uri: element.original_file_name,
      name: element.color_name,
      code: element.color_code,
      isChosen: false,
      isShowing: isImgThumb,
      newColor: false,
      grades: Array(nGrades.length).fill({
        name: '0000',
        quantity: ''
      })
    });
  });
  return colors;
};

export const getCurrGallery = (colors, { code, photo_file_name }) => {
  let gallery = [];
  let pointerGallery = 0;
  if (colors.length > 0) {
    const cor = colors.find((c, index) => {
      const wasFound = photo_file_name.indexOf(c.code) > -1;
      if (wasFound) pointerGallery = index;
      return wasFound;
    });
  }
  return pointerGallery;
};

export const getAllGalleries = async (colors, code) => {
  const galleries = [];
  await asyncForEach(colors, async (color) => {
    galleries.push(await getGallery(code, color));
  });
  return galleries;
};
// Busca os preços do produto e da cor sorteada na thumb.
const getProductPrices = async (colors, product, currentTable) => {
  const cor = colors[0];
  if (cor) {
    return SrvProduct.getPriceProduct(currentTable.code, product.code, cor.code);
  }
  return [];
};


export const getGallery = async (code, cor) => {
  const galleryArr = await SrvResource.getGallery(code, cor.code, 's');
  const gallery = [];
  galleryArr._array.forEach(element => {
    const fileName = `${element.product_code}${element.color_code}${element.sequence}`;
    gallery.push({
      key: element.sequence,
      url: fileName,
      selected: true,
      name: element.original_file_name
    });
  });
  return gallery;
};


export const mapTags = (tags) => {
  const mappedTags = {};
  if (tags) {
    JSON.parse(tags).forEach((tag) => {
      mappedTags[tag.ref2] = tag.sfa_labels_list.split(';');
    });
  }
  return mappedTags;
};