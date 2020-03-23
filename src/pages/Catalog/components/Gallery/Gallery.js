import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import { Fade, IconActionless, Button, ArrowNavigator, ColorNavigator, Gallery as GGallery, ImageLoad, DisableComponent, LoadIndicator } from '../../../../components';
import global from '../../../../assets/styles/global';
import SrvProduct from '../../../../services/Product';
import { acNavigateColor, acSetPanel, acUpdateCurrColor } from '../../../../redux/actions/pages/catalog';
import { arrayIntoGroups } from '../../../../redux/reducers/pages/common/functions';
import { getGallery } from '../../../../services/Pages/Catalog/Queries';
import { semImg } from '../../../../assets/images';
import { navigate } from '../../../../utils/CommonFns';
const SIDE_CONTAINER_WIDTH = 55;
const VW_ARROW_HEIGHT = 48;
const GALLERY_IMG = 260;
const IMG_WIDTH = 327;
const RIGHT_CONTAINER = 40;
class Gallery extends React.Component {
  constructor(props) {
    super(props);
    const pointerColor = this.loadPointer();
    this.nrPerPage = 5;
    this.colorQtd = 6;
    this.state = {
      pages: arrayIntoGroups(props.currentProduct.gallery, this.nrPerPage),
      currColorPage: 0,
      currentPage: 0,
      pointerGallery: 0,
      pointerColor,
      carrouselData: props.currentProduct.colors,
    };
  }


