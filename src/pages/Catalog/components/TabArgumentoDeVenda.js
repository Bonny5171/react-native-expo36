import React from 'react';
import { View, Text, ScrollView, PanResponder } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';

class TabArgumentoDeVenda extends React.PureComponent {
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        this.props.flatListRef.setNativeProps({ scrollEnabled: false });
      },
      onPanResponderMove: () => {

      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: () => {
        this.props.flatListRef.setNativeProps({ scrollEnabled: true });
      },
    });
  }

  render() {
    const { currentProduct } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          {...this._panResponder.panHandlers}
          onScrollEndDrag={() => this.props.flatListRef.setNativeProps({ scrollEnabled: true })}
        >
          <Text
            style={{
              fontFamily: Font.ALight,
              fontSize: 18,
              color: 'rgba(20, 20, 20, 0.7)',
              paddingTop: 5,
            }}
          >
            ARGUMENTO DE VENDA
          </Text>
          <Text style={{ paddingTop: 5, }}>
            {currentProduct.argumentoDeVenda}
          </Text>
        </ScrollView>
      </View>
    );
  }
}

export default TabArgumentoDeVenda;