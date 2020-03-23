import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Font } from '../../../../assets/fonts/font_names';
import { Fade } from '../../../../components';
import { SelectCart, CurrentCart } from './common';
import { acTogglePanel, acSetPanel } from '../../../../redux/actions/pages/catalog';

class FastSelection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.btnPlusClicked = this.btnPlusClicked.bind(this);
  }

  render() {
    const { carts, dropdown, acSaveCart, popSelectCart, acPopSelectCart, client } = this.props;
    // console.log('popSelectCart', popSelectCart);
    return (
      <View style={styles.container}>
        {/* <SelectCart
          isVisible={popSelectCart}
          acTogglePop={acPopSelectCart}
          containerStyle={{
            bottom: 63,
            right: 5,
            paddingBottom: 4
          }}
          client={client}
        /> */}
        <View style={styles.row}>
          {/* Resum dos carrinhos */}
          {/* <Fade visible={this.props.btnCarrinho && this.props.selecaoCarrinho}>
            <DropDown
              container={{
                width: 220,
                height: 30,
              }}
              current={dropdown.current}
              acOpenCloseDropDown={() => {
                this.props.acSelecaoCarrinho({ selecaoCarrinho: !this.props.selecaoCarrinho });
              }}
              params={[]}
            />
            <DropDownView
              vwStyle={{ width: 220, borderTopWidth: 1 }}
              isVisible
              options={carts}
              {...this.props}
              selectedStyleBold
              dropdown={dropdown}
              noClose
            />
          </Fade> */}
          {/* Label de carrinho atual */}
          {/* <CurrentCart
            visible={!this.props.selectOpt && this.props.btnCarrinho}
            currCart={dropdown.current}
            acPopSelectCart={() => {
              this.props.acPopSelectCart();
              this.props.acToggleMask();
            }}
            tchbStyle={{
              marginBottom: 11,
              marginRight: 7,
            }}
          /> */}
          {/* Caixa no canto inferior direita */}
          <View>

            <Fade visible={this.props.selectOpt} style={{ transform: [{ translateY: 8 }] }}>

              {/* CARRINHO */}
              {this.renderCarrinhoButton()}

              {/* EMAIL */}
              {this.renderEnvelopButton()}
            </Fade>

            {this.renderPlusButton()}
          </View>
        </View>
      </View>
    );
  }

  renderCarrinhoButton(selectOpt = false) {
    const iconPlusSelected = this.props.btnCarrinho ? {
      color: 'rgba(0, 122, 176, 0.85)',
      textShadowColor: 'rgba(0, 122, 176, 0.85)',
      textShadowOffset: { height: 1, width: 0 },
      textShadowRadius: 3,
    } : null;

    return (
      <TouchableOpacity
        activeOpacity={this.props.btnCarrinho ? 1 : 0.7}
        onPress={() => {
          // Quando o '+' está selecionado
          if (selectOpt) {
            // Volta o botão de carrinho para o '+'
            this.props.acCarrinho({ btnCarrinho: false });
            this.props.acSelecaoCarrinho({ selecaoCarrinho: false });
            this.props.acSelectOpt({ selectOpt: false });
            this.props.acSelectList({ selectList: false });
            if (this.props.popSelectCart) this.props.acPopSelectCart();
          } else {
            // Define botõs ativos
            this.props.acCarrinho({ btnCarrinho: !this.props.btnCarrinho });

            // Define o icone atual e fecha as opções de botões flutuantes
            this.props.acSelectOpt({ selectOpt: !this.props.selectOpt });
            this.props.acSelecaoCarrinho({ selecaoCarrinho: true });

            if (!this.props.btnCarrinho) {
              this.props.acSelecaoCarrinho({ selecaoCarrinho: true });
            }

            if (this.props.btnEnvelope) {
              this.props.acBtnEnvelop({ btnEnvelope: !this.props.btnEnvelope });
            }

            // Fecha o assistente de seleção se ativo. "Checkbox"
            if (this.props.selectList && !this.props.btnEnvelope) {
              return this.props.acSelectList({ selectList: false });
            }

            // Ja habilito o assitente de seleção.
            this.props.acSelectList({ selectList: true });
          }
        }}
        style={{ marginBottom: 3 }}
      >
        <View style={[styles.circle, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }]}>
          <Text style={[styles.iconPlus, iconPlusSelected]}>p</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderEnvelopButton(selectOpt = false) {
    return (
      <TouchableOpacity
        activeOpacity={this.props.selectList ? 1 : 0.7}
        onPress={() => {
          if (selectOpt) {
            this.props.acSelectOpt({ selectOpt: false });
            this.props.acBtnEnvelop({ btnEnvelope: false });
            this.props.acSelectList({ selectList: false });
          } else {
            // Fecha o assistente de seleção se ativo. "Checkbox"
            // Define o icone atual e fecha as opções de botões flutuantes
            this.props.acSelectOpt({ selectOpt: !this.props.selectOpt });
            this.props.acBtnEnvelop({ btnEnvelope: true });

            if (this.props.selectList) {
              this.props.acSelectList({ selectList: false });
            }
            this.props.acBtnEnvelop({ btnEnvelope: !this.props.btnEnvelope });
            if (this.props.btnCarrinho) {
              this.props.acCarrinho({ btnCarrinho: !this.props.btnCarrinho });
            }
            if (!this.props.btnCarrinho) {
              this.props.acSelecaoCarrinho({ selecaoCarrinho: false });
            }
            // Habilita o assistente de seleção.
            this.props.acSelectList({ selectList: !this.props.btnEnvelope });
          }
        }}
      >
        <View style={[styles.circle, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }]}>
          <Text style={[
            styles.iconPlus,
            {
              color: this.props.btnEnvelope
                ? 'rgba(0, 122, 176, 0.85)'
                : 'rgba(102, 102, 102, 0.5)'
            }
          ]}
          >W
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderPlusButton() {
    if (!this.props.selectOpt && (this.props.btnCarrinho || this.props.btnEnvelope)) {
      if (this.props.btnCarrinho) {
        return this.renderCarrinhoButton(true);
      }

      return this.renderEnvelopButton(true);
    }
    const plusStateStyle = this.props.selectOpt ? {
      color: 'rgba(0, 122, 176, 0.85)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowColor: '#0085B2',
      textShadowRadius: 8
    } : { color: 'rgba(102, 102, 102, 0.5)' };
    return (
      <TouchableOpacity
        activeOpacity={this.props.selectList ? 1 : 0.7}
        onPress={this.btnPlusClicked}
      >
        <View style={[styles.circle, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[
            styles.iconPlus,
            plusStateStyle
          ]}
          >g
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  btnPlusClicked() {
    // O seletor múltiplo precisa ter contato com a lista quando está ativo
    if (this.props.modalMask) {
      this.props.acToggleMask();
    }
    // this.props.acCloseCatalogModals();
    // Abre as opções.
    this.props.acSelectOpt({ selectOpt: !this.props.selectOpt });
    // Fecha o assistente de seleção se ativo. "Checkbox"
    if (!this.props.selectList) {
      this.props.acSelectList({ selectList: false });
    }
    if (this.props.btnCarrinho) {
      this.props.acSelecaoCarrinho({ selecaoCarrinho: false });
      this.props.acBtnEnvelop({ btnCarrinho: false });
    }
  }
}

export default FastSelection;

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    animateList: {
      paddingTop: 55,
    },
    iconPlus: {
      fontFamily: Font.C,
      fontSize: 32,
      color: 'rgba(102, 102, 102, 0.5)',
    },
    toPlus: {
      position: 'absolute',
      height: 50,
      width: 50,
      bottom: 0,
      right: 10,
      padding: 5
    },
    circle: {
      width: 55,
      height: 55,
      borderRadius: 55 / 2,
    }
  }
);