  async componentDidUpdate(prevProps, prevState) {
    // Troca a galeria de fotos de uma mesma cor
    const { currentProduct, currentColor } = this.props;
    // Se receber a galeria de ângulos de todas as cores,
    //  atualizamos o vetor trabalhado atual para exibir a galeria correta
    if (currentProduct.galleries) {
      if (currentProduct.galleries !== prevProps.currentProduct.galleries && currentProduct.galleries[this.state.pointerColor]) {
        this.setState({
          pages: arrayIntoGroups(currentProduct.galleries[this.state.pointerColor], this.nrPerPage),
        });
      }
    }
    // Ao mudar a galeria atual, re-paginamos o vetor para trabalhar com o componente de galeria vertical
    if ((currentProduct.gallery !== prevProps.currentProduct.gallery) && this._mounted) {
      this.setState({
        pages: arrayIntoGroups(currentProduct.gallery, this.nrPerPage),
      });
    }

    // Quando as cores do produto mudaram, recarregamos o ponteiro que indica qual é a cor atual
    // E atualizamos o vetor trabalhado localmente para o carousel(carouselData)
    if (currentProduct.colors !== prevProps.currentProduct.colors && this._mounted) {
      const pointerColor = this.loadPointer();
      this.setState({
        carrouselData: currentProduct.colors,
        pointerColor,
      });
    }
    if (currentProduct.code !== prevProps.currentProduct.code && this._mounted) {
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
      // Move o carousel para a cor selecionada
      if (this._carrousel) this._carrousel.snapToItem(this.state.pointerColor);
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.moveColorList(this.state.pointerColor, true);
    }, 550);
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const {
      imgButtons,
      colorsPopUp,
      currentProduct,
      currentColor,
      acToggleMask,
      acToggleZoom,
      acColorsPopUp,
    } = this.props;
    const { pages, colorPages, currColorPage, pointerGallery, currentPage } = this.state;
    const hasNextPage = currentPage + 1 < pages.length;
    let photos = 0;
    if (Array.isArray(currentProduct.gallery)) photos = currentProduct.gallery.length;
    const isVerticalVisible = (hasNextPage || photos > 1);
    const gota = colorsPopUp ? [global.iconChecked, { fontSize: 28, }] : { color: 'rgba(0,0,0,0.3)', fontSize: 28, };
    let wSpace = {};
    if (Platform.OS === 'web') {
      wSpace = { whiteSpace: 'nowrap' };
    }
    // console.log('currentProduct.gallery', currentProduct.gallery);
    // const isBeforeLastElement = pointerGallery + 1 < pages[currentPage] ? pages[currentPage].length : 0;
    const isLastElement = pages[currentPage] ? pointerGallery + 1 < pages[currentPage].length : true;
    // Visibilidade do navegador da galeria vertical
    return (
      <View
        style={{ flex: 1, padding: 10 }}
        pointerEvents={this.props.isQuering ? 'none' : 'auto'}
      >
        { /* GALERIA */}
        <View style={global.flexOne}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View
              style={{ height: '100%', width: SIDE_CONTAINER_WIDTH, alignItems: 'center' }}
            >
              <LoadIndicator
                isLoading={this.props.isQuering}
                containerStyle={[global.containerCenter, { paddingTop: 55 }]}
              >
                <GGallery
                  isVisible
                  data={pages[currentPage] || currentProduct.gallery}
                  pointerColor={this.state.pointerColor + 1}
                  pointerGallery={this.state.pointerGallery}
                  setPointerGallery={this.setPointerGallery}
                  updateGallery={() => {}}
                  containerStyle={{ flex: 1, width: '100%' }}
                />
              </LoadIndicator>
              <View style={{ height: 50, width: '100%', alignItems: 'center' }}>
                <ArrowNavigator
                  isVertical
                  hasNext={isVerticalVisible && isLastElement && !this.props.isQuering && pages[currentPage]}
                  hasPrevious={pointerGallery > 0 || !(currentPage === 0 && pointerGallery === 0)}
                  navigateToNext={this.galleryNextElement}
                  navigateToPrevious={this.galleryPreviousElement}
                />
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <LoadIndicator
                isLoading={this.props.isQuering || currentProduct.colors.length === 0}
                containerStyle={{ flex: 1, height: GALLERY_IMG, justifyContent: 'center', alignItems: 'center' }}
              >
                <View
                  style={{ flex: 1, height: GALLERY_IMG, alignItems: 'center' }}
                >
                  <Carousel
                    callbackOffsetMargin={5000}
                    data-no-scroll="no-scroll"
                    firstItem={this.state.pointerColor}
                    data={this.state.carrouselData}
                    renderItem={this._renderPhoto}
                    initialNumToRender={this.colorQtd + 3}
                    lockScrollWhileSnapping
                    itemWidth={IMG_WIDTH}
                    sliderWidth={IMG_WIDTH}
                    containerCustomStyle={{ width: IMG_WIDTH }}
                    decelerationRate="fast"
                    onSnapToItem={this.onSnapToItem}
                    ref={(c) => { this._carrousel = c; }}
                  />
                </View>
              </LoadIndicator>
              <View style={gallery.vwImgBtn}>
                {/* Botões (zoom e estoque) de ação próximo a imagem do produto */}
                {/* <TouchableOpacity
                  activeOpacity={0.5}
                  style={{ alignItems: 'center',  }}
                  onPress={this.handleDrop}
                >
                  <Text style={[global.iconGota, gota]}>y</Text>
                </TouchableOpacity> */}
                {/* <ColorNavigator
                  pointerColor={this.state.pointerColor}
                  colorsLength={currentProduct.colors.length}
                  navigateColor={this.navigateColor}
                  containerStyle={{ marginRight: 5 }}
                /> */}
                {/* Motivo do comentário no Details.js da pgProduto
                <Button
                  txtMsg="M"
                  txtStyle={[global.imgBtn, { color: 'rgba(0,0,0,.35)', marginBottom: 5 }]}
                  action={this.toggleZoom}
                /> */}
                <ButtonIndicator
                  msg="."
                  tchbStyle={{ marginBottom: 5 }}
                  isChosen={imgButtons[0]}
                  actions={[{ func: this.props.acDetailProductBtn, params: [0] }]}
                />
              </View>
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingVertical: 5, }}
          >
            <View
              style={{ width: SIDE_CONTAINER_WIDTH, height: VW_ARROW_HEIGHT, justifyContent: 'center', alignItems: 'center' }}
            >
              <Arrow
                isLeft
                isVisible={this.props.currentProduct.colors.length > 1 && Platform.OS === 'web'}
                isDisabled={this.state.pointerColor - 1 < 0 || this.props.isQuering || currentProduct.colors.length === 0}
                action={() => this.navigateColor(false)}
              />
            </View>
            <LoadIndicator
              isLoading={this.props.isQuering || currentProduct.colors.length === 0}
              containerStyle={{ flex: 1, alignItems: 'center', height: 35, justifyContent: 'center' }}
            >
              {
                currentProduct.colors.length > 1 && (
                  <FlatList
                    horizontal
                    ref={(f) => { this.flatList = f; }}
                    data={this.state.carrouselData}
                    renderItem={this._renderColor}
                    keyExtractor={(item, index) => index.toString()}
                    getItemLayout={(data, index) => {
                      return { length: VW_ARROW_HEIGHT, offset: VW_ARROW_HEIGHT * index, index };
                    }}
                    contentContainerStyle={{ flexDirection: 'row', paddingRight: 30 }}
                  />
                )
              }
            </LoadIndicator>
            <View
              style={{ width: RIGHT_CONTAINER, justifyContent: 'center', alignItems: 'center' }}
            >
              <Arrow
                isVisible={this.props.currentProduct.colors.length > 1 && Platform.OS === 'web'}
                isDisabled={this.state.pointerColor + 1 >= currentProduct.colors.length || this.props.isQuering || currentProduct.colors.length === 0}
                action={this.navigateColor}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  _renderPhoto = ({ item, index }) => {
    return (
      <ImageLoad
        isClickable
        onPress={this.toggleZoom}
        tchbStyle={{ width: '100%', alignItems: 'center' }}
        sizeType="l"
        resizeMode="contain"
        filename={item.uri}
        containerStyle={{ height: GALLERY_IMG, maxWidth: IMG_WIDTH }}
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

    if (this._mounted) this.setState({ pointerGallery, carrouselData });
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
    // Para atualizar a cor, precisamos atualizar o ponteiro de acor atual,
    // E a galeria exibida
    if (this._mounted) {
      const pages = galleries[pointerColor] ? arrayIntoGroups(galleries[pointerColor], 5) : [];
      this._carrousel.snapToItem(pointerColor);
      setTimeout(() => {
        let newState = {
          pointerColor,
          pointerGallery: 0,
          pages,
        };
        this.setState(newState);
        // E mover a lista horizontal de cores, caso a cor esteja escondida
        this.moveColorList(pointerColor);
      }, 450);
    }
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
    const pointerColor = currentProduct.colors.findIndex((element, index) => element.isShowing);
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
    if (currentProduct.colors.length > 0 && this._mounted) {
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
        colorPages: arrayIntoGroups(this.props.currentProduct.colors, this.colorQtd),
        pointerColor: index
      });
    }
  }

  moveColorList(nextPointerColor, isFirstLoad) {
    // Pagina determinada a partir da posicao atual e tamanho da lista (this.colorQtd)
    const prevPage = navigate(this.state.pointerColor, this.colorQtd);
    const nextPage = navigate(nextPointerColor, this.colorQtd);
    // Se as paginas forem diferentes, ele move a lista
    if (prevPage !== nextPage || isFirstLoad) {
      const index = this.colorQtd * (nextPage - 1);
      if (this.flatList) this.flatList.scrollToIndex({ animated: true, index });
    }
  }

  handleDrop = () => {
    this.props.acColorsPopUp();
    this.props.acToggleMask();
    const panel = { id: 0, title: `${this.props.currentProduct.colors.length} CORES DISPONÍVEIS` };
    this.props.acSetPanel(0, panel);
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
    this.props.acClosePopStock();
  }
}

