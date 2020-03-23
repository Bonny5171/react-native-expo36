import React from 'react';
import { Text } from 'react-native';
import { object, number, array, string, oneOfType } from 'prop-types';

import { Font } from '../../assets/fonts/font_names';

const IconActionless = props => <Text style={[props.style, (props.noIcon)? null : { fontFamily: Font.C }]}>{props.msg}</Text>;

export default IconActionless;

IconActionless.propTypes = {
  style: oneOfType([object, number, array]),
  msg: string
};
