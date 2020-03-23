import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { Font } from '../../../../../../../assets/fonts/font_names';
import { DropDown, DropDownView, SimpleButton } from '../../../../../../../components';
import { acSetEmbalamentos, acToggleCartuchoRule, acCurrentProduct, acTogglePanel } from '../../../../../../../redux/actions/pages/cart';
import { acToggleMask } from '../../../../../../../redux/actions/global';
import { agrupaCoresEGrades, asyncForEach, upsertEmbalagem, atualizaCarrinhoAtual } from '../../../../../../../utils/CommonFns';
import { getEmbalamentos } from '../../../../../../../services/Pages/Cart/Queries';
import SrvOrder from '../../../../../../../services/Order';
import { acSetDropdownCarts, acSetCarts } from '../../../../../../../redux/actions/pages/catalog';
import { semImg } from '../../../../../../../assets/images';
import SrvProduct from '../../../../../../../services/Product';

class PopEmbalamento extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      embalamento: props.currentProduct.embalamento || '',
      dropdown: false,
    };
    this.confirmar = this.confirmar.bind(this);
  }

  async componentDidMount() {
    const embalamentos = await getEmbalamentos(this.props.currentProduct.code);
    await this.props.acSetEmbalamentos(embalamentos);
  }

  render() {
    const { currentProduct } = this.props;
    if (currentProduct === null) return null;
    const embalamentoNome = currentProduct && currentProduct.name ? currentProduct.name.toUpperCase() : ' - ';

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.vwProductInfo}>
          <Text style={styles.txtProductInfo}>{currentProduct.code} - {embalamentoNome}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 2 }}>
            <View style={{ marginBottom: 15, }}>
              <Text style={styles.h2}>OPÇÕES</Text>
              <DropDown
                isSimpleString
                current={this.state.embalamento}
                acOpenCloseDropDown={this.toggleDropdown}
                params={['embalamentos']}
                container={styles.vwDropEmbalamento}
                maxLength={15}
                txtInput={{ fontSize: 14 }}
                shouldUpperCase
              />
            </View>
            <View>
              <View>
                <Text style={styles.label}>IMAGEM</Text>
                <View style={{ height: 140, backgroundColor: '#f6f6f6', padding: 5, borderRadius: 6, borderColor: 'rgba(0,0,0,.3)', borderWidth: 1 }}>
                  <ImageBackground source={semImg} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
                </View>
              </View>
              {
                this.pointerEmbalamento !== undefined && (
                  <View style={styles.vwDescription}>
                    <Text style={styles.h2}>DESCRIÇÃO</Text>
                    <Text style={styles.txtDescription}>{this.props.embalamentos[this.pointerEmbalamento].description}</Text>
                  </View>
                )
              }
            </View>
            <DropDownView
              isVisible={this.state.dropdown}
              options={this.props.embalamentos}
              updateCurrent={this.updateCurrent}
              acToggleDropdown={this.toggleDropdown}
              params={['embalamentos']}
              vwStyle={styles.vwDropViewEmbalamento}
              listStyle={styles.listDropEmbalamento}
              maxHeight={479}
              txtItemStyle={{ fontSize: 14 }}
              shouldUpperCase
            />
          </View>
          {/* <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11, marginBottom: 8 }}>OPÇÕES</Text>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text style={{ fontFamily: Font.C, fontSize: 22, opacity: 0.5, marginRight: 5, transform: [{ translateY: -4 }] }}>i</Text>
              <Text style={{ fontFamily: Font.ARegular, fontSize: 13 }}>Aplicar para todos os modelos previamente selecionados</Text>
            </View>
          </View> */}
        </View>
        <View style={styles.vwCancel}>
          <SimpleButton
            msg="CANCELAR"
            txtStyle={styles.txtButtons}
            tchbStyle={styles.tchbCancel}
            action={() => {
              this.props.acToggleMask();
              this.props.acTogglePanel();
            }}
          />
          <SimpleButton
            msg="CONFIRMAR"
            action={this.confirmar}
            txtStyle={styles.txtButtons}
            tchbStyle={styles.tchbConfirm}
          />
        </View>
      </View>
    );
  }

  async confirmar() {
    const { dropdown, currentProduct, } = this.props;

    /*  Aplica regra para embalamento tipo 'Cartucho'
        grades com total de 6 pares. */
    // const isEmbalamentoCartucho = this.state.embalamento.toLowerCase() === 'cartucho';
    // const hasGradesDeSeisPares = this.verificaGradesDeSeisPares();
    // if (isEmbalamentoCartucho && hasGradesDeSeisPares) {
      this.alertChangeEmbalamentoToCartucho(this.state.embalamento, this.pointerEmbalamento);
    // } else {
    //   this.props.acToggleMask();
    //   this.props.acTogglePanel();

      // Atualiza o "embalamento" na ORDER.
      // await SrvOrder.updateCarrnho({
      //  id: dropdown.current.key,
      //  ref4: this.state.embalamento,
      // });

    //   await this.atualizaCopomentes();
    // }
  }

  async atualizaCopomentes() {
    const { dropdown, currentProduct, acSetCarts, } = this.props;
    const cartDefault = this.props.carts.find(car => car.key === dropdown.current.key);

    // Atualiza todos os "embalamentos" na ORDER_ITEM.
    if (currentProduct.changeAll) {

      const productCode = currentProduct.code;
      const colorCode = currentProduct.colors[0].key; // Fix-me...

      const prices = await SrvProduct.getPriceProduct(cartDefault.sf_pricebook2id, productCode, colorCode);
      const price = prices.find(p => p.ref4 === this.state.embalamento);
      const sf_unit_price = price ? price.sf_unit_price : prices[0].sf_unit_price;

      await SrvOrder.updateEmbalamentoAllByModel({
        quote_sfa_guid__c: cartDefault.key,
        ref1: currentProduct.code,
        ref4: this.state.embalamento,
        sf_unit_price,
      });
    } else {
      await upsertEmbalagem({ id: currentProduct.key, embalagem: this.state.embalamento, });
    }

    // Atualiza todos os "preços" na ORDER_ITEM.
    // Pois pode ter ocorrido uma alteração de embalamento
    // e consequentemente uma atualização dos preços.
    await SrvOrder.updatePriceAllByModel({
      quote_sfa_guid__c: cartDefault.key,
      ref1: currentProduct.code,
      ref4: this.state.embalamento,
      sf_desconto_item__c: currentProduct.desconto,
    });

    // Actions...
    const currentTable = { code: cartDefault.sf_pricebook2id, };
    await atualizaCarrinhoAtual({ client: {
      sf_id: dropdown.current.clientId,
    }, currentTable, acSetCarts, acSetDropdownCarts: this.props.acSetDropdownCarts, });
    const corGrade = await agrupaCoresEGrades(this.props.dropdown, currentProduct);
    this.props.acCurrentProduct({ ...currentProduct, grades: corGrade.grades, colors: corGrade.colors });
  }

  verificaGradesDeSeisPares = () => {
    const { currentProduct } = this.props;
    const { grades } = currentProduct;
    const condition = g => g.sf_sum_of_pairs__c === 6;
    return grades.find(condition) !== undefined;
  }

  alertChangeEmbalamentoToCartucho = async (value, index) => {
    // const response = confirm('Existem grades de 6 pares já incluídas neste modelo e são incompatíveis com o embalamento selecionado. Deseja remover as grades de 6 já incluídas?');
    // if (response === true) {
    //   const { currentProduct } = this.props;
    //   const { grades } = currentProduct;
    //   const condition = g => g.sf_sum_of_pairs__c === 6;
    //   const gradesRemovidas = grades.filter(condition);
    //   await asyncForEach(gradesRemovidas, async (g) => SrvOrder.removerProduto(g.key));
    //   const cartDefault = this.props.carts.find(car => car.name === this.props.dropdown.current.name);
    //   const corGrade = await agrupaCoresEGrades(this.props.dropdown, currentProduct);
    //   this.props.acCurrentProduct({ ...currentProduct, grades: corGrade.grades, colors: corGrade.colors });
    //   cartDefault.products = await SrvOrder.getProdutos([{ quote_sfa_guid__c: cartDefault.key }]);
    //   this.props.acSetDropdownCarts({ current: cartDefault, isVisible: false });

    //   this.props.acToggleMask();
    //   this.props.acTogglePanel();

      await this.atualizaCopomentes();
    // }
  }

  updateCurrent = (value, index) => {
    this.setState({ embalamento: value });
    this.pointerEmbalamento = index;
  }

  toggleDropdown = () => this.setState({ dropdown: !this.state.dropdown });
}

const mapStateToProps = (state) => ({
    embalamentos: state.cart.embalamentos,
  currentProduct: state.cart.currentProduct,
           carts: state.catalog.carts,
        dropdown: state.catalog.dropdown,
});

const mapDispatchToProps = {
  acSetEmbalamentos,
  acToggleCartuchoRule,
  acCurrentProduct,
  acToggleMask,
  acTogglePanel,
  acSetDropdownCarts,
  acSetCarts,
};

export default connect(mapStateToProps, mapDispatchToProps)(PopEmbalamento);

const styles = StyleSheet.create({
  vwProductInfo: {
    borderBottomWidth: 1,
    borderColor: '#CCC',
    width: '100%',
    paddingBottom: 11,
    marginBottom: 20
  },
  txtProductInfo: {
    fontFamily: Font.AThin,
    fontSize: 16,
    color: '#333',
  },
  icDropDown: {
    fontSize: 22,
    color: '#0085B2',
    transform: [{ rotate: '270deg' }],
    paddingHorizontal: 6,
  },
  label: {
   fontFamily: Font.BSemiBold,
   fontSize: 11,
   marginBottom: 2,
  },
  h2: {
    fontFamily: Font.BSemiBold,
    fontSize: 11,
    marginBottom: 10
  },
  vwDescription: {
    flex: 1,
    paddingTop: 10,
  },
  txtDescription: {
    fontFamily: Font.AMedium,
    fontSize: 9,
  },
  vwDropEmbalamento: {
    height: 32,
    width: '100%'
  },
  vwDropViewEmbalamento: {
    position: 'absolute',
    width: 281,
    top: 49,
  },
  listDropEmbalamento: {
    width: 258,
  },
  vwCancel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#CCC',
    width: '100%',
    paddingVertical: 20,
  },
  tchbCancel: {
    paddingHorizontal: 20,
    height: 35,
    backgroundColor: '#999',
  },
  tchbConfirm: {
    paddingHorizontal: 20,
    height: 35,
  },
  txtButtons: {
    fontSize: 14
  }
});