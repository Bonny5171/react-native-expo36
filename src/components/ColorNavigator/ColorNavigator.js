import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { func, number } from 'prop-types';
import { ArrowNavigator } from '..';
import { Font } from '../../assets/fonts/font_names';

const ColorNavigator = (props) => {
  const { pointerColor, colorsLength, navigateColor } = props;
  return (
    <ArrowNavigator
      isStatic
      hasNext={pointerColor + 1 < colorsLength}
      hasPrevious={pointerColor - 1 >= 0}
      navigateToNext={() => navigateColor(true)}
      navigateToPrevious={() =>  navigateColor(false)}
      containerStyle={[styles.container, props.containerStyle]}
      iconStyle={styles.icon}
    >
      <Text style={styles.txt}>{pointerColor + 1}/{colorsLength}</Text>
    </ArrowNavigator>
  );
};

export default ColorNavigator;

ColorNavigator.propTypes = {
  pointerColor: number,
  colorsLength: number.isRequired,
  navigateColor: func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    height: 28,
  },
  icon: {
    fontSize: 15
  },
  txt: {
    fontFamily: Font.ALight,
    fontSize: 14,
  },
  middleComponent: {
    height: 30,
    width: 30,
    marginHorizontal: 4
  }
});