import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Font } from '../../../../../assets/fonts/font_names';
import { ImageLoad } from '../../../../../components';

class ColorPerc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      percentCores: [
        { colorImg: '220025145900', colorCode: 51459, colorDescr: 'S:AMARELO/ROSA', percentRegional: '28.25%', percentNacional: '22.36%', novacor: false,  },
        { colorImg: '220025083700', colorCode: 50837, colorDescr: 'S:PRETO/ROSA', percentRegional: '23.64%', percentNacional: '26.15%', novacor: true },
        { colorImg: '220025157500', colorCode: 51575, colorDescr: 'S:ROSA/ROSA', percentRegional: '22.62%', percentNacional: '23.11%', novacor: true },
        { colorImg: '220025145200', colorCode: 51452, colorDescr: 'S:ROSA/AZUL', percentRegional: '7.73%', percentNacional: '5.13%', novacor: false },
        { colorImg: '220025222700', colorCode: 52227, colorDescr: 'S:AZUL/ROSA', percentRegional: '6.99%', percentNacional: '0.33%', novacor: false },
        // {colorImg:barbiePreta, colorCode:24021, colorDescr:'S:ROSA CLARO/G:ROSA',percentRegional:'6.86%',percentNacional:'4.06%',novacor:false},
        // {colorImg:barbieAmarela, colorCode:20729, colorDescr:'S:AZUL/G:AZUL',percentRegional:'1.88%',percentNacional:'9.99%',novacor:false},
        // {colorImg:barbieNude, colorCode:24375, colorDescr:'ROSA NEON/ROSA',percentRegional:'1.45%',percentNacional:'4.80%',novacor:false},
        // {colorImg:barbieRosa, colorCode:24394, colorDescr:'ROSA STARCK/ROSA STARCK',percentRegional:'0.58%',percentNacional:'4.05%',novacor:false}
      ],
      nacionalMaior: '26.15%',
      regiao: 'SUDESTE'
    };
  }

  renderCol(to, from) {
    const col = this.state.percentCores.slice(to, from);
    const list = col.map((item, index) =>
      <PercentCor key={index.toString()} idx={index} pos={to} item={item} nacionalMaior={this.state.nacionalMaior} regiao={this.state.regiao} />
    );
    return list;
  }

  render() {
    return (
      <ScrollView style={{ height: 335, paddingTop: 10,  }}>
        <View data-id="percentCores" style={[styles.percentCores_ctn, { paddingTop: 60 }]}>
          <View style={styles.percentCores_col}>
            {this.renderCol(0, Math.round(this.state.percentCores.length / 2))}
          </View>
          <View style={styles.percentCores_col}>
            {this.renderCol(Math.round(this.state.percentCores.length / 2), this.state.percentCores.length)}
          </View>
        </View>
      </ScrollView>
    );
  }
}

 function PercentCor(props) {
   const regiaoBold = (props.pos === 0 && props.idx === 0) ? styles.percentValueBold : null;
   const nacionalBold = (props.nacionalMaior === props.item.percentNacional) ? styles.percentValueBold : null;

   return (
     <View data-id="item" style={styles.percentCores_item}>
       <ImageLoad
         filename={props.item.colorImg}
         containerStyle={styles.percentCores_img}
         sizeType="m"
       />
       <View style={{ flexGrow: 1 }}>
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
           <Text style={styles.colorCode}>{props.item.colorCode}</Text>
           {props.item.novacor && <Text style={styles.labelNovaCor}>NOVA COR</Text>}
         </View>
         <Text style={styles.colorDescr}>{props.item.colorDescr}</Text>
       </View>
       <View style={{ alignItems: 'center', marginRight: 20, width: 65 }}>
         <Text style={styles.region}>{props.regiao}</Text>
         <Text style={[styles.percentValue, regiaoBold]}>{props.item.percentRegional}</Text>
       </View>
       <View style={{ alignItems: 'center', width: 65,  }}>
         <Text style={styles.region}>BRASIL</Text>
         <Text style={[styles.percentValue, nacionalBold]}>{props.item.percentNacional}</Text>
       </View>
     </View>
   );
 }

const styles = StyleSheet.create({
  percentCores_ctn: {
    flex: 1,
    maxWidth: 1024,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentCores_col: {
    flex: 1,
  },
  percentCores_img: {
    width: 70,
    height: 45
  },
  percentCores_item: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.15)',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  labelNovaCor: {
    backgroundColor: '#00B22D',
    fontFamily: Font.ASemiBold,
    fontSize: 10,
    color: 'white',
    borderRadius: 6,
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  colorCode: {
    fontFamily: Font.ABold,
    fontSize: 14,
  },
  colorDescr: {
    fontFamily: Font.BRegular,
    fontSize: 12,
    color: 'rgba(0,0,0,.6)',
  },
  region: {
    fontFamily: Font.ASemiBold,
    fontSize: 10,
    marginBottom: 2
  },
  percentValue: {
    fontFamily: Font.ARegular,
    fontSize: 16,
  },
  percentValueBold: {
    fontFamily: Font.ABold,
    color: '#0085B2'
  }
});

export default ColorPerc;