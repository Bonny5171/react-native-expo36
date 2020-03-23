import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { bool, string, func } from 'prop-types';
import { SortArrows } from '..';
import { Font } from '../../assets/fonts/font_names';


const SortBy = (props) => (
  <TouchableOpacity
    onPress={props.toggle}
    style={[styles.container, props.containerStyle]}
  >
    <Text style={[styles.txt, props.txtStyle, { color: props.isActive ? 'black' : '#999' }]}>{props.type.toUpperCase()}</Text>
    {
      props.hasArrows &&
      (
        <SortArrows
          isUp={props.isUp}
          isActive={props.isActive}
        />
      )
    }
  </TouchableOpacity>
);

export default SortBy;

SortBy.propTypes = {
  isUp: bool.isRequired,
  isActive: bool.isRequired,
  type: string.isRequired,
  toggle: func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    fontFamily: Font.AMedium,
    fontSize: 12,
  },
});