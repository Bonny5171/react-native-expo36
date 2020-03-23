import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { bool, func, string, array, object, number, oneOfType } from 'prop-types';
import { CheckBox } from '../../../components';
import global from '../../../assets/styles/global';
import { Font } from '../../../assets/fonts/font_names';

class CheckOption extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.checkbox !== nextProps.checkbox) {
      return true;
    }
    return false;
  }

  render() {
    const {
      msg,
      action,
      params,
      radio,
      checkbox,
      reverse,
      container,
      txtStyle,
      checkStyle,
      checkIcStyle,
      disabled,
    } = this.props;
    if (reverse) {
      return (
        <TouchableOpacity
          disabled={disabled}
          style={[styles.container, container]}
          onPress={() => {
            if (params !== undefined) {
              action(...params);
            } else {
              action();
            }
          }}
        >
          <Text
            style={[[global.text, styles.txt], txtStyle]}
          >
            {msg}
          </Text>
          <CheckBox
            style={checkStyle}
            icStyle={checkIcStyle}
            disabled={disabled}
            radio={radio}
            isChosen={checkbox}
            action={() => {
              if (params !== undefined) {
                action(...params);
              } else {
                action();
              }
            }}
          />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        disabled={disabled}
        style={[styles.container, container]}
        onPress={this.handleClick}
      >
        <CheckBox
          style={checkStyle}
          icStyle={checkIcStyle}
          disabled={disabled}
          radio={radio}
          isChosen={checkbox}
          action={this.handleClick}
        />
        <Text
          style={[[global.text, styles.txt], txtStyle]}
        >
          {msg}
        </Text>
      </TouchableOpacity>
    );
  }

  handleClick() {
    const { params, action } = this.props;
    if (params !== undefined) {
      action(...params);
    } else {
      action();
    }
  }
}

export default CheckOption;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  vwTxt: {
    flex: 1,
    justifyContent: 'center'
  },
  txt: {
    fontSize: 16,
    fontFamily: Font.ARegular,
    alignSelf: 'center',
  }
});

CheckOption.propTypes = {
  checkbox: bool,
  msg: string,
  action: func.isRequired,
  container: oneOfType([array, object, number]),
  txtStyle: oneOfType([array, object, number]),
};

