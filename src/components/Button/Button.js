import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = ({
  action, tchbStyle, txtStyle, txtMsg, disabled,
}) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={() => action != null ? action() : null}
    style={tchbStyle}
  >
    <Text style={txtStyle}>{txtMsg}</Text>
  </TouchableOpacity>
);

export default Button;
