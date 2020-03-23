import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { SimpleButton, DisableComponent, ImageLoad, } from '../../../components';

class Promotional extends React.Component {
  maxCaractere(text) {
    const maxCaracteres = 215;
    if (text && text.length > maxCaracteres) {
      return text.substr(0, maxCaracteres);
    }
    return text;
  }

  render() {
    // console.log('4 - render > Promotional', this.props.product.currentGallery);
    return (
      <View style={styles.container}>

        {/* TITULO */}
        <View style={styles.containerTitulo}>
          <Text style={styles.titulo}>COMBO PROMOCIONAL</Text>
        </View>

        <View style={styles.subContainer}>

          {/* DIREITA */}
          <View style={styles.containerLeft}>
            <Box filename="218202003200" name="DISNEY CARROS TENIS INF" />
            <Text style={styles.plus}>+</Text>
            <Box filename="220012035400" name="MINNIE GOLD SANDALIA INF" />
            <Text style={styles.equal}>=</Text>
            <Text style={[styles.value, { fontFamily: Font.C }]}>C</Text>
            {/* <Text style={styles.porcent}>%</Text> */}
          </View>

          {/* ESQUEDA */}
          <View style={styles.containerRigth}>
            <Text style={styles.textRigth}>
              {/* Na compra de <Text style={styles.bold}>Grenda Aruba</Text> e <Text style={styles.bold}>Grendha Cancun</Text>, com pedido mí­nimo de 100 pares, ganhe <Text style={styles.bold}>desconto</Text>! */}
              Na compra de dois produtos da linha DISNEY, com pedido mínimo de 10 pares, ganhe descontos do combo.
            </Text>
            <View style={styles.more}>
              <DisableComponent
                isDisabled={this.props.checkboxes[1] || this.props.isCompleteCat}
              >
                <SimpleButton
                  msg="EU QUERO"
                  action={() => { console.log('EU QUERO'); }}
                />
              </DisableComponent>
            </View>
          </View>

        </View>
      </View>
    );
  }
}

const Box = ({ name, filename }) => (
  <View>
    <ImageLoad
      filename={filename}
      sizeType="m"
      containerStyle={styles.imgBox}
    />
    <Text style={styles.TextBox}>{name}</Text>
  </View>
);

export default Promotional;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 40,
    maxWidth: 1200,
  },
  containerTitulo: {
    paddingTop: 40,
  },
  titulo: {
    fontFamily: Font.BLight,
    fontSize: 22,
    color: 'black',
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  containerLeft: {
    width: '70%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerRigth: {
    width: '30%',
    flex: 1,
    maxHeight: 183,
    justifyContent: 'center',
  },
  plus: {
    fontFamily: Font.AThin,
    fontSize: 80,
    opacity: 0.5,
  },
  equal: {
    fontFamily: Font.AThin,
    fontSize: 60,
    opacity: 0.5,
    paddingHorizontal: 15
  },
  value: {
    fontFamily: Font.BLight,
    fontSize: 48,
  },
  porcent: {
    fontFamily: Font.BLight,
    fontSize: 36,
  },
  textRigth: {
    fontFamily: Font.ARegular,
    fontSize: 14,
    marginBottom: 20,
  },
  more: {
    alignItems: 'flex-end'
  },
  imgBox: {
    width: 130,
    height: 130,
    alignSelf: 'center'
  },
  TextBox: {
    fontFamily: Font.ASemiBold,
    fontSize: 12,
  },
  bold: {
    fontFamily: Font.ASemiBold,
    fontSize: 14,
  },
});
