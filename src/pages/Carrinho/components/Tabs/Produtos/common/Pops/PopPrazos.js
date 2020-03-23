import React from 'react';
import { View, Text, } from 'react-native';
import { connect } from 'react-redux';
import { Font } from '../../../../../../../assets/fonts/font_names';
import { SimpleButton, InputText } from '../../../../../../../components';
import { acTogglePopCartDesconto, acCurrentProduct } from '../../../../../../../redux/actions/pages/cart';
import { acSetDropdownCarts, acSetCarts } from '../../../../../../../redux/actions/pages/catalog';
import { acToggleMask } from '../../../../../../../redux/actions/global';
import SrvOrder from '../../../../../../../services/Order';
import { atualizaCarrinhoAtual, agrupaCoresEGrades } from '../../../../../../../utils/CommonFns';

class PopPrazos extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      prazo: props.currentProduct.prazo || '',
      initPrazo: props.currentProduct.prazo || '',
    };
    this.confirmar = this.confirmar.bind(this);
  }

  componentDidMount() {
    const { currentProduct } = this.props;
    if (currentProduct.prazo) {
      this.setState({
        prazo: currentProduct.prazo,
        initPrazo: currentProduct.prazo,
      });
    }
  }

  componentWillUnmount() {
    this.clearInput();
  }

  clearInput = () => this.setState({ prazo: '' });

  async confirmar() {
    const {
      currentProduct, dropdown, carts,
      acTogglePanel,
    } = this.props;
    const cartDefault = carts.find(car => car.key === dropdown.current.key);

    acTogglePanel();
    this.props.acToggleMask();

    if (this.state.initPrazo !== this.state.prazo) {
      await SrvOrder.updatePrazoAllByModel({
        quote_sfa_guid__c: cartDefault.key,
        ref1: currentProduct.code,
        sf_prazo__c: this.state.prazo
      });

      const client = { sf_id: dropdown.current.clientId, };
      const currentTable = { code: cartDefault.sf_pricebook2id, };
      await atualizaCarrinhoAtual({ client, currentTable, acSetCarts: this.props.acSetCarts, acSetDropdownCarts: this.props.acSetDropdownCarts, });
      const corGrade = await agrupaCoresEGrades(dropdown, currentProduct);
      this.props.acCurrentProduct({ ...currentProduct, grades: corGrade.grades, colors: corGrade.colors });
    }
  }

  render() {
    const { currentProduct, } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ borderBottomWidth: 1, borderColor: '#CCC', width: '100%', paddingBottom: 11, marginBottom: 20 }}>
          <Text style={{ fontFamily: Font.AThin, fontSize: 16, color: '#333' }}>{currentProduct.code} - {currentProduct.name.toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 2 }}>
            <View style={{ marginBottom: 15, }}>
              <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11, marginBottom: 10 }}>VALOR DO PRAZO</Text>
              <InputText
                value={this.state.prazo}
                onChangeText={prazo => {
                  if (typeof Number(prazo) === 'number') {
                    this.setState({ prazo });
                  }
                }}
                setInput={this.clearInput}
                keyboardType="numeric"
                inputStyle={{
                  justifyContent: 'center',
                  width: '100%'
                }}
              />
            </View>
            {/*
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, paddingTop: 10 }}>
                <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11, marginBottom: 2 }}>DESCRIÇÃO</Text>
                <Text>Pariatur mollit ea sit id minim.</Text>
              </View>
            </View>
            */}
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderColor: '#CCC', width: '100%', paddingVertical: 20 }}>
          <SimpleButton
            msg="CANCELAR"
            txtStyle={{ fontSize: 14 }}
            tchbStyle={{ width: 105, height: 35, backgroundColor: '#999' }}
            action={() => {
              this.props.acTogglePanel();
              this.props.acToggleMask();
            }}
          />
          <SimpleButton
            msg="CONFIRMAR"
            txtStyle={{ fontSize: 14 }}
            tchbStyle={{ width: 105, height: 35 }}
            action={this.confirmar}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
    embalamentos: state.cart.embalamentos,
  currentProduct: state.cart.currentProduct,
           carts: state.catalog.carts,
        dropdown: state.catalog.dropdown,
});

const mapDispatchToProps = {
  acTogglePopCartDesconto,
  acToggleMask,
  acCurrentProduct,
  acSetDropdownCarts,
  acSetCarts,
};

export default connect(mapStateToProps, mapDispatchToProps)(PopPrazos);