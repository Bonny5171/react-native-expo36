import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconActionless } from '..';
import { Font } from '../../assets/fonts/font_names';
import global from '../../assets/styles/global';
import { obterLarguraDasCaixas, } from '../../services/Dimensions';

const OrderBox = ({ order, props }) => (
  <View style={[styles.vwLastOrder, { width: obterLarguraDasCaixas(props) }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[global.text, { color: '#DDD', fontSize: 35 }]}>{order.day}</Text>
      <View style={{ marginLeft: 4, justifyContent: 'center' }}>
        <Text style={[global.text, { marginBottom: 2, marginTop: 2, }]}>{order.month}</Text>
        <Text style={[global.text, { marginTop: -3, fontSize: 11 }]}>{order.year}</Text>
      </View>
    </View>
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', padding: 3, width: '100%' }}>
        <Text style={styles.txtOrderCode}>{order.code}</Text>
      </View>
      <View style={styles.body}>
        <IconInfo
          icon="m"
          text={`R$${order.total}k`}
        />
        <IconInfo
          icon="e"
          text={order.date}
        />
      </View>
    </View>
  </View>
);

export default OrderBox;

const styles = StyleSheet.create({
  vwLastOrder: {
    justifyContent: 'center',
    height: 127,
    backgroundColor: '#FFF',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    shadowColor: 'rgba(0,0, 0, 0.3)',
    elevation: 2,
    padding: 9,
    marginHorizontal: 10,
  },
  txtOrderCode: {
    fontFamily: Font.BSemiBold,
    letterSpacing: 0.6,
    color: '#6C9ECD',
    fontSize: 17,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 4,
  }
});

const IconInfo = ({ text, icon }) => (
  <View style={{ alignItems: 'center' }}>
    <IconActionless msg={icon} style={{ fontSize: 22, color: '#999' }} />
    <Text style={{ fontSize: 13, color: '#666' }} >{text}</Text>
  </View>
);