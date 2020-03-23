import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View, Platform } from 'react-native';
import { IconActionless as IA } from '..';
import { Font } from '../../assets/fonts/font_names';
import AnimatedCircle from './AnimatedCircle';
import global from '../../assets/styles/global';

class SwitchButton extends React.Component {
  constructor(props) {
    super(props);
    this.movingRange = {
      from: props.circleFrom ? props.circleFrom : Platform.OS === 'web' ? -14 : 4,
      to: props.circleTo ? props.circleTo : Platform.OS === 'web' ? 14 : 32,
    };
    this.state = {
      circlePosition: new Animated.Value(props.active ? this.movingRange.to : this.movingRange.from)
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.active !== this.props.active) {
      this.animate();
    }
  }
  render() {
    const { isDisabled, actions, active, container, noLabel, circleStyle } = this.props;
    return (
      <TouchableOpacity
        disabled={isDisabled}
        activeOpacity={1}
        style={[styles.container, container]}
        onPress={() => {
          if (this.props.action) {
            this.props.action();
          }
          if (actions) {
            actions.forEach(({ func, params }) => {
              func(...params);
            });
          }
        }}
      >
        {
          noLabel ? null :
            (
              <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <Text style={[styles.txt, !active && !isDisabled ? global.activeColor : { color: '#999' }, this.props.txtStyle]}>N</Text>
                <Text style={[styles.txt, active && !isDisabled ? global.activeColor : { color: '#999' }, this.props.txtStyle]}>S</Text>
              </View>
            )
        }
        <AnimatedCircle isDisabled={isDisabled} active={active} circlePosition={this.state.circlePosition} circleStyle={circleStyle} />
      </TouchableOpacity>
    );
  }

  animate() {
    Animated.timing(this.state.circlePosition, {
      duration: 500,
      toValue: this.props.active ? this.movingRange.to : this.movingRange.from
    }).start();
  }
}

export default SwitchButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'rgb(244, 244, 244)',
    opacity: 0.95,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgb(120, 120, 120)',
    width: 77,
    height: 40,
    marginLeft: 30
  },
  txt: {
    fontSize: 16,
    fontFamily: Font.AMedium
  },
});