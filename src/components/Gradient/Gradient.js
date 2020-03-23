import React from 'react';
import { View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Gradient = ({ style, range, webId, children, noGradient }) => {
  if (Platform.OS === 'web') {
    const dataId = noGradient ? '' : webId;
    return (
      <View
        style={style}
        data-id={dataId}
      >
        {children}
      </View>
    );
  }
  const colors = noGradient ? noColorGrandient : range;
  return (
    <LinearGradient
      colors={colors}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};

const noColorGrandient = ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'];
export default Gradient;