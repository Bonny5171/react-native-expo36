import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Font } from '../../assets/fonts/font_names';
import { IconActionless as IA, TextLimit } from '../../components';
import global from '../../assets/styles/global';

const DropDown = ({
  container,
  params,
  isSimpleString,
  txtInput,
  current,
  element,
  disabled,
  actions,
  maxLength,
  shouldUpperCase,
  acOpenCloseDropDown,
}) => {
  const parameters = params !== undefined ? params : [];
  let msg = isSimpleString ? current : current.name;
  if (shouldUpperCase) msg = msg.toUpperCase();
  return (
    <View style={[styles.container, styles.border, { opacity: disabled ? 0.4 : 1, backgroundColor: 'rgb(250, 250, 250)', marginTop: 0 }, container]}>
      <TouchableOpacity
        style={styles.tchb}
        onPress={() => {
          acOpenCloseDropDown(...parameters);
          if (actions) actions.forEach(({ func, params }) => func(...params));
        }}
        disabled={disabled}
      >
        <View style={{ flex: 3, justifyContent: 'center' }}>
          {
            element !== undefined ?
              element(current)
            :
              <TextLimit
                style={[global.text, styles.txtInput, txtInput]}
                msg={msg}
                maxLength={maxLength}
              />
          }
        </View>
        <IA
          msg="J"
          style={styles.icDropDown}
        />
      </TouchableOpacity>
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: 41,
    marginTop: 4,
  },
  border: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#999',
  },
  tchb: {
    flex: 1,
    height: 37,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vwInput: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  txtInput: {
    marginLeft: 15,
    fontSize: 16,
  },
  icDropDown: {
    fontSize: 22,
    color: '#0085B2',
    transform: [{ rotate: '270deg' }],
    paddingHorizontal: 6,
  },
});