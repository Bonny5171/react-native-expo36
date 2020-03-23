import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native';
import { SimpleButton, CheckBox } from '../../../components';
import { Font } from '../../../assets/fonts/font_names';
import global from '../../../assets/styles/global';
import SrvAccount from '../../../services/Account';

class DefineDiscounts extends React.Component {
  async componentDidMount() {
    const lista = await SrvAccount.getDiscount(this.props.client.sf_id);
    const discountCheckboxes = lista.map(value => {
      const segmento = value.sf_name;
      const desconto = value.sf_desconto__c ? `${value.sf_desconto__c}%` : null;
      const prazo = value.sf_prazo__c ? `${value.sf_prazo__c}%` : null;
      // const camanha = value.sfa_campanha__c ? `${value.sfa_campanha__c}` : '[NULL]';
      const isChosen = false;
      return { segmento, desconto, prazo, camanha: 'Dia dos pais', isChosen };
    });

    this.props.acSetDiscountCheckBoxes({ discountCheckboxes });
  }

  renderLinhas() {
    return this.props.discountCheckboxes.map((item, index) => {
      return (
        <View key={index.toString()}>
          <View style={styles.linha}>
            <View style={[styles.celula, { flex: 17 }]}>
              <Text style={[global.text, styles.checkStep4]}>{item.camanha}</Text>
            </View>
            <View style={[styles.celula, { flex: 4 }]} />
            <View style={[styles.celula, { flex: 4 }]} />
          </View>
          <View
            style={[index === this.props.discountCheckboxes.length - 1 ? styles.linha : styles.bordaLinha]}
          >
            <View style={[styles.celula, { flex: 17 }]}>
              <Text style={[global.text, styles.cabecalho, { paddingLeft: 25 }]}>{item.segmento}</Text>
            </View>
            <View style={[styles.celula, { flex: 4 }]}>
              {
                item.prazo !== null ?
                  <TouchableOpacity disabled={false} onPress={() => console.log('111')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                      disabled={false}
                      radio={false}
                      isChosen={item.isChosen}
                      action={() => console.log('222')}
                    />
                    <Text style={[global.text, { paddingLeft: 8 }]}>{item.prazo}</Text>
                  </TouchableOpacity>
                :
                  <Text style={[global.text, styles.checkStep4]}>-</Text>
              }
            </View>
            <View style={[styles.celula, { flex: 4 }]}>
              {
                item.desconto !== null ?
                  <TouchableOpacity disabled={false} onPress={() => console.log('111')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                      disabled={false}
                      radio={false}
                      isChosen={item.isChosen}
                      action={() => console.log('222')}
                    />
                    <Text style={[global.text, { paddingLeft: 8 }]}>{item.desconto}</Text>
                  </TouchableOpacity>
                :
                  <Text style={[global.text, styles.checkStep4]}>-</Text>
              }
            </View>
          </View>
        </View>
      );
    });
  }

  render() {
    const { acUpdateContext, navigation, } = this.props;
    return (
      <View style={{ flexDirection: 'column', }}>
        <View style={{ flexDirection: 'row', maxWidth: 670 }}>
          <View style={{ flex: 1 }}>
            <Text>TABELA</Text>
            <Text>{this.props.currentTable.name}</Text>
          </View>
          <SimpleButton
            msg="IR PARA O CATÁLOGO"
            action={() => {
              navigation.replace('catalog', { isShowCase: this.props.checkboxes[1] });
              acUpdateContext('Vendedor');
            }}
          />
        </View>
        {
          this.props.discountCheckboxes.length === 0 ?
            (
              <View style={[global.flexOne, { flexDirection: 'row', maxWidth: 670, paddingTop: 30 }]}>
                <Text style={{ paddingRight: 205 }} >Nenhuma política comercial encontrada</Text>
              </View>
            )
          : (
            <View data-id="aba-desc-ctn-cols" style={[global.flexOne, { flexDirection: 'row', paddingTop: 30, }]}>
              <View style={{ width: '70%' }}>
                <View style={styles.bordaLinha}>
                  <View style={[styles.celula, { flex: 17 }]}>
                    <Text style={styles.campanha}>SEGMENTAÇÃO/CAMPANHA</Text>
                  </View>
                  <View style={[styles.celula, { flex: 4 }]}>
                    <Text style={styles.campanha}>PRAZOS</Text>
                  </View>
                  <View style={[styles.celula, { flex: 4 }]}>
                    {/* <Text style={styles.campanha}>DESC. (máx {this.props.currentTable.max_desconto}%)</Text> */}
                    <Text style={styles.campanha}>DESC. (máx 30%)</Text>
                  </View>
                </View>
                {this.renderLinhas()}
              </View>
            </View>
          )
        }
      </View>
    );
  }
}

export default DefineDiscounts;

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontFamily: Font.AMedium,
    marginBottom: 8
  },
  checkStep4: {
    fontSize: 16,
    fontFamily: Font.ASemiBold,
    alignSelf: 'center',
  },
  cabecalho: {
    fontSize: 14,
    fontFamily: Font.ARegular,
  },
  campanha: {
    fontSize: 12,
    fontFamily: Font.ASemiBold,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: 5
  },
  bordaLinha: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    borderBottomColor: 'rgba(0,0,0,.15)',
    borderBottomWidth: 1,
    paddingBottom: 5
  },
  celula: {
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  container: {
    flex: 1.1,
    maxWidth: 680,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    width: '100%'
  },
  summaryCard: {
    width: 666,
    height: 50,
  },
  contentCard: {
    height: 42,
    backgroundColor: 'rgb(250, 250, 250)',
    paddingHorizontal: 8,
  },
  txtCode: {
    color: 'black',
    fontSize: 14,
  },
  txt: {
    color: 'black',
    fontSize: 12,
  },
  deleteIcon: {
    fontFamily: Font.C,
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.7)',
  }
});
