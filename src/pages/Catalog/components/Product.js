import React from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Animated, Platform, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from '../../../assets/styles/global';
import { Fade, TextLimit, Price, ImageLoad } from '../../../components';
import { Font } from '../../../assets/fonts/font_names';
import SrvOrder from '../../../services/Order/';
import { acSelectProduct, acCurrentProduct, acAssistant, acHorizontalList, acSetCurrProd, acEnrichProduct } from '../../../redux/actions/pages/catalog';
import { getDetailProduct, getAllGalleries, getGallery, getCurrGallery, } from '../../../services/Pages/Catalog/Queries';
import { getEmbalamentoPadrao } from '../../../utils/CommonFns';

class Product extends React.PureComponent {
  render() {
    const {
      mode,
      larguraDasCaixas,
      openDetail,
      product,
      keyDestaque,
      ponteiroProduto,
      productPos,
      name,
      code
    } = this.props;

    const { isHidden, isExpanded, tags, photo_file_name } = product;

    const styleBorder =
      Platform.OS !== 'web'
        ? {
          borderColor: 'rgba(0, 0, 0, 0.7)',
          borderWidth: 0.2
        }
        : {};

    const isHiddenState = mode === 'Grid' ? false : isHidden;
    const isExpandedState = mode === 'Grid' ? false : isExpanded;

    const TopInf = this.TopInf(this.props);
    return (
      <Fade visible={!(isHiddenState && isExpandedState)}>
        <View style={stylesLocal.container}>
          <TouchableHighlight
            disabled={!openDetail}
            onPress={this.currentProduct}
            onLongPress={this.onLongPress}
            activeOpacity={0.8}
            animationVelocity={1}
            underlayColor="transparent"
          >
            <View
              style={[
                stylesLocal.containerTouchable,
                styleBorder,
                { width: larguraDasCaixas },
                { backgroundColor: isExpanded ? '#CACBCB' : 'white' }
              ]}
            >
              <View
                style={stylesLocal.ViewInf}
              >
                <ImageLoad
                  filename={photo_file_name}
                  sizeType="m"
                  containerStyle={{ position: 'absolute', top: 5, left: 5, width: '95%', height: '75%' }}
                />

                {TopInf}

                <BottomInf name={name} code={code} isExpanded={isExpanded} />
              </View>
              <PriceInfo
                product={this.props.product}
                currColor={this.props.product && this.props.product.photo_file_name.substr(5, 5)}
                isVisible={this.props.buttons[0].isChosen}
                larguraDasCaixas={larguraDasCaixas}
              />
            </View>
          </TouchableHighlight>
          {/* <Tags tags={tags} /> */}
          <Triangulo keyDestaque={keyDestaque} ponteiroProduto={ponteiroProduto} productPos={productPos} />
        </View>
      </Fade>
    );
  }

