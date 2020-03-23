import React, { Component } from 'react';
import { Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { Font } from '../../../../../../assets/fonts/font_names';
import global from '../../../../../../assets/styles/global';

class ItemBuscaCarrinho extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selecionado: false,
      cota: false,
    };
  }

  componentDidMount() {
    this.setState({ selecionado: this.props.selecionado, cota: this.props.cota });
  }

  render() {
    return (
      <TouchableOpacity style={[{ backgroundColor: this.state.cota ? '#eee' : 'white' }, styles.tchb]}>
        <Text style={[styles.txt, { opacity: this.state.selecionado ? 1 : 0 }]}>(</Text>
        <ImageBackground source="" style={[global.flexOne, { opacity: this.state.selecionado ? 0.35 : 1 }]} resizeMode="contain">
          <Text style={styles.txtCode}>23017</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

export default ItemBuscaCarrinho;

const styles = StyleSheet.create({
  tchb: {
    width: 90,
    height: 60,
    padding: 6,
    marginHorizontal: 1
  },
  txt: {
    fontFamily: Font.C,
    fontSize: 22,
    color: '#0085B2',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  txtCode: {
    fontFamily: Font.ARegular,
    fontSize: 10,
    position: 'absolute',
    bottom: 0,
  }
});