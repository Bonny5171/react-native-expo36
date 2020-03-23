import React from 'react';
import { View, StyleSheet } from 'react-native';
import { bool } from 'prop-types';
import global from '../../assets/styles/global';
import { Fade } from '..';


const PopUp = (props) => (
  <Fade
    visible={props.isVisible}
    style={[styles.container, props.containerStyle]}
  >
    {/* <View style={[global.triangleUp, styles.triangle]} /> */}
    <View style={[global.vwPopUp, global.shadow]}>
      {props.children}
    </View>
  </Fade>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  triangle: {
    alignSelf: 'flex-end',
    marginRight: 7,
  },
});

export default PopUp;

PopUp.propTypes = {
  isVisible: bool.isRequired,
};