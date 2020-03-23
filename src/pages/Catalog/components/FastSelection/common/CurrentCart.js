import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconActionless, Fade, TextLimit } from '../../../../../components';
import { Font } from '../../../../../assets/fonts/font_names';
import { agrupaProdutosNoCarrinho } from '../../../../../utils/CommonFns';
import global from '../../../../../assets/styles/global';

const CurrentCart = props => {
  if (!props.currCart) return null;
  const produtos = agrupaProdutosNoCarrinho(props.currCart.products);
  return (
    <Fade
      style={[props.containerStyle, { padding: 3 }]}
      visible={props.visible}
    >
      <TouchableOpacity
        style={[styles.tchb, props.tchbStyle, global.shadow]}
        onPress={() => props.acPopSelectCart()}
        disabled={props.isDisabled}
      >
        <IconActionless msg="p" style={styles.icCart} />
        {
          props.shouldLimitText !== undefined ?
            <TextLimit
              maxLength={props.shouldLimitText}
              style={styles.txt}
              msg={props.currCart.name}
            />
            :
            <Text style={styles.txt}>{props.currCart.name}</Text>
        }
        <Text style={[styles.txt, { marginRight: 20 }]}> ({produtos.length})</Text>
        <Text style={[styles.dots, props.isDisabled && styles.disabledDot]}>...</Text>
      </TouchableOpacity>
    </Fade>
  );
};

export default CurrentCart;

const styles = StyleSheet.create({
  tchb: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 33,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.86)',
    padding: 5,
    paddingHorizontal: 8,
  },
  icCart: {
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.4)',
    marginRight: 4,
  },
  txt: {
    fontFamily: Font.AMedium,
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  dots: {
    fontSize: 28,
    color: '#0085B2',
    marginTop: -14,
    textShadowColor: 'rgba(0, 122, 176, 0.85)',
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: 3,
  },
  disabledDot: {
    textShadowRadius: 0,
    color: 'rgb(200, 200, 200)'
  }
});