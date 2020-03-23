import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { IconActionless, TextLimit } from '..';
import { Font } from '../../assets/fonts/font_names';
const DropTable = ({ isDisabled, actions, currentTable, containerStyle, shouldChangeBorder, maxLength }) => {
  const borderStyle = shouldChangeBorder ? styles.optimizedLayout : null;
  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[styles.tchbSelectTable, containerStyle, borderStyle]}
      onPress={() => actions.forEach(({ func, params = [] }) => func(...params))}
    >
      {
        maxLength ?
          <TextLimit
            msg={currentTable.toUpperCase()}
            style={styles.txtSelectTable}
            maxLength={maxLength}
          />
          :
          <Text style={styles.txtSelectTable}>{currentTable.toUpperCase()}</Text>
      }
      <IconActionless
        msg="..."
        style={[styles.dots, isDisabled && styles.disabledDots]}
        noIcon
      />
    </TouchableOpacity>
  );
};

export default DropTable;

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 4,
    fontSize: 20,
    color: '#0085B2',
    transform: [{ rotate: '270deg' }],
  },
  tchbSelectTable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 250, 250, 0.84)',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    height: 30,
    width: 100,
    padding: 3,
    paddingHorizontal: 9,
  },
  txtSelectTable: {
    fontFamily: Font.ALight,
    fontSize: 13,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  optimizedLayout: {
    borderBottomEndRadius: 0,
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0
  },
  dots: {
    fontSize: 28,
    color: '#0085B2',
    position: 'absolute',
    right: 8,
    transform: [{ translateY: -8 }],
    paddingLeft: 4,
  },
  disabledDots: {
    textShadowRadius: 0,
    color: 'rgb(200, 200, 200)'
  }
});