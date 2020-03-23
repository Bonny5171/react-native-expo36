import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { acChooseChecks } from '../../../../../redux/actions/pages/cart';
import global from '../../../../../assets/styles/global';
import { Font } from '../../../../../assets/fonts/font_names';
import { Address, Filiais } from './common';
import { Header } from '..';
import { acAddStore } from '../../../../../redux/actions/pages/catalog';
class TabEntrega extends React.Component {
  componentDidMount() {
    const { assistantStores, stores, acAddStore } = this.props;
    // console.log('assistantStores', assistantStores);
    if (assistantStores[0] !== undefined) {
      acAddStore(assistantStores);
    }
  }

  render() {
    const { stores } = this.props;
    const addresses = this._renderAddresses();

    return (
      <View style={styles.container}>
        <Header msg="Dados para a entrega" />
        {/* Body Padding */}
        <View style={styles.body}>
          <View style={styles.addresses}>
            <Text style={[global.h7SemiBold, styles.lblAddresses]}>ENDEREÇO</Text>
            {addresses}
          </View>
          {/* Filiais */}
          {/* <View style={styles.branches}>
            <View style={styles.vwBranches}>
              <FiliaisView stores={stores} />
            </View>
          </View> */}
        </View>
      </View>
    );
  }

  _renderAddresses() {
    const { distributionCenter, comercial } = this.props.client;
    return (
      <View style={{ flexDirection: 'row' }}>
        <Address
          city={comercial.city}
          state={comercial.state}
          title={comercial.type}
          address={comercial.address}
          isChosen={this.props.shippingCheck[0]}
          disabled={this.props.type === 'Order' ? true : this.props.shippingCheck[0]}
          action={() => this.props.acChooseChecks('choose_address', comercial, 0)}
          params={[]}
        />
        {/* {
          distributionCenter !== undefined ?
            <Address
              container={{ marginLeft: 20 }}
              city={distributionCenter.city}
              state={distributionCenter.state}
              title={distributionCenter.type}
              address={distributionCenter.address}
              isChosen={this.props.shippingCheck[1]}
              disabled={this.props.type === 'Order' ? true : this.props.shippingCheck[1]}
              action={() => this.props.acChooseChecks('choose_address', distributionCenter, 1)}
              params={[]}
            />
            :
            null
        } */}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  shippingCheck: state.cart.shippingCheck,
  assistantStores: state.assistant.stores,
  stores: state.cart.stores,
});

export default connect(mapStateToProps, { acChooseChecks, acAddStore })(TabEntrega);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingVertical: 4,
  },
  h1: {
    fontSize: 20,
    color: '#464646',
    fontFamily: Font.AThin
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addresses: {
    paddingRight: 30,
    paddingVertical: 10,
  },
  lblAddresses: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 12,
    paddingVertical: 8,
  },
  branches: {
    flex: 1
  },
  vwBranches: {
    flex: 1,
    width: '100%',
    paddingTop: 10,
    marginRight: 30,
  },
  lblBranches: {
    width: '100%',
    fontSize: 17,
    fontFamily: Font.BLight,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    paddingLeft: 3,
    paddingVertical: 2.5,
  }
});

const FiliaisView = ({ stores }) => {
  if (stores.length === 1) return null;
  return (
    <View style={{ flex: 1, width: '100%' }}>
      <Text style={styles.lblBranches}>FILIAIS</Text>
      <Filiais
        stores={stores}
      />
    </View>
  );
};