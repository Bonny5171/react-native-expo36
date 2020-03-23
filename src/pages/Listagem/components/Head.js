import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import global from '../../../assets/styles/global';
import { Font } from '../../../assets/fonts/font_names';
import { Row, Button } from '../../../components';

const HEADER_HEIGHT = 85;

class Head extends React.Component {
  constructor(props) {
    super(props);
    this.navigateToCatalog = this.navigateToCatalog.bind(this);
  }

  render() {
    return (
      <View
        style={{
          height: HEADER_HEIGHT,
          alignItems: 'center',
          width: '100%',
          flexDirection: 'row',
        }}
      >
        <Row style={{ flex: 2, paddingBottom: 10, width: '100%' }}>
          <Text style={[global.titlePagina, { marginLeft: 20, }]}>LISTAGEM </Text>
          <View style={{ flex: 1, paddingLeft: 10, top: -5 }}>
            <Text data-id="boxTituloCliente" style={global.titleNomeCliente}>
              {this.props.client.fantasyName !== undefined ? this.props.client.fantasyName : ''}
              <Text style={global.codigoCliente}>{this.props.client.code === '' ? '' : `(${this.props.client.code})`}</Text>
            </Text>
            <Text style={global.setorCliente}>
              {this.props.client.sector}
            </Text>
          </View>
        </Row>
        <View style={{ flexDirection: 'row' }}><Text>Ícones</Text>
        </View>
      </View>
    );
  }

  navigateToCatalog() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'catalog' })],
    });
    this.props.navigation.dispatch(resetAction);
  }
}

export default Head;


const styles = StyleSheet.create(
  {
    // vwHeader: {
    //   height: HEADER_HEIGHT,
    //   flexDirection: 'row',
    //   alignItems: 'center'
    // },
    // title: {
    //   fontFamily: Font.AThin,
    //   marginLeft: 35,
    //   fontSize: 42,
    //   color: 'rgba(102, 102, 102, 0.5)',
    // },
    client: {
      fontFamily: Font.BMedium,
      fontSize: 18,
      color: '#6C7073',
      marginTop: 2
    },
    // clientType: {
    //   fontFamily: Font.Bmedium,
    //   fontSize: 16,
    //   color: '#A4A5A7'
    // },
    // icMenu: {
    //   fontFamily: Font.C,
    //   fontSize: 34,
    //   color: 'rgba(102, 102, 102, 0.4)',
    // },
    // icArrow: {
    //   position: 'absolute',
    //   bottom: 2,
    //   marginLeft: 7
    // },
    // vwSubMenu: {
    //   flex: 1,
    //   alignItems: 'center',
    // },
    // tchbSelectTable: {
    //   zIndex: 2,
    //   flexDirection: 'row',
    //   alignSelf: 'center',
    //   alignItems: 'center',
    //   backgroundColor: 'rgba(236, 238, 237, 0.84)',
    //   borderWidth: 1,
    //   borderColor: '#999',
    //   borderRadius: 12,
    //   height: 40,
    //   width: 105,
    //   padding: 3,
    //   paddingHorizontal: 9,
    //   marginRight: 12,
    // },
    // txtSelectTable: {
    //   fontFamily: Font.BThin,
    //   fontSize: 19,
    //   textAlign: 'center',
    //   color: 'rgba(0, 0, 0, 0.6)',
    // },
    // vwSelectTable: {
    //   position: 'absolute',
    //   alignItems: 'center',
    //   width: 105,
    //   backgroundColor: 'rgba(236, 238, 237, 0.84)',
    //   borderWidth: 1,
    //   borderBottomEndRadius: 12,
    //   borderBottomLeftRadius: 12,
    //   borderColor: '#999',
    //   borderTopWidth: 0,
    //   maxHeight: 200,
    //   marginTop: 51,
    //   right: 302
    // },
  }
);