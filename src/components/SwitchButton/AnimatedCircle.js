import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { IconActionless as IA } from '..';
import { Font } from '../../assets/fonts/font_names';
import global from '../../assets/styles/global';
class AnimatedCircle extends React.Component {
  render() {
    return (
      <Animated.View style={{ position: 'absolute', marginLeft: this.props.circlePosition }}>
        <IA
          msg="i"
          style={[styles.icon, global.activeBtnShadow, this.props.circleStyle, this.props.isDisabled && { color: '#CCC', textShadowColor: '#CCC' }]}
        />
      </Animated.View>
    );
  }
}
export default AnimatedCircle;

const styles = StyleSheet.create({
  icon: {
    fontFamily: Font.C,
    fontSize: 32,
  },
  activeIcon: {
    color: '#0085B2'
  },
  inactiveIcon: {
    color: '#999',
  }
});