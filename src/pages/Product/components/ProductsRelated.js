import React from 'react';
import { View, Text } from 'react-native';

class ProductsRelated extends React.Component {
  render() {
    // console.log('7 - render > ProductsRelated', this.props.product.currentGallery);
    return (
      <View style={{ marginBottom: 16 }}>
        <Text>TAMBEM COMPROU</Text>
      </View>
    );
  }
}

export default ProductsRelated;