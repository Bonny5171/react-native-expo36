import React from 'react';
import { View, Text } from 'react-native';
import { IconActionless as IA } from '../../../components';
import { Font } from '../../../assets/fonts/font_names';

const BreadCrumb = (props) => {
  const arrow = (<IA style={{ fontSize: 10 }} msg="v" />);
  const { categoria, subCategoria } = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 100,
        paddingBottom: 20,
        paddingLeft: 30,
      }}
    >
      <Text style={{ color: '#333', fontFamily: Font.ALight }}>CATALOGO {arrow} {categoria.toUpperCase()} {arrow} {subCategoria.toUpperCase()}</Text>
    </View>
  );
};

export default BreadCrumb;