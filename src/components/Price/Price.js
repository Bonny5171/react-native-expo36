import React from 'react';
import { Platform, Text } from 'react-native';
import { locales } from '../../../config';

if (Platform.OS === 'android') { // only android needs polyfill
  require('intl'); // import intl object
  require('intl/locale-data/jsonp/pt-BR'); // load the required locale details
}

export default ({
  price,
  style,
}) => {
  const cfg = { maximumFractionDigits: 2, minimumFractionDigits: 2 };
  const priceFormated = new Intl.NumberFormat(locales, cfg).format(price);
  return (
    <Text style={style}>
      {priceFormated}
    </Text>
  );
};
