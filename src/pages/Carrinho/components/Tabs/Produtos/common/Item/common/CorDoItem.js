import React from 'react';
import { View, Text, TouchableOpacity, } from 'react-native';
import { Font } from '../../../../../../../../assets/fonts/font_names';
import { Grades } from '.';
import SrvProduct from '../../../../../../../../services/Product';
import { extractSizes, AtivaGrades, agrupaCoresEGrades, getEmbalamentoPadrao, } from '../../../../../../../../utils/CommonFns';
import ImageLoad from '../../../../../../../../components/ImageLoad';
import SrvOrder from '../../../../../../../../services/Order/';

class CorDoItem extends React.Component {
  _renderLabelsDaCor() {
    if (this.props.idx !== 0) return null;
    return (
      <View data-id="labelsCor" style={{ flexDirection: 'row' }}>
        <View style={{ flex: 2, flexShrink: 1 }} />
        <View style={{ flex: 2, flexShrink: 1 }} />
        <View style={{ flex: 2, flexShrink: 1, alignItems: 'center' }}>
          <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11 }}>COR</Text>
        </View>
        <View style={{ flex: 2, alignItems: 'center' }}>
          <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11 }}>CÓDIGO</Text>
        </View>
      </View>
    );
  }

  removerCor = async () => {
    const {
      dropdown,
      color,
      currentProduct,
      carts,
    } = this.props;

    const cartDefault = carts.find(car => car.key === dropdown.current.key);
    await SrvOrder.removerProdutosByCor(currentProduct.code, color.key, dropdown.current.key);

    // Zera as grades caso seja a ultima cor a ser removida
    if (currentProduct.colors.length === 1) {
      let embalamentoPadrao = await getEmbalamentoPadrao(dropdown.current.sf_account_id);
      let sf_unit_price;
      const prices = await SrvProduct.getPriceProduct(cartDefault.sf_pricebook2id, currentProduct.code, color.key);

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
        ref1: currentProduct.code,
        ref4: embalamentoPadrao,
        sf_unit_price,
        sf_description: currentProduct.name,
        sf_photo_file_name__c: `${currentProduct.code}${color.key}00`,
      });

      this.props.acFlushGrades();
    }

    cartDefault.products = await SrvOrder.getProdutos(
      [{ quote_sfa_guid__c: dropdown.current.key }],
      { fields: ['sf_segmento_negocio__c'] });
    await this.props.acSetDropdownCarts({ current: cartDefault, isVisible: false });

    const corGrade = await agrupaCoresEGrades(dropdown, currentProduct);
    this.props.acCurrentProduct({ ...currentProduct, grades: corGrade.grades, colors: corGrade.colors, });
  }

  openPainelGrade = async () => {
    const {
      produto,
      dropdown,
      color,
      currentProduct,
    } = this.props;

    let gradesCurrent = await SrvProduct.getGrades(produto.code);
    const sizes = extractSizes(gradesCurrent);
    const objGrades = AtivaGrades(gradesCurrent, dropdown, produto.code, color.key);
    const product = { ...currentProduct, currenteColor: color };

    this.props.acCurrentProduct({ ...product, grades: objGrades.grades, sizes }, color.key);
    this.props.acSetPanel(5, { title: `${objGrades.grades.length} GRADES DISPONÍVEIS` });
    this.props.acToggleMask();
  }

  render() {
    return (
      <View data-id="itemCor" style={{ flexDirection: 'row', flexGrow: 1, marginBottom: 8 }}>
        <View data-id="colunaCor" style={{ width: '30%' }}>
          {this._renderLabelsDaCor()}

          <View data-id="dadosCor" style={{ flexDirection: 'row', alignItems: 'center', height: 35 }}>
            <View style={{ flex: 2, flexShrink: 1 }}>
              {
                this.props.type === 'Carrinho' &&
                <TouchableOpacity onPress={this.removerCor}>
                  <Text style={{ fontFamily: Font.C, fontSize: 25, opacity: 0.5 }}>t</Text>
                </TouchableOpacity>
              }
            </View>
            <View style={{ flex: 2, flexShrink: 1 }}>
              {
                this.props.type === 'Carrinho' &&
                <TouchableOpacity onPress={this.openPainelGrade}>
                  <Text style={{ fontFamily: Font.C, fontSize: 25, opacity: 0.5 }}>§</Text>
                </TouchableOpacity>
              }
            </View>
            <View style={{ flex: 2, flexShrink: 1, alignItems: 'center' }}>
              <ImageLoad
                isClickable
                onPress={() => {
                  this.props.acToggleZoom({ url: `${this.props.produto.code}${this.props.color.key}00`, name: this.props.produto.name });
                }}
                sizeType="s"
                resizeMode="contain"
                filename={`${this.props.produto.code}${this.props.color.key}00`}
                tchbStyle={{ width: '100%' }}
                containerStyle={{ width: '100%', height: 35 }}
              />
            </View>
            <View style={{ flex: 2, alignItems: 'center' }}>
              <Text style={{ fontFamily: Font.ARegular, fontSize: 14 }}>{this.props.color.key}</Text>
            </View>
          </View>
        </View>
        <Grades
          grades={this.props.color.grades}
          corIdx={this.props.idx}
          produto={this.props.produto}
          type={this.props.type}
        />
      </View>
    );
  }
}

export default CorDoItem;