import React from 'react';
import { Dimensions, Animated, View, TouchableOpacity, StyleSheet, Platform, Image, Text, ActivityIndicator } from 'react-native';
import { IconActionless, Fade, Gradient, ImageLoad } from '..';
import SrvResource from '../../services/Resource';
import global from '../../assets/styles/global';
import { semImg } from '../../assets/images';
import ArrowNavigator from '../ArrowNavigator';

let Zoom;
let ImageZoom;

if (Platform.OS === 'web') {
    Zoom = require('react-img-zoom');
} else {
    ImageZoom = require('react-native-image-pan-zoom').default;
}
const hiddenHeight = Dimensions.get('window').height;
const cropWidth = Dimensions.get('window').width;

class ModalZoom extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      yPosition: new Animated.Value(hiddenHeight),
      base64ImageUri: '',
      loading: true,
      isFirstMount: true,
      pointer: props.content.pointer,
      sndLabel: null,
    };
    this.height = hiddenHeight;
    this.width = cropWidth;
    this.topGradient = ['rgba(0,133,178, 0.12)', 'rgba(0,133,178, 0.05)', 'rgba(0,133,178, 0)'];
    this.bottomGradient = ['rgba(0,133,178, 0)', 'rgba(0,133,178, 0.05)', 'rgba(0,133,178, 0.12)'];
    this._mounted = false;
  }

  async componentDidMount() {
    this._mounted = true;
    await this.resolveImage();
    if (this._mounted) this.setState({ isFirstMount: false });
  }

  componentDidUpdate(prevProps, prevState) {
    this.state.yPosition.addListener(value => { this._value = value; });
    if (prevState.loading && this._mounted) {
      this.setState({ loading: false });
    }
  }

  async getSnapshotBeforeUpdate(prevProps, prevState) {
    this.updateShownImage(prevProps, prevState);

    // Reset a posição do modal ao fechar ele
    if (!this.props.visible && this.state.yPosition._value < hiddenHeight) {
      this.setState({ yPosition: new Animated.Value(hiddenHeight) });
    }
    return null;
  }

  async resolveImage() {
    const { content } = this.props;
    this._mounted = true;
    let response = null;
    const sizeType = 'z';
    if (content && content.source) {
      const filename = content.sources.length > 0 ? content.sources[this.state.pointer].uri : content.source;
      response = await SrvResource.getByFileName(filename + '_' + sizeType);
    }

    if (this._mounted) {
      this.setState({ base64ImageUri: response && response.fullContent, loading: false });
    }
  }

  componentWillUnmount() {
    this.state.yPosition.removeAllListeners();
    this._mounted = false;
  }

  render() {
    const { visible } = this.props;
    const container = {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    };
    const animatedStyles = { transform: [{ translateY: this.state.yPosition }] };
    const zoom = this._renderZoom();
    const closeLabel = this._renderCloseLabel();
    if (visible) Animated.timing(this.state.yPosition, { toValue: 0, duration: 650 }).start();
    return (
      <Fade
        style={[StyleSheet.absoluteFill, styles.container]}
        visible={visible}
      >
        <Gradient
          style={[styles.gradient, styles.topGradient]}
          webId="lineargradient-detailproduct-anin0"
          range={this.topGradient}
        />
        <Animated.View style={[container, animatedStyles]}>
          {zoom}
          {closeLabel}
        </Animated.View>
        <Gradient
          style={[styles.gradient, styles.bottomGradient]}
          webId="lineargradient-detailproduct-anin1"
          range={this.bottomGradient}
        />
      </Fade>
    );
  }

  _renderZoom() {
    if (Platform.OS === 'web') {
      const closeLabel = this._renderCloseLabel();
      const dataSourceBase64 = this.state.loading || this.state.isFirstMount ? (
        <View style={[styles.sizeImage, styles.loadingImage]}>
          <ActivityIndicator size="small" color="#333" />
        </View>
      ) : (
        <Zoom
          img={this.state.base64ImageUri ? this.state.base64ImageUri : semImg}
          zoomScale={2}
          width={this.props.window.width}
          height={this.props.window.height}
        >
          {closeLabel}
        </Zoom>
      );
      return (
        <View style={{ backgroundColor: 'white' }}>
          {dataSourceBase64}
        </View>
      );
    }

    const source = this.state.base64ImageUri ? { uri: this.state.base64ImageUri } : semImg;
    return this.state.loading || this.state.isFirstMount ? (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '95%', height: '75%' }} >
        <ActivityIndicator size="small" color="#333" />
      </View>
    ) : (
      <ImageZoom
        enableCenterFocus={false}
        cropWidth={this.width}
        cropHeight={this.height}
        imageWidth={this.width}
        imageHeight={this.height}
        maxZoom={8}
      >
        <Image
          style={{ width: this.width, height: this.height }}
          source={source}
          resizeMode="contain"
        />
      </ImageZoom>
      );
  }

  _renderCloseLabel() {
    return (
      <View style={styles.closeView}>
        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
          <Text style={[global.h5, styles.txtLabel, { marginRight: 12, fontSize: 27 }]}>{this.props.content.label.toUpperCase()}</Text>
          <CloseButton closeModal={this.props.toggleZoom} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
          <Text style={[global.h5, styles.txtLabel, { fontSize: 20, marginRight: this.props.content.sources.length === 0 ? 62 : 10, }]}>{this.state.sndLabel || this.props.content.sndLabel}</Text>
          <Navigator
            pointer={this.state.pointer}
            navigate={this.navigate}
            dataLength={this.props.content.sources.length}
          />
        </View>
      </View>
    );
  }

  navigate = (toLeft) => {
    const pointer = toLeft ? this.state.pointer - 1 : this.state.pointer + 1;
    this.setState({ pointer, sndLabel: `${this.props.content.sources[pointer].code} - ${this.props.content.sources[pointer].name}` });
  }

  loadImg = () => {
    this.setState({ loading: true });
    this.resolveImage();
  }

  async updateShownImage(prevProps, prevState) {
    const { content, } = this.props;
    const hasNavigation = content.sources.length > 0;
    // a variável source é usada para checar se estamos em um zoom modal que possua navegação
    const source = this.props.content.sources[content.pointer];
    const sourceChanged = content.source !== prevProps.content.source || (source && source.uri);
    const sourcesAndPointer = hasNavigation && this.state.pointer !== prevState.pointer;

    // Quando o vetor de cores mudar, devemos atualizar todos os dados do zoom (pointeiro, labels e imagem exibida)
    if (prevProps.content.sources !== content.sources && source) {
      await this.setState({
        pointer: content.pointer,
        sndLabel: `${source.code} - ${source.name}`
      });
      this.loadImg();
    // Senão, quando atualizarmos o ponteiro ele recupera a nova imagem obtida a partir de sources ou source
    } else if (sourceChanged || sourcesAndPointer) {
      this.loadImg();
    }

    // Check para atualizar imagem exibida em zoom simples (sem navegação) quando o uri mudou
    if (sourceChanged && content.sources.length === 0) {
      this.loadImg();
    }
  }
}

export default ModalZoom;

const styles = {
  container: {
    zIndex: 7,
    elevation: 8,
    backgroundColor: Platform.OS === 'web' ? '#EEE' : 'white',
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  closeView: {
    position: 'absolute',
    alignItems: 'flex-end',
    right: 15,
    top: 25,
  },
  gradient: {
    position: 'absolute',
    height: 40,
    width: '100%',
  },
  topGradient: {
    top: 0,
    zIndex: 3,
  },
  bottomGradient: {
    bottom: 0,
    zIndex: 3
  },
  txtLabel: {
    fontSize: 28,
    color: 'rgba(0, 0, 0, 0.35)',
    marginRight: 10,
    marginTop: 9,
  }
};

const CloseButton = props => (
  <TouchableOpacity
    style={styles.closeIcon}
    onPress={() => props.closeModal()}
  >
    <IconActionless
      style={{ fontSize: 34, color: '#B4B7B9', marginRight: 6 }}
      msg="t"
    />
  </TouchableOpacity>
);


const Navigator = ({ dataLength, navigate, pointer }) => {
  if (dataLength === 0) return null;
  const hasNext = pointer + 1 < dataLength;
  const hasPrevious = pointer - 1 >= 0;
  return (
    <ArrowNavigator
      hasNext={hasNext}
      hasPrevious={hasPrevious}
      navigateToNext={navigate}
      navigateToPrevious={() => navigate(true)}
      containerStyle={{  marginTop: 9, height: 38 }}
    />
  );
};