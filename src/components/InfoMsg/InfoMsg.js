import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { string, array, oneOfType } from 'prop-types';
import { IconActionless } from '..';
import global from '../../assets/styles/global';

const InfoMsg = ({ firstMsgBold, firstMsg, sndMsg, icon, containerStyle, fstStyle, sndMsgStyle, iconStyle }) => {
  return (
    <View style={[global.containerCenter, { height: '100%' }, containerStyle]}>
      <IconActionless msg={icon} style={[styles.icon, iconStyle]} />
      {firstMsgBold ? <BoldMessage firstMsg={firstMsg} /> : <Text style={[global.h4, styles.lineHeight, fstStyle]}>{firstMsg}</Text>}
      {/* Segunda linha */}
      {sndMsg && <Text style={[global.h4, styles.txtSecondLine, styles.lineHeight, sndMsgStyle]}>{sndMsg}</Text>}
    </View>
  );
};

export default InfoMsg;

InfoMsg.propTypes = {
  // Passar um vetor contento [mensagem antes do negrito, mensagem em negrito, mensagem depois do negrito]
  firstMsg: oneOfType([array, string]),
  icon: string.isRequired,
  sndMsg: string,
};

InfoMsg.defaultProps = {
  firstMsg: ['', '', ''],
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 50,
    color: 'rgba(0, 0, 0, 0.3)',
    marginBottom: 5
  },
  txtSecondLine: {
    fontSize: 14
  },
  lineHeight: {
    lineHeight: 20
  }
});


const BoldMessage = ({ firstMsg }) => (
  <Text style={[global.h4, styles.lineHeight]}>
    {/* Mensagem antes do negrito */}
    {firstMsg[0]}
    <Text style={[global.h4, styles.lineHeight, global.bold]}>
      {/* Mensagem em negrito */}
      {` ${firstMsg[1]} `}
    </Text>
    {/* Mensagem depois do negrito */}
    {firstMsg[2]}
  </Text>
);