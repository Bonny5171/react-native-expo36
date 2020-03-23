import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, } from 'react-native';
import { InputText, SimpleButton, InputLabel, CheckBox, } from '../../../components';
import CopyRow from './CopyRow';
import global from '../../../assets/styles/global';
import SrvClients from '../../../services/Account/';
import SrvOrder from '../../../services/Order/';
import SrvProduct from '../../../services/Product';
import { assistant } from '../../../services/Pages/Assistant';
import { Font } from '../../../assets/fonts/font_names';
import { ToastStyles } from '../../../components/Toaster';
import { asyncForEach } from '../../../utils/CommonFns';

class Copy extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    let txtName = '';
    this.state = {
      txtName,
      resulmoOpen: true,
      _mounted: false,
      value: '',
      nameCart: '',
      tables: [],
      tableChecked: {},
      outPutCopy: [],
    };
  }

  componentDidMount() {
    const { availableTables } = this.props;
    let tableChecked = {};
    if (availableTables.length === 1) {
      tableChecked = availableTables[0];
    }

    this.setState({
      tables: availableTables,
      tableChecked: tableChecked,
    });
    this._mounted = true;
  }

  onChangeText = (value) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.filter(value), 450);
    if (this._mounted) this.setState({ value });
  }

  filter = (value) => {
    const filters = [];
    SrvClients.filter(
      {
        name: value,
        positivacao: {
          a: '',
          de: ''
        }
      },
      this.props.acSetClients,
      true,
      filters
    );
  }

  setInput = async (value, currentClient, shouldReset) => {
    if (value === '' || shouldReset) {
      const select = await assistant.queryClients(this.props.appDevName);
      const result = await SrvClients.customQuery(select);
      this.props.acSetClients(result);
    }

    this.resetSearch(value, shouldReset);
    if (this._mounted) this.setState({ value: '' });
  }

  resetSearch(value, shouldReset) {
    if (shouldReset && value === '') {
      this.props.acCurrentClient({});
      this.props.acUnchooseAllStores();
    }
  }

  checkedTable = (tableChecked) => {
    this.setState({ tableChecked });
  }

  render() {
      if (!this.props.isVisible) return null;
      this.hasFilters = this.props.panelFilter.find(({ current }) => current !== '') || this.state.txtName !== '';

      return (
        <View style={[global.flexOne, { paddingTop: 5 }]}>
          <View style={{ borderBottomWidth: 1, width: '100%', borderBottomColor: '#CCC', paddingBottom: 10, alignItems: 'center' }}>
            <Text style={{ fontFamily: Font.C, fontSize: 28, opacity: 0.5, }}>4</Text>
            <Text style={[global.txtLabel, { fontSize: 11, marginBottom: 2 }]}>COPIAR PARA CLIENTES</Text>
          </View>
          <ScrollView style={[{ flex: 1, paddingVertical: 10 }, global.separatorBorder]}>
            {
              this.state.resulmoOpen ? (
                <View>
                  <InputLabel
                    label="BUSCA"
                    hasSearch
                    value={this.state.value}
                    container={{ flex: 1, marginTop: -4 }}
                    inputStyle={{ flex: 1, width: 344 }}
                    ref={(ref) => { this.myTextInput = ref; }}
                    onChangeText={this.onChangeText}
                    setInput={this.setInput}
                  />
                </View>
              ) : (
                <View>
                  {this.state.outPutCopy.map((log, index) => {
                    return (<Text key={log} style={{ padding: 5, fontWeight: index === (this.state.outPutCopy.length - 1) ? 'bold' : 'normal' }}>{log}</Text>);
                  })}
                </View>
              )
            }
            {
              this.state.resulmoOpen && <FlatList
                style={styles.list}
                data={this.props.clients}
                keyExtractor={(item, index) => `${item.fantasyName}${index}`}
                renderItem={this._renderRow}
              />
            }
          </ScrollView>
          {
            this.state.resulmoOpen &&
              <View style={{ paddingTop: 10 }}>
                <Text style={[global.txtLabel, { fontSize: 11, marginBottom: 2 }]}>TABELA DE PREÇO</Text>
                {
                  this.state.tables.map(t => {
                    const checked = this.state.tables.length === 1;
                    return (
                      <View style={{ flexDirection: 'row', }} key={t.code}>
                        <CheckBox
                          style={{ paddingLeft: 5 }}
                          disabled={false}
                          radio
                          isChosen={checked}
                          action={() => {
                            this.checkedTable(t);
                          }}
                        />
                        <Text style={[global.text, { fontSize: 12, fontFamily: Font.ARegular, alignSelf: 'center', paddingLeft: 10 }]}>
                          {t.name}
                        </Text>
                      </View>
                    );
                  })
                }

              </View>
          }
          {
            this.state.resulmoOpen &&
              <View style={{ paddingTop: 10 }}>
                <Text style={[global.txtLabel, { fontSize: 11, marginBottom: 2 }]}>NOME DO CARRINHO</Text>
                <InputText
                  inputStyle={{ width: 344 }}
                  onChangeText={(text) => { this.setState({ nameCart: text }); }}
                  clearAction={() => {
                    this.setState({ nameCart: '' });
                    this.props.acUpdateCurrent('textName', '', true);
                  }}
                  value={this.state.nameCart}
                />
              </View>
          }
          {
            this.state.resulmoOpen &&
            <View style={{ paddingVertical: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <SimpleButton
                msg="CANCELAR"
                action={this.cancel}
                tchbStyle={{ height: 36 }}
              />
              <SimpleButton
                msg="COPIAR"
                action={this.copy}
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
        acAddCopyClient={this.props.acAddCopyClient}
        acRemoveCopyClient={this.props.acRemoveCopyClient}
      />
    );
  }

  chooseFilter = (item, index, name) => {
    this.props.acUpdateComponent('dropdown', name);
    this.props.acUpdateCurrent(name, item.option, true);
  }

  cancel = () => {
    clearTimeout(this.timer);
    SrvClients.get(this.props.acSetClients);
    this.props.acResetCopyClient();
    this.props.acRemoveMask();
    this.props.acCloseClientModals();
  }

  copy = async () => {
    if (this.props.cartsCopy.length === 0) {
      return this.props.acSetToast({
        text: 'Selecione ao menos um carrinho.',
        styles: ToastStyles.warning,
      });
    }

    if (this.props.clientCopy.length === 0) {
      return this.props.acSetToast({
        text: 'Selecione ao menos um cliente.',
        styles: ToastStyles.warning,
      });
    }

    if (this.state.nameCart.length === 0) {
      return this.props.acSetToast({
        text: 'Defina o nome do carrinho que sera criado.',
        styles: ToastStyles.warning,
      });
    }

    this.mergeCarts();
  }

  validaProduto = (produto, produtosPermitidos) => {
    let obj = false;
    const permitido = produtosPermitidos[0].products.find(p => {
      return produto.name === p.name && produto.code === p.code;
    });
    obj = permitido !== undefined;
    return obj;
  }

  mergeCarts = async () => {
    const listOutPutCopy = [];

    // Realiza o checked nas opções de tabelas de preço.
    const currentTable = this.state.tableChecked;

    // Carrega os produtos de cada carrinhos selecionado para copia.
    await asyncForEach(this.props.cartsCopy, async (car) => {
      car.products = await SrvOrder.getProdutos(
        [{ quote_sfa_guid__c: car.key }],
        { fields: ['sf_segmento_negocio__c'] }
      );
    });

    // Cria uma lista com todos os modelos.
    const list = this.props.cartsCopy
      .map(p => p.products)
      .reduce((pre, cur) => pre.concat(cur));

    const listaDeProdutos = [];
    list.forEach(elem => {
      const indexExist = listaDeProdutos.findIndex(p => p.code === elem.code);
      if (indexExist === -1) {
        listaDeProdutos.push(elem);
      }
    });

    /* Para cada cliente selecionado, sera criado um novo
       carrinho, com todos os modelos. */
    await asyncForEach(this.props.clientCopy, async (client) => {
      const produtosPermitidos = await SrvProduct.filter({}, currentTable.code, null, null, client.sf_id, false);

      // Valida para ver se vai ter algum modelo para ser mergeado.
      let hasModelInCar = false;
      await asyncForEach(listaDeProdutos, async (product) => {
        hasModelInCar = this.validaProduto(product, produtosPermitidos);
        if (!hasModelInCar) {
          listOutPutCopy.push(`Modelo "${product.code}" não esta mais presente na tabela de preço "${currentTable.name}"`);
        }
      });

      if (hasModelInCar) {
        // Cria o carrinho.
        const newCart = await SrvOrder.addCarrinho({
          sf_name: this.state.nameCart,
          sf_carrinho_selecionado__c: 'false',
          sf_account_id: client.sf_id,
          sf_conta__c: client.sf_id,
          sf_nome_cliente__c: client.fantasyName,
          sf_previsao_embarque__c: this.props.cartsCopy[0].previsaoEmbarque,
          sf_pricebook2id: currentTable.code,
          sf_pricebook2_name__c: currentTable.name,
        });

        // Valida se o modelo esta presente na tabela de preço selecionada.
        await asyncForEach(listaDeProdutos, async (product) => {
          const produtoOk = this.validaProduto(product, produtosPermitidos);
          if (produtoOk) {
            const newProduct = Object.assign(product, {
              quote_sfa_guid__c: newCart.id,
              sf_description: product.name,
              sf_photo_file_name__c: product.uri,
            });
            await SrvOrder.addProduto(newProduct);
          }
        });

        listOutPutCopy.push('Modelo(s) copiado(s) com sucesso');
      } else {
        listOutPutCopy.push('Não foi possível criar o carrinho. Nenhum item foi compatível com a tabela e/ou cliente selecionados.');
      }
    });

    this.props.loadList();

    const outPutCopy = [];
    listOutPutCopy.forEach(elem => {
      const indexExist = outPutCopy.findIndex(p => p === elem);
      if (indexExist === -1) {
        outPutCopy.push(elem);
      }
    });

    this.setState({ outPutCopy, resulmoOpen: false });
    this.timer = setTimeout(() => {
      this.setState({ resulmoOpen: true });
      this.props.acResetCopyClient();
      this.props.acRemoveMask();
      this.props.acCloseClientModals();
    }, 5000);

    this.props.btnPlusClicked();
  };
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