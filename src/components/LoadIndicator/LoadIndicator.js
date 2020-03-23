import React, { Fragment } from 'react';
import { StyleSheet, View, ActivityIndicator, ViewPropTypes } from 'react-native';
import { func, bool, string, oneOfType } from 'prop-types';
// High order func para incrementar funcionalidade de
const LoadIndicator = (props) => {
  const { children, isLoading, loadSize, size } = props;
  if (!isLoading) return children;

  return (
    <View style={props.containerStyle}>
      <LoadIcon
        isLoading={isLoading}
        loadSize={loadSize}
        size={size}
        loadStyle={props.loadStyle}
      />
    </View>
  );
};

export default LoadIndicator;

LoadIndicator.propTypes = {
  // Componente a ser evoluído
  isLoading: bool,
  loadSize: string,

  loadStyle: ViewPropTypes.style,
};

const styles = StyleSheet.create({
  icLoad: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export const LoadIcon = ({ size = 'small', loadStyle, isLoading }) => (
  <Fragment>
    {
      isLoading && (
        <View style={[styles.icLoad, loadStyle]}>
          <ActivityIndicator
            size={size}
            color="#333"
          />
        </View>
      )
    }
  </Fragment>
);