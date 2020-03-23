import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';

export default class components extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }

  handleChecked = () => {
    const { item } = this.props;

    if (this.state.selected) {
      this.props.acRemoveCopyClient(item);
    } else {
      this.props.acAddCopyClient(item);
    }

    this.setState({ selected: !this.state.selected });
  }

  render() {
    const { item } = this.props;
    const client = item.client ? item.client : '';
    const fantasyName = item.fantasyName ? item.fantasyName : '';
    const cnpj = item.cnpj ? item.cnpj : '';
    const rua = (item.comercial && item.comercial.address) ? `${item.comercial.address} - ` : '';
    const city = (item.comercial && item.comercial.city) ? `${item.comercial.city} - ` : '';
    const state = (item.comercial && item.comercial.state) ? `${item.comercial.state} - ` : '';
    const address = `${rua}${city}${state}`;
    return (
      <TouchableOpacity onPress={this.handleChecked} style={styles.container}>
        <View style={{ padding: 5, }}>
          { this.state.selected ? (<Text style={[styles.iconChecked, styles.activeBtnShadow]}>h</Text>) : (<Text style={styles.iconUnChecked}>i</Text>)}
        </View>
        <View style={{ padding: 5, width: 300, }}>
          <Text style={styles.titulo}>{`${client}`}</Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
            <Text style={styles.subtitulo}>({fantasyName})</Text>
            <Text style={styles.subtitulo}>{cnpj}</Text>
          </View>
          <Text style={styles.subtitulo}>{address}</Text>
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
