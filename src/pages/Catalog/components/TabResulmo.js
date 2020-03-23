import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { Price } from '../../../components';
import global from '../../../assets/styles/global';
class TabResumo extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.currentColor !== this.props.currentColor) return true;
    if (nextProps.currentProduct.code === this.props.currentProduct.code) return false;
    return true;
  }

  render() {
    const { currentProduct, custonStyle, currentColor } = this.props;
    const { colors } = currentProduct;
    const cor = colors[currentColor];
    const corCode = cor ? cor.code : '';
    const corName = cor ? cor.name.toUpperCase() : '';
    return (
      <View style={[{ flex: 1, }, custonStyle]}>

        <Text style={styles.name}>
          {`${currentProduct.code} - ${currentProduct.name.toUpperCase()}`}
        </Text>
        <Text>
          {`${corCode} - ${corName}`}
        </Text>
        {/* TAGS */}
        {
          currentProduct.tags[corCode] && <Tags
            tags={currentProduct.tags[corCode]}
            containerStyle={{ paddingVertical: 7 }}
          />

        }
        <View style={[styles.container, { paddingTop: 0 }]}>
          {
            currentProduct.prices.map((item, index) => {
              return (
                <View style={styles.vwColumn} key={index.toString()}>
                  <View style={styles.box}>
                    <Text style={styles.titulo}>{currentProduct.prices.length > 1 ? `PREÇO ${item.label.toUpperCase()}` : 'PREÇO LISTA'}</Text>
                    <View style={styles.vwPrice}>
                      <Text style={[styles.txtPriceUnity, styles.txt]}>R$ </Text>
                      <Price
                        price={item.price}
                        style={[styles.txtPrice, styles.txt]}
                      />
                    </View>
                  </View>
                </View>
              );
            })
          }

          <View style={styles.vwColumn}>
            <View style={styles.box}>
              <Text style={styles.titulo}>PREÇO SUGESTÃO</Text>
              <View style={styles.vwPrice}>
                <Text style={[styles.txtPriceUnity, styles.txt]}>R$ </Text>
                <Price
                  price={currentProduct.precoSugerido}
                  style={[styles.txtPrice, styles.txt]}
                />
              </View>
            </View>
          </View>


          <View style={styles.vwColumn}>
            <View style={styles.box}>
              <Text style={styles.titulo}>GRUPO</Text>
              <Text style={[styles.descricao, { paddingLeft: 20 }]}>1</Text>
            </View>
          </View>

        </View>

      </View>
    );
  }
}

export default TabResumo;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 30,
    flexWrap: 'wrap',
  },
  txt: {
    fontFamily: Font.ARegular,
    color: 'rgba(0, 0, 0, 0.7)',
    marginTop: -9,
  },
  txtPrice: {
    fontSize: 22,
    paddingTop: 5,
    paddingLeft: 2,
  },
  txtPriceUnity: {
    fontSize: 12,
    paddingTop: 10,
  },
  vwPrice: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  vwColumn: {
    flexDirection: 'column',
    paddingRight: 20,
    // backgroundColor: 'pink'
  },
  box: {
    paddingBottom: 15,
  },
  titulo: {
    fontSize: 12,
    fontFamily: Font.ASemiBold,
    color: 'rgba(102, 102, 102, 1)',
    paddingBottom: 3,
  },
  name: {
    fontSize: 22,
    color: '#333',
    fontFamily: Font.BRegular,
  },
  descricao: {
    fontSize: 16,
    fontFamily: Font.ASemiBold,
    color: 'rgba(102, 102, 102, 1)',
  },
});

export const Tags = ({ tags = [], containerStyle }) => (
  <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, containerStyle]}>
    {
      tags.map(t => (
        <View
          key={t}
          style={{
            borderRadius: 10,
            backgroundColor: 'red',
            marginBottom: 5,
            marginRight: 5,
            marginTop: 2,
            paddingVertical: 2,
            paddingRight: 6,
            paddingLeft: 8,
          }}
        >
          <Text style={global.tag}>{t.toUpperCase()}</Text>
        </View>
      ))
    }
  </View>
);