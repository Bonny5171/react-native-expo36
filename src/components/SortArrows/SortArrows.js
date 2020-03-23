import React from 'react';
import { View, StyleSheet } from 'react-native';
import { bool } from 'prop-types';
import global from '../../assets/styles/global';

const SortArrows = (props) => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <Triangle
        orientation="Up"
        containerStyle={[{ borderBottomColor: props.isUp && props.isActive ? 'black' : '#999' }, styles.vwTriangle]}
      />
      <Triangle
        orientation="Down"
        containerStyle={[{ borderBottomColor: !props.isUp && props.isActive ? 'black' : '#999' }, styles.vwTriangle, styles.vwTriangleDown]}
      />
    </View>
  );
};

export default SortArrows;

SortArrows.propTypes = {
  isUp: bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    marginLeft: 3,
  },
  vwTriangleDown: {
    marginTop: 2,
  },
  vwTriangle: {
    borderRightWidth: 4.5,
    borderBottomWidth: 7,
    borderLeftWidth: 4.5,
  }
});

const Triangle = (props) => (
  <View
    style={[global[`triangle${props.orientation}`], props.containerStyle]}
  />
);