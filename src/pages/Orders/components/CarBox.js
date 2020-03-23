import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native';
import { connect } from 'react-redux';
import { Font } from '../../../assets/fonts/font_names';
import { IconActionless, TextLimit, Price, FormatDate } from '../../../components';
import { agrupaProdutosNoCarrinho } from '../../../utils/CommonFns';
import { acCurrentClient } from '../../../redux/actions/pages/client';
import { cartBoxClicked } from '../../../services/Pages/Cart/Queries';

class CarBox extends React.Component {
  constructor(props) {
    super(props);
    this.maxNameLength = 17;
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.index !== nextProps.index) return true;
    if (this.props.window !== nextProps.window) return true;
    return false;
  }

  render() {
    const { item, larguraDasCaixas, } = this.props;
    const maxLengthClientName = 28;

    const prod = agrupaProdutosNoCarrinho(item.products);
    const nPedido = item.key.split('-')[0];

    let valor = 0;
    prod.forEach(el => valor += el.totalPrice);

    return (
      <View data-id="boxCarrinho" style={[styleCB.vwClientBox, { width: larguraDasCaixas }]}>
        <TouchableOpacity
          style={{ flex: 1, width: '100%', alignItems: 'center' }}
          onPress={this.handleClick}
          activeOpacity={0.8}
          animationVelocity={1}
          underlayColor="transparent"
        >
          <View style={styleCB.vwLastOrder}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: Font.ARegular, fontSize: 14 }}>{item.sf_pricebook2_name__c}</Text>
              <View data-id="checkbox" />
            </View>
            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
              <Text style={{ fontFamily: Font.ASemiBold, fontSize: 16, color: '#0085B2' }}>{nPedido || 'null' }</Text>
              <Text style={{ marginVertical: 5 }}>STATUS: {item.status}</Text>
            </View>

            {/* <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: Font.AThin,
                  color: 'rgba(0, 0, 0, 0.35)',
                  fontSize: 35
                }}
              >
                {item.created.day}
              </Text>
              <View style={{ marginLeft: 4, height: 52, justifyContent: 'center' }}>
                <Text style={[global.text, { marginBottom: 2, marginTop: 2, }]}>{item.created.month}</Text>
                <Text style={[global.text, { marginTop: -3, fontSize: 11 }]}>{item.created.year}</Text>
              </View>
            </View> */}

            <View style={styleCB.body}>

              <View style={{ alignItems: 'center' }}>
                <IconActionless msg="m" style={{ fontSize: 22, color: '#999' }} />
                <Text style={{ fontSize: 12, color: 'black', paddingTop: 3 }} >
                  {'R$ '}
                  <Price price={valor} />
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <IconActionless msg="e" style={{ fontSize: 22, color: '#999' }} />
                {(item.previsaoEmbarque) && <FormatDate date={item.previsaoEmbarque} txtStyle={{ fontSize: 12, color: 'black', paddingTop: 3 }} />}
              </View>

            </View>
          </View>
          {
            this.props.context === 'Admin' &&
            <View style={styleCB.rowRodape}>
              <TextLimit style={styleCB.labelClient} maxLength={maxLengthClientName} msg={`${item.client}`} />
            </View>
          }
        </TouchableOpacity>
      </View>
    );
  }

  handleClick = async () => {
    await cartBoxClicked(this.props.carts, this.props.item.key, this.props.acSetDropdownCarts, this.props.acCurrentClient, this.props.appDevName);
    this.props.navigation.navigate('order', { BackSpace: true, });
  }
}

const mapStateToProps = (state) => ({
  context: state.global.context,
  appDevName: state.global.appDevName,
});

const mapDispatchToProps = {
  acCurrentClient
};

export default connect(mapStateToProps, mapDispatchToProps)(CarBox);

const styleCB = StyleSheet.create({
  vwClientBox: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowRadius: 2,
    marginTop: 20,
    marginLeft: 25,
    marginBottom: 5,
  },
  vwLastOrder: {
    padding: 10,
    width: '100%',
    flexGrow: 1,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  labelClient: {
    fontFamily: Font.BSemiBold,
    color: '#333'
  },
  rowRodape: {
    width: '100%',
    backgroundColor: '#f6f6f6',
    // justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    flexDirection: 'row',
    paddingHorizontal: 10
  },
});
