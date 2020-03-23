import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { string, bool, func } from 'prop-types';
import { Font } from '../../assets/fonts/font_names';
import IconActionless from '../IconActionless';
import { Fade } from '..';
import global from '../../assets/styles/global';

const GSubmenu = (props) => {
  return (
    <Fade
      visible={props.isVisible}
      style={[props.containerStyle, { padding: 2 }]}
    >
      <View style={[styles.container, global.shadow]}>
        {props.children}
      </View>
    </Fade>
  );
};

export default GSubmenu;

const styles = StyleSheet.create({
  container: {
    minWidth: 240,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },
});

export const GSItem = ({ msg, icon, action, disabled }) => (
  <TouchableOpacity
    onPress={action}
    disabled={disabled}
    style={gItem.container}
  >
    <IconActionless
      msg={icon}
      style={gItem.icon}
    />
    <Text style={gItem.txt}>{msg}</Text>
  </TouchableOpacity>
);

GSItem.propTypes = {
  action: func.isRequired,
  disabled: bool,
  icon: string,
  msg: string
};
const gItem = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    color: 'black',
    opacity: 0.3,
    fontSize: 23,
  },
  txt: {
    fontFamily: Font.ALight,
    color: 'black',
    marginLeft: 15
  }
});