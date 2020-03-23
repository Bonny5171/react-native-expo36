import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from '../../../assets/styles/global';
import { Product, DetailProduct } from '.';

const RowBox = props => (
  <View style={{ paddingLeft: 20 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: props.index === 0 ? 45 : 15, paddingLeft: 5 }}>
      <Text style={styles.grupoDestaque}>
        {props.exhibition}
      </Text>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {
        props.products.map(
          item => (
            <Product
              {...item}
              {...props}
              keyProduct={item.key}
              product={item}
            />
          )
        )
      }
    </ScrollView>
    {
      props.ponteiroProduto[0] === props.keyDestaque &&
      <DetailProduct {...props} />
    }
  </View>
);

export default RowBox;