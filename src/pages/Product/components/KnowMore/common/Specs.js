import React from 'react';
import { connect } from 'react-redux';
import { Text, View, StyleSheet } from 'react-native';
import { Font } from '../../../../../assets/fonts/font_names';

class Specs extends React.Component {
  render() {
    const { product } = this.props;
    return (
      <View style={stylesLocal.container}>
        <View style={[stylesLocal.subContainer]}>
          <Text style={stylesLocal.titulo}>SOLA</Text>
          <View style={stylesLocal.descContainer}>
            <Text style={stylesLocal.subTitulo}>{product.sola}</Text>
          </View>

        </View>
        <View style={[stylesLocal.subContainer]}>
          <Text style={stylesLocal.titulo}>PALMILHA</Text>
          <View style={stylesLocal.descContainer}>
            <Text style={stylesLocal.subTitulo}>{product.palmilha}</Text>
          </View>
        </View>
        <View style={[stylesLocal.subContainer]}>
          <Text style={stylesLocal.titulo}>FORRO</Text>
          <View style={stylesLocal.descContainer}>
            <Text style={stylesLocal.subTitulo}>{product.forro}</Text>
          </View>
        </View>
        <View style={[stylesLocal.subContainer]}>
          <Text style={stylesLocal.titulo}>CABEDAL</Text>
          <View style={stylesLocal.descContainer}>
            <Text style={stylesLocal.subTitulo}>{product.cabedal}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, null)(Specs);


const stylesLocal = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 30,
    // backgroundColor: 'red'
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  descContainer: {
    paddingVertical: 15,
    paddingTop: 10,
    // backgroundColor: 'magenta',
  },
  titulo: {
    fontFamily: Font.BSemiBold,
    fontSize: 17,
    color: 'black',
    marginBottom: 15,
  },
  subTitulo: {
    fontFamily: Font.BSemiBold,
    fontSize: 14,
    color: 'black',
  },
  descricao: {
    fontFamily: Font.ALight,
    fontSize: 14,
    color: 'black',
  }
});