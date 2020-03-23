import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { Fade, Button } from '../../../components';
import global from '../../../assets/styles/global';

export default class Footer extends Component {
  state = {
    infoPosition: new Animated.Value(0),
    isInfoVisible: true,
  }

  render() {
    const animatedStyles = { transform: [{ translateX: this.state.infoPosition }] };
    return (
      <View
        style={styles.container}
      >
        <View
          data-id="rodapeDoCarrinho"
          style={styles.vwFooter}
        >
          <Button
            txtMsg="a"
            txtStyle={[global.iconUnChecked, this.state.isInfoVisible ? global.activeBtnShadow : global.defaultBlack, styles.btnHideInfo]}
            action={this.toggleInfo}
          />
          <Animated.View
            style={[styles.vwOrderInfo, animatedStyles]}
          >
            <View style={styles.vwInfo}>
              <Text style={styles.headerInfo}>TOTAL GERAL</Text>
              <Text style={styles.valueInfo}><Text style={styles.unit}>R$</Text> 1.234,56</Text>
            </View>
            <View style={styles.vwInfo}>
              <Text style={styles.headerInfo}>PARES</Text>
              <Text style={styles.valueInfo}>250</Text>
            </View>
            <View style={styles.vwInfo}>
              <Text style={styles.headerInfo}>GRADES</Text>
              <Text style={styles.valueInfo}>80</Text>
            </View>
            <View style={styles.vwInfo}>
              <Text style={styles.headerInfo}>MÊS FATUR.</Text>
              <Text style={styles.valueInfo}>ABR/19</Text>
            </View>
          </Animated.View>
          <View style={styles.grow} />
          <View style={styles.vwBtns}>
            {/* <TouchableOpacity style={styles.btnSave}>
              <Text style={styles.txtButton}>SALVAR CARRINHO</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.btnBuy}>
              <Text style={styles.txtButton}>FINALIZAR COMPRA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  toggleInfo = () => {
    Animated.spring(this.state.infoPosition, {
      duration: 225,
      toValue: this.state.isInfoVisible  ? -1000 : 0,
      useNativeDriver: true,
    }).start();
    this.setState({ isInfoVisible: !this.state.isInfoVisible });
  }
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,.9)',
    height: 90,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.35)'
  },
  vwFooter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  vwOrderInfo: {
    flexDirection: 'row'
  },
  vwInfo: {
    marginRight: 20
  },
  headerInfo: {
    fontFamily: Font.BSemiBold,
    fontSize: 11,
    marginBottom: 2
  },
  valueInfo: {
    fontFamily: Font.ARegular,
    fontSize: 20,
  },
  grow: {
    flexGrow: 1
  },
  vwBtns: {
    flexDirection: 'row'
  },
  btnSave: {
    flexShrink: 1,
    marginLeft: 20,
    backgroundColor: '#0085B2',
    borderRadius: 17,
    paddingHorizontal: 20,
    height: 32,
    justifyContent: 'center'
  },
  txtButton: {
    color: 'white',
    fontFamily: Font.ASemiBold,
    fontSize: 14
  },
  btnBuy: {
    flexShrink: 1,
    marginLeft: 20,
    backgroundColor: '#0085B2',
    borderRadius: 17,
    paddingHorizontal: 20,
    height: 32,
    justifyContent: 'center'
  },
  unit: {
    fontSize: 11,
    marginRight: 2,
  },
  btnHideInfo: {
    marginRight: 15,
  }
});