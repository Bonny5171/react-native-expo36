import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { IconActionless } from '../../../components';
import global from '../../../assets/styles/global';

const Header = () => {
  return (
    <View style={styles.firstRow}>
      <View style={styles.flex2Center}>
        <Text style={[global.titlePagina, { marginTop: 0 }]}>SOBRE O APLICATIVO </Text>
      </View>
      {/* <View style={styles.scndRow}>
        <IconActionless style={[global.icon, { marginRight: 10 }]} msg="c" />
        <IconActionless style={[global.icon, { marginRight: 32 }]} msg="d" />
      </View> */}
    </View>
  );
};
export default Header;

const styles = StyleSheet.create({
firstRow: {
  flexDirection: 'row',
  paddingTop: 20,

},
scndRow: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  flexGrow:1,
},
flex2Center: {
  justifyContent: 'center'
}
});

