import React from 'react';
import { View, ScrollView, } from 'react-native';
import { ClientBox } from './';
import { obterLarguraDasCaixas } from '../../../services/Dimensions';

const _RenderLinha = props => props.dataClientes.map(
  (item, index) => {
    const next = props.dataClientes[index + 1];
    const previous = props.dataClientes[index - 1];
    const nextClient = next !== undefined ? { fantasyName: next.fantasyName, key: next.key } : null;
    const previousClient = previous !== undefined ? { fantasyName: previous.fantasyName, key: previous.key } : null;
    // Conta para obter a posição da caixa branca de cliente em relação à lista atual da página
    const dataPosition = (props.groupSize * props.index) + index;
    return (
      <React.Fragment key={index.toString()}>
        <ClientBox
          key={dataPosition.toString()}
          row={props.index}
          rowPosition={index}
          dataPosition={dataPosition}
          name={item.fantasyName}
          code={item.code}
          item={item}
          {...props}
          {...item}
          next={nextClient}
          previous={previousClient}
          larguraDasCaixas={obterLarguraDasCaixas(props)}
        />
      </React.Fragment>
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