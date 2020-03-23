import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { func, number, object, array, string, oneOfType } from 'prop-types';
import { Font } from '../../assets/fonts/font_names';

const Button = ({
  actions,
  action,
  tchbStyle,
  txtStyle,
  msg,
  disabled,
}) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={() => {
      if (actions) {
        actions.forEach(({ func, params }) => {
          func(...params);
        });
      } else {
        action();
      }
    }}
    style={[styles.tchb, tchbStyle, disabled && { opacity: 0.7 }]}
  >
    <Text style={[styles.txt, txtStyle]}>{msg}</Text>
  </TouchableOpacity>
);

export default Button;

const styles = StyleSheet.create({
  tchb: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    // width: 120,
    paddingHorizontal: 20,
    borderRadius: 45,
    backgroundColor: '#0085B2',
    elevation: 2,
    shadowOffset: { height: 1, width: 1 },
    shadowRadius: 8,
    shadowColor: 'black',
    shadowOpacity: 0.3
  },
  txt: {
    fontSize: 16,
    bottom: 1,
    color: 'white',
    fontFamily: Font.ASemiBold,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

Button.propTypes = {
  action: func,
  // Texto do botão
  msg: string.isRequired,
  txtStyle: oneOfType([object, array, number]),
  tchbStyle: oneOfType([object, array, number]),
};