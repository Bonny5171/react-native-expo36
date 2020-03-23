import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import global from '../../assets/styles/global';
import { Font } from '../../assets/fonts/font_names';
import ImageLoad from '../ImageLoad';

export default ({ content, hasImageLoad, acCurrentBox, index, larguraDasCaixas, hasMask, maskStyle, customContent, hasCustomContent, txtView, txtStyle }) => {
  const img = hasImageLoad ?
  (
    <ImageLoad
      noSizeType
      resizeMode="cover"
      filename={content.uri}
      containerStyle={{ height: '100%', width: '100%' }}
    />
  )
  :
  (
    <Image
      style={{ height: '100%', width: '100%' }}
      source={content.uri}
      resizeMode="cover"
    />
  );

  const childContent = hasCustomContent ? customContent(content) : img;
  return (
    <TouchableOpacity
      onPress={() => acCurrentBox(index, null, true)}
      style={[global.vwWhiteBox, { paddingTop: 0, paddingBottom: 0, width: larguraDasCaixas }]}
    >
      {childContent}
      {hasMask &&
        <View
          style={[StyleSheet.absoluteFill, maskStyle]}
        />
      }
      { !hasCustomContent &&
        <View style={[styles.txtView, txtView]}>
          <Text style={[global.p1, styles.text, txtStyle]}>{content.msg.substr(0, 62)}{content.msg.length >= 62 ? '...' : ''}</Text>
        </View>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontFamily: Font.ASemiBold,
    color: 'white',
    textAlign: 'left',
    marginLeft: 8,
  },
  txtView: {
    position: 'absolute',
    justifyContent: 'center',
    top: 115,
    height: 36,
    width: '100%',
  }
});