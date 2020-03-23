import React from 'react';
import { View, StyleSheet } from 'react-native';

import ClientField from './ClientField';
import { Row } from '../../../components';
import { Font } from '../../../assets/fonts/font_names';

class ClientInfo extends React.Component {
  render() {
    const { dropdown } = this.props;
    return (
      <View style={{ width:'55%' }}>
        <View style={{paddingRight: 30, paddingTop: 23 }}>
          <View style={{ flex: 1 }}>
            <Row>
              {/* 1st Column */}
              <View style={styles.column}>
                <ClientField
                  label="PRÉ-DATA"
                  breakline
                  // styleText={{ maxWidth: 140 }}
                  msg={dropdown.current.preDataEntrega}
                  container={styles.vwClientField}
                />
                <ClientField
                  label="REPRESENTANTE/VENDENDOR"
                  msg="NULL"
                  container={styles.vwClientField}
                />
                <ClientField
                  label="CONDIÇÃO DE PAGAMENTO"
                  msg={dropdown.current.condicoesPagamento}
                  container={styles.vwClientField}
                />
                <ClientField
                  label="PERÍODO DE ENTREGA INICIAL E FINAL"
                  breakline
                  msg={dropdown.current.periodoEntrega}
                  // styleText={{ maxWidth: 140 }}
                  container={styles.vwClientField}
                />
              </View>
              {/* 2nd Column */}
              <View style={styles.column}>
                <ClientField
                  label="TIPO DE PEDIDO"
                  breakline
                  msg="[NULO]"
                  // styleText={{ maxWidth: 140 }}
                  container={styles.vwClientField}
                />
                <ClientField
                  label="REDESPACHO"
                  msg={dropdown.current.preDataEntrega}
                  container={styles.vwClientField}
                />
                <ClientField
                  label="ORDEM DE COMPRA"
                  msg={dropdown.current.codigoTotvs}
                  container={styles.vwClientField}
                  shouldntUpper
                />
                <ClientField
                  label="DESCONTOS"
                  msg={dropdown.current.descontoAdicional}
                  container={styles.vwClientField}
                />
              </View>
            </Row>
          </View>
        </View>
      </View>
    );
  }
}

export default ClientInfo;

const styles = StyleSheet.create({
  vwClientField: {
    width: '100%',
    height: 50,
    marginTop: 5,
  },
  column: {
    flex: 1,
    paddingLeft: 25
  },
  vwLabelClient: {
    flex: 1,
    width: 130,
    justifyContent: 'center'
  },
  vwTextShort: {
    justifyContent: 'flex-start',
    width: 160
  },
  button: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#0085B2',
    height: 42,
    borderRadius: 45,
    marginBottom: 27,
    marginRight: 31,
    elevation: 2,
    shadowOffset: { height: 0, width: 2 },
    shadowColor: 'rgba(0, 0, 0, 0.6)',
  },
  txtButton: {
    fontSize: 15,
    color: 'white',
    fontFamily: Font.ABold,
    textAlign: 'center',
  },
});