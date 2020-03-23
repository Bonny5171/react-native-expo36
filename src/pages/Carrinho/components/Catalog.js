import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, } from 'react-native';
import { InputLabel, } from '../../../components';
import global from '../../../assets/styles/global';
import SrvProduct from '../../../services/Product';
import { Font } from '../../../assets/fonts/font_names';
import { CatalogRow } from './';

class Catalog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resulmoOpen: true,
      value: '',
      outPutCopy: [],
      data: [],
      _mounted: false,
    };
  }

  async componentDidMount() {
    const { dropdown } = this.props;
    const currentTable = dropdown.current.sf_pricebook2id;
    const client = dropdown.current.sf_account_id;
    const isCompleteCat = true;
    const filters = {};
    const data = await SrvProduct.filter(
      filters,
      currentTable.code,
      null,
      true,
      client.sf_id,
      isCompleteCat,
    );

    this.setState({ data: data[0].products });
    this._mounted = true;
  }

  onChangeText = (value) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.filter(value), 450);
    if (this._mounted) this.setState({ value });
  }

  filter = async (value) => {
    const { dropdown } = this.props;
    const currentTable = dropdown.current.sf_pricebook2id;
    const client = dropdown.current.sf_account_id;
    const isCompleteCat = true;
    const filters = { name: value, };
    const data = await SrvProduct.filter(
      filters,
      currentTable.code,
      null,
      true,
      client.sf_id,
      isCompleteCat,
    );

    this.setState({ data: data[0].products });
  }

  setInput = async (value, currentClient, shouldReset) => {
    if (value === '' || shouldReset) {
      const { dropdown } = this.props;
      const currentTable = dropdown.current.sf_pricebook2id;
      const client = dropdown.current.sf_account_id;
      const isCompleteCat = true;
      const filters = {
        name: value,
      };
      const data = await SrvProduct.filter(
        filters,
        currentTable.code,
        null,
        true,
        client.sf_id,
        isCompleteCat,
      );
      this.setState({ data: data[0].products });
      if (this._mounted) this.setState({ value: '' });
    }

    this.resetSearch(value, shouldReset);
    if (this._mounted) this.setState({ value: '' });
  }

  resetSearch(value, shouldReset) {
    if (shouldReset && value === '') {
      // this.props.acCurrentClient({});
      // this.props.acUnchooseAllStores();
    }
  }

  render() {
    if (!this.props.isVisible) return null;
    return (
      <View style={[global.flexOne, { paddingTop: 5 }]}>
        <View style={{ borderBottomWidth: 1, width: '100%', borderBottomColor: '#CCC', paddingBottom: 10, alignItems: 'center' }}>
          <Text style={{ fontFamily: Font.C, fontSize: 28, opacity: 0.5, }}>´</Text>
          <Text style={[global.txtLabel, { fontSize: 11, marginBottom: 2 }]}>CATALOGO</Text>
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
              data={this.state.data}
              keyExtractor={(item, index) => `${item.fantasyName}${index}`}
              renderItem={this._renderRow}
            />
          }
        </ScrollView>
      </View>
    );
  }

  _renderRow = ({ item }) => {
    return (
      <CatalogRow
        item={item}
        products={this.props.products}
        dropdown={this.props.dropdown}
        acSetCarts={this.props.acSetCarts}
        acSetDropdownCarts={this.props.acSetDropdownCarts}
      />
    );
  }
}

export default Catalog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingBottom: 7,
  },
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