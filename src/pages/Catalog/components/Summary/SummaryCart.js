import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Row, DropDown, Button, Fade, ModalMask } from '../../../../components';
import { ListCartSummary } from '..';
import { Font } from '../../../../assets/fonts/font_names';
import { CurrentCart, SelectCart } from '../FastSelection/common';
import SrvOrder from '../../../../services/Order/';

class SummaryCart extends React.PureComponent {
  state = {
    modalMask: false,
  }

  componentWillUnmount = () => {
    const { popSelectCart, dropdown } = this.props;
    if (popSelectCart) this.props.acPopSelectCart();
    if (dropdown.isVisible) this.props.acOpenCloseDropDown();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevProps.popSelectCart && !this.props.popSelectCart) this.toggleModalMask();
    return null;
  }

  componentDidUpdate(prevProps, prevState) {

  }

  render() {
    const {
      dropdown,
      acPopSelectCart,
    } = this.props;

    return (
      <View style={styles.container}>
        {/* Header */}
        <Row style={{ justifyContent: 'space-between', alignItems: 'center', height: 40, width: '100%', marginBottom: 20 }}>
          <CurrentCart
            visible
            currCart={dropdown.current}
            acToggleMask={() => {}}
            acPopSelectCart={() => {
              this.toggleModalMask();
              acPopSelectCart();
            }}
            containerStyle={{ height: 30, alignSelf: 'center' }}
          />
          <Button
            txtMsg="W"
            txtStyle={styles.icMail}
            action={() => this.props.acSetToast({ text: 'Resumo Enviado p/Email' })}
          />
          <Button
            txtMsg="Ir para a página do carrinho"
            txtStyle={styles.goToCartPage}
            action={this.goToCartPage}
          />
        </Row>
        {/* Body */}
        <View style={{ flex: 1 }}>
          {
            dropdown.current &&
            <ListCartSummary {...this.props} data={dropdown.current.products} />
          }
        </View>
        <ModalMask
          visible={this.state.modalMask}
          toggleModal={[
            { func: this.props.acPopSelectCart, params: [] },
            { func: this.toggleModalMask, params: [] }
          ]}
        />
      </View>
    );
  }

  toggleModalMask = () => {
    this.setState({ modalMask: !this.state.modalMask });
  }
  goToCartPage = async () => {
    this.props.acToggleMask();
    this.props.acCurrentProduct({});

    const cartDefault = this.props.carts.find(car => car.key === this.props.dropdown.current.key);
    cartDefault.products = await SrvOrder.getProdutos([{ quote_sfa_guid__c: cartDefault.key }], { fields: ['sf_segmento_negocio__c'] });
    this.props.acSetDropdownCarts({ current: cartDefault, isVisible: false });
    this.props.acCurrentProduct({});

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'carrinho', params: { wasInCatalog: true } })]
    });
    this.props.navigation.dispatch(resetAction);
  };
}
export default SummaryCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icMail: {
    fontFamily: Font.C,
    color: 'rgba(0, 0, 0, 0.3)',
    fontSize: 30,
    marginTop: 5,
  },
  goToCartPage: {
    fontFamily: Font.ALight,
    fontSize: 16,
    textDecorationLine: 'underline',
    color: '#359EC2',
    marginTop: 3,
  }
});
