import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Font } from '../../../../../../../assets/fonts/font_names';
import SrvOrder from '../../../../../../../services/Order/';

class PopPendencias extends React.PureComponent {
  state = {
    nPendenciaCor: 0,
    nPendenciaGrade: 0,
    nPendenciaEmbalamento: 0,
    // nPendenciaPrazo: 0,
    nPendenciaDesconto: 0,
    nPendenciaQuantidade: 0,
  };

  async componentDidMount() {
    const filtro = [
      { quote_sfa_guid__c: this.props.dropdown.current.key },
    ];
    const produtos = await SrvOrder.getProdutos(filtro);
    const nPendenciaCor = produtos.filter(p => (p.ref2 === null) || p.ref2 === '').length;
    const nPendenciaGrade = produtos.filter(p => (p.ref3 === null) || p.ref3 === '').length;
    const nPendenciaEmbalamento = produtos.filter(p => (p.ref4 === null) || p.ref4 === '').length;
    // const nPendenciaPrazo = produtos.filter(p => (p.prazo === null) || p.prazo === '').length;
    // const nPendenciaDesconto = produtos.filter(p => (p.ref2 === null) || p.ref2 === '').length;
    const nPendenciaQuantidade = produtos.filter(p => (p.quantity === null) || p.quantity === '').length;

    this.setState({
      nPendenciaCor,
      nPendenciaGrade,
      nPendenciaEmbalamento,
      // nPendenciaPrazo,
      // nPendenciaDesconto,
      nPendenciaQuantidade,
    });
  }

  render() {
    return (
      <View data-id="popPendencias" style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', }}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Pendency
              noQtd
              isVisible={this.props.dropdown.current.products.length === 0}
              bloco={1}
              icone="3"
              tipo="modelos para este carrinho"
            />
            <Pendency
              icone="y"
              bloco={1}
              tipo="cor/modelo"
              qtd={this.state.nPendenciaCor}
            />
            <Pendency
              icone="z"
              bloco={1}
              tipo="grade"
              qtd={this.state.nPendenciaGrade}
            />
            <Pendency
              icone="p"
              bloco={1}
              tipo="embalamento"
              qtd={this.state.nPendenciaEmbalamento}
            />
            {
            /*
              <Pendency
                icone="T"
                bloco={1}
                tipo="prazo"
                qtd={this.state.nPendenciaPrazo}
              />
            */
            }
            <Pendency
              icone="C"
              bloco={1}
              tipo="desconto"
              qtd={this.state.nPendenciaDesconto}
            />
            <Pendency
              icone="Q"
              bloco={1}
              tipo="quantidade"
              qtd={this.state.nPendenciaQuantidade}
            />
          </View>
        </View>
        <View style={{ borderBottomColor: 'rgba(0,0,0,.2)', borderBottomWidth: 1, marginVertical: 15 }} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ paddingRight: 10 }}>
            <Pendency
              icone="R"
              bloco={2}
              tipo="fechamento"
              noQtd
              isVisible={!this.props.isFechamentoDone}
            />
          </View>
          {/*
          <View style={{ flex: 1, paddingLeft: 10 }}>
            {this._renderItem('x', 2, 'entrega', null)}
          </View> */}
        </View>
      </View>
    );
  }
}

export default PopPendencias;

const Pendency = ({ icone, bloco, tipo, qtd, noQtd, isVisible }) => {
  // Se a pendencia tiver qtd e for 0, nao precisa exibir
  // Caso ela nao tenha qtd, o controle de visibilidade eh feito por outra logica recebida por props
  if ((qtd === 0 && !noQtd) || (!isVisible && noQtd)) return null;
  const frase = (bloco === 1) ? 'Falta definir ' : 'Faltam dados na aba de ';
  const item = <Text style={{ fontFamily: Font.ASemiBold, fontSize: 12 }}>{tipo}</Text>;
  const complemento = (qtd != null) ? ' de ' + qtd + ((qtd > 1) ? ' itens' : ' item') : '';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
      <View style={{ width: 40 }}>
        <Text style={{ fontFamily: Font.C, fontSize: 22, opacity: 0.5 }}>{icone}</Text>
      </View>
      <Text style={{ fontFamily: Font.ARegular, fontSize: 13 }}>{frase}{item}{complemento}</Text>
    </View>
  );
};