const mapStateToProps = state => ({
  currentColor: state.catalog.currentColor,
});

const mapDispatchToProps = {
  acNavigateColor,
  acSetPanel,
  acUpdateCurrColor,
};

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);

const gallery = StyleSheet.create({
  vwImgBtn: {
    flexWrap: 'wrap',
    alignItems: 'center',
    width: RIGHT_CONTAINER,
    paddingTop: 3,
  }
});


const ButtonIndicator = ({ msg, isChosen, actions, tchbStyle }) => (
  <View>
    <Button
      txtMsg={msg}
      isChosen={isChosen}
      txtStyle={global.imgBtn}
      tchbStyle={tchbStyle}
      actions={actions}
      changeColor
      chosenColor="#0085B2"
      nChosenColor="rgba(0,0,0,0.3)"
    />
    <Fade style={{ position: 'absolute', marginTop: 25, alignSelf: 'center' }} visible={isChosen}>
      <IconActionless
        style={{ fontSize: 18, transform: [{ rotate: '90deg' }], color: '#0084AE', marginLeft: 8 }}
        msg="J"
      />
    </Fade>
  </View>
);


const mock = {
  key: '00',
  name: '218202003200.jpg',
  selected: false,
  uri: ''
};

export const Arrow = (props) => {
  if (!props.isVisible) return null;
  return (
    <TouchableOpacity
      style={[{ width: 33, justifyContent: 'center', alignItems: 'center', padding: 3, paddingVertical: 5, borderRadius: 15, backgroundColor: 'rgb(250, 250, 250)' }, global.shadow, props.containerStyle]}
      onPress={props.action}
      disabled={props.isDisabled}
    >
      <IconActionless msg="v" style={{ transform: [{ rotate: props.isLeft ? '180deg' : '0deg' }], fontSize: 15, color: props.isDisabled ? 'rgba(0, 0, 0, 0.5)' : 'black' }} />
    </TouchableOpacity>
  );
};


const colors = StyleSheet.create({
  img: {
    height: 50,
    width: 50,
    padding: 2,
    borderWidth: 1,
  }
});