import React from 'react';
import { View, Text } from 'react-native';

class BestSellers extends React.Component {
  render() {
    // console.log('8 - render > BestSellers', this.props.product.currentGallery);
    return (
      <View style={{ marginBottom: 16 }}>
        <Text>MAIS VENDIDOS</Text>
      </View>
    );
  }
}

export default BestSellers;