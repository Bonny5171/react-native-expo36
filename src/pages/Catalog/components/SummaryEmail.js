import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Row, Button, Fade } from '../../../components';
import { ListCartSummary } from '.';
import { Font } from '../../../assets/fonts/font_names';
import global from '../../../assets/styles/global';

class SummaryEmail extends React.PureComponent {
  render() {
    const { visible, headerHeight, dropdown, acOpenCloseDropDown, acClosePopUp } = this.props;

    const dim = this.props.window;
    const maxHeight = dim.height - headerHeight;

    return (
      <Fade visible={visible} style={[styles.container, { maxHeight, marginTop: headerHeight, width: '100%' }]}>
        {/* Header */}
        <View style={styles.header}>
          <Row style={{ flex: 2, alignItems: 'center' }}>
            <Text style={global.h2}>RESUMO DO EMAIL...</Text>
          </Row>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button
              tchbStyle={{ alignSelf: 'flex-end', marginTop: 0 }}
              txtStyle={global.iconClose}
              txtMsg="t"
              actions={[
                { func: acClosePopUp, params: [] },
                {
                  // Só fecha o dropdown caso ele esteja visível
                  func: dropdown.isVisible ? acOpenCloseDropDown : () => null,
                  params: []
                }
              ]}
            />
          </View>
        </View>
        {/* Body */}
        <View style={{ flex: 2, paddingRight: 20 }}>
          <ListCartSummary {...this.props} />
          <Button
            tchbStyle={styles.BTN}
            txtStyle={{
              fontSize: 20,
              color: 'white',
              fontFamily: Font.ASemiBold,
              textAlign: 'center'
            }}
            txtMsg="ENVIAR"
            action={() => {
              this.props.acSetToast({ text: 'Enviado p/Email' });
            }}
          />
          <Button
            tchbStyle={styles.BTN}
            txtStyle={{
              fontSize: 20,
              color: 'white',
              fontFamily: Font.ASemiBold,
              textAlign: 'center'
            }}
            txtMsg="SALVAR IMAGENS"
            action={() => {
              this.props.acSetToast({ text: ' Imagens salvas' });
            }}
          />
        </View>
      </Fade>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    elevation: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: { height: 1, width: 0.2 },
    shadowRadius: 55,
    shadowOpacity: 0.2,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 0.2
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15
  },
  icMail: {
    fontFamily: Font.C,
    color: 'rgba(0, 0, 0, 0.3)',
    fontSize: 30
  },
  goToCartPage: {
    fontFamily: Font.ALight,
    fontSize: 18,
    textDecorationLine: 'underline',
    color: '#359EC2'
  },
  BTN: {
    backgroundColor: '#0085B2',
    height: 30,
    width: 120,
    borderRadius: 45
  }
});

export default SummaryEmail;