  TopInf({
    selectList,
    SELECIONADO,
    btnCarrinho,
    acRemoveCartProduct,
    acRemoveCheckedProduct,
    acAddCartProduct,
    acAddCheckedProduct,
    product,
    usedInCampaign,
    currentTable
  }) {
    return (
      <View style={[stylesLocal.TopInf, { width: this.props.larguraDasCaixas }]}>
        {/* USADO EM CAMPANHA */}
        {usedInCampaign && (
          <View style={stylesLocal.containerEmCampanha}>
            <Text style={stylesLocal.iconEmCampanha}>b</Text>
          </View>
        )}
        {/* CHECKBOX */}
        <Fade style={stylesLocal.checkbox} visible={selectList} duration={300}>
          <TouchableOpacity
            onPress={async () => {
              if (SELECIONADO) {
                if (btnCarrinho) {
                  const productInCart = this.props.dropdown.current.products.find(p => p.ref1 === product.code);
                  await SrvOrder.removerProdutosByModel(product.code, this.props.dropdown.current.key);
                  acRemoveCartProduct(productInCart);
                } else {
                  acRemoveCheckedProduct(product);
                }
              } else if (this.props.btnCarrinho) {
                const cartDefault = this.props.carts
                  .find(car => car.key === this.props.dropdown.current.key);

                // const embalamentoPadrao = await getEmbalamentoPadrao(currentTable, product);
                const embalamentoPadrao = await getEmbalamentoPadrao(this.props.dropdown.current.sf_account_id);

                // Adiciona produtos em um carrinho.
                const prod = await SrvOrder.addProduto({
                  quote_sfa_guid__c: this.props.dropdown.current.key,
                  ref1: product.code,
                  sf_description: product.name,
                  sf_photo_file_name__c: product.photo_file_name,
                  ref4: embalamentoPadrao,
                });
                prod.uri = product.photo_file_name;
                prod.code = product.code;
                // Dispara esta action para adicionar este produto no carrinho currente.
                acAddCartProduct(prod);
              } else {
                const prod = Object.assign(product, {
                  imagemSelected: false,
                  cartelaDeCoresSelected: false,
                  gradesSelected: false,
                  composicaoSelected: false
                });
                acAddCheckedProduct(prod);
              }
            }}
          >
            {SELECIONADO ? (
              <Text style={[styles.iconChecked, styles.activeBtnShadow]}>h</Text>
            ) : (
              <Text style={styles.iconUnChecked}>i</Text>
              )}
          </TouchableOpacity>
        </Fade>
      </View>
    );
  }

  currentProduct = async (isLongPress = false) => {
    const {
      currentProduct,
      keyDestaque,
      rowData,
      previousPointer,
      nextPointer,
      index,
      productPos,
      product,
      ponteiroProduto,
      currentTable,
      dropdown,
      isOnlyGrid,
      isHamb,
    } = this.props;
    const cartProducts = dropdown.current ? dropdown.current.products : [];
    if (currentProduct.code === product.code && this.props.isDetailOpen) {
      this.props.acSelectProduct('', '');
      return;
    }
    if (isLongPress === true) {
      const p = await getDetailProduct(product, cartProducts, currentTable);
      await this.props.acSetProduct(p);
      this.props.acUpdateSelected();
      this.props.acAssistant(p);
      return;
    }
    // Muda os dois estados (Galeria e detalhe do produto) para em requisição
    this.props.toggleRowQuering(true);
    // Abre o detalhe do produto
    let horizontalList = rowData;
    if (isOnlyGrid) horizontalList = rowData[this.props.rowPointer];
    if (isHamb) horizontalList = rowData[0];
    // Primeira promisse para definir produto atual
    // Lógica de definição do produto atual
    const keyD = isLongPress === true ? null : keyDestaque;
    const pointers = {
      pointerPrevious: previousPointer,
      pointerCurrent: productPos,
      pointerNext: nextPointer,
      pointerRow: index
    };
    this.props.acCurrentProduct(
      horizontalList,
      pointers,
      horizontalList.length,
      false, // horizontalList
      null, // horizontalListLength
      keyD,
      [],
      [],
      product,
      isLongPress
    );
    // console.time('detail');
    const newProduct = getDetailProduct(product, cartProducts, currentTable)
    .then(async (prod) => {
      if (prod.code === this.props.currentProduct.code) {
        await this.props.acEnrichProduct(prod);
      }
      // console.timeEnd('detail');
      this.props.toggleRowQuering();
      return prod;
    });

    // Pega a galaria da cor atual
    const gallery = (async () => {
      // console.time('gallery');
      const code = product.photo_file_name.substr(5, 5);
      const gallery = await getGallery(product.code, { code });
      // console.timeEnd('gallery');
      if (product.code === this.props.currentProduct.code) {
        this.props.acSetProduct({ ...this.props.currentProduct, gallery });
      }
      this.props.toggleRowQuering(false, 'hasGallery');
      return gallery;
    })();
    // Pega todas as galerias do produto atual
    const galleries = newProduct.then((prod) => {
      if (prod.code === this.props.currentProduct.code) {
        // console.time('galleries');
        return getAllGalleries(prod.colors, prod.code);
      }
      return [];
    });

    Promise.all([newProduct, galleries, gallery])
    .then(([prod, galleries, gallery]) => {
      if (prod.code === this.props.currentProduct.code) {
        // console.timeEnd('galleries');
        // console.log('galleries', galleries);
        const newProd = {
          ...prod,
          galleries,
          gallery,
        };
        this.props.acSetProduct(newProd);
      }
    });
    // Galeria de angulos exibida inicialmente
    this.props.toggleRowQuering();
  }

