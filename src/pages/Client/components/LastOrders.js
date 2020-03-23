import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { CarBox } from '../../Orders/components';
import { obterLarguraDasCaixas } from '../../../services/Dimensions';

const LastOrders = (props) => {
  if (props.orders && props.orders.length === 0) return <View />;
  const qtd = 4;
  const n = obterLarguraDasCaixas(props);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ÚLTIMOS PEDIDOS</Text>
      <View style={{ flexDirection: 'row' }}>
        {
          props.orders.slice(0, qtd).map((item, index) => (
            <CarBox
              key={item.key}
              index={props.index}
              rowPosition={index}
              name={item.client}
              {...props}
              item={item}
              {...item}
              larguraDasCaixas={n}
              carts={props.orders}
              acSetDropdownCarts={props.acSetDropdownCarts}
              acCurrentProduct={props.acCurrentProduct}
            />
          ))
        }
      </View>
    </View>
  );
};

export default LastOrders;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 60,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Font.BLight,
    fontSize: 22,
    color: 'black',
    marginBottom: 15
  }
});