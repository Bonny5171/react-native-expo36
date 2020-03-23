import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Font } from '../../../../../../../assets/fonts/font_names';
import { InputText } from '../../../../../../../components';


class PopCrossDocking extends React.PureComponent {
  _renderListaDeLojas() {
    const grades = [1, 2, 3, 4, 5, 6, 7];
    const listaLojas = grades.map((item, index) => (
      <View key={index.toString()} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Text style={{ fontFamily: Font.ARegular, fontSize: 12 }}>XPTO COM. DE CALÇADOS LTDA</Text>
        <InputText
          inputStyle={{ height: 25, width: 32, marginRight: 5, backgroundColor: 'white', borderRadius: 6, borderColor: 'rgba(0,0,0,.3)', borderWidth: 1 }}
          value=""
        />
      </View>
    ));
    return listaLojas;
  }

  render() {
    return (
      <View data-id="popCrossDocking" style={{ position: 'absolute', backgroundColor: 'rgba(255,255,255,.95)', width: 700, borderRadius: 10, padding: 15, paddingBottom: 20 }}>
        {/* header do box */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
          <Text style={{ fontFamily: Font.ASemiBold, fontSize: 14,  }}>DISTRIBUA AS GRADES ENTRE AS LOJAS <Text style={{ fontFamily: Font.ARegular, opacity: 0.6, fontSize: 12 }}>(Cross Docking)</Text></Text>
          <TouchableOpacity style={{ marginLeft: 4 }}>
            <Text style={{ fontFamily: Font.C, fontSize: 24, opacity: 0.5 }}>t</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11, marginBottom: 2 }}>LOJAS</Text>
            <ScrollView style={{ height: 135 }}>
              {this._renderListaDeLojas()}
            </ScrollView>
          </View>
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11, marginBottom: 8 }}>OPÇÕES</Text>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text style={{ fontFamily: Font.C, fontSize: 22, opacity: 0.5, marginRight: 5, transform: [{ translateY: -4 }] }}>i</Text>
              <Text style={{ fontFamily: Font.ARegular, fontSize: 13 }}>Aplicar para todas grades</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text style={{ fontFamily: Font.C, fontSize: 22, opacity: 0.5, marginRight: 5, transform: [{ translateY: -4 }] }}>i</Text>
              <Text style={{ fontFamily: Font.ARegular, fontSize: 13 }}>Aplicar valor pra todas as lojas</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11, marginBottom: 2 }}>TOTAL DE GRADES</Text>
                <Text style={{ fontFamily: Font.ARegular, fontSize: 13 }}>1000</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11, marginBottom: 2 }}>DISTRIBUÍDAS</Text>
                <Text style={{ fontFamily: Font.ARegular, fontSize: 13 }}>300</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: Font.BSemiBold, fontSize: 11, marginBottom: 2 }}>RESTAM</Text>
                <Text style={{ fontFamily: Font.ARegular, fontSize: 13 }}>700</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default PopCrossDocking;