  onLongPress = () => {
    if (!this.props.isCompleteCat) {
      this.currentProduct(true);
    }
  };
}

Product.propTypes = {
  // Objeto de produto.
  product: PropTypes.object.isRequired,

  // Modo de visualização da lista.
  mode: PropTypes.oneOf(['DESTAQUES', 'HAMBURGUER', 'GRID']),

  // Largura da caixa.
  larguraDasCaixas: PropTypes.number.isRequired,

  // Desabilita abertura do detalhe.
  openDetail: PropTypes.bool.isRequired,

  // Indice da linha.
  // keyDestaque: PropTypes.number.isRequired,

  // Liga ou não o assistente de seleção.
  selectList: PropTypes.bool.isRequired,

  // Define o checkbox: Checked/Unckecked.
  SELECIONADO: PropTypes.bool.isRequired,

  // Define se o botão carrinho na seleção rapida esta visivel.
  /* Propriedade utilizada na acão de checked e unChecked, e definir
    se o produto sera incrementado ou decrementado de uma lista de
    carrinho ou lista de email. */
  btnCarrinho: PropTypes.bool.isRequired,

  // Reducers.
  acAssistant: PropTypes.func.isRequired,
  acSetProduct: PropTypes.func.isRequired,

  // Adiciona e remove o produto a lista do carrinho currente.
  acRemoveCartProduct: PropTypes.func.isRequired,

  // Adiciona e remove o produto a lista de email.
  acRemoveCheckedProduct: PropTypes.func.isRequired,
  acAddCheckedProduct: PropTypes.func.isRequired
};

const stylesLocal = StyleSheet.create({
  container: {
    marginRight: 20
    // backgroundColor: 'blueviolet',
  },
  containerTouchable: {
    marginLeft: 5,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    marginBottom: 3,
    // backgroundColor: 'yellow',
  },
  constainerImage: {
    width: '96%',
    height: '73%',
    position: 'absolute',
    top: 5,
    left: 5
    // backgroundColor: 'salmon',
  },
  ViewInf: {
    flex: 1,
    justifyContent: 'flex-end',
    borderColor: 'transparent',
    height: 180,
  },
  TopInf: {
    position: 'absolute',
    height: 35,
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingHorizontal: 10
  },
  BottomInf: {
    paddingHorizontal: 10,
    paddingBottom: 5,
    marginTop: 10
    // backgroundColor: 'red',
  },
  containerEmCampanha: {
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  iconEmCampanha: {
    fontFamily: Font.C,
    color: 'white',
    fontSize: 20,
    padding: 2
  },
  containerTriangulo: {
    justifyContent: 'flex-end',
    alignContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: -3
  },
  triangulo: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#007ab0',
    position: 'relative',
    bottom: -3
  },
  containerTags: {
    alignItems: 'flex-start',
    elevation: 5,
    position: 'absolute',
    top: 100,
    left: 0,
    zIndex: 99999
    // backgroundColor: 'pink',
  },
  label: {
    borderRadius: 10,
    marginBottom: 5
  },
  checkbox: {
    position: 'absolute',
    right: 6,
    top: Platform.OS !== 'web' ? 10 : null,
  }
});
const mapStateToProps = (state) => ({
  buttons: state.catalog.buttons,
});

