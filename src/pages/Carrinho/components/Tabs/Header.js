import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Font } from '../../../../assets/fonts/font_names';

const Header = ({ msg }) => (
  <View style={styles.header}>
    <Text style={styles.h1}>{msg}</Text>
  </View>
);

export default Header;

const styles = StyleSheet.create({
  header: {
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingVertical: 4,
  },
  h1: {
    fontSize: 18,
    color: '#464646',
    fontFamily: Font.ALight
  },
});