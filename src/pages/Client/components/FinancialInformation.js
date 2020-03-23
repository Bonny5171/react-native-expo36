import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Price } from '../../../components';
import { Font } from '../../../assets/fonts/font_names';
import SrvAccount from '../../../services/Account';

export default class FinancialInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      informacoesFinanceiras: [],
    };
  }

  async componentDidMount() {
    const informacoesFinanceiras = await SrvAccount.getFinancialInformation(this.props.client.sf_id);
    this.setState({ informacoesFinanceiras });
  }

  render() {
    // Pai informou que existe 3 tipos de análises de análise de crédito.
    const LIMITE_DE_CREDITO = 'Limite de crédito';
    const LIMITE_ADICIONAL = 'Limite adicional';
    const CRED_EXTRAORD = 'Crédito extraordinario';
    const typeLimiteCredito = this.state.informacoesFinanceiras.find(f => f.sf_tipo__c === LIMITE_DE_CREDITO);
    const typeCreditoAdicional = this.state.informacoesFinanceiras.find(f => f.sf_tipo__c === LIMITE_ADICIONAL);
    const typeCreditoExtrard = this.state.informacoesFinanceiras.find(f => f.sf_tipo__c === CRED_EXTRAORD);
    const limiteCredito = typeLimiteCredito || '0';
    const creditoAdicional = typeCreditoAdicional || '0';
    const creditoExtrard = typeCreditoExtrard || '0';
    const limiteAdicional = this.props.client.limiteAdicional;
    const pedidosAprovar = this.props.client.pedidosAprovar;
    const pedidosFaturados = this.props.client.pedidosFaturados;
    const pedidosAprovados = this.props.client.pedidosAprovados;
    const saldoDespesasAvencer = this.props.client.saldoDespesasAvencer;
    const saldoDespesasVencidas = this.props.client.saldoDespesasVencidas;
    const saldoDuplicatasVencidas = this.props.client.saldoDuplicatasVencidas;
    const saldoDuplicatasAVencer = this.props.client.saldoDuplicatasAVencer;
    const saldoLimite = this.props.client.saldoLimite;

    return (
      <View data-id="infoFinanc" style={[styles.container, { backgroundColor: 'rgba(255, 255, 255, 0.30)' }]}>
        <View style={styles.ctnLimit}>
          <View style={styles.row}>
            <View style={styles.info_1}>
              <View style={[styles.box, styles.box_info_1]}>
                <Text style={styles.lblClient}>LIMITE DE CRÉDITO</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.price, styles.price_1]}>R$ </Text>
                  <Price style={[styles.price, styles.price_1]} price={limiteCredito} />
                </View>
              </View>
              <View style={[styles.box, styles.box_info_1]}>
                <Text style={styles.lblClient}>SALDO LIMITE</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.price, styles.price_1]}>R$ </Text>
                  <Price style={[styles.price, styles.price_1]} price={saldoLimite} />
                </View>
              </View>
            </View>
            <View style={styles.info_2}>
              <View style={styles.box}>
                <Text style={styles.lblClient}>DESPESAS VENCIDAS</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.price, styles.price_2]}>R$ </Text>
                  <Price style={[styles.price, styles.price_2]} price={saldoDespesasVencidas} />
                </View>
              </View>
              <View style={styles.box}>
                <Text style={styles.lblClient}>DESPESAS A VENCER</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.price, styles.price_2]}>R$ </Text>
                  <Price style={[styles.price, styles.price_2]} price={saldoDespesasAvencer} />
                </View>
              </View>
              <View style={styles.box}>
                <Text style={styles.lblClient}>DUPLICADAS VENCIDAS</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.price, styles.price_2]}>R$ </Text>
                  <Price style={[styles.price, styles.price_2]} price={saldoDuplicatasVencidas} />
                </View>
              </View>
              <View style={styles.box}>
                <Text style={styles.lblClient}>DUPLICADAS A VENCER</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.price, styles.price_2]}>R$ </Text>
                  <Price style={[styles.price, styles.price_2]} price={saldoDuplicatasAVencer} />
                </View>
              </View>
              <View style={styles.box}>
                <Text style={styles.lblClient}>PEDIDOS APROVADOS</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.price, styles.price_2]}>R$ </Text>
                  <Price style={[styles.price, styles.price_2]} price={pedidosAprovados} />
                </View>
              </View>
              <View style={styles.box}>
                <Text style={styles.lblClient}>PEDIDOS FATURADOS</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.price, styles.price_2]}>R$ </Text>
                  <Price style={[styles.price, styles.price_2]} price={pedidosFaturados} />
                </View>
              </View>
              <View style={styles.box}>
                <Text style={styles.lblClient}>PEDIDOS A APROVAR</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.price, styles.price_2]}>R$ </Text>
                  <Price style={[styles.price, styles.price_2]} price={pedidosAprovar} />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 4, flexDirection: 'row',  }}>
              <View style={styles.box}>
                <Text style={styles.lblClient}>LIMITE ADICIONAL</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.price, styles.price_3]}>R$ </Text>
                  <Price style={[styles.price, styles.price_3]} price={limiteAdicional} />
                </View>
              </View>
              <View style={styles.box}>
                <Text style={styles.lblClient}>CRÉD. EXTRAORD</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.price, styles.price_3]}>R$ </Text>
                  <Price style={[styles.price, styles.price_3]} price={creditoExtrard} />
                </View>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={[styles.box, styles.box_info_1]}>
                <Text style={styles.lblClient}>SALDO TOTAL</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.price, styles.price_4]}>R$ </Text>
                  <Price style={[styles.price, styles.price_4]} price="teste" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ctnLimit: {
    maxWidth: 1024,
    flex: 1,
    paddingLeft: 35,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  box: {
    // borderWidth: 1,
    width: '25%',
    height: 50,
    paddingLeft: 20,
    marginBottom: 10,
  },
  box_info_1: {
    width: null,
  },
  info_1: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 0, 0, 0.15)',
    flexWrap: 'wrap',
  },
  info_2: {
    flex: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lblClient: {
    fontFamily: Font.BSemiBold,
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.9)',
    letterSpacing: 0.7,
  },
  txtClient: {
    fontFamily: Font.ALight,
    fontSize: 14,
    color: 'black',
    marginTop: 2,
    letterSpacing: 0.7,
  },
  price: {
    fontFamily: Font.ALight,
    marginTop: 2,
    letterSpacing: 0.7,
    fontWeight: 'bold',
    fontSize: 16,
  },
  price_1: {
    color: 'rgb(0, 133, 178);',
  },
  price_2: {
    color: 'rgb(178, 44, 1)',
  },
  price_3: {
    color: '#808282',
  },
  price_4: {
    color: '#018c46',
  },
});