const mapDispatchToProps = {
  acEnrichProduct,
  acSelectProduct,
  acCurrentProduct,
  acAssistant,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);


const PriceInfo = (props) => (
  <Fade
    visible={props.isVisible}
    style={{ flexDirection: 'row', padding: 5, paddingHorizontal: 10, width: props.larguraDasCaixas, backgroundColor: '#f6f6f6' }}
  >
    <View style={{ flex: 1 }}>
      <PriceListOrPacking
        currentColor={props.currColor}
        prices={props.product.prices}
      />
    </View>
    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <PriceLabeled
        label="SG"
        price={props.product.precoSugerido}
      />
      {/* <Text style={styles.codigoProduto}>GV: {props.product.grupo}</Text> */}
    </View>
  </Fade>
);

const PriceLabeled = ({ label, price }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.codigoProduto}>{label}: R$ </Text>
      <Price
        price={price}
        style={styles.codigoProduto}
      />
    </View>
  );
};

const PriceListOrPacking = ({ prices, currentColor }) => {
  if (prices.length === 0) return null;
  // Vetor que contém preços da cor atual
  const currColorPrices = [];
  let pointer = 0;
  prices.forEach(p => {
    const isShowingColor = p.ref2 === currentColor;
    let notInserted = true;
    if (currColorPrices.length > 0) notInserted = currColorPrices[pointer - 1].label !== p.label;
    // Se não foi inserido e
    // se for a cor atual exibida na caixa do produto,
    // Inserimos este preço para ser exibido
    if (isShowingColor && notInserted) {
      currColorPrices.push(p);
      // console.log('pointer', currColorPrices[pointer]);
      pointer += 1;
    }
  });

  // Exibição de Preço Cartucho e Favo
  if (currColorPrices.length > 1) {
    return currColorPrices.map(({ label, price }) => {
      if (label !== 'Cartucho' && label !== 'Favo') return null;
      const lb = label === 'Cartucho' ? 'CT' : 'FV';
      return (
        <PriceLabeled
          key={lb}
          label={lb}
          price={price}
        />
      );
    });
  }
  // Exibição somente de preço Lista
  return (
    <View>
      <PriceLabeled
        label="LT"
        price={prices[0].price}
      />
      <View style={{ height: 15 }} />
    </View>
  );
};

const BottomInf = ({ name, code, isExpanded }) => {
  const text = isExpanded ? { margin: 1, color: '#979899' } : { margin: 1 };

  return (
    <View style={stylesLocal.BottomInf}>
      <TextLimit msg={name ? name.toUpperCase() : 'NULL'} maxLength={18} />
      <Text style={[styles.codigoProduto, text]}>{code}</Text>
    </View>
  );
};

const Tags = ({ tags }) => {
  return null;
  let tagsArr = [];
  if (tags) {
    tagsArr = [];
    // Limitando número de tags temporariamente para 2
    tags.map((tag, index) => {
      if (index <= 1) tagsArr.push(tag);
    });
  }

  let wSpace = {};
  if (Platform.OS === 'web') {
    wSpace = { whiteSpace: 'nowrap' };
  }

  return (
    <View style={stylesLocal.containerTags}>
      {tagsArr.map(t => (
        <View key={t} style={[stylesLocal.label, { backgroundColor: 'red' }]}>
          <Text style={[styles.tag, wSpace, { paddingRight: 3, color: 'white' }]}>{t}</Text>
        </View>
      ))}
    </View>
  );
};

const Triangulo = ({ keyDestaque, ponteiroProduto, productPos }) => {
  const active = `${keyDestaque}${productPos}` === `${ponteiroProduto[0]}${ponteiroProduto[1]}`;

  return (
    <View style={stylesLocal.containerTriangulo}>
      <View style={[stylesLocal.triangulo, active ? { borderLeftWidth: 30, borderRightWidth: 30 } : '']} />
    </View>
  );
};