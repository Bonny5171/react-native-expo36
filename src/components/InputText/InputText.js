import React from 'react';
import { View, TextInput, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { func, object, number, array, string, oneOfType } from 'prop-types';
import { Font } from '../../assets/fonts/font_names';
import global from '../../assets/styles/global';
import IconActionless from '../IconActionless';

class InputText extends React.Component {
  render() {
    const {
      inputStyle,
      hasDeleteIcon,
      clearAction,
      params,
      setInput,
      value,
      noClear,
      hasSearch,
      editable,
    } = this.props;

    return (
      <View style={[global.vwIT, { paddingLeft: 10 }, inputStyle, !editable && styles.disabled]}>
        <Input {...this.props} />
        {
          noClear ?
            null
          :
            <DeleteIcon
              isVisible={hasDeleteIcon || !editable}
              hasSearch={hasSearch}
              action={clearAction}
              params={params}
              setInput={setInput}
              value={value}
            />
        }
      </View>
    );
  }
}

export default InputText;

const styles = StyleSheet.create({
  txtInput: {
    flex: 1,
    fontSize: 16,
    width: '100%',
    height: '100%',

    fontFamily: Font.ALight,
  },
  txtLabel: {
    color: 'black',
    fontSize: 12,
    opacity: 0.9,
    marginLeft: 2
  },
  disabled: {
    backgroundColor: 'rgb(225, 225, 225)'
  }
});


InputText.defaultProps = {
  onChangeText: () => null,
  editable: true,
};

InputText.propTypes = {
  inputStyle: oneOfType([number, object, array]),
  // Valor do input (Controlado por um state do componente pai, ou na store)
  value: string.isRequired,
  // Function a cada mudança de texto no input
  onChangeText: func,
};

const DeleteIcon = ({ isVisible, hasSearch, setInput, action, params, value }) => {
  if (hasSearch && value.length === 0) return (<IconActionless style={{ position: 'absolute', right: 8, color: '#C1C2C3', fontSize: 23 }} msg="l" />);
  if (isVisible) return null;
  if (value.length === 0) return null;
  return (
    <TouchableOpacity
      style={{ position: 'absolute', right: 8 }}
      onPress={() => {
        if (action) {
          if (params) { action(...params); } else { action(); }
        }
        if (setInput) {
          setInput('');
        }
      }}
    >
      <IconActionless msg="t" style={{ color: '#C1C2C3', fontSize: 23 }} />
    </TouchableOpacity>
  );
};

const Input = (props) => {
  let align = 'center';
    let textAreaStyle = {};

    if (props.isTextArea) {
      align = 'top';
      textAreaStyle = { paddingTop: 6, justifyContent: null };
    }
  if (Platform.OS === 'web') {
    return (
      <TextInput
        editable={props.editable === undefined ? true : props.editable}
        underlineColorAndroid="transparent"
        style={[styles.txtInput, textAreaStyle, props.txtInputStyle]}
        onChangeText={props.onChangeText}
        keyboardType={props.keyboardType}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        value={props.value}
        spellCheck={false}
        multiline={props.isTextArea}
        numberOfLines={props.nrLines}
        maxLength={props.maxLength}
      />
    );
  }

  return (
    <TextInput
      ref={ref => { this.txtInput = ref; }}
      underlineColorAndroid="transparent"
      style={[styles.txtInput, textAreaStyle, props.txtInputStyle]}
      onChangeText={props.onChangeText}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      value={props.value}
      spellCheck={false}
      multiline={props.isTextArea}
      numberOfLines={props.nrLines}
      textAlignVertical={align}
      maxLength={props.maxLength}
      keyboardType={props.keyboardType}
    />
  );
};