
import React from 'react';
import { View, StyleSheet, Text, FlatList, Platform, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Row, Button, Fade, SimpleButton } from '../../../../components';
import { Font } from '../../../../assets/fonts/font_names';
import global from '../../../../assets/styles/global';

class SummaryEmail extends React.Component {
  render() {
    const {
      visible,
      dropdown,
      headerHeight,
      headerColumns,
      productsChecked,
      acClosePopUp,
      acToggleMask,
      acOpenCloseDropDown,
      acRemoveCheckedProduct,
    } = this.props;

    const dim = this.props.window;
    const maxHeight = dim.height - headerHeight;

    // console.log('RENDER SummaryEmail ...');
    return (
      <View style={styles.container}>
        { /* GRID SUMMARY - INICIO */ }
        <View style={{ flex: 1, height: '100%', marginBottom: 6 }}>
          <View>
            <View style={{
              flexDirection: 'row',
              borderBottomWidth: 0.75,
              borderBottomColor: '#EEE',
            }}
            >
              {/* Produto + Nome */}
              <View style={{ width: 303 }}>
                <Text style={global.columnHeader}>{headerColumns[0]}</Text>
              </View>
              {/* Codigo */}
              <View style={{ width: 72, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={global.columnHeader}>{headerColumns[1]}</Text>
              </View>
              {/* Imagem */}
              <View style={{ width: 72, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={global.columnHeader}>{headerColumns[2]}</Text>
              </View>
              {/* Cartela de cores */}
              <View style={{ width: 107, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={global.columnHeader}>{headerColumns[3]}</Text>
              </View>
            </View>
            <Fade visible={false} duration={150} style={{ position: 'absolute', width: '100%', marginTop: 20 }}>
            {
                  Platform.OS === 'web'
                    ? <View
                      style={{ height: 10, width: '100%' }}
                      colors={['rgba(0, 0, 0, 0.15)', 'rgba(0, 0, 0, 0.10)', 'rgba(0, 0, 0, 0)']}
                      data-id="lineargradient-summary-email"
                    />
                    : <LinearGradient
                      style={{ height: 10, width: '100%' }}
                      colors={['rgba(0, 0, 0, 0.15)', 'rgba(0, 0, 0, 0.10)', 'rgba(0, 0, 0, 0)']}
                    />
                }
            </Fade>
          </View>

          {/* ROWS */}
          <FlatList
            data={productsChecked}
              // onScroll={event => console.log('EVENT', event)}
              // onScrollBeginDrag={() => this.setState({ scrolling: true })}
              // onScrollEndDrag={() => this.setState({ scrolling: false, shadow: false })}
            renderItem={({ item }) => {
                const {
                  name,
                  code,
                  imagemSelected,
                  cartelaDeCoresSelected,
                  gradesSelected,
                  composicaoSelected,
                } = item;

                let vwDelete = { alignSelf: 'flex-end', paddingBottom: 8 };
                if (Platform.OS === 'web') {
                  vwDelete = { alignSelf: 'center' };
                }

                const sombra = {
                  color: '#0085B2',
                  textShadowColor: '#0085B2',
                  textShadowOffset: { width: 1, height: 2 },
                  textShadowRadius: 20,
                };

                return (
                  <View style={{ flex: 1, flexDirection: 'row', paddingTop: 5 }}>
                    {/* Thumb  */}
                    <View style={row.vwThumb}>
                      <Image
                        source={null}
                        style={{ height: 35, width: 65 }}
                        resizeMode="contain"
                      />
                    </View>

                    {/* Nome  */}
                    <View style={[row.vwColumn, { width: 233, }]}>
                      <View style={row.vwValue}>
                        <Text style={global.columnName}>{name.toUpperCase()}</Text>
                      </View>
                    </View>

                    {/* Codigo */}
                    <View style={[row.vwColumn, { width: 72, alignItems: 'center', }]}>
                      <View style={row.vwValue}>
                        <Text style={global.columnValue}>{code}</Text>
                      </View>
                    </View>

                    {/* Imagem */}
                    <View style={[row.vwColumn, { width: 72, alignItems: 'center', }]}>
                      <View style={row.vwValue}>
                        <TouchableOpacity onPress={() => {
                          item.imagemSelected = !item.imagemSelected;
                          this.props.acUpdateProductEmail(item);
                        }}
                        >
                          <Text style={[{
                              fontFamily: Font.C,
                              fontSize: 17,
                              color: 'rgba(0, 0, 0, 0.8)'
                            }, imagemSelected ? sombra : {}]}
                          >
                            {imagemSelected ? 'h' : 'i'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Cartela de cores */}
                    <View style={[row.vwColumn, { width: 107,  alignItems: 'center', }]}>
                      <View style={row.vwValue}>
                        <TouchableOpacity onPress={() => {
                          item.cartelaDeCoresSelected = !item.cartelaDeCoresSelected;
                          this.props.acUpdateProductEmail(item);
                        }}
                        >
                          <Text style={[{
                                fontFamily: Font.C,
                                fontSize: 17,
                                color: 'rgba(0, 0, 0, 0.8)',
                              }, cartelaDeCoresSelected ? sombra : {}]
                            }
                          >
                            {cartelaDeCoresSelected ? 'h' : 'i'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>


                    {/* Delete */}
                    <Button
                      tchbStyle={vwDelete}
                      txtMsg="w"
                      txtStyle={row.icDelete}
                      actions={[{ func: acRemoveCheckedProduct, params: [item] }]}
                    />
                  </View>
                  );
                }
              }
          />
        </View>

        {/* FOOTER */}
        <View style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        >
          <SimpleButton
            tchbStyle={[{ width: 110 }]}
            msg="ENVIAR"
            action={() => this.props.acSetToast({ text: 'Resumo Enviado p/Email' })}
          />
        </View>
      </View>
    );
  }
}

export default SummaryEmail;


const row = StyleSheet.create(
  {
    vwThumb: {
      alignItems: 'center',
      padding: 5,
      paddingLeft: 0,
    },
    vwColumn: {
      justifyContent: 'center',
      paddingBottom: 5,
      paddingTop: 5,
    },
    vwValue: {
      justifyContent: 'center'
    },
    icDelete: {
      fontFamily: Font.C,
      fontSize: 24,
      color: 'rgba(0, 0, 0, 0.3)',
    }
  }
);

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      width: '100%',
    },
    header: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 15
    },
    icMail: {
      fontFamily: Font.C,
      color: 'rgba(0, 0, 0, 0.3)',
      fontSize: 30
    },
    goToCartPage: {
      fontFamily: Font.ALight,
      fontSize: 18,
      textDecorationLine: 'underline',
      color: '#359EC2',
    },
    buttons: {
      backgroundColor: '#0085B2',
      height: 35,
      borderRadius: 45,
      justifyContent: 'center',
    },
    txtButtons: {
      fontSize: 20,
      color: 'white',
      fontFamily: Font.ASemiBold,
      textAlign: 'center'
    }
  }
);