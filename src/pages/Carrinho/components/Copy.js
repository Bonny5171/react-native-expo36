import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, } from 'react-native';
import { SimpleButton, SwitchButton, } from '../../../components';
import CopyRow from './CopyRow';
import global from '../../../assets/styles/global';
import SrvOrder from '../../../services/Order/';
import SrvProduct from '../../../services/Product';
import { Font } from '../../../assets/fonts/font_names';
import { ToastStyles } from '../../../components/Toaster';
import { asyncForEach, atualizaCarrinhoAtual, } from '../../../utils/CommonFns';

class Copy extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      resulmoOpen: true,
      carts: [],
      outPutCopy: [],
      switchButton: false,
      // switchButton "false" === "MOVER"
      // switchButton "true" === "COPIAR"
    };
  }

  async componentDidMount() {
    const carts = await SrvOrder.getCarrinhos();
    await asyncForEach(carts, async (car) => {
      car.products = await SrvOrder
        .getProdutos(
          [{ quote_sfa_guid__c: car.key }],
          { fields: ['sf_segmento_negocio__c'] }
        );
    });

    const filterCarts = c => c.key !== this.props.dropdown.current.key;
    const filterTableList = c => c.sf_pricebook2id === this.props.dropdown.current.sf_pricebook2id;
    const filterAccount = c => c.sf_account_id === this.props.dropdown.current.sf_account_id;

    let cartsFiltred = carts.filter(filterCarts);
    cartsFiltred = cartsFiltred.filter(filterTableList);
    cartsFiltred = cartsFiltred.filter(filterAccount);
    this.setState({ carts: cartsFiltred });
  }

  handleSwitch = async () => {
    this.setState({ switchButton: !this.state.switchButton });
  }

  ListEmpty = () => {
    return (
      <View style={[{ flex: 1, paddingVertical: 10 }]}>
        <Text style={{ textAlign: 'center' }}>Nenhum carrinho encontrado</Text>
      </View>
    );
  };

  render() {
    if (!this.props.isVisible) return null;
    const stateVisible = this.state.resulmoOpen && this.props.cartsCopy.length > 0;
    return (
      <View style={[global.flexOne, { paddingTop: 5 }]}>
        <View style={{ borderBottomWidth: 1, width: '100%', borderBottomColor: '#CCC', paddingBottom: 10, alignItems: 'center' }}>
          <Text style={{ fontFamily: Font.C, fontSize: 28, opacity: 0.5, }}>f</Text>
          <Text style={[global.txtLabel, { fontSize: 11, marginBottom: 2 }]}>OUTRO(S) CARRINHO(S)</Text>
        </View>
        <ScrollView style={[{ flex: 1, paddingVertical: 10 }, global.separatorBorder]}>
          {
            this.state.resulmoOpen ? <FlatList
              style={styles.list}
              data={this.state.carts}
              keyExtractor={(item, index) => `${item.fantasyName}${index}`}
              renderItem={this._renderRow}
              ListEmptyComponent={this.ListEmpty}
            /> : (
              <View>
                {this.state.outPutCopy.map((log, index) => {
                  return (<Text key={log} style={{ padding: 5, fontWeight: index === (this.state.outPutCopy.length - 1) ? 'bold' : 'normal' }}>{log}</Text>);
                })}
              </View>
            )
          }
        </ScrollView>
        {
          stateVisible &&
            <View style={{ paddingTop: 10, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flexGrow: 1 }}>AÇÃO:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[global.inputLbl,
                    { fontWeight: this.state.switchButton ? 'normal' : 'bold' },
                    { color: this.state.switchButton ? 'rgb(170, 170, 170)' : 'black' },
                    { fontSize: 14 },
                  ]}
                >
                  Mover
                </Text>
                <SwitchButton
                  container={{ marginLeft: 10, marginRight: 10 }}
                  active={this.state.switchButton}
                  action={this.handleSwitch}
                  noLabel
                />
                <Text style={[global.inputLbl,
                    { fontWeight: this.state.switchButton ? 'bold' : 'normal' },
                    { color: this.state.switchButton ? 'black' : 'rgb(170, 170, 170)' },
                    { fontSize: 14 },
                  ]}
                >
                  Copiar
                </Text>
              </View>
            </View>
        }
        {
          stateVisible &&
          <View style={{ paddingVertical: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <SimpleButton
              msg="CANCELAR"
              action={this.cancel}
              tchbStyle={{ height: 36 }}
            />
            <SimpleButton
              msg="APLICAR"
              action={this.aplicar}
              tchbStyle={{ height: 36 }}
            />
          </View>
        }
      </View>
    );
  }

  _renderRow = ({ item }) => {
    return (
      <CopyRow
        item={item}
        dropdown={this.props.dropdown}
        acAddCopyCart={this.props.acAddCopyCart}
        acRemoveCopyCart={this.props.acRemoveCopyCart}
      />
    );
  }

  cancel = async () => {
    clearTimeout(this.timer);
    await this.props.acToggleMask();
    await this.props.acResetPopCart();
    await this.props.acResetCopyCart();
    await this.props.acRemoveSelectAllModel();
    await this.props.removeCheckedAllModels();
  }

  aplicar = async () => {
    if (this.props.modelCopy.length === 0) {
      return this.props.acSetToast({
        text: 'Selecione ao menos um modelo.',
        styles: ToastStyles.warning,
      });
    }

    if (this.props.cartsCopy.length === 0) {
      return this.props.acSetToast({
        text: 'Selecione ao menos um carrinho.',
        styles: ToastStyles.warning,
      });
    }

    if (this.state.switchButton) {
      this.copy();
    } else {
      this.move();
    }
  }

  move = async () => {
    await asyncForEach(this.props.modelCopy, async (modelo) => {
      const modelos = this.props.dropdown.current.products
        .filter(produto => produto.code === modelo.code);

      this.props.cartsCopy.forEach(async (carrinho) => {
        await asyncForEach(modelos, async (product) => {
          await SrvOrder.addProduto(Object.assign(product, {
            quote_sfa_guid__c: carrinho.key,
            sf_description: product.name,
            sf_photo_file_name__c: product.uri,
            sf_quantity: product.quantity,
            sf_total_price: product.sf_total_price,
          }));
        });
      });

      await asyncForEach(modelos, async (product) => {
        await SrvOrder.removerProdutosByModel(product.ref1, this.props.dropdown.current.key);
      });
    });

    await asyncForEach(this.props.cartsCopy, async (item) => {
      await atualizaCarrinhoAtual({
        client: { sf_id: item.sf_account_id },
        currentTable: { code: item.sf_pricebook2id },
        acSetCarts: this.props.acSetCarts,
        acSetDropdownCarts: this.props.acSetDropdownCarts,
      });
    });

    const outPutCopy = this.state.outPutCopy;
    outPutCopy.push('Itens movido com sucesso.');
    this.setState({ outPutCopy, resulmoOpen: false });

    this.setTimer();
  }

  copy = async () => {
    this.props.modelCopy.forEach(async (modelo) => {
      this.props.cartsCopy.forEach(async (carrinho) => {
        const modelos = this.props.dropdown.current.products
          .filter(produto => produto.code === modelo.code);

        await asyncForEach(modelos, async (product) => {
          await SrvOrder.addProduto(Object.assign(product, {
            quote_sfa_guid__c: carrinho.key,
            sf_description: product.name,
            sf_photo_file_name__c: product.uri,
            sf_quantity: product.quantity,
            sf_total_price: product.sf_total_price,
          }));
        });
      });
    });

    await asyncForEach(this.props.cartsCopy, async (item) => {
      await atualizaCarrinhoAtual({
        client: { sf_id: item.sf_account_id },
        currentTable: { code: item.sf_pricebook2id },
        acSetCarts: this.props.acSetCarts,
        acSetDropdownCarts: this.props.acSetDropdownCarts,
      });
    });

    const outPutCopy = this.state.outPutCopy;
    outPutCopy.push('Itens copiado com sucesso.');
    this.setState({ outPutCopy, resulmoOpen: false });

    this.setTimer();
  }

  setTimer() {
    this.timer = setTimeout(async () => {
      this.setState({ resulmoOpen: true });
      await this.props.acToggleMask();
      await this.props.acResetPopCart();
      await this.props.acResetCopyCart();
      await this.props.acRemoveSelectAllModel();
      await this.props.removeCheckedAllModels();
    }, 5000);
  }

  validaProduto = (produto, produtosPermitidos) => {
    let obj = false;
    const permitido = produtosPermitidos[0].products.find(p => {
      return produto.name === p.name && produto.code === p.code;
    });
    obj = permitido !== undefined;
    return obj;
  }
}

export default Copy;

const styles = StyleSheet.create({
  vwFilters: {
    marginBottom: 12,
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
  list: {
    paddingVertical: 10,
  },
  titulo: {
    fontFamily: Font.ABold,
    fontSize: 12,
  },
  subtitulo: {
    fontFamily: Font.ALight,
    fontSize: 12,
  }
});