import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import IconActionless from '../IconActionless';
import { func } from 'prop-types';
import global from '../../assets/styles/global';

const ArrowNavigator = (props) => {
  const noNavigation = !props.hasNext && !props.hasPrevious;
  if (props.hide || (noNavigation && !props.isStatic)) return null;

  let container = null;
  let previousTchb = { paddingHorizontal: 3 };
  let previousIcon = { transform: [{ rotate: '180deg' }], fontSize: 15, };
  let nextTchb = { paddingHorizontal: 3 };
  let nextIcon = { fontSize: 15, transform: [{ rotate: '0deg'  }] };
  // Se for vertical, muda a orientação dos estilos para o componente ficar de pé
  if (props.isVertical) {
    container = { flexDirection: 'column', width: 33, height: null, alignItems: 'center' };
    previousTchb = { paddingTop: 3, paddingBottom: 1,  };
    nextTchb = { paddingBottom: 3, paddingTop: 1,  };
    previousIcon.transform[0].rotate = '270deg';
    nextIcon.transform[0].rotate = '90deg';
  }

  return (
    <View style={[styles.container, container, global.shadow, props.containerStyle]}>
      <TouchableOpacity
        disabled={!props.hasPrevious || props.isDisabled}
        onPress={() => props.navigateToPrevious()}
        style={previousTchb}
      >
        <IconActionless msg="v" style={[previousIcon, !props.hasPrevious ? styles.disabled : null, props.leftIconStyle, props.iconStyle]} />
      </TouchableOpacity>
      {props.children}
      <TouchableOpacity
        disabled={!props.hasNext || props.isDisabled}
        onPress={() => props.navigateToNext()}
        style={nextTchb}
      >
        <IconActionless msg="v" style={[nextIcon, !props.hasNext ? styles.disabled : null, props.rightIconStyle, props.iconStyle]} />
      </TouchableOpacity>
    </View>
  );
};
export default ArrowNavigator;

ArrowNavigator.propTypes = {
  // navigateToRight: func.isRequired,
  // navigateToLeft: func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 4,
    height: 28,
    backgroundColor: 'rgb(250, 250, 250)',
    borderRadius: 20,
    padding: 2,
  },
  disabled: {
    color: '#AAA'
  }
});