import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { SimpleButton, ImageLoad } from '../../../components';


const TabRanking = ({ currentProduct }) => (
  <View style={{ flex: 1 }}>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
      {/* Ranking Nacional */}
      <Box
        name="BRASIL"
        backgroundImg="mapa-brasil.png"
        ranking="3"
        textRanking="MAIS VENDIDO"
        textPercent="COR MAIS VENDIDA"
        imagem={currentProduct.colors.length > 0 && currentProduct.colors[0].uri}
      />

      {/* CAIXA 2 */}
      <Box
        name="SUDESTE"
        backgroundImg="mapa-sudeste.png"
        ranking="8"
        textRanking="MAIS VENDIDO"
        textPercent="COR MAIS VENDIDA"
        imagem={currentProduct.colors.length > 1 ? currentProduct.colors[1].uri : currentProduct.colors[0].uri}
      />
    </View>
  </View>
);

export default TabRanking;

const styles = StyleSheet.create({
  titleBox: {
    fontSize: 18,
    color: 'rgba(20, 20, 20, 0.7)'
  },
  boxOriginal: {
    width: '45%',
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
    right: 30,
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
    marginLeft: 25,
    maxWidth: 70
  },
  boxInfoCorPorcent: {
    fontFamily: Font.ARegular,
    fontSize: 12,
  }
});

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