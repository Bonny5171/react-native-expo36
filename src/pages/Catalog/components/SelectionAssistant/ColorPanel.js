import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text, Platform } from 'react-native';
import { Fade, CheckBox, ImageLoad } from '../../../../components';
import global from '../../../../assets/styles/global';
import SrvOrder from '../../../../services/Order/';
import { asyncForEach, agrupaCoresEGrades, getEmbalamentoPadrao } from '../../../../utils/CommonFns';
import SrvProduct from '../../../../services/Product';

class ColorPanel extends React.PureComponent {
  render() {
    const {
      visible,
      container,
      colors = [],
    } = this.props;

    return (
      <Fade visible={visible} style={[{ flex: 1, marginTop: 2 }, container]}>
        <FlatList
          data={colors}
          style={[global.flexOne, this.props.maxHeight]}
          renderItem={this.renderItem}
          keyExtractor={item => item.code}
        />
      </Fade>
    );
  }

  renderItem = ({ item }) => {
    return (
      <Color
        item={item}
        acSelectColor={this.props.acSelectColor}
        acRemoveColor={this.props.acRemoveColor}
        carts={this.props.carts}
        dropdown={this.props.dropdown}
        grades={this.props.grades}
        colors={this.props.colors}
        currentProduct={this.props.currentProduct}
        acSetDropdownCarts={this.props.acSetDropdownCarts}
        acSetGrades={this.props.acSetGrades}
        typeComponent={this.props.typeComponent}
        acCurrentProduct={this.props.acCurrentProduct}
        acAssistant={this.props.acAssistant}
      />
    );
  }
}

const getEmbalamentoAtual = (dropdown) => {
  if (dropdown.current.products.length > 0) {
    return dropdown.current.products[0].ref4;
  }
  return null;
};

const getPrazo = (dropdown) => {
  if (dropdown.current.products.length > 0) {
    return dropdown.current.products[0].prazo;
  }
  return null;
};

const getDesconto = (dropdown) => {
  if (dropdown.current.products.length > 0) {
    return dropdown.current.products[0].desconto;
  }
  return null;
};

const getPrice = (dropdown, code) => {
  const product = dropdown.current.products.find((p) => p.code === code);
  if (product && product.sf_unit_price) return product.sf_unit_price;
  return null;
};

export default ColorPanel;

const Color = ({
  item,
  acSelectColor,
  carts,
  dropdown,
  acSetDropdownCarts,
  currentProduct,
  grades,
  acSetGrades,
  colors,
  typeComponent,
  acCurrentProduct,
}) => {
  const {
    name,
    code,
    newColor,
    uri,
    isChosen,
  } = item;
  return (
    <TouchableOpacity
      style={styles.vwColor}
      disabled
    >
      <CheckBox
        action={async () => {
          // Action para adicionar cor
          acSelectColor(code);

          // Declare variaveis
          const sf_photo_file_name__c = `${currentProduct.code}${code}00`;
          const cartDefault = carts.find(car => car.key === dropdown.current.key);
          const currentTable = { code: cartDefault.sf_pricebook2id, };
          let protudosMapeados = cartDefault.products;

          // Define embalamento
          let embalamento = getEmbalamentoAtual(dropdown);
          if (!embalamento) {
            embalamento = await getEmbalamentoPadrao(dropdown.current.sf_account_id);
          }

          // Define prazo
          const prazo = getPrazo(dropdown);

          // Define desconto
          const desconto =  getDesconto(dropdown);

          // Define preço;
          let sf_unit_price = getPrice(dropdown, currentProduct.code);
          if (!sf_unit_price) {
            const prices = await SrvProduct.getPriceProduct(cartDefault.sf_pricebook2id, currentProduct.code, code);
            if (embalamento) {
              const price = prices.find(p => p.ref4 === embalamento);
              if (!price) {
                embalamento = prices[0].name4;
              }
              sf_unit_price = price ? price.sf_unit_price : prices[0].sf_unit_price;
            } else if (prices.length > 0) {
              embalamento = prices[0].ref4;
              sf_unit_price = prices[0].sf_unit_price;
            }
          }
          if (typeComponent === 'AssistenteDeSelecao') {
            if (isChosen) {
              await SrvOrder.removerProdutosByCor(currentProduct.code, code, dropdown.current.key);

              // Zera as grades caso seja a ultima cor a ser removida
              if (colors.filter(d => d.isChosen).length === 1) {
                acSetGrades([]);
              }

              protudosMapeados = protudosMapeados.filter(item => item.ref2 !== code);
            } else {
              await SrvOrder.removerProdutosComCoresGradesNulas(dropdown.current.key, currentProduct.code);

              const gradesAtivas = grades.filter(c => c.isChosen);
              if (gradesAtivas.length === 0) {
                const p = await SrvOrder.addProduto({
                  quote_sfa_guid__c: dropdown.current.key,
                  ref1: currentProduct.code,
                  ref2: code,
                  ref4: embalamento,
                  sf_unit_price,
                  sf_description: currentProduct.name,
                  sf_photo_file_name__c,
                  sf_prazo__c: prazo,
                  sf_desconto_item__c: desconto,
                });

                protudosMapeados.push(p);
              } else {
                await SrvOrder.removerProdutosComGradesNulas(
                  dropdown.current.key,
                  currentProduct.code
                );

                await asyncForEach(gradesAtivas, async element => {
                  const qtdParesPorGrades = await SrvProduct.getQtdParesPorGrades(currentProduct.code, element.code);
                  const p = await SrvOrder.addProduto({
                    quote_sfa_guid__c: dropdown.current.key,
                    ref1: currentProduct.code,
                    ref2: code,
                    ref3: element.code,
                    ref4: embalamento,
                    sf_unit_price,
                    sf_description: currentProduct.name,
                    sf_photo_file_name__c,
                    sf_sum_of_pairs__c: qtdParesPorGrades.sf_sum_of_pairs__c,
                    sf_prazo__c: prazo,
                    sf_desconto_item__c: desconto,
                  });
                  protudosMapeados.push(p);
                });
              }
            }

            cartDefault.products = await SrvOrder.getProdutos(
              [{ quote_sfa_guid__c: dropdown.current.key }],
              { fields: ['sf_segmento_negocio__c'] });

            acSetDropdownCarts({ current: cartDefault, isVisible: false });
          }

          if (typeComponent === 'DetalheCarrinho') {
            if (isChosen) {
              await SrvOrder.removerProdutosByCor(currentProduct.code, code, dropdown.current.key);
            } else {
              await SrvOrder.removerProdutosComCoresGradesNulas(dropdown.current.key, currentProduct.code);

              await SrvOrder.addProduto({
                quote_sfa_guid__c: dropdown.current.key,
                ref1: currentProduct.code,
                ref2: code,
                ref4: embalamento,
                sf_unit_price,
                sf_description: currentProduct.name,
                sf_photo_file_name__c,
                sf_prazo__c: prazo,
                sf_desconto_item__c: desconto,
              });
            }

            cartDefault.products = await SrvOrder.getProdutos(
              [{ quote_sfa_guid__c: dropdown.current.key }],
              { fields: ['sf_segmento_negocio__c'] });
            await acSetDropdownCarts({ current: cartDefault, isVisible: false });

            const corGrade = await agrupaCoresEGrades(dropdown, currentProduct);
            acCurrentProduct({ ...currentProduct, grades: corGrade.grades, colors: corGrade.colors, });
          }
        }}
        param={code}
        isChosen={isChosen}
      />
      <View
        style={[[{ margin: 4 }, [styles.activeColor, { borderColor: 'transparent' }]]]}
      >
        {/* <ImageBackground
          source={{ uri }}
          style={styles.img}
          resizeMode="cover"
        /> */}
        <ImageLoad
          sizeType="s"
          resizeMode="contain"
          filename={uri}
          containerStyle={styles.img}
        />
      </View>
      {
        newColor ?
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[global.tag, {  borderRadius: 10, paddingVertical: 2, paddingHorizontal: 6, backgroundColor: '#090' }]}>NOVA COR</Text>
          </View>
        :
          <View style={{ width: 75 }} />
      }
      <View data-id="ctnDaCor" style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
        <Text style={[global.h6Bold, { fontSize: 13, color: '#333333' }]}>{code}</Text>
        {Platform.OS !== 'web' ?
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <Text style={[global.h5, { color: '#999', fontSize: 12, flex: 1, flexWrap: 'wrap', flexShrink: 1, textAlign: 'right' }]}>{name}</Text>
          </View>
          :
          <Text data-id="nomeDaCor" style={[global.h5, { color: '#999', fontSize: 12, textAlign: 'right' }]}>{name}</Text>
        }
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   position: 'absolute',
  //   zIndex: 4,
  // },
  vwColor: {
    // height: 80,
    // flexGrow: 1,
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    // width: '100%',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#CCC',
  },
  activeColor: {
    borderWidth: 2,
    borderColor: '#CCC',
    height: 65,
    width: 65,
  },
  img: {
    width: '100%',
    height: '100%',
  }
});