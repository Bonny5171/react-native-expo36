import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { Fade, Button, Price, FormatDate } from '../../../components';
import SrvOrder from '../../../services/Order';
import { getTotalGrades, getTotalPairs } from '../../../services/Pages/Cart/Queries';
import global from '../../../assets/styles/global';
import { TabFechamento } from '../components/Tabs';

export default class Footer extends PureComponent {
  constructor(props) {
    super(props);
    this._mounted = false;
  }

  state = {
    infoPosition: new Animated.Value(0),
    isInfoVisible: true,
    totals: {
      totalAmount: 0,
      pairs: 0,
      grades: 0,
    },
  }

  componentDidMount() {
    this._mounted = true;
    this.updateTotals();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.products !== this.props.products || this.props.dropdown !== prevProps.dropdown) {
      this.updateTotals();
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
  }

  render() {
    const animatedStyles = { transform: [{ translateX: this.state.infoPosition }] };
    const animatedFooterStyles = { height: this.props.footerHeight };
    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

    return (
      <Animated.View style={[styles.container, animatedFooterStyles]}>
        <TouchableOpacity
          data-id="rodapeDoCarrinho"
          style={styles.vwFooter}
          onPress={this.props.onFooter}
          disabled={this.props.footerOpen}
        >
          <Fade visible={this.props.footerOpen} duration={250} >
            <TabFechamento
              type="Carrinho"
              client={this.props.client}
              preData={this.props.preData}
              startDate={this.props.startDate}
              endDate={this.props.endDate}
            />
          </Fade>
          <AnimatedTouchable
            style={[
              { flexDirection: 'row', alignItems: 'center', padding: 20, width: '100%', height: 100 },
              animatedStyles
            ]}
            onPress={this.props.onFooter}
            disabled={!this.props.footerOpen}
          >
            <Button
              txtMsg="a"
              txtStyle={[global.iconUnChecked, this.state.isInfoVisible ? global.activeBtnShadow : global.defaultBlack, styles.btnHideInfo]}
              action={this.toggleInfo}
            />
            <View style={[styles.vwOrderInfo]}>
              <View style={styles.vwInfo}>
                <Text style={styles.headerInfo}>TOTAL GERAL</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={styles.unit}>R$</Text>
                  <Price
                    price={this.state.totals.totalAmount}
                    style={styles.valueInfo}
                  />
                </View>
              </View>
              <View style={styles.vwInfo}>
                <Text style={styles.headerInfo}>PARES</Text>
                <Text style={styles.valueInfo}>{this.state.totals.pairs}</Text>
              </View>
              <View style={styles.vwInfo}>
                <Text style={styles.headerInfo}>GRADES</Text>
                <Text style={[styles.valueInfo, { textAlign: 'center' }]}>{this.state.totals.grades}</Text>
              </View>
              <View style={styles.vwInfo}>
                <Text style={styles.headerInfo}>MÊS FATUR.</Text>
                {
                  (this.props.dropdown.current && this.props.dropdown.current.previsaoEmbarque) && <FormatDate date={this.props.dropdown.current.previsaoEmbarque} />
                }
              </View>
            </View>
            <View style={styles.grow} />
            <View style={styles.vwBtns}>
              <TouchableOpacity style={styles.btnSave} onPress={() => this.props.acSetToast({ text: 'Prévia do carrinho foi enviada por email.' })}>
                <Text style={styles.txtButton}>ENVIAR PRÉVIA</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.btnSave}>
                <Text style={styles.txtButton}>SALVAR CARRINHO</Text>
              </TouchableOpacity> */}
              {
                this.props.type === 'Carrinho' &&
                <TouchableOpacity
                  style={styles.btnBuy}
                  onPress={this.handleFinishOrder}
                >
                  <Text style={styles.txtButton}>FINALIZAR COMPRA</Text>
                </TouchableOpacity>
              }
            </View>
          </AnimatedTouchable>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  async updateTotals() {
    const { current } = this.props.dropdown;
    const { key } = this.props.dropdown.current;
    let totalAmount = 0;
    this.props.products.forEach((p) => { totalAmount += p.totalPrice; });
    const grades = await getTotalGrades(this.props.currentTable.code, key);
    const pairs = await getTotalPairs(this.props.currentTable.code, key);
    const totals = { ...this.state.totals, totalAmount, grades, pairs };
    if (this._mounted) {
      if (totals.totalAmount !== 0) {
        await SrvOrder.updateCarrnho({ id: current.key, }, { sf_grand_total: totals.totalAmount });
      }
      this.setState({ totals });
    }
  }

  handleFinishOrder = async () => {
    const { current } = this.props.dropdown;
    await this.props.acCheckPendencies(current.products, true);
    if (this.props.isOrderReady) {
      // Change status to COMPLETED
      await SrvOrder.updateCarrnho({ id: current.key, }, { sf_status: 'Em validação', sf_grand_total: this.state.totals.totalAmount });
      const client = { sf_id: current.clientId, fantasyName: current.client };
      const table = { code: current.sf_pricebook2id, name: current.sf_pricebook2_name__c, mesFatur: current.previsaoEmbarque };
      await SrvOrder.criarCarrinhoPadrao(client, table);
      // const cart = await SrvOrder.criarCarrinhoPadrao(client, table);
      // await this.props.acCurrentDropDown(cart);
      await this.props.checkOrderState(true);
      this.props.acOpenToast();
    } else {
      this.props.acSetPanel(4);
      this.props.acTogglePanel();
      this.props.acToggleMask();
    }
  }

  toggleInfo = () => {
    Animated.spring(this.state.infoPosition, {
      duration: 225,
      toValue: this.state.isInfoVisible ? -1000 : 0,
      useNativeDriver: true,
    }).start();
    this.setState({ isInfoVisible: !this.state.isInfoVisible });
  }
}

Footer.defaultProps = {
  products: []
};


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,.9)',
    height: 90,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.35)',
    flexDirection: 'row',
  },
  vwFooter: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  vwOrderInfo: {
    flexDirection: 'row',
  },
  vwInfo: {
    marginRight: 20,
  },
  headerInfo: {
    fontFamily: Font.BSemiBold,
    fontSize: 11,
    marginBottom: 2
  },
  valueInfo: {
    fontFamily: Font.ARegular,
    fontSize: 20,
  },
  grow: {
    flexGrow: 1
  },
  vwBtns: {
    flexDirection: 'row'
  },
  btnSave: {
    flexShrink: 1,
    marginLeft: 20,
    backgroundColor: '#0085B2',
    borderRadius: 17,
    paddingHorizontal: 20,
    height: 32,
    justifyContent: 'center'
  },
  txtButton: {
    color: 'white',
    fontFamily: Font.ASemiBold,
    fontSize: 14
  },
  btnBuy: {
    flexShrink: 1,
    marginLeft: 20,
    backgroundColor: '#0085B2',
    borderRadius: 17,
    paddingHorizontal: 20,
    height: 32,
    justifyContent: 'center'
  },
  unit: {
    fontSize: 11,
    marginRight: 2,
  },
  btnHideInfo: {
    marginRight: 15,
  }
});