import React, { Fragment } from 'react';
import { View, Platform, Animated, Easing, TouchableOpacity, StyleSheet, Text, FlatList } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Gallery, TabArgumentoDeVenda, TabRanking, TabCombos } from './';
import { Font } from '../../../assets/fonts/font_names';
import { SimpleButton, FadeTabs, DisableComponent, Gradient, Fade, Button, ArrowNavigator, LoadIndicator } from '../../../components';
import TabResulmo from './TabResulmo';
import global from '../../../assets/styles/global';
import { acAssistant, acCurrentProduct, acTogglePonteiroProduto } from '../../../redux/actions/pages/catalog';
import { getDetailProduct, getAllGalleries, getGallery } from '../../../services/Pages/Catalog/Queries';
import { resetNavigate } from '../../../utils/routing/Functions';


class DetailProduct extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      activeTab: 0
    };
    this.tabLabels = [
      {
        name: 'Resumo',
        active: true
      },
      {
        name: 'Argumentos de venda',
        active: false
      },
      {
        name: 'Ranking',
        active: false
      },
      {
        name: 'Combos',
        active: false
      }
    ];
    this.setCurrentTab = this.setCurrentTab.bind(this);
  }

  async componentDidMount() {
    const easing = Easing.elastic();

    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 700,
      easing,
      userNativeDriver: true
    }).start(({ finished }) => {
      const { scrollToIndex, indexDestaque } = this.props;
      if (finished) {
        scrollToIndex(indexDestaque);
      }
    });
  }

  render() {
    const { fadeAnim } = this.state;
    const { currentProduct, navigation } = this.props;
    const height = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 335]
    });
    const hasAllGalleries = this.props.currentProduct.galleries && this.props.currentProduct.galleries[this.props.currentColor];
    return (
      <Animated.View
        style={[
          {
            ...this.props.style,
            height,
            opacity: fadeAnim,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            marginBottom: 6
          }
        ]}
      >
        <Gradient
          style={{
            position: 'absolute',
            height: Platform.OS === 'web' ? 40 : 80,
            width: '100%'
          }}
          range={['rgba(0,133,178, 0.15)', 'rgba(0,133,178, 0.08)', 'rgba(0,133,178, 0)']}
          webId="lineargradient-detailproduct-anin0"
        />
        <Gradient
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: Platform.OS === 'web' ? 40 : 105
          }}
          range={['rgba(0,133,178, 0)', 'rgba(0,133,178, 0.10)', 'rgba(0,133,178, 0.17)']}
          webId="lineargradient-detailproduct-anin1"
        />
        <View
          style={{
              flex: 1,
              flexDirection: 'row'
            }}
        >

          {/* Box do lado esquerdo */}
          <Gallery style={{ flex: 1 }} {...this.props} />
          {/* Box do lado direito */}
          <View style={{ flex: 1 }}>
            <FadeTabs
              tabs={[
                  {
                    name: 'Resumo',
                    active: this.state.activeTab === 0
                  },
                  {
                    name: 'Argumento de venda',
                    active: this.state.activeTab === 1
                  },
                  {
                    name: 'Ranking',
                    active: this.state.activeTab === 2
                  },
                  {
                    name: 'Combos',
                    active: this.state.activeTab === 3
                  }
                ]}
              activeTab={this.state.activeTab}
              acChangeTab={this.setCurrentTab}
              contentStyle={{ padding: 10 }}
              pTabWidth={null}
              txtTab={{ fontSize: 14 }}
              noGradient
              isLoading={this.props.isQuering}
            >
              <TabResulmo currentProduct={currentProduct} isCompleteCat={this.props.isCompleteCat} currentColor={this.props.currentColor} />
              <TabArgumentoDeVenda currentProduct={currentProduct} flatListRef={this.props.flatListRef} />
              <TabRanking currentProduct={currentProduct} />
              <TabCombos currentProduct={currentProduct} />
            </FadeTabs>
            {/* FOOTER */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => {
                    this.props.acSetProduct(currentProduct);
                    resetNavigate('product', this.props.navigation);
                  }}
              >
                <Text style={[styles.txt, styles.txtGoToProduct]}>Ir para a página do produto</Text>
              </TouchableOpacity>
              <DisableComponent
                isDisabled={this.props.isCompleteCat}
              >
                <SimpleButton
                  tchbStyle={styles.btnEuQuero}
                  msg="EU QUERO"
                  action={() => {
                      this.props.acAssistant(currentProduct);
                    }}
                />
              </DisableComponent>
            </View>
          </View>
          <PopUpStock
            isVisible={this.props.imgButtons[0]}
            currentProduct={currentProduct}
          />
          <Button
            txtMsg="t"
            txtStyle={global.iconClose}
            tchbStyle={styles.icClose}
            action={this.props.acTogglePonteiroProduto}
          />
          <ArrowNavigator
            hasPrevious={this.props.previousProduct}
            hasNext={this.props.nextProduct}
            navigateToPrevious={() => this.navigate(true)}
            navigateToNext={() => this.navigate()}
            containerStyle={styles.arrowStyle}
          />
        </View>
      </Animated.View>
    );
  }

  setCurrentTab(index) {
    this.setState({ activeTab: index });
    this.props.acClosePopStock();
  }

  navigate = async (isPrevious) => {
    const {
      keyDestaque,
      rowData,
      pointerCurrent,
      currentTable,
      dropdown,
    } = this.props;

    // Cancela requisições que estejam em andamento
    const product = this.props[`${isPrevious ? 'previous' : 'next'}Product`];
    let currPointer = pointerCurrent + 1;
    let pointers = {
      pointerPrevious: pointerCurrent,
      pointerCurrent: currPointer,
      pointerNext: pointerCurrent + 2,
      pointerRow: currPointer,
    };

    if (isPrevious) {
      currPointer = pointerCurrent - 1;
      pointers = {
        pointerPrevious: pointerCurrent - 2,
        pointerCurrent: currPointer,
        pointerNext: pointerCurrent,
        pointerRow: currPointer,
      };
    }
    this.props.toggleRowQuering(true);
    // Atualiza ponteiros
    this.props.acCurrentProduct(
      rowData,
      pointers,
      rowData.length,
      false, // horizontalList
      null, // horizontalListLength
      keyDestaque,
      [],
      [],
      product,
      false,
    );
    const newProduct = getDetailProduct(product, dropdown.current.products, currentTable)
    .then(async (prod) => {
      if (prod.code === this.props.currentProduct.code) {
        await this.props.acEnrichProduct(prod);
        this.props.toggleRowQuering();
        return prod;
      }
      this.props.toggleRowQuering();
      return product;
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
}

const styles = StyleSheet.create({
  icClose: {
    position: 'absolute',
    right: 3,
    top: 8
  },
  btnEuQuero: {
    marginLeft: 60
  },
  txt: {
    fontFamily: Font.ALight,
    color: 'rgba(0, 0, 0, 0.7)'
  },
  txtGoToProduct: {
    color: '#0085B2',
    textDecorationLine: 'underline',
    fontSize: 16,
    paddingLeft: 10
  },
  gapVertical: {
    flexGrow: 1
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingBottom: 15,
    paddingRight: 20
    // marginRight: 200,
  },
  arrowStyle: {
    position: 'absolute',
    ...Platform.select({
      web: {
        right: 37, top: -14
      },
      ios: {
        right: 37, top: -14
      },
      android: {
        right: 55, top: 10
      }
    }),

  }
});

const mapStateToProps = (state) => ({
  previousProduct: state.catalog.previousProduct,
  nextProduct: state.catalog.nextProduct,
  pointerCurrent: state.catalog.pointerCurrent,
});

const mapDispatchToProps = {
  acAssistant,
  acCurrentProduct,
  acTogglePonteiroProduto
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailProduct);

const PopUpStock = ({ isVisible, currentProduct }) => (
  <Fade
    visible={isVisible}
    style={popUpStock.container}
  >
    <View style={{ alignItems: 'center' }}>
      <Text style={[popUpStock.label, { marginBottom: 5 }]}>TAMANHOS: </Text>
      <Text style={popUpStock.label}>ESTOQUES: </Text>
    </View>
    <FlatList
      style={popUpStock.list}
      horizontal
      data={[
        {
          size: '37/38',
          stock: '33k'
        },
        {
          size: '39/40',
          stock: '31k'
        },
        {
          size: '41/42',
          stock: '22k'
        },
        {
          size: '44/43',
          stock: '18k'
        },
        {
          size: '45/46',
          stock: '12k'
        },
        {
          size: '47/48',
          stock: '6k'
        },
        {
          size: '49/50',
          stock: '2k'
        },
        // {
        //   size: '49/50',
        //   stock: '2k'
        // },
        // {
        //   size: '49/50',
        //   stock: '2k'
        // },
        // {
        //   size: '49/50',
        //   stock: '2k'
        // },
        // {
        //   size: '49/50',
        //   stock: '2k'
        // },
        // {
        //   size: '49/50',
        //   stock: '2k'
        // },
        // {
        //   size: '49/50',
        //   stock: '2k'
        // },
        // {
        //   size: '49/50',
        //   stock: '2k'
        // },
        // {
        //   size: '49/50',
        //   stock: '2k'
        // },
        // {
        //   size: '49/50',
        //   stock: '2k'
        // },
        // {
        //   size: '49/50',
        //   stock: '2k'
        // }
      ]}
      renderItem={({ item }) => (
        <View style={{ width: 55, height: 40, marginTop: Platform.OS === 'web' ? 0 : 4, alignItems: 'center' }}>
          <Text style={[global.text, popUpStock.txt]}>{item.size}</Text>
          <Text style={[global.text, popUpStock.txt]}>{item.stock}</Text>
        </View>
      )}
      keyExtractor={(item) => item.size}
    />
  </Fade>
);

const popUpStock = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 874,
    backgroundColor: 'rgba(252, 252, 252, 0.93)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowColor: 'rgba(0,0, 0, 0.3)',
    marginHorizontal: 30,
    left: 0,
    top: 50,
    marginLeft: 24,
    padding: 5,
    elevation: 1,
  },
  label: {
    width: 80,
    fontFamily: Font.ASemiBold,
    fontSize: 12,
    textAlign: 'right'
  },
  txt: {
    fontSize: 12,
    marginTop: 2,
    paddingHorizontal: 8
  },
  list: {
    marginLeft: 6,
    ...Platform.select({ web: { marginTop: 8 } }),
  },
});