import React from 'react';
import { Text, StyleSheet, View, Platform } from 'react-native';
import { TableList } from '../../../../../../components';
import { Font } from '../../../../../../assets/fonts/font_names';
import global from '../../../../../../assets/styles/global';

const Filiais = ({ stores }) => {
  return (
    <TableList
      maxHeight={Platform.OS === 'web' ? 290 : 352}
      data={stores}
      header={HeaderBranches}
      row={RowBranches}
      headerHeight={40}
      noBackground
      noSeparator
    />
  );
};

export default Filiais;

const HeaderBranches = (props) => (
  <View style={{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center' }}>
    <Text style={[global.h7SemiBold, styles.code, styles.column]}>CÓDIGO</Text>
    <Text style={[global.h7SemiBold, styles.reason, styles.column]}>RAZÃO SOCIAL</Text>
    <Text style={[global.h7SemiBold, styles.address, styles.column]}>ENDEREÇO</Text>
  </View>
);

const RowBranches = (item, index) => {
  if (item.headquarter) return null;
  return (
    <View style={{ flexDirection: 'row', width: '100%', paddingBottom: 10 }}>
      <Text style={[global.columnValue, styles.code, styles.txt]}>{item.code}</Text>
      <Text style={[global.columnValue, styles.reason, styles.txt]}>{item.reason}</Text>
      <Text style={[global.columnValue, styles.address, styles.txt]}>{item.address}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    fontSize: 12,
    color: 'black',
  },
  code: {
    width: 80,
    marginLeft: 4
  },
  reason: {
    width: 150,
  },
  address: {
    flex: 1,
  },
  txt: {
    fontSize: 14,
  },
});