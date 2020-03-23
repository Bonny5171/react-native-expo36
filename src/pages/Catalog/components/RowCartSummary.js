import React from 'react';
import { View, Text, StyleSheet, Platform, } from 'react-native';
import global from '../../../assets/styles/global';
import { Button, TextLimit, ImageLoad } from '../../../components';
import { Font } from '../../../assets/fonts/font_names';
import SrvOrder from '../../../services/Order';
class Row extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.name === nextProps.name) {
      return false;
    }
    return true;
  }

  render() {
    const {
      name,
      price,
      code,
      uri,
      group,
      category,
      line,
      acRemoveCartProduct,
    } = this.props;

    let vwDelete = { alignSelf: 'flex-end', paddingBottom: 8 };
    if (Platform.OS === 'web') {
      vwDelete = { alignSelf: 'center' };
    }

    return (
      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 5 }}>
        {/* Thumb  */}
        <View style={row.vwThumb}>
          <ImageLoad
            sizeType="s"
            resizeMode="contain"
            filename={uri}
            containerStyle={{ transform: [{ translateX: -10 }], position: 'absolute', top: 5, left: 5 }}
          />
        </View>
        {/* Nome  */}
        <View style={[row.vwColumn, { width: 238 }]}>
          <View style={row.vwValue}>
            <TextLimit
              maxLength={26}
              msg={name.toUpperCase()}
              style={global.columnName}
            />
          </View>
        </View>
        {/* Preço Lista */}
        <View style={[row.vwColumn, { width: 72, alignItems: 'center' }]}>
          <View style={row.vwValue}>
            <Text style={global.columnValue}>R$ {price}</Text>
          </View>
        </View>
        {/* Código */}
        <View style={[row.vwColumn, { width: 72, alignItems: 'center' }]}>
          <View style={row.vwValue}>
            <Text style={global.columnValue}>{code}</Text>
          </View>
        </View>
        {/* Delete */}
        <Button
          tchbStyle={vwDelete}
          txtMsg="w"
          txtStyle={row.icDelete}
          action={this.deleteProduct}
        />
      </View>
    );
  }

  deleteProduct = async () => {
    const { code, dropdown } = this.props;
    this.props.acRemoveCartProduct({ code });
    await SrvOrder.removerProdutosByModel(code, dropdown.current.key);
  }
}

export default Row;

const row = StyleSheet.create(
  {
    vwThumb: {
      alignItems: 'center',
      height: 45,
      width: 70,
      padding: 5,
      paddingLeft: 0,
    },
    vwColumn: {
      paddingBottom: 5,
      paddingTop: 5,
      justifyContent: 'center',
    },
    vwValue: {
      justifyContent: 'center',
    },
    icDelete: {
      fontFamily: Font.C,
      fontSize: 24,
      color: 'rgba(0, 0, 0, 0.3)',
    }
  }
);