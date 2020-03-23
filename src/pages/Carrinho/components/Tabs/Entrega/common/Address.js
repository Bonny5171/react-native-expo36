import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckOption } from '../../../../../Assistant/components';
import global from '../../../../../../assets/styles/global';

const Address = ({ disabled, container, title, address, city, state, action, params, isChosen }) => (
  <TouchableOpacity
    disabled={disabled}
    style={container}
    onPress={() => action(...params)}
  >
    <CheckOption
      txtStyle={styles.check}
      disabled
      radio
      checkbox={isChosen}
      msg={title}
      action={action}
      params={params}
      checkIcStyle={{ fontSize: 22 }}
    />
    <Text style={[global.text, styles.txt]}>{address}</Text>
    <Text style={[global.text, styles.txt]}>{city} - {state}</Text>
  </TouchableOpacity>
);

export default Address;

const styles = StyleSheet.create({
  check: {
    fontSize: 14,
    marginLeft: 13,
    marginTop: 8,
  },
  txt: {
    fontSize: 14,
    marginLeft: 41,
  },
});