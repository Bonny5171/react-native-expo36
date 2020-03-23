import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { ImageLoad } from '../../../components';

class ProductRanking extends React.Component {
  render() {
    const { colors } = this.props.currentProduct;
    // console.log('5 - render > ProductRanking', this.props.product.currentGallery);
    return (
      <View style={styles.container}>
        {/* DIREITA */}
        <View style={styles.containerLeft}>
          <Text style={styles.title}>RANKING DESTE PRODUTO</Text>
          {/* <Text style={styles.subTitle}>Lorem ipsum dolor sit amet consectetu adipiscing elit, sed do iumod tempor.</Text> */}
        </View>

        {/* ESQUEDA */}
        <View style={styles.containerRigth}>
          {/* CAIXA 1 */}
          <Box
            name="BRASIL"
            backgroundImg="mapa-brasil"
            ranking="3"
            textRanking="MAIS VENDIDO"
            textPercent="COR MAIS VENDIDA"
            imagem={colors.length > 0 && colors[0].uri}
          />

          {/* CAIXA 2 */}
          <Box
            name="SUDESTE"
            backgroundImg="mapa-sudeste"
            ranking="8"
            textRanking="MAIS VENDIDO"
            textPercent="COR MAIS VENDIDA"
            imagem={colors.length > 1 ? colors[1].uri : colors[0].uri}
          />
        </View>
      </View>
    );
  }
}

const Box = ({
  backgroundImg, ranking, textRanking, textPercent, name, imagem
}) => (
  <View style={styles.boxOriginal}>
      <Text style={styles.boxTitle}>{name}</Text>
      <ImageLoad
        noSizeType
        filename={backgroundImg}
        containerStyle={styles.boxImg}
      />
      <View style={styles.boxInfoMaisVendido}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.boxTitleMaisVendido}>{ranking}</Text>
          <Text style={styles.boxGrauMaisVendido}>°</Text>
        </View>
        <Text style={styles.boxRankMaisVendido}>{textRanking}</Text>
        <Text style={styles.boxRankClientes}><Text style={{ fontFamily: Font.AMedium, fontSize: 14, }}>45%</Text> dos clientes compraram</Text>
      </View>
      <View style={styles.boxInfoCorMaisVendida}>
        <Text style={styles.boxInfoCorPorcent}>{textPercent}</Text>
        <ImageLoad
          containerStyle={styles.boxCorImg}
          filename={imagem}
        />
      </View>
    </View>
  );

export default ProductRanking;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: 30,
    maxWidth: 1200,
    marginTop: 70,
  },
  containerLeft: {
    width: '40%',
    justifyContent: 'space-between',

  },
  containerRigth: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 5,
  },
  title: {
    fontFamily: Font.BLight,
    fontSize: 22,
    color: 'black',
  },
  subTitle: {
    fontFamily: Font.ARegular,
    fontSize: 14,
    marginBottom: 20,
    paddingRight: 50,
  },
  boxOriginal: {
    width: 250,
    maxWidth: '40%',
    position: 'relative',
  },
  boxTitle: {
    fontSize: 12,
    fontFamily: Font.ABold,
  },
  boxImg: {
    position: 'absolute',
    opacity: 0.3,
    width: '70%',
    height: '70%',
    top: 0,
    right: 0,
  },
  boxCorImg: {
    width: 130,
    height: 70,
  },
  boxInfoMaisVendido: {
    flexDirection: 'row',
  },
  boxTitleMaisVendido: {
    fontFamily: Font.BLight,
    fontSize: 48,
  },
  boxInfoCorMaisVendida: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boxGrauMaisVendido: {
    fontFamily: Font.BLight,
    fontSize: 36,
    transform: [{ translateY: 4 }]
  },
  boxRankMaisVendido: {
    fontFamily: Font.ARegular,
    fontSize: 12,
    paddingTop: 22,
  },
  boxRankClientes: {
    fontFamily: Font.ARegular,
    fontSize: 12,
    paddingTop: 5,
    marginLeft: 40,
    maxWidth: 70
  },
  boxInfoCorPorcent: {
    fontFamily: Font.ARegular,
    fontSize: 12,
  }
});