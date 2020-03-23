import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Font } from '../../../../assets/fonts/font_names';
import global from '../../../../assets/styles/global';
import { Button, TextLimit, ImageLoad } from '../../../../components';

class Left extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.product.name !== nextProps.product.name) return true;
    return false;
  }

  render() {
    const { product, acToggleZoom, currentColor } = this.props;

    if (!this.props.currentProduct.gallery) {
      return null;
    }

    if (!this.color) {
      this.color = this.props.currentProduct.colors[currentColor] || { url: null };
    }

    return (
      <View style={[global.container, { maxWidth: 282 }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ImageLoad
            isClickable
            onPress={() => {
              const { currentProduct } = this.props;
              const zoom = {
                url: this.color.uri,
                name: `${currentProduct.code} - ${currentProduct.name}`,
                sndLabel: `${this.color.code} - ${this.color.name}`,
              };
              acToggleZoom(zoom);
            }}
            tchbStyle={{ height: 150, width: 180 }}
            sizeType="m"
            resizeMode="contain"
            filename={this.color.uri}
            containerStyle={{ height: '100%' }}
          />
          {/*
            Motivo do comentário no Details.js da pgProduto
          <Button
            txtMsg="M"
            tchbStyle={{ position: 'absolute', right: 20, top: 10 }}
            txtStyle={styles.imgBtn}
            actions={[{ func: acToggleZoom, params: [{ url: this.color.url, name: product.name }] }]}
          /> */}
        </View>
        <View style={{ flex: 3, paddingLeft: 30 }}>
          <TextLimit
            style={styles.name}
            msg={product.name.toUpperCase()}
            maxLength={24}
          />
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={global.container}>
              <Text style={styles.columnHeader}>CÓDIGO</Text>
              <Text style={styles.columnValue}>{product.code}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.columnHeader}>GRUPO</Text>
              <Text style={styles.columnValue}>1</Text>
            </View>
            <View style={{ flex: 2 }} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', paddingRight: 35 }}>
            <View style={styles.info}>
              <Text style={styles.columnHeader}>LINHA</Text>
              <Text style={styles.columnValue}>{product.sf_segmento_negocio__c.toUpperCase()}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.columnHeader}>CATEGORIA</Text>
              <Text style={styles.columnValue}>{product.sf_genero__c.toUpperCase()}</Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', paddingRight: 35 }}>
            <View style={styles.info}>
              <Text style={styles.columnHeader}>PREÇO LISTA</Text>
              <Text style={styles.columnValue}>NULO</Text>
            </View>
            {/* <View style={styles.info}>
              <Text style={styles.columnHeader}>EMBALAMENTO</Text>
              <Text style={styles.columnValue}>{embalamento.toUpperCase()}</Text>
            </View> */}
          </View>
          <View style={{ flex: 5 }}>
            {/* tags */}
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  currentProduct: state.catalog.currentProduct
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Left);

const styles = StyleSheet.create({
  name: {
    fontFamily: Font.ABold,
    color: 'rgba(0, 0, 0, 0.7)',
    padding: 5,
    paddingRight: 10,
    paddingLeft: 0,
  },
  info: {
    flex: 1,
    justifyContent: 'center'
  },
  imgBtn: {
    fontFamily: Font.C,
    fontSize: 28,
    color: '#A0A5A7',
  }
});

styles.columnHeader = [global.columnHeader, { fontSize: 12 }];
styles.columnValue = [global.columnValue, { fontSize: 14 }];