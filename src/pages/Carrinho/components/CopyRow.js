import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { agrupaProdutosNoCarrinho, } from '../../../utils/CommonFns';

export default class components extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }

  componentWillUnmount() {
    // console.log('componentWillUnmount CopyRow desmontado');
  }

  handleChecked = () => {
    const { item } = this.props;

    if (this.state.selected) {
      this.props.acRemoveCopyCart(item);
    } else {
      this.props.acAddCopyCart(item);
    }

    this.setState({ selected: !this.state.selected });
  }

  render() {
    const { item } = this.props;
    const produtos = agrupaProdutosNoCarrinho(item.products);
    return (
      <TouchableOpacity onPress={this.handleChecked} style={styles.container}>
        <View style={{ padding: 5, }}>
          { this.state.selected ? (<Text style={[styles.iconChecked, styles.activeBtnShadow]}>h</Text>) : (<Text style={styles.iconUnChecked}>i</Text>)}
        </View>
        <View style={{ padding: 5, width: 300, }}>
          {/* <Text style={styles.titulo}>id: {`${item.key}`}</Text>
          <Text style={styles.titulo}>cliente: {`${item.client}`}</Text>
          <Text style={styles.titulo}>lista de preço: {`${item.sf_pricebook2_name__c}`}</Text>
          <Text style={styles.titulo}>carrinho: {`${item.name}`}</Text> */}
          <Text style={styles.titulo}>{`${item.name} (${produtos.length})`}</Text>
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
  titulo: {
    fontFamily: Font.ABold,
    fontSize: 12,
  },
  subtitulo: {
    fontFamily: Font.ALight,
    fontSize: 12,
  }
});
