import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { ImageLoad } from '../../../components';
import SrvOrder from '../../../services/Order/';
import { getEmbalamentoPadrao, atualizaCarrinhoAtual, } from '../../../utils/CommonFns';

export default class CatalogRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  async componentDidMount() {
    const { item, products, } = this.props;

    const prod = products.findIndex(p => p.code === item.code);
    if (prod > -1) {
      this.setState({ selected: true });
    }
  }

  handleChecked = async () => {
    const { item, dropdown } = this.props;

    if (this.state.selected) {
      await SrvOrder.removerProdutosByModel(item.code, this.props.dropdown.current.key);
    } else {
      const embalamentoPadrao = await getEmbalamentoPadrao(this.props.dropdown.current.sf_account_id);
      await SrvOrder.addProduto({
        quote_sfa_guid__c: this.props.dropdown.current.key,
        ref1: item.code,
        sf_description: item.name,
        sf_photo_file_name__c: item.photo_file_name,
        ref4: embalamentoPadrao,
      });
    }

    this.setState({ selected: !this.state.selected });

    atualizaCarrinhoAtual({
      client: { sf_id: dropdown.current.sf_account_id },
      currentTable: { code: dropdown.current.sf_pricebook2id },
      acSetCarts: this.props.acSetCarts,
      acSetDropdownCarts: this.props.acSetDropdownCarts,
    });
  }

  render() {
    return (
      <TouchableOpacity onPress={this.handleChecked} style={styles.container}>

        {/* CHECKED */}
        <View style={{ padding: 5 }}>
          { this.state.selected ? (<Text style={[styles.iconChecked, styles.activeBtnShadow]}>h</Text>) : (<Text style={styles.iconUnChecked}>i</Text>)}          
        </View>

        {/* IMAGEM */}
        <ImageLoad
          filename={this.props.item.photo_file_name}
          sizeType="m"
          containerStyle={{ width: 60, height: 60, }}
        />

        {/* INFO */}
        <View style={{ padding: 5, width: 300 }}>
          <Text>{`${this.props.item.code} - ${this.props.item.name}`}</Text>
        </View>

      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingBottom: 7,
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