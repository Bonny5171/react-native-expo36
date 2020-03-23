import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Image } from 'react-native';
import { connect } from 'react-redux';
import global from '../../assets/styles/global';
import { navigate } from '../../utils/CommonFns';
import { obterQuantidaDeCaixas, obterLarguraDasCaixas } from '../../services/Dimensions';
import { WhiteBox } from '..';
class HorizontalGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleY: new Animated.Value(0),
    };
    this._renderItem = this._renderItem.bind(this);
  }

  componentWillMount() {
    this.state.scaleY.addListener(value => { this._value = value; });
    this.larguraDasCaixas = obterLarguraDasCaixas(this.props);
    this.qtd = obterQuantidaDeCaixas(this.props);
  }

  componentWillUpdate(nextProps) {
    this.qtd = obterQuantidaDeCaixas(this.props);
    const currentPage = navigate(this.props.horizontalPointer, this.qtd);
    const nextPage = navigate(nextProps.horizontalPointer, this.qtd);
    // Verificação para definir se deve mover a lista horizontalmente
    if (currentPage !== nextPage) {
      let scrollToIndex = 0;
      // Se a próxima página será a primeira(0), não precisa subtrair
      if (currentPage !== 0) scrollToIndex = this.qtd * (nextPage - 1);
      // console.log('scrolltoIndex', scrollToIndex, 'INDEX TESTED', nextProps.ponteiroProduto[1]);
      if (scrollToIndex >= 0 && scrollToIndex <= this.props.gallery.length) this.flatList.scrollToIndex({ animated: true, index: scrollToIndex });
    }
  }

  componentWillUnmount() {
    this.state.scaleY.removeAllListeners();
  }

  componentDidMount() {
    // console.log('SHOULD ANIMATE', this.props.shouldAnimated);
    if (this.props.shouldAnimated) {
      Animated.spring(this.state.scaleY, {
        toValue: 1,
        duration: 12000,
      }).start();
    } else {
      // Só deixa a galeria ativa quando não precisa ter animação
      if (this.state.scaleY._value !== 1) {
        this.setState({ scaleY: new Animated.Value(1) });
      }
    }
  }
  render() {
    const {
      style,
      gallery
    } = this.props;
    const heightInterpolated = this.state.scaleY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 190],
    });
    const animatedStyles = { height: heightInterpolated };
    return (
      <Animated.View style={[styles.container, style, animatedStyles]}>
        <FlatList
          ref={(ref) => { this.flatList = ref; }}
          style={{ paddingBottom: 4 }}
          horizontal
          data={gallery}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </Animated.View>
    );
  }

  _renderItem({ item, index }) {
    const show = this.props.horizontalPointer === index ? {
      borderLeftWidth: 20,
      borderRightWidth: 20,
    } : null;
    return (
      <View style={{ alignItems: 'center' }}>
        <View style={[styles.triangle, show]} />
        <WhiteBox
          index={index}
          content={item}
          hasImageLoad={this.props.hasImageLoad}
          hasMask
          larguraDasCaixas={this.larguraDasCaixas}
          acCurrentBox={this.props.acCurrentBox}
          maskStyle={{ backgroundColor: 'rgba(0, 80, 95, 0.55)' }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  window: state.global.window,
});

export default connect(mapStateToProps, null)(HorizontalGallery);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 6,
    height: 190,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#007ab0',
  },
});