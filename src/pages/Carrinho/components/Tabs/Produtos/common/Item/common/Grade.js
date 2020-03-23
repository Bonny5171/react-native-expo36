import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Font } from '../../../../../../../../assets/fonts/font_names';
import { InputText, Price, DisableComponent } from '../../../../../../../../components';
import { upsertQuantidade, agrupaCoresEGrades, getEmbalamentoPadrao, asyncForEach, } from '../../../../../../../../utils/CommonFns';
import SrvOrder from '../../../../../../../../services/Order/';
import SrvProduct from '../../../../../../../../services/Product';

class GradeDoItemDoCarrinho extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      quantidade: '',
      initQuantidade: '',
    };

    this.upInsertQuantidade = this.upInsertQuantidade.bind(this);
  }

  componentDidMount() {
    this.defineStatoDaGrade();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.grade !== this.props.grade) {
      this.defineStatoDaGrade();
    }
  }

  defineStatoDaGrade() {
    if (this.props.grade) {
      const quantidade = this.props.grade.quantity ? this.props.grade.quantity.toString() : '';
      const initQuantidade = quantidade;

      this.setState({
        key: this.props.grade.key,
        quantidade,
        initQuantidade,
      });
    }
  }

  _renderLabelsDaGrade() {
    // só imprime as labels na primeira grade da primeira cor
    if (Number(this.props.idx) === 0 && this.props.corIdx === 0) {
      return (
        <View data-id="labelsGrades" style={{ flexDirection: 'row' }}>
          <View style={{ flex: 2, alignItems: 'center' }}>
            <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11 }}>GRADE</Text>
          </View>
          <View style={{ flex: 3, alignItems: 'center' }}>
            <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11 }}>QTD. GRADES</Text>
          </View>
          <View style={{ flex: 3, alignItems: 'center' }}>
            <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11 }}>PREÇO</Text>
          </View>
          <View style={{ flex: 3, alignItems: 'center' }}>
            <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11 }}>TOTAL</Text>
          </View>
          <View style={{ flex: 1 }} />
        </View>
      );
    }
    return null;
  }

  async atualizaItems() {
    const { carts, dropdown } = this.props;
    const cartDefault = carts.find(car => car.key === dropdown.current.key);
    cartDefault.products = await SrvOrder.getProdutos(
      [{ quote_sfa_guid__c: dropdown.current.key }],
      { fields: ['sf_segmento_negocio__c'] }
    );
    const corGrade = await agrupaCoresEGrades(this.props.dropdown, this.props.currentProduct);
    this.props.acCurrentProduct({ ...this.props.currentProduct, grades: corGrade.grades, colors: corGrade.colors });
    await this.props.acSetDropdownCarts({ current: cartDefault, isVisible: false });
  }

  async upInsertQuantidade() {
    if (this.state.initQuantidade !== this.state.quantidade) {
      await upsertQuantidade(this.props, { id: this.state.key, quantity: this.state.quantidade, });
      await this.atualizaItems();
      this.setState({ initQuantidade: this.state.quantidade });
    }
  }

  removerGrade = async () => {
    const { carts, grade, grades, dropdown, currentProduct,ððð } = this.props;
    const { ref1, ref2, ref3 } = grade;
    const cartDefault = carts.find(car => car.key === dropdown.current.key);

    await SrvOrder.removerProdutosByModeloCorGrade(ref1, ref2, ref3, dropdown.current.key);

    // Reincere as linhas das cores ativas.
    if (grades.length === 1) {
      const cartDefault = carts.find(car => car.key === dropdown.current.key);
      let embalamentoPadrao = await getEmbalamentoPadrao(dropdown.current.sf_account_id);
      let sf_unit_price;
      const prices = await SrvProduct.getPriceProduct(cartDefault.sf_pricebook2id, grade.ref1, grade.ref2);

      if (embalamentoPadrao) {
        const price = prices.find(p => p.ref4 === embalamentoPadrao);
        if (!price) {
          embalamentoPadrao = prices[0].name4;
        }
        sf_unit_price = price ? price.sf_unit_price : prices[0].sf_unit_price;
      } else if (prices.length > 0) {
        embalamentoPadrao = prices[0].ref4;
        sf_unit_price = prices[0].sf_unit_price;
      }

      await SrvOrder.addProduto({
        quote_sfa_guid__c: dropdown.current.key,
        ref1: ref1,
        ref2: ref2,
        ref4: embalamentoPadrao,
        sf_unit_price,
        sf_description: currentProduct.name,
        sf_photo_file_name__c: `${ref1}${ref2}00`,
      });
    }

    cartDefault.products = await SrvOrder.getProdutos(
      [{ quote_sfa_guid__c: dropdown.current.key }],
      { fields: ['sf_segmento_negocio__c'] });
    await this.props.acSetDropdownCarts({ current: cartDefault, isVisible: false });

    const corGrade = await agrupaCoresEGrades(dropdown, currentProduct);
    this.props.acCurrentProduct({ ...currentProduct, grades: corGrade.grades, colors: corGrade.colors, });
  }

  render() {
    const { grade, } = this.props;
    const { sf_unit_price = '0.00', sf_total_price = '0.00', } = grade;
    const styleRow = this.props.labels ? { paddingTop: 5 } : { paddingTop: 0 };

    return (
      <View data-id="itemGrade" style={{ flexGrow: 1 }}>
        {this._renderLabelsDaGrade()}

        <View data-id="dadosGrades" style={[{ flexDirection: 'row', alignItems: 'center', height: 30 }, styleRow]}>
          <View style={{ flex: 2, alignItems: 'center' }}>
            <TouchableOpacity>
              <Text style={{ fontFamily: Font.ARegular, fontSize: 14, color: '#0085B2', textDecorationColor: '#0085B2', textDecorationLine: 'underline', textDecorationStyle: 'solid' }}>
                {this.props.grade.ref3}
              </Text>
            </TouchableOpacity>
          </View>
          {/* QUANTIDADE */}
          <View style={{ flex: 3, alignItems: 'center', }}>
            {
              this.props.type === 'Order' ?
                <Text>{this.state.quantidade}</Text>
                :
                <InputText
                  noClear
                  value={this.state.quantidade}
                  maxLength={3}
                  keyboardType="numeric"
                  onChangeText={(quantidade) => this.setState({ quantidade })}
                  onBlur={this.upInsertQuantidade}
                  txtInputStyle={{ fontSize: 12, textAlign: 'center' }}
                  inputStyle={{ height: 25, width: 32, paddingLeft: null, marginRight: 5, backgroundColor: 'white', borderRadius: 6, borderColor: 'rgba(0,0,0,.3)', borderWidth: 1 }}
                />
            }
          </View>
          {/* PREÇO LISTA */}
          <View style={{ flex: 3, alignItems: 'center' }}>
            <Text style={{ fontFamily: Font.ARegular, fontSize: 14 }}>
              <Text style={{ fontSize: 11, marginRight: 5 }}>R$</Text>
              <Price price={sf_unit_price} />
            </Text>
          </View>
          {/* PREÇO TOTAL */}
          <View style={{ flex: 3, alignItems: 'flex-end' }}>
            <Text style={{ fontFamily: Font.ARegular, fontSize: 14, paddingRight: 20 }}>
              <Text style={{ fontSize: 11, marginRight: 5 }}>R$</Text>
              <Price price={sf_total_price} />
            </Text>
          </View>
          {/* EVENTO: REMOVER GRADE */}
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <DisableComponent
              isDisabled={this.props.type !== 'Carrinho'}
            >
              <TouchableOpacity onPress={this.removerGrade}>
                <Text style={{ fontFamily: Font.C, fontSize: 25, opacity: 0.5 }}>t</Text>
              </TouchableOpacity>
            </DisableComponent>
          </View>
        </View>
      </View>
    );
  }
}


export default GradeDoItemDoCarrinho;