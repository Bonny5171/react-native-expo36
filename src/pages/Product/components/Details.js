import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import { Font } from '../../../assets/fonts/font_names';
import { SimpleButton, Button, Price, ColorNavigator, Gallery, ArrowNavigator, DisableComponent } from '../../../components';
import SrvResource from '../../../services/Resource';
import SrvProduct from '../../../services/Product';
import global from '../../../assets/styles/global';
import { acToggleZoom, acToggleMask } from '../../../redux/actions/global';
import { acTogglePanelProd } from '../../../redux/actions/pages/product';
import { asyncForEach, navigate } from '../../../utils/CommonFns';
import { arrayIntoGroups } from '../../../redux/reducers/pages/common/functions';
import { acChangeColor, acUpdateGallery, acChangePrice, acAssistant, acUpdateCurrColor } from '../../../redux/actions/pages/catalog';
import ImageLoad from '../../../components/ImageLoad';
import { Arrow } from '../../Catalog/components/Gallery/Gallery';
import { semImg } from '../../../assets/images';
import { Tags } from '../../Catalog/components/TabResulmo';

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.nrPerPage = 5;
    this.colorQtd = 6;
    this._mounted = false;
    const gallery = props.currentProduct.galleries[props.currentColor] ? props.currentProduct.galleries[props.currentColor] : props.currentProduct.gallery;
    this.state = {
      pages: arrayIntoGroups(gallery, this.nrPerPage),
      currentPage: 0,
      pointerGallery: 0,
      pointerColor: props.currentColor,
      carrouselData: props.currentProduct.colors,
    };
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  async componentDidUpdate(prevProps, prevState) {
    // Troca a galeria de fotos de uma mesma cor
    const { currentProduct, currentColor } = this.props;
    if (currentProduct.code !== prevProps.currentProduct.code) {
      await this.loadPointer();
      // Procura cor exibida para o produto atual
      let pointerColor = currentProduct.colors.findIndex((element, index) => element.isShowing);
      this.setState({ carrouselData: [] });
      this.setState({
        carrouselData: [...currentProduct.colors],
        pointerColor,
        pointerGallery: 0,
        pages: arrayIntoGroups(currentProduct.gallery, this.nrPerPage),
      });
      if (this._carrousel) this._carrousel.snapToItem(this.state.pointerColor);
    }
  }

  render() {
    const {
      acToggleZoom,
      currentProduct,
    } = this.props;

    const { pages, pointerGallery, currentPage } = this.state;
    const hasNextPage = currentPage + 1 < pages.length;
    let photos = 0;
    if (Array.isArray(currentProduct.gallery)) photos = currentProduct.gallery.length;
    const isVerticalVisible = (hasNextPage || photos > 1);
    const img = currentProduct.gallery.find(element => element.selected);
    const color = { color: !this.props.isPanelVisible ? 'rgba(0,0,0,0.3)' : '#0085B2' };
    const uri = !img ? 'https://www.lognetinfo.com.br/imagens/350x350/sem_imagem.jpg' : img.url;
    const isLastElement = pages[currentPage] ? pointerGallery + 1 < pages[currentPage].length : true;
    const { colors } = currentProduct;
    const cor = colors[this.props.currentColor];
    return (
      <View style={styles.container}>

        <View style={styles.background} />
        <View style={styles.btn}>
          <DisableComponent
            isDisabled={this.props.checkboxes[1] || this.props.isCompleteCat}
          >
            <SimpleButton msg="EU QUERO" action={() => { this.props.acAssistant(this.props.currentProduct); }} />
          </DisableComponent>
        </View>

        <View style={styles.containerLeft}>

          <View style={styles.box}>
            <View style={{ height: 378, alignItems: 'center' }}>
              <Gallery
                data={pages[currentPage]}
                isVisible={isVerticalVisible}
                pointerColor={this.pointerColor}
                pointerGallery={pointerGallery}
                setPointerGallery={this.setPointerGallery}
                updateGallery={this.props.acUpdateGallery}
                containerStyle={{ flex: 1 }}
              />
              <ArrowNavigator
                // isStatic
                isVertical
                hasNext={isVerticalVisible && isLastElement}
                hasPrevious={pointerGallery > 0 || !(currentPage === 0 && pointerGallery === 0)}
                navigateToNext={this.galleryNextElement}
                navigateToPrevious={this.galleryPreviousElement}
              />
              <View
                style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}
              >
                <DisableComponent
                  isDisabled={Platform.OS !== 'web'}
                >
                  <Arrow
                    isLeft
                    isVisible={this.props.currentProduct.colors.length > 1}
                    isDisabled={this.state.pointerColor - 1 < 0}
                    action={() => this.navigateColor(false)}
                  />
                </DisableComponent>
              </View>
            </View>
            <View
              style={{ flex: 1, alignItems: 'center' }}
            >
              <View style={{ height: '100%' }}>
                <View style={{ height: 327, }}>
                  <Carousel
                    callbackOffsetMargin={5000}
                    data-no-scroll="no-scroll"
                    firstItem={this.state.pointerColor}
                    data={this.state.carrouselData}
                    renderItem={this._renderPhoto}
                    initialNumToRender={this.colorQtd + 3}
                    lockScrollWhileSnapping
                    itemWidth={400}
                    sliderWidth={400}
                    containerCustomStyle={{ maxWidth: 400 }}
                    decelerationRate="fast"
                    onSnapToItem={this.onSnapToItem}
                    ref={(c) => { this._carrousel = c; }}
                  />
                </View>
                {
                  currentProduct.colors.length > 1 && (
                    <FlatList
                      horizontal
                      ref={(f) => { this.flatList = f; }}
                      data={this.state.carrouselData}
                      renderItem={this._renderColor}
                      contentContainerStyle={{ flexDirection: 'row', paddingRight: 30 }}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  )
                }
              </View>
            </View>
            <View >
              <View style={styles.topMenu}>
                <View style={[styles.containerEmCampanha, styles.mBottom]}>
                  <Text style={styles.iconEmCampanha}>b</Text>
                </View>
                {/*
                  (DW) MOTIVO PARA ESTAR COMENTADO:
                  Como o componente que determina se possui imagem ou não é o <ImageLoad/>, o pai não tem acesso a esta informação.
                  Tentei evoluir o componente trabalhando com uma função que faria um setState no pai avisando que não possuía a img no bd
                  Mas isso piora a manutenção do código por ter que aplicar em todos os lugares que possuirem isso.
                  Em lugares que usam o <Carrosel> esta lógica precisa ser mais evoluída ainda, trabalhando com um ponteiro da cor atual provavelmente.
                  Porque só temos um botão de zoom (desacoplado) da cor atual, que só saberemos se possui imagem ou não em sua primeira montagem.
                <Button
                  txtMsg="M"
                  tchbStyle={styles.mBottom}
                  txtStyle={styles.zoom}
                  action={this.toggleZoom}
                /> */}
                <Text style={[styles.envelop, styles.mBottom]}>W</Text>
                <Text style={[styles.carrinho, styles.mBottom]}>p</Text>
              </View>
              <View
                style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}
              >
                <DisableComponent
                  isDisabled={Platform.OS !== 'web'}
                >
                  <Arrow
                    isVisible={this.props.currentProduct.colors.length > 1}
                    isDisabled={this.state.pointerColor + 1 >= currentProduct.colors.length}
                    action={this.navigateColor}
                  />
                </DisableComponent>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.containerRight}>

          <View style={styles.subContainerRight}>
            <View style={styles.vwName}>
              <Text style={styles.name}>
                {currentProduct.code} - {currentProduct.name && currentProduct.name.toUpperCase()}
              </Text>
              <Text style={[styles.name, { fontSize: 14 }]}>
                {`${cor.code} - ${cor.name && cor.name.toUpperCase()}`}
              </Text>
            </View>
            <Tags
              tags={currentProduct.tags[cor.code]}
              containerStyle={{ paddingTop: 7, paddingHorizontal: 20 }}
            />

            {/* LINHA 1 */}
            <View style={styles.row}>

              <View style={styles.cell}>
                <Text style={styles.titulo}>CATEGORIA</Text>
                <Text style={styles.subTitulo}>{currentProduct.category.toUpperCase()}</Text>
              </View>

              <View style={styles.cell}>
                <Text style={styles.titulo}>LINHA</Text>
                <Text style={styles.subTitulo}>{currentProduct.sf_genero__c.toUpperCase()}</Text>
              </View>

              <View style={styles.cell}>
                <Text style={styles.titulo}>NCM</Text>
                <Text style={styles.subTitulo}>{currentProduct.ncm}</Text>
              </View>

            </View>

            {/* LINHA 2 */}
            <View style={styles.row}>

              <View style={styles.cell}>
                <Text style={styles.titulo}>GRUPO</Text>
                <Text style={styles.subTitulo}>{currentProduct.group}</Text>
              </View>

              <View style={styles.cell}>
                <Text style={styles.titulo}>FÁBRICA</Text>
                <Text style={styles.subTitulo}>{currentProduct.sf_estabelecimento_prod__c.toUpperCase()}</Text>
              </View>

              <View style={styles.cell}>
                <Text style={styles.titulo}>PEDIDO MÍNIMO</Text>
                <Text style={styles.subTitulo}>NULO</Text>
              </View>

            </View>

            {/* LINHA 3 */}
            <View style={{ borderTopColor: 'rgba(0,0,0,.10)', borderTopWidth: 1, marginTop: 15, marginHorizontal: 20, height: 1 }} />
            <View data-id="precos" style={styles.row}>
              {
                currentProduct.prices.map((item, index) => {
                  return (
                    <View key={index.toString()} style={[styles.cell, { width: null }]}>
                      <Text style={[styles.titulo, { fontSize: 10, paddingBottom: 3, paddingTop: 10 }]}>{currentProduct.prices.length > 1 ? `PREÇO ${item.label.toUpperCase()}` : 'PREÇO LISTA'}</Text>
                      <View style={styles.vwPrice}>
                        <Text style={[styles.txtPriceUnity, styles.txt, { fontSize: 10 }]}>R$ </Text>
                        <Price
                          price={item.price}
                          style={[styles.txtPrice, styles.txt, { fontSize: 16 }]}
                        />
                      </View>
                    </View>
                  );
                })
              }
              <View style={[styles.cell, { width: null }]}>
                <Text style={[styles.titulo, { fontSize: 10, paddingBottom: 3, paddingTop: 10 }]}>PREÇO SUGESTÃO</Text>
                <View style={styles.vwPrice}>
                  <Text style={[styles.txtPriceUnity, styles.txt, { fontSize: 10 }]}>R$ </Text>
                  <Price
                    price={currentProduct.precoSugerido}
                    style={[styles.txtPrice, styles.txt, { fontSize: 16 }]}
                  />
                </View>
              </View>
            </View>

          </View>

        </View>

      </View>
    );
  }

  _renderPhoto = ({ item }) => {
    return (
      <ImageLoad
        isClickable
        onPress={this.toggleZoom}
        sizeType="l"
        resizeMode="contain"
        filename={item.uri}
        tchbStyle={{ flex: 1, width: '100%', alignItems: 'center' }}
        containerStyle={{ flex: 1, paddingVertical: 4, width: '100%', height: '100%' }}
      />
    );
  }

  _renderColor = ({ item, index }) => {
    const isChosen = index === this.state.pointerColor;
    return (
      <TouchableOpacity
        onPress={() => {
          this.updateColor(index, item.code);
        }}
        style={{ alignItems: 'center' }}
        disabled={isChosen}
      >
        <ImageLoad
          sizeType="m"
          resizeMode="contain"
          filename={item.url || item.uri}
          containerStyle={[colors.img, { borderColor: isChosen ? '#CCC' : 'transparent' }]}
        />
      </TouchableOpacity>
    );
  }

  setPointerGallery = (pointerGallery = 0) => {
    const img = this.state.pages[this.state.currentPage][pointerGallery];
    let uri = semImg;
    if (img) uri = img.url;
    const carrouselData = this.state.carrouselData.map((color, index) => {
      if (index === this.state.pointerColor) {
        return { ...color, uri };
      }
      return color;
    });

    this.setState({ pointerGallery, carrouselData });
  }

  navigateColor = async (isRight) => {
    const { currentProduct } = this.props;
    const pointerColor = isRight ? this.state.pointerColor + 1 : this.state.pointerColor - 1;
    const color = currentProduct.colors[pointerColor];

    this.updateColor(pointerColor, color.code);
  }

  async updateColor(pointerColor, colorCode) {
    const { galleries } = this.props.currentProduct;
    this.props.acUpdateCurrColor(pointerColor);
    // this.setState({
    //   pointerColor,
    //   pointerGallery: 0,
    //   pages: galleries[pointerColor] ? arrayIntoGroups(galleries[pointerColor], 5) : [],
    //   carrouselData: this.props.currentProduct.colors
    //  });
    // this.moveColorList(pointerColor);
    this._carrousel.snapToItem(pointerColor);
    setTimeout(() => {
      let newState = {
        pointerColor,
        pointerGallery: 0,
        pages: galleries[pointerColor] ? arrayIntoGroups(galleries[pointerColor], 5) : [],
        carrouselData: this.props.currentProduct.colors
       };
      this.setState(newState);
      // E mover a lista horizontal de cores, caso a cor esteja escondida
      this.moveColorList(pointerColor);
    }, 450);
  }

  galleryPreviousElement = () => {
    const { currentPage, pages } = this.state;
    const { currentProduct } = this.props;
    const pointerGallery = this.state.pointerGallery - 1;
    // Troca de página
    if (this.state.pointerGallery === 0 && currentPage > 0) {
      this.setState({ currentPage: currentPage - 1, pointerGallery: pages[currentPage].length - 1 });
      // Navegar na mesma página, redefinindo a foto atual
    } else {
      this.setPointerGallery(pointerGallery);
    }
  }

  galleryNextElement = () => {
    const { currentPage, pages } = this.state;
    const { currentProduct } = this.props;
    // console.log('this.state.pointerGallery === pages[currentPage].length - 1)', this.state.pointerGallery, pages[currentPage].length - 1);
    const pointerGallery = this.state.pointerGallery + 1;
    if (this.state.pointerGallery === pages[currentPage].length - 1) this.setState({ currentPage: currentPage + 1, pointerGallery: 0 });
    else {
      this.setPointerGallery(pointerGallery);
    }
  }

  loadPointer() {
    const { currentProduct } = this.props;
    const pointerColor = currentProduct.colors[this.props.currentColor];
    this.props.acSetCurrColor(pointerColor);
    return pointerColor;
  }


  onSnapToItem = (index) => {
    const { colors } = this.props.currentProduct;
    if (colors.length > 1 && this._mounted) {
      this.updateColor(index, colors[index].code);
    }
  }

  afterSlideUpdates(index) {
    const { currentProduct } = this.props;
    if (currentProduct.colors.length > 0) {
      // Move o carrosel
      if (this._carrousel) this._carrousel.snapToItem(index);
      const color = currentProduct.colors[index];

      // Atualiza galerial atual exibida
      this.props.acChangeGallery(color.name, index);
      if (currentProduct.gallery.length === 0) currentProduct.gallery[0] = { key: '00', name: '404', selected: true, url: 'https://www.lognetinfo.com.br/imagens/350x350/sem_imagem.jpg' };
      this.props.acUpdateGallery('00');

      this.setState({
        currentPage: 0,
        pointerGallery: 0,
        pointerColor: index
      });
    }
  }

  moveColorList(nextPointerColor) {
    // Pagina determinada a partir da posicao atual e tamanho da lista (this.colorQtd)
    const prevPage = navigate(this.state.pointerColor, this.colorQtd);
    const nextPage = navigate(nextPointerColor, this.colorQtd);
    // Se as paginas forem diferentes, ele move a lista
    if (prevPage !== nextPage) {
      const index = this.colorQtd * (nextPage - 1);
      this.flatList.scrollToIndex({ animated: true, index });
    }
  }

  toggleZoom = () => {
    const { currentProduct } = this.props;

    const zoom = {
      url: this.state.carrouselData[this.state.pointerColor] && this.state.carrouselData[this.state.pointerColor].uri,
      name: `${currentProduct.code} - ${currentProduct.name}`,
      sndLabel: `${this.state.carrouselData[this.state.pointerColor].code} - ${this.state.carrouselData[this.state.pointerColor].name}`,
      sources: this.state.carrouselData,
      pointer: this.state.pointerColor
    };
    this.props.acToggleZoom(zoom);
  }
}

const mapStateToProps = (state) => ({
  isPanelVisible: state.product.isPanelVisible,
  currentColor: state.catalog.currentColor,
  checkboxes: state.assistant.checkboxes,
});
const mapDispatchToProps = {
  acTogglePanelProd,
  acToggleZoom,
  acChangeColor,
  acUpdateGallery,
  acChangePrice,
  acAssistant,
  acUpdateCurrColor,
};
export default connect(null, { mapStateToProps, mapDispatchToProps })(Details);


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // backgroundColor: 'brown',
  },
  background: {
    position: 'absolute',
    height: 391,
    width: '100%',
    backgroundColor: 'rgba(244,244,244, 0.5)',
  },
  btn: {
    position: 'absolute',
    bottom: 18,
    right: 25,
    transform: [{ translateY: 20 }]
  },
  containerLeft: {
    width: '60%',
    // backgroundColor: 'green',
  },
  containerRight: {
    width: '40%',
    marginTop: 30,
    // backgroundColor: 'pink',
  },

  subContainerRight: {

  },
  tag: {
    borderRadius: 10,
    backgroundColor: 'red',
    marginBottom: 5,
    marginRight: 4,
  },
  vwName: {
    // paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  name: {
    fontSize: 26,
    color: 'rgba(102, 102, 102, 1)',
    fontFamily: Font.BLight,
  },
  containerImage: {
    position: 'absolute',
    top: 40,
    left: 76,
    marginTop: 20,
  },
  img: {
    width: '77%',
    height: '75%',
  },
  imgensGaleria: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    bottom: 70,
    width: '100%',
    // backgroundColor: '#fff001',
  },
  box: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 25,
    height: 390,
    maxHeight: 400,
    backgroundColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowColor: 'rgba(0,0, 0, 0.3)',
    elevation: 3,
    padding: 6,
  },
  topMenu: {
    flex: 1,
    alignItems: 'center',
  },
  bottomMenu: {
    flexDirection: 'column',
    width: '100%',
    zIndex: 999999,
    elevation: 19
    // backgroundColor: 'gray',
  },
  containerMenu: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
    // backgroundColor: 'magenta'
  },
  tags: {
    flexDirection: 'row',
    marginLeft: 20,
    paddingTop: 10,
  },
  containerEmCampanha: {
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: 23,
    marginBottom: 5,
  },
  iconEmCampanha: {
    fontFamily: Font.C,
    color: 'white',
    fontSize: 20,
    padding: 2,
  },
  zoom: {
    fontFamily: Font.C,
    color: 'rgba(102, 102, 102, 0.5)',
    fontSize: 28,
  },
  envelop: {
    fontFamily: Font.C,
    fontSize: 28,
    color: 'rgba(102, 102, 102, 0.5)',
  },
  carrinho: {
    fontFamily: Font.C,
    fontSize: 28,
    color: 'rgba(102, 102, 102, 0.5)',
    // backgroundColor: 'gray',
  },
  containerTags: {
    flex: 1,
    // backgroundColor: 'black',
  },
  titulo: {
    fontSize: 12,
    fontFamily: Font.ASemiBold,
    color: 'rgba(102, 102, 102, 1)',
    // paddingBottom: 3,
    paddingTop: 5
  },
  descricao: {
    fontSize: 14,
    fontFamily: Font.ASemiBold,
    color: 'rgba(102, 102, 102, 1)',
  },
  txt: {
    fontFamily: Font.ARegular,
    color: 'rgba(0, 0, 0, 0.7)',
    marginTop: -9,
  },
  txtGoToProduct: {
    fontSize: 16,
    fontFamily: Font.ARegular,
    // color: 'rgba(0, 0, 0, 0.7)',
    color: '#0085B2',
    textDecorationLine: 'underline',
  },
  txtPrice: {
    fontSize: 22,
    paddingTop: 5,
    paddingLeft: 2,
  },
  txtPriceUnity: {
    fontSize: 12,
    paddingTop: 10,
  },
  vwPrice: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  vwColumn: {
    flexDirection: 'column',
    paddingLeft: 20,
    paddingVertical: 30,
  },
  boxDetalhe: {
    paddingBottom: 30,
    // backgroundColor: 'gray',
  },
  subTitulo: {
    color: 'rgba(102, 102, 102, 1)',
    fontFamily: Font.ARegular,
    fontSize: 15,
    // marginTop: 3,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    // paddingTop: 20,
    marginLeft: 20,
  },
  rowLine: {
    borderTopColor: 'rgba(0,0,0,.15)',
    borderTopWidth: 1,
    marginTop: 20,
  },
  cell: {
    width: '33%',
    paddingRight: 15
  },
  mBottom: {
    marginBottom: 10
  }
});


const colors = StyleSheet.create({
  img: {
    height: 50,
    width: 50,
    padding: 2,
    borderWidth: 1,
  }
});