import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from '..';
import { Font } from '../../assets/fonts/font_names';

const NavArrow = (props) => {
  const {
    right, params,
    txtStyle, tchbStyle,
    acNavigate, disabled,
  } = props;
  // Definição da navegação ser para direita ou esquerda (default para a esquerda)
  // Styles de acordo com a orientação
  let styleTchb = styles.vwLeftArrow;
  let styleTxt = styles.icLeftArrow;

  if (right) {
    styleTchb = [styles.vwLeftArrow, styles.vwRightArrow];
    styleTxt = [styleTxt, { transform: [], marginRight: 0, marginLeft: 4 }];
  }
  styleTchb = disabled ? [styleTchb, { backgroundColor: disabled ? 'rgb(225, 225, 225)' : '#FFF', opacity: 0.3 }] : styleTchb;
  const paramsVerified = params !== undefined ? params : [];
  return (
    <Button
      disabled={disabled}
      tchbStyle={[styleTchb, tchbStyle]}
      txtStyle={[styleTxt, txtStyle]}
      txtMsg="v"
      actions={[
        {
          func: acNavigate,
          params: paramsVerified
        }
      ]}
    />
  );
};

export default NavArrow;

const styles = StyleSheet.create({
  vwLeftArrow: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 60,
    width: 50,
    backgroundColor: '#FFF',
    borderBottomRightRadius: 30,
    borderTopRightRadius: 30,
    elevation: 3,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { height: 1, width: 0 },
    left: 0,
  },
  icLeftArrow: {
    fontFamily: Font.C,
    fontSize: 28,
    marginRight: 4,
    color: 'black',
    transform: [{ rotate: '180deg' }]
  },
  vwRightArrow: {
    left: null,
    right: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 30,
    borderTopLeftRadius: 30
  },
});