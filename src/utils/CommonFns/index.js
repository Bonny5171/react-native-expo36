import SrvOrder from '../../services/Order/';
import SrvProduct from '../../services/Product';

export const navigate = (x, rowLength) => {
  return Math.floor((x / rowLength) + 1);
};

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array);
  }
};


export const agrupaProdutosNoCarrinho = (data) => {
  // let totalPrice = 0;
  const reduxData = data.map(item => {
    return {
      ref1: item.ref1,
      name: item.name,
      uri: item.uri,
      totalPrice: item.sf_total_price || 0,
      embalamento: item.ref4,
      prazo: item.prazo,
      desconto: item.desconto,
    };
  });
  const totalPrices = [];
  let pointerPrices = 0;
  let totalPrice = 0;
  // Agrupa pelo "modelo" ref1.
  const groupedRef1 = Array.from(new Set(reduxData.map(s => {
    // Procura o produto na lista de totais de preço calculados
    const hasFound = totalPrices.find(p => p.ref1 === s.ref1);
    // Se não for encontrado, insere o novo produto, atualiza o ponteiro
    // e zera a variável auxiliar para valor total do produto
    if (!hasFound) {
      if (totalPrices.length > 0) {
        pointerPrices += 1;
        totalPrice = 0;
      }
      totalPrices.push({ ref1: s.ref1, totalPrice: s.totalPrice });
    }

    totalPrice += s.totalPrice;
    totalPrices[pointerPrices].totalPrice = totalPrice;
    return s.ref1;
  })));

  // console.log('totalPrices', totalPrices);
  const grouped = groupedRef1.map(ref1 => {
    const p = reduxData.find(s => s.ref1 === ref1);
    const totalPrice = (totalPrices.find(product => product.ref1 === p.ref1)).totalPrice;
    return {
      code: ref1,
      name: p.name,
      price: '',
      embalamento: p.embalamento,
      prazo: p.prazo,
      desconto: p.desconto,
      uri: p.uri,
      totalPrice,
      qtGradesSelected: p.qtGradesSelected,
    };
  });

  return grouped;
};

export const agrupaCoresEGrades = async (dropdown, currentProduct) => {
  const produtos = await SrvOrder.getProdutos([
    { quote_sfa_guid__c: dropdown.current.key },
    { ref1: currentProduct.code },
  ]);

  const colors = [];
  const grades = [];

  produtos.forEach(prod => {
    const produtoCorEncontrado = colors.find(cor => cor.key === prod.ref2);
    if (!produtoCorEncontrado) {
      const objGrades = produtos.filter(pp => prod.ref3 && pp.ref2 === prod.ref2);
      // console.log('objGrades', objGrades);
      objGrades.forEach(i => {
        if (i.ref3 !== null) {
          grades.push({
            key: i.key,
            code: i.ref3,
            isChosen: false,
            name: i.ref3,
            pairs: 0,
            quantity: i.quantity,
            id: prod.key,
            sf_sum_of_pairs__c: i.sf_sum_of_pairs__c,
            desconto: i.desconto,
          });
        }
      });
      if (prod.ref2 !== null) {
        colors.push({
          key: prod.ref2,
          option: `${prod.ref2} - [NOME DA COR]`,
          isChosen: false,
          grades: objGrades,
        });
      }
    }
  });

  return { colors, grades };
};

export const extractSizes = (grades) => {
  const sizes = [];
  grades.forEach((tamanhos) => {
    tamanhos.sizes.forEach((size) => {
      if (!sizes.find(s => s === size.value)) {
        sizes.push(size.value);
      }
    });
  });
  return sizes;
};

export const AtivaGrades = (grades, dropdown, productCode, colorCode) => {
  let qtSelected = 0;
  const newGrades = grades.map(grade => {
    const product = dropdown.current.products.find(p => {
      if (colorCode) {
        return p.ref1 === productCode &&
          p.ref2 === colorCode &&
          p.ref3 === grade.key;
      }
      return p.ref1 === productCode &&
        p.ref3 === grade.key;
    });
    if (product) {
      qtSelected += 1;
      return { ...grade, isChosen: true, };
    } return grade;
  });
  return {
    grades: newGrades,
    qtSelected
  };
};

export const ativaCores = (cores, products, productCode) => {
  return cores.map(cor => {
    const product = products.find(p => {
      return p.ref2 === cor.code && p.ref1 === productCode;
    });
    if (product) {
      return { ...cor, isChosen: true, };
    }
    return cor;
  });
};

export const hasCorInProduct = (products, modelo) => {
  return products
    .filter(p => p.ref1 === modelo)
    .find(p => p.ref2 !== null) === undefined || products
      .filter(p => p.ref1 === modelo)
      .find(p => p.ref2 !== undefined) === undefined;
};

export const upsertQuantidade = async ({ grade, dropdown, }, { id, quantity, }) => {
  const produto = {
    /* ... */
  };

  // Vadidação dos dado de input "id".
  if (id) {
    produto.id = id;
  } else {
    console.log('SEM ID UP_SET_NAO_REALIZADO...');
    return null;
  }

  if (grade) {
    const { ref1, ref2, ref4, desconto } = grade;
    if (ref1 && ref2 && ref4) {
      const price = await SrvProduct.getPrice(ref1, ref2, ref4, dropdown.current.sf_pricebook2id, dropdown.current.sf_account_id);
      if (quantity && price !== undefined) {
        const { sf_unit_price, sf_pricebook_entry_id } = price;
        const sf_total_price = quantity * sf_unit_price;
        if (desconto && desconto !== '-') {
          produto.sf_total_price = calcDesconto(sf_total_price, desconto);
        } else {
          produto.sf_total_price = sf_total_price;
        }
        produto.sf_unit_price = sf_unit_price;
        produto.sf_quantity = quantity;
        produto.sf_pricebook_entry_id = sf_pricebook_entry_id;
      } else {
        produto.sf_total_price = null;
        produto.sf_quantity = null;
      }
    } else if (quantity) {
      produto.sf_quantity = quantity;
    }
  }

  return SrvOrder.updateProduto(produto);
};

export const upsertPrazo = async ({ id, prazo, }) => {
  const produto = { id, sf_prazo__c: null };
  if (prazo) {
    produto.sf_prazo__c = prazo;
  }
  return SrvOrder.updateProduto(produto);
};

export const upsertDesconto = async ({ id, desconto, }) => {
  const produto = { id, sf_desconto_item__c: null };
  if (desconto) {
    produto.sf_desconto_item__c = desconto;
  }
  return SrvOrder.updateProduto(produto);
};

export const upsertEmbalagem = async ({ id, embalagem, }) => {
  const produto = { id, ref4: null };
  if (embalagem) {
    produto.ref4 = embalagem;
  }
  return SrvOrder.updateProduto(produto);
};

export const buscarGaleriaCores = async ({ code }) => {
  const colors = [];
  const colorsGallery = await SrvProduct.getColorsGallery(code);
  const nGrades = await SrvProduct.getQtdGrades(code);

  await asyncForEach(colorsGallery._array, async element => {
    colors.push({
      productCode: code,
      uri: element.original_file_name,
      name: element.color_name,
      code: element.color_code,
      isChosen: false,
      isShowing: false,
      newColor: false,
      grades: Array(nGrades.length).fill({
        name: '0000',
        quantity: ''
      })
    });
  });
  return colors;
};

// Atualizado store de Catalog -> 'dropdown', relacionados a carrinhos;
export const atualizaCarrinhoAtual = async ({
  client,
  currentTable,
  acSetCarts,
  acSetDropdownCarts,
}) => {
  const filtro = [
    { sf_account_id: client.sf_id, },
    { sf_pricebook2id: currentTable.code, }
  ];
  // debugger
  const carts = await SrvOrder.getCarrinhos(filtro);
  // debugger

  await asyncForEach(carts, async (car) => {
    car.products = await SrvOrder
      .getProdutos(
        [{ quote_sfa_guid__c: car.key }],
        { fields: ['sf_segmento_negocio__c'] }
      );
  });

  acSetCarts(carts);
  let cartDefault = null;
  // Lógica para encontrar carrinho padrão para quando temos somente um carrinho ou N carrinhos
  if (carts.length > 1) {
    cartDefault = carts.find(car => car.isDefault);
  } else {
    cartDefault = carts[0];
  }

  // Carrinho atual
  acSetDropdownCarts({
    current: cartDefault,
    isVisible: false
  });
};

export const atualizarCarrinhos = async ({
  carts,
  acSetDropdownCarts,
}) => {
  await asyncForEach(carts, async (car) => {
    car.products = await SrvOrder.getProdutos(
      [{ quote_sfa_guid__c: car.key }],
      { fields: ['sf_segmento_negocio__c'] });
  });

  const cartDefault = carts.find(car => car.isDefault);

  await acSetDropdownCarts({
    current: cartDefault,
    isVisible: false
  });
};

export const getEmbalamentoPadrao = async (clientId) => {
  // const embalamentos = await SrvProduct.getEmbalamentoPadrao(currentTable.code, product.code);
  const embalamentos = await SrvProduct.getEmbalamentoPadraoDoCliente(clientId);
  const temMaisDeUmeEmbalamento = embalamentos.length > 0;
  return temMaisDeUmeEmbalamento ? embalamentos[0].sf_classificador_tipo_embalamento__c : null;
};

export const calcLarguraDasGrades = (sizes = []) => {
  // Largura minima para não quebra a mensagem quando não houver grades.
  let panelWidth = 300;

  if (sizes.length > 0) {
    const padding = 40;
    const collFixaGrades = 100;
    const collFixaPares = 45;
    const collDupla = 45;
    const collSimples = 35;
    const scroll = 5;

    const ncollDupla = sizes.filter(p => p.indexOf('/') > 0).length;
    const ncollSimples = sizes.length - ncollDupla;
    panelWidth =
      padding +
      collFixaGrades +
      collFixaPares +
      (ncollDupla * collDupla) +
      (ncollSimples * collSimples) +
      scroll;
  }

  return panelWidth;
};

export const calcDesconto = (precoTotal, desconto) => {
  return precoTotal - ((precoTotal * desconto) / 100);
};