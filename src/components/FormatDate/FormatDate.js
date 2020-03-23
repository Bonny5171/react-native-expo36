import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { string } from 'prop-types';
import { Font } from '../../assets/fonts/font_names';

const FormatDate = ({ date, txtStyle }) => {
  let msg = date;
  if (date !== '[NULO]') {
    const monthPointer = Number(date.substr(5, 2)) - 1;
    const year = date.substr(2, 2);
    msg = `${months[monthPointer]}/${year}`;
  }
  return <Text style={[styles.txt, txtStyle]}>{msg}</Text>;
};

export default FormatDate;

FormatDate.defaultProps = {
  date: string.isRequired
};

const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAIO', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

const styles = StyleSheet.create({
  txt: {
    fontFamily: Font.ARegular,
    fontSize: 20
  }
});