import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, } from 'react-native';
import { connect } from 'react-redux';
import { Font } from '../../../assets/fonts/font_names';
import { IconActionless, TextLimit, Price, Fade, } from '../../../components';
import { agrupaProdutosNoCarrinho } from '../../../utils/CommonFns';
import { acCurrentClient } from '../../../redux/actions/pages/client';
import { cartBoxClicked } from '../../../services/Pages/Cart/Queries';

class CarBox extends React.Component {
  constructor(props) {
    super(props);
    this.maxNameLength = 17;
    this.state = {
      selected: false,
    };
  }

  render() {
    const { item, larguraDasCaixas, } = this.props;
    const maxLengthClientName = 20;
    const prod = agrupaProdutosNoCarrinho(item.products);
    const nItens = prod.length;

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
              <Text style={{ fontFamily: Font.ARegular, fontSize: 16 }}>{item.sf_pricebook2_name__c}</Text>
              <View data-id="checkbox" />
            </View>
            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
              <Text style={{ fontFamily: Font.ASemiBold, fontSize: 14, color: '#0085B2' }}>{item.name ? item.name : 'null'}</Text>
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
                  <Price price={item.totalAmount} />
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <IconActionless msg="n" style={{ fontSize: 22, color: '#999' }} />
                <Text style={{ fontSize: 12, color: 'black', paddingTop: 3 }} >{`${nItens} ITENS`}</Text>
              </View>

            </View>
          </View>
          {
            this.props.context === 'Admin' &&
            <View style={styleCB.rowRodape}>
              <TextLimit style={styleCB.labelClient} maxLength={maxLengthClientName} msg={`${item.client}`} />
            </View>
          }
          {/* CHECKBOX */}
          <Fade style={styleCB.checkbox} visible={this.props.selectList} duration={300}>
            <TouchableOpacity onPress={(this.handleChecked)} >
              {
                this.state.selected ? (<Text style={[styleCB.iconChecked, styleCB.activeBtnShadow]}>h</Text>) : (<Text style={styleCB.iconUnChecked}>i</Text>)
              }
            </TouchableOpacity>
          </Fade>

        </TouchableOpacity>
      </View>
    );
  }

  handleChecked = async () => {
    const { item, } = this.props;

    if (this.state.selected) {
      this.props.acRemoveCopyCart(item);
    } else {
      this.props.acAddCopyCart(item);
    }

    this.setState({ selected: !this.state.selected });
  }

  handleClick = async () => {
    await cartBoxClicked(this.props.carts, this.props.item.key, this.props.acSetDropdownCarts, this.props.acCurrentClient, this.props.appDevName);
    this.props.navigation.navigate('carrinho', { BackSpace: true, wasInCarts: true, carrinho: this.props.item });
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
    flex: 1,
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

  checkbox: {
    position: 'absolute',
    right: 6,
    top: 10,
  },
  iconChecked: {
    fontFamily: Font.C,
    color: 'rgba(0, 122, 176, 0.85)',
    fontSize: 22,
    textShadowOffset: { width: 1, height: 2 },
    textShadowColor: '#0085B2',
    textShadowRadius: 4
  },
  activeBtnShadow: {
    color: '#0085B2',
    textShadowOffset: { width: 0, height: 2 },
    textShadowColor: 'rgba(0, 133, 178, 0.6)',
    textShadowRadius: 3
  },
  iconUnChecked: {
    fontFamily: Font.C,
    color: 'rgba(102, 102, 102, 0.5)',
    fontSize: 22
  },
});
