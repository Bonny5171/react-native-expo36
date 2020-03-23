import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import global from '../../../../assets/styles/global';
import SrvOrder from '../../../../services/Order/';
import { atualizarCarrinhos } from '../../../../utils/CommonFns';
import ImageLoad from '../../../../components/ImageLoad';

class ColorColumn extends React.Component {
  render() {
    const { color, acRemoveColor, product, carts, acToggleZoom, } = this.props;

    if (color.isChosen) {
      return (
        <View style={{ width: 80 }}>
          <View
            style={{ height: 60, width: 60 }}
          >
            <ImageLoad
              isClickable
              onPress={() => {
                const zoom = {
                  url: color.uri,
                  name: `${product.code} - ${product.name}`,
                  sndLabel: `${color.code} - ${color.name}`,
                };
                acToggleZoom(zoom);
              }}
              sizeType="s"
              resizeMode="contain"
              filename={color.uri}
              containerStyle={{ height: '100%' }}
            />
            <Text style={[global.text, { fontSize: 14, alignSelf: 'center' }]}>{color.code}</Text>
          </View>
          <TouchableOpacity
            onPress={async () => {
              acRemoveColor(color.name);

              await SrvOrder.removerProdutosByCor(product.code, color.code, this.props.dropdown.current.key);

              // Zera as grades caso seja a ultima cor a ser removida
              if (product.colors.filter(d => d.isChosen).length === 1) {
                this.props.acFlushGrades();
              }

              atualizarCarrinhos({ carts, acSetDropdownCarts: this.props.acSetDropdownCarts, });
            }}
            style={{ position: 'absolute', right: 0, top: 2 }}
          >
            <Text style={[global.iconClose, { fontSize: 19 }]}>t</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }
}
export default ColorColumn;