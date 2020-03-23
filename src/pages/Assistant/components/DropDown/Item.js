import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import global from '../../../../assets/styles/global';
const Item = ({ item, onRowClick, lastItem }) => (
  <TouchableOpacity
    style={[styles.row, { borderBottomWidth: lastItem ? 0 : 0.75 }]}
    onPress={() => onRowClick(item)}
  >
    <Text style={[global.text, styles.txt, { width: 50 }]}>
      {item.code}
    </Text>
    <Text style={[global.text, styles.txt, { width: 212, marginLeft: 15 }]}>
      {item.fantasyName.substr(0, 22).toUpperCase()}
      {item.fantasyName.length > 28 ? '...' : '' }
    </Text>
    <Text style={[global.text, styles.txt, { marginLeft: 15 }]}>
      {item.billing.address.substr(0, 17).toUpperCase()}
      {item.billing.length > 20 ? '...' : '' }
    </Text>
  </TouchableOpacity>
);

//  code name cnpj
//  endereço setor de atividade
export default Item;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.75,
    borderBottomColor: '#CCC',
    padding: 3,
    paddingLeft: 15
  },
  txt: {
    height: 25,
    justifyContent: 'center',
    fontSize: 14,
  },
});