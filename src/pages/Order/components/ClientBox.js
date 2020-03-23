import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { Price, FormatDate, ImageLoad } from '../../../components';

class ClientBox extends React.Component {
  constructor(props) {
    super(props);
    this.maxNameLength = 27;
  }
  render() {
    const { dropdown, } = this.props;
    const nPedido = dropdown.current.key ? dropdown.current.key.split('-')[0] : '';
    const boxStyle = this.props.boxStyle ? this.props.boxStyle : null;
    let day, month, year;
    if (dropdown.current.updateAt) {
      const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAIO', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
      const monthPointer = Number(dropdown.current.updateAt.substr(5, 2)) - 1;
      day = Number(dropdown.current.updateAt.substr(8, 2));
      month = months[monthPointer];
      year = dropdown.current.updateAt.substr(0, 4);
    }
    return (
      <View style={styles.vwClientBox}>
        <View style={[styles.clientBox, boxStyle]}>
          <ImageLoad
            noSizeType
            filename="bg_order_icon"
            resizeMode="cover"
            containerStyle={{ position: 'absolute', right: 0 }}
          />
          <View style={{ flex: 1, justifyContent: 'space-between', width: '100%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.dia}>{day}</Text>
              <View>
                <Text style={styles.mes}>{month}</Text>
                <Text style={styles.ano}>{year}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.codigoPedido}>{nPedido}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text style={styles.label}>TABELA</Text>
                <Text style={styles.tabela}>{dropdown.current.sf_pricebook2_name__c}</Text>
                {/* ({dropdown.current.sf_pricebook2id}) */}
              </View>
              <View>
                <Text style={styles.label}>MÊS FATUR.</Text>
                <View style={{ flexDirection: 'row' }}>
                  {/* <Text style={styles.cifrao}>R$</Text> <Price price={total} style={styles.price}/> */}
                  {/* <Text style={styles.tabela}>{dropdown.current.sf_pricebook2_name__c}</Text> */}
                  {(this.props.dropdown.current && this.props.dropdown.current.previsaoEmbarque) && <FormatDate date={dropdown.current.previsaoEmbarque} txtStyle={styles.tabela} />}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default ClientBox;

const styles = StyleSheet.create({
  vwClientBox: {
    width: '45%',
    alignItems: 'flex-end',
    marginLeft: 7,
    paddingTop: 8,
  },
  clientBox: {
    backgroundColor: '#ffffff',
    height: 300,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowColor: 'rgba(0,0, 0, 0.3)',
    elevation: 3,
    marginBottom: 14,
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  clientImg: {

  },
  clientName: {
    fontFamily: Font.BLight,
    fontSize: 27,
    color: 'black',
  },
  dia: {
    fontFamily: Font.ALight,
    fontSize: 42,
    color: 'rgba(0,0,0,.4)',
    marginRight: 5,
  },
  mes: {
    fontFamily: Font.ARegular,
    fontSize: 16,
    color: 'black',
  },
  ano: {
    fontFamily: Font.ARegular,
    fontSize: 14,
    color: 'black',
  },
  codigoPedido: {
    fontFamily: Font.BRegular,
    fontSize: 38,
    color: '#6499D2',
  },
  label: {
    fontFamily: Font.BSemiBold,
    fontSize: 11,
  },
  tabela: {
    fontFamily: Font.ARegular,
    fontSize: 14,
  }
  // cifrao:{
  //   fontFamily:Font.ARegular,
  //   fontSize:11,
  // },
  // price:{
  //   fontFamily:Font.ARegular,
  //   fontSize:18,
  // }
});