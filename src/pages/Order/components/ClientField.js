import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';

const ClientField = ({
  msg,
  breakline,
  label,
  container,
  styleText,
  maxNameLength,
  shouldntUpper,
}) => {
  const stringMsg = msg instanceof String ? msg : `${msg}`;
  let cutValue = '';
  let value = '';
  if (breakline) {
    cutValue = stringMsg.substr(0, maxNameLength === undefined ? 24 : maxNameLength);
    value = `${cutValue}${stringMsg.length > cutValue.length && breakline ? '...' : ''}`;
  } else {
    value = stringMsg;
  }

  value = shouldntUpper ? value : value.toUpperCase();

  return (
    <View style={container}>
      <Text style={styles.lblClient}>{label}</Text>
      {/* Passar um maxWidth para o tamanho máximo do horizontal do texto */}
      <Text style={[styles.txtClient, styleText]}>
        {value}
      </Text>
    </View>
  );
};

export default ClientField;

const styles = StyleSheet.create({
  lblClient: {
    fontFamily: Font.BSemiBold,
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.9)',
    letterSpacing: 0.7,
  },
  txtClient: {
    fontFamily: Font.ALight,
    fontSize: 14,
    color: 'black',
    marginTop: 2,
    letterSpacing: 0.7,
  },
  vwLabel: {
    flex: 1,
    height: 10,
  },
  vwText: {
    maxWidth: 125,
    minHeight: 40,
    maxHeight: 65,
    backgroundColor: 'yellow'
  }
});