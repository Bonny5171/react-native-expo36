import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Platform,} from 'react-native';
import { connect } from 'react-redux';
import { Font } from '../../../../../assets/fonts/font_names';
import { Item } from './common';
import { asyncForEach } from '../../../../../utils/CommonFns';
import SrvOrder from '../../../../../services/Order/';
import { acSetDropdownCarts, } from '../../../../../redux/actions/pages/catalog';

class TabProdutos extends React.PureComponent {
  render() {
    const { type, products, dropdown, carts, } = this.props;
    return (
      <View>
        <View>
          {/* Cabecalho da lista de produtos */}
          <View style={styles.vwListHeader}>
            <View style={styles.flexGrow1}>
              <Text style={styles.txtTotalProducts}>{`${products.length} produto`}{dropdown.current.products.length > 1 && 's'}</Text>
            </View>
            <View style={styles.flexRoww}>
              {
                type === 'Carrinho' &&
                <TouchableOpacity
                  style={styles.marginLeft4}
                  onPress={async () => {
                    if (Platform.OS === 'web') {
                      window.Electron.dialog.showMessageBox({
                        type: 'question',
                        title: 'Remoção dos modelos',
                        message: 'Tem certeza que deseja remover todos os itens do carrinho ?',
                        buttons: ['Não', 'Sim']
                      }, async (buttonIndex) => {
                        if (buttonIndex === 1) {
                          await asyncForEach(products, async (product) => SrvOrder.removerProdutosByModel(product.code, dropdown.current.key));
                          const cartDefault = carts.find(car => car.key === dropdown.current.key);
                          cartDefault.products = await SrvOrder.getProdutos(
                            [{ quote_sfa_guid__c: dropdown.current.key }],
                            { fields: ['sf_segmento_negocio__c'] });
                          await this.props.acSetDropdownCarts({ current: cartDefault, isVisible: false });
                        }
                      });
                    } else {
                      Alert.alert(
                        'Remoção dos modelos',
                        'Tem certeza que deseja remover todos os itens do carrinho ?',
                        [
                          {
                            text: 'Sim',
                            onPress: async () => {
                              await asyncForEach(products, async (product) => SrvOrder.removerProdutosByModel(product.code, dropdown.current.key));
                              const cartDefault = carts.find(car => car.key === dropdown.current.key);
                              cartDefault.products = await SrvOrder.getProdutos(
                                [{ quote_sfa_guid__c: dropdown.current.key }],
                                { fields: ['sf_segmento_negocio__c'] });
                              await this.props.acSetDropdownCarts({ current: cartDefault, isVisible: false });
                            },
                          },
                          {
                            text: 'Não',
                            onPress: () => {
                              console.log('Cancelado logoff');
                            },
                            style: 'cancel',
                          },
                        ],
                        { cancelable: true },
                      );
                    }
                  }}
                >
                  <Text style={styles.icon}>w</Text>
                </TouchableOpacity>
              }
              {
                type === 'Carrinho' &&
                <TouchableOpacity style={styles.marginLeft4} onPress={this.props.selectAllProduct}>
                  {
                    this.props.selectedAll ? (
                      <Text style={[styles.iconChecked, styles.activeBtnShadow]}>h</Text>
                    ) : (
                      <Text style={styles.iconUnChecked}>i</Text>
                    )
                  }
                </TouchableOpacity>
              }
              {/* gap botão */}
              <View style={styles.buttonGap} />
            </View>
          </View>
          <View data-id="containerDeProdutos">
            <FlatList
              data={products}
              renderItem={this.renderProducts}
              keyExtractor={(item) => item.code}
            />
          </View>
        </View>
      </View>
    );
  }

  renderProducts = ({ item, index, }) => {
    return (
      <Item
        key={item.code}
        index={index}
        produto={item}
        type={this.props.type}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  dropdown: state.catalog.dropdown,
     carts: state.catalog.carts,
});

const mapDispatchToProps = {
  acSetDropdownCarts
};

TabProdutos.defaultProps = {
  products: []
};

export default connect(mapStateToProps, mapDispatchToProps)(TabProdutos);

const styles = StyleSheet.create({
  icon: {
    fontFamily: Font.C,
    fontSize: 22,
    opacity: 0.5
  },
  marginLeft4: {
    marginLeft: 4
  },
  vwBuscaPorProd: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  vwSearch: {
    flexGrow: 1,
    flexDirection: 'row',
    maxWidth: 800,
  },
  inputSearch: {
    flexGrow: 1,
    height: 32,
    marginTop: 0
  },
  btnBuscar: {
    flexShrink: 1,
    justifyContent: 'center',
    marginLeft: 20,
    backgroundColor: '#0085B2',
    borderRadius: 17,
    paddingHorizontal: 20,
    height: 32,
  },
  txtBuscar: {
    color: 'white',
    fontFamily: Font.ASemiBold,
    fontSize: 14,
  },
  vwListHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderBottomColor: 'rgba(0,0,0,.2)',
    borderBottomWidth: 1
  },
  txtTotalProducts: {
    fontFamily: Font.ALight,
    fontSize: 16,
    color: 'rgba(0,0,0,.85)',
  },
  flexGrow1: {
    flexGrow: 1
  },
  flexRoww: {
    flexDirection: 'row'
  },
  buttonGap: {
    width: 30
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