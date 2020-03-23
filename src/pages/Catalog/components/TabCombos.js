import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { ImageLoad } from '../../../components';

const TabCombos = () => {
  const percent = 5;

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.titleBox}>COMBO PROMOCIONAL</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ImageLoad
          filename="218202003200"
          sizeType="m"
          containerStyle={styles.imgBox}
        />
        <Text style={{ fontSize: 32 }}> + </Text>
        <ImageLoad
          filename="220012035400"
          sizeType="m"
          containerStyle={styles.imgBox}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 32 }}> = </Text><Text style={{ fontSize: 48, fontFamily: Font.C }}>C</Text>
          {/* <Text style={{fontSize:36, fontFamily: Font.BLight}}>%</Text> */}
        </View>
      </View>
      <Text style={{ fontFamily: Font.ARegular, paddingTop: 5, }}>
        {/* Na compra de Grendha Aruba e  Grendha Cancun, com pedido mínimo de 10 pares, <Text style={{fontFamily:Font.ABold}}>ganhe desconto</Text>. */}
        Na compra de dois produtos da linha DISNEY, com pedido mínimo de 10 pares, ganhe descontos do combo.
      </Text>
    </View>
  );
};

export default TabCombos;

const styles = StyleSheet.create({
  txt: {
    fontFamily: Font.ARegular,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  titleBox: {
    fontFamily: Font.ALight,
    fontSize: 18,
    color: 'rgba(20, 20, 20, 0.7)',
    paddingTop: 5,
  },
  imgBox: {
    height: 130,
    width: 130,
  },
  TextBox: {
    fontFamily: Font.ASemiBold,
    fontSize: 12,
  },
});