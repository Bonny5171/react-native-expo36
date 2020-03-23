import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { func, object, number, array, string, oneOfType } from 'prop-types';
import { Font } from '../../assets/fonts/font_names';
import global from '../../assets/styles/global';
import IconActionless from '../IconActionless';
import { InputText } from '..';

class InputLabel extends React.Component {
  render() {
    const {
      container,
      label,
      inputStyle,
      readOnly,
      value,
      editable
    } = this.props;

    return (
      <View style={container}>
        <Text style={[global.h7SemiBold, styles.txtLabel, !editable && styles.disabled]}>{label}</Text>
        {
          readOnly ?
            <Text style={inputStyle}>{value}</Text>
            :
            <InputText {...this.props} inputStyle={[{ marginTop: 4 }, inputStyle]} />
        }
      </View>
    );
  }
}

export default InputLabel;

const styles = StyleSheet.create({
  txtInput: {
    flex: 1,
    fontSize: 18,
    width: '100%',
    height: '100%',
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 41,
    fontFamily: Font.ALight,
  },
  txtLabel: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 12,
    marginLeft: 2
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.3)'
  }
});

InputLabel.defaultProps = {
  editable: true
};

InputLabel.propTypes = {
  container: oneOfType([number, object, array]),
  inputStyle: oneOfType([number, object, array]),
  // Valor do input (Controlado por um state do componente pai, ou na store)
  value: string.isRequired,
  // Function a cada mudança de texto no input
  onChangeText: func.isRequired,
};