import React from 'react';
import { View, StyleSheet } from 'react-native';

import ClientField from './ClientField';
import { Button, Row, SimpleButton } from '../../../components';
import { Font } from '../../../assets/fonts/font_names';

class ClientInfo extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.client.name === nextProps.client.name) {
      return false;
    }
    return true;
  }

  render() {
    const { client } = this.props;

    return (
      <View style={{ flex: 1, maxWidth: 550 }}>
        <View style={{ flex: 2, paddingHorizontal: 30, paddingTop: 23 }}>
          <View style={{ flex: 1 }} >
            <Row style={{ flex: 2 }}>
              {/* 1st Column */}
              <View style={styles.column}>
                <ClientField
                  label="RAZÃO SOCIAL"
                  breakline
                  styleText={{ maxWidth: 140 }}
                  msg={client.reason}
                  container={styles.vwClientField}
                />
                <ClientField
                  label="TELEFONE 1"
                  msg={client.phone}
                  container={styles.vwClientField}
                />
                <ClientField
                  label="CNPJ"
                  msg={client.cnpj}
                  container={styles.vwClientField}
                />
                <ClientField
                  label="CONTATO"
                  breakline
                  msg={client.contact}
                  styleText={{ maxWidth: 140 }}
                  container={styles.vwClientField}
                />
              </View>
              {/* 2nd Column */}
              <View style={styles.column}>
                <ClientField
                  label="NOME FANTASIA"
                  breakline
                  msg={client.name}
                  styleText={{ maxWidth: 140 }}
                  container={styles.vwClientField}
                />
                <ClientField
                  label="TELEFONE 2"
                  msg={client.phone2}
                  container={styles.vwClientField}
                />
                <ClientField
                  label="EMAIL"
                  //msg={client.email}
                  msg="contato@itapevi.com.br"
                  container={styles.vwClientField}
                  shouldntUpper
                />
                <ClientField
                  label="SITUAÇÃO"
                  msg={client.situation}
                  container={styles.vwClientField}
                />
              </View>
            </Row>
          </View>
        </View>
        {/* <SimpleButton
          msg="INICIAR/CONTINUAR COMPRA"
          tchbStyle={styles.button}
          txtStyle={styles.txtButton}
        /> */}
      </View>
    );
  }
}

export default ClientInfo;

const styles = StyleSheet.create({
  vwClientField: {
    width: '100%',
    height: 65,
    marginLeft: -30,
    marginTop: 5,
  },
  column: {
    flex: 1,
    marginLeft: 5,
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