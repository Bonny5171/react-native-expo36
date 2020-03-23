import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { acChooseChecks } from '../../../../redux/actions/pages/cart';
import { Header } from '.';
import global from '../../../../assets/styles/global';
import { CheckOption } from '../../../Assistant/components';
export class Espelho extends Component {
  static propTypes = {
  }

  render() {
    const { products, productsCheck, barCodes, barCodesCheck } = this.props;
    const productsLayout = this._renderOptions(products, productsCheck, 'choose_products', 3);
    const barCodesLayout = this._renderOptions(barCodes, barCodesCheck, 'choose_bar_codes', 2);
    return (
      <View style={styles.container}>
        <Header msg="Itens que serão exibidos no espelho do pedido" />
        <View style={styles.body}>
          {/* PRODUTOS  */}
          <View>
            <Text style={[global.h7SemiBold, styles.lblAddresses]}>PRODUTOS</Text>
            {productsLayout}
          </View>
          {/* CÓDIGO DE BARRAS */}
          <View style={styles.containerCodeBars}>
            <Text style={[global.h7SemiBold, styles.lblAddresses]}>CÓDIGO DE BARRAS</Text>
            {barCodesLayout}
          </View>
        </View>
      </View>
    );
  }

  _renderOptions(array, arrayCheck, type, columns) {
    const { acChooseChecks } = this.props;
    const optionWidth = columns > 2 ? (825 / columns) : 275;
    const spacing = 15;
    const containerWidth = columns * (optionWidth + spacing);
    return (
      <View style={[styles.containerOptions, { width: containerWidth }]}>
        {
          array.map((curr, index) => (
            <CheckOption
              key={curr}
              container={{ width: optionWidth, marginRight: spacing }}
              msg={curr}
              checkbox={arrayCheck[index]}
              action={acChooseChecks}
              params={[type, array, index]}
              txtStyle={styles.lblOption}
              checkIcStyle={styles.checkStyle}
              disabled={this.props.type === 'Order'}
            />
          ))
        }
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  productsCheck: state.cart.productsCheck,
  barCodesCheck: state.cart.barCodesCheck,
  products: state.cart.products,
  barCodes: state.cart.barCodes,
});

export default connect(mapStateToProps, { acChooseChecks })(Espelho);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  body: {
    flex: 1,
    width: '100%',
    paddingTop: 10,
    paddingLeft: 20,
  },
  lblAddresses: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 12,
    paddingVertical: 8,
  },
  containerCodeBars: {
    paddingTop: 30,
  },
  containerOptions: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  lblOption: {
    fontSize: 14,
    marginLeft: 8
  },
  checkStyle: {
    fontSize: 22
  }
});