import React from 'react';
import { View, ScrollView } from 'react-native';
import { CarBox } from './';
import { obterLarguraDasCaixas } from '../../../services/Dimensions';

const _RenderLinha = props => props.dataClientes.map(
  (item, index) => {
    const n = obterLarguraDasCaixas(props);
    const key = `${item.client}_${index}`;
    return (
      <CarBox
        key={key}
        index={props.index}
        rowPosition={index}
        name={item.client}
        {...props}
        item={item}
        {...item}
        larguraDasCaixas={n}
        carts={props.carts}
        acSetDropdownCarts={props.acSetDropdownCarts}
        acCurrentProduct={props.acCurrentProduct}
      />
    );
  }
);

class Row extends React.PureComponent {
  render() {
    return (
      <View
        style={{ paddingLeft: 10, }}
        data-id="box-de-destaque-ctn"
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          { _RenderLinha(this.props) }
        </ScrollView>
      </View>
    );
  }
}

export default Row;