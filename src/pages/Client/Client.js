import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Platform, Animated, } from 'react-native';
import { connect } from 'react-redux';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import * as actionsCliente from '../../redux/actions/pages/client';
import * as actionsMenu from '../../redux/actions/pages/menu';
import { acCurrentClient, acNextClient, acPreviousClient } from '../../redux/actions/pages/clients';
import { acUpdateButtons, acResetButtons, acSetDropdownCarts, } from '../../redux/actions/pages/catalog';
import { acCurrentTable } from '../../redux/actions/pages/assistant';
import { Title, FadeTabs, ExtraInfo as EI, SimpleDropDown, DropTable, TranslucidHeader } from '../../components';
import { Font } from '../../assets/fonts/font_names';
import { SubHeader, ClientDetails, LastOrders, Attribute, ClientField, ExtraInfo, FinancialInformation, } from './components';
import Button from '../../components/Button';
import global from '../../assets/styles/global';
import { EIHeader } from '../../components/ExtraInfo';
import SrvOrder from '../../services/Order';
import { asyncForEach } from '../../utils/CommonFns';
import { acCurrentProduct } from '../../redux/actions/pages/cart';

const width = Platform.OS === 'web' ? '98%' : '100%';
const HEADER_HEIGHT = 116;

class Client extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: 0,
      listHeight: new Animated.Value(0),
      orders: [],
      tabsComparativas: [
        {
          title: 'ACUMULADO (JAN - MAI)',
          data: [
            ['FEMININO', '14.292', '14.120', '-1,2%', 'R$ 271.728,01', 'R$ 268.457,84', '-1,2%'],
            ['IPANEMA', '16.548', '16.620', '0,4%', 'R$ 157.878,71', 'R$ 158.565,64', '0,4%'],
            ['KIDS', '10.020', '8.396', '-16,2%', 'R$ 250.369,65', 'R$ 209.790,78', '-16,2%'],
            ['MASCULINO', '15.048', '14.998', '-0,3%', 'R$ 186.714,22', 'R$ 186.093,82', '-0,3%']
          ]
        },
        {
          title: 'TABELA ATUAL (JUN)',
          data: [
            ['FEMININO', '0', '0', '-100,0%', 'R$ 0,00', 'R$ 0,00', '-100,0%'],
            ['IPANEMA', '456', '0', '-100,0%', 'R$ 2.815,80', 'R$ 0,00', '-100,0%'],
            ['KIDS', '0', '0', '-100,0%', 'R$ 0,00', 'R$ 0,00', '-100,0%'],
            ['MASCULINO', '4.512', '0', '-100,0%', 'R$ 53.220,79', 'R$ 0,00', '-100,0%']
          ]
        }
      ],
      informacoesFinanceiras: {},
    };
    this._mounted = false;
    this.backgroundHeight = 0;
    this.client = this.props.context === 'Admin' ? props.client : props.assClient;
    this.background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
    this._renderCustomHeader = this._renderCustomHeader.bind(this);
  }

  async componentDidMount() {
    this._mounted = true;
    const filtro = [{ sf_account_id: this.client.sf_id }];
    const orders = await SrvOrder.getPedidos(filtro);
    await asyncForEach(orders, async (car) => {
      car.products = await SrvOrder
        .getProdutos(
          [{ quote_sfa_guid__c: car.key }],
          { fields: ['sf_segmento_negocio__c'] }
        );
    });
    if (this._mounted) this.setState({ orders });

    const cartDefault = orders.find(car => car.isDefault);
    this.props.acSetDropdownCarts({
      current: cartDefault,
      isVisible: false
    });
  }

  componentWillUnmount() {
    if (this.props.context === 'Admin') {
      this.props.acCurrentClient({}, {}, {}, {});
    }
    this.props.acResetPage();
    this._mounted = false;
  }

  componentWillUpdate(nextProps) {
    if (this.props.infoPointer !== nextProps.infoPointer) this.props.acResetButtons();
  }

  render() {
    const { context, } = this.props;
    if (!this.client.billing) return null;
    const infos = this.client.billing !== undefined ? [this.client.billing.address, this.client.comercial.address, this.client.shipping.address] : ['[nulo]', '[nulo]', '[nulo]'];

    this.extraInfoScreens = [
      <FinancialInformation
        client={this.client}
        pedidosAprovar={this.client.pedidosAprovar}
        despesasAvencer={this.client.saldoDespesasAvencer}
        despesasVencidas={this.client.saldoDespesasVencidas}
      />,
      <ExtraInfo
        title="Endereços"
        labels={['COBRANÇA', 'COMERCIAL', 'ENTREGA']}
        infos={infos}
        postalCodes={['003123', '003123', '003123']}
        locationInfo={[
          {
            postalCode: this.client.billing.postalCode,
            city: this.client.billing.city,
            state: this.client.billing.state,
          },
          {
            postalCode: this.client.comercial.postalCode,
            city: this.client.comercial.city,
            state: this.client.comercial.state,
          },
          {
            postalCode: this.client.shipping.postalCode,
            city: this.client.shipping.city,
            state: this.client.shipping.state,
          },
        ]}
        infoElement={AddressInfo}
        {...this.props}
        client={this.client}
      />,
      <ExtraInfo
        customContent
        title="Descontos"
        labels={['BONIF. EXCLUSIVIDADE', 'DESC.CLIENTE', 'MARKUP CADASTRO', 'DIAS NF', 'PONTUALIDADE NF', 'PONT. DUPLIC']}
        infos={['-', '15 %', '-', '14 dia(s)', '-', '5% NA DUPLICATA']}
        contentElement={DiscountInfo}
        {...this.props}
        client={this.client}
      />,
      <ExtraInfo
        title="Outras Informações"
        labels={['CENTRALIZADOR DE PAGAMENTOS', 'CENTRALIZADOR DE COBRANÇAS', 'SETOR DE ATIVIDADE', 'UTILIZA ORDEM DE COMPRA', 'EMBALAMENTO']}
        infos={['588644', '588644', this.client.sector, this.client.ordemCompra ? 'SIM' : 'NÃO', this.client.tipoEmbalamento.type]}
        infoElement={DefaultInfo}
        {...this.props}
        client={this.client}
      />
    ];
    const tabs = this._renderTabs();
    const marginTop = context === 'Admin' ? { marginTop: 100 } : { marginTop: 0 };
    return (
      <ImageBackground source={this.background} style={{ flex: 1 }} resizeMode="cover">
        {
          context === 'Admin'
          &&  <TranslucidHeader
            startingHeight={100}
            content={[{ height: HEADER_HEIGHT, alignItems: 'center', width, }, styles.header]}
            y={this.state.listHeight}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              { context !== 'Vendedor' &&
              <Button
                txtStyle={styles.backArrow}
                action={() => {
                        this.props.navigation.pop();
                      }}
                txtMsg="v"
              />
                  }
              <Title msg="CLIENTE" style={{ marginLeft: 10, marginTop: 8 }} />
            </View>
              </TranslucidHeader>
        }
        <ScrollView
          ref={(ref) => { this.scrollView = ref; }}
          onScroll={this.handleScroll}
          scrollEventThrottle={16}
          style={marginTop}
        >
          {
            context === 'Vendedor'
            &&  <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center', }, styles.header]}>
              <Title msg="CLIENTE" style={{ marginLeft: 10, marginTop: 8 }} />
                </View>
          }
          <ClientDetails clientU={this.client} {...this.props} />
          { /* Informações extras do cliente atual */}
          <FadeTabs
            noGradient
            activeTab={this.props.infoPointer}
            tabs={this.props.extraInfo}
            customHeader={this._renderCustomHeader}
            container={{ marginTop: 46 }}
          >
            {tabs}
          </FadeTabs>
          <LastOrders
            {...this.props}
            orders={this.state.orders}
            acSetDropdownCarts={this.props.acSetDropdownCarts}
            acCurrentProduct={this.props.acCurrentProduct}
          />
          {/* Atributos */}
          <View style={{ flex: 1, paddingTop: 60, }}>
            <Text style={styles.attributesTitle}>ATRIBUTOS</Text>
            <View style={styles.vwAttributes}>
              <Attribute {...this.props} type="PONTUALIDADE" grade={this.client.pontualidade} />
              <Attribute {...this.props} type="FREQUÊNCIA" grade={this.client.frequencia} />
              <Attribute {...this.props} type="CONFIRMAÇÃO" grade={this.client.confirmacao} />
              <Attribute {...this.props} type="ENCARTES" grade={this.client.encartes} />
            </View>
          </View>

          {/* TABELA MOCADA PARA CONVENÇÃO */}
          <View style={{ flex: 1,  }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20,  }}>
              <Text style={styles.attributesTitle}>COMPARATIVO - VENDA LÍQUIDA</Text>
              <Text style={styles.subTitleComparativo}>Acumulado (Jan - Mai)</Text>
            </View>
            <View data-id="comparativo" style={{ marginHorizontal: 60 }}>
              <View style={[styles.tabRow, { marginBottom: 5 }]}>
                <View style={{ flex: 2 }} />
                <Text style={[styles.tabTitle, { flex: 5 }]}>PARES</Text>
                <Text style={[styles.tabTitle, { flex: 7 }]}>R$ (-5%)</Text>
              </View>
              <View data-id="headRow" style={[styles.tabRow]}>
                <Text style={[styles.tabCell, styles.tabHead, { flex: 2 }]}>SEGMENTO</Text>
                <View style={styles.tabGap} />
                <Text style={[styles.tabCell, styles.tabHead, { flex: 2 }]}>2018</Text>
                <Text style={[styles.tabCell, styles.tabHead, { flex: 2 }]}>2019</Text>
                <Text style={[styles.tabCell, styles.tabHead, { flex: 2 }]}>VAR.</Text>
                <View style={styles.tabGap} />
                <Text style={[styles.tabCell, styles.tabHead, { flex: 3 }]}>2018</Text>
                <Text style={[styles.tabCell, styles.tabHead, { flex: 3 }]}>2019</Text>
                <Text style={[styles.tabCell, styles.tabHead, { flex: 2 }]}>VAR.</Text>
              </View>
              {this._renderTabRow(0)}
              <View data-id="FooterRow" style={[styles.tabRow]}>
                <Text style={[styles.tabCell, styles.tabText, styles.tabTotal, { flex: 2 }]}>TOTAL</Text>
                <View style={styles.tabGap} />
                <Text style={[styles.tabCell, styles.tabText, styles.tabFooter, { flex: 2 }]}>55.908</Text>
                <Text style={[styles.tabCell, styles.tabText, styles.tabFooter, { flex: 2 }]}>54.134</Text>
                <Text style={[styles.tabCell, styles.tabText, styles.tabFooter, { flex: 2, color: 'red' }]}>-3,2%</Text>
                <View style={styles.tabGap} />
                <Text style={[styles.tabCell, styles.tabText, styles.tabFooter, { flex: 3 }]}>R$ 866.690,59</Text>
                <Text style={[styles.tabCell, styles.tabText, styles.tabFooter, { flex: 3 }]}>R$ 822.908,08</Text>
                <Text style={[styles.tabCell, styles.tabText, styles.tabFooter, { flex: 2, color: 'red' }]}>-5,1%</Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, paddingTop: 60, marginBottom: 30, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20,  }}>
              <Text style={styles.attributesTitle}>COMPARATIVO - VENDA LÍQUIDA</Text>
              <Text style={styles.subTitleComparativo}>Tabela Atual (Jun)</Text>
            </View>
            <View data-id="comparativo" style={{ marginHorizontal: 60 }}>
              <View style={[styles.tabRow, { marginBottom: 5 }]}>
                <View style={{ flex: 2 }} />
                <Text style={[styles.tabTitle, { flex: 5 }]}>PARES</Text>
                <Text style={[styles.tabTitle, { flex: 7 }]}>R$ (-5%)</Text>
              </View>
              <View data-id="headRow" style={[styles.tabRow]}>
                <Text style={[styles.tabCell, styles.tabHead, { flex: 2 }]}>SEGMENTO</Text>
                <View style={styles.tabGap} />
                <Text style={[styles.tabCell, styles.tabHead, { flex: 2 }]}>2018</Text>
                <Text style={[styles.tabCell, styles.tabHead, { flex: 2 }]}>2019</Text>
                <Text style={[styles.tabCell, styles.tabHead, { flex: 2 }]}>VAR.</Text>
                <View style={styles.tabGap} />
                <Text style={[styles.tabCell, styles.tabHead, { flex: 3 }]}>2018</Text>
                <Text style={[styles.tabCell, styles.tabHead, { flex: 3 }]}>2019</Text>
                <Text style={[styles.tabCell, styles.tabHead, { flex: 2 }]}>VAR.</Text>
              </View>
              {this._renderTabRow(1)}
              <View data-id="FooterRow" style={[styles.tabRow]}>
                <Text style={[styles.tabCell, styles.tabText, styles.tabTotal, { flex: 2 }]}>TOTAL</Text>
                <View style={styles.tabGap} />
                <Text style={[styles.tabCell, styles.tabText, styles.tabFooter, { flex: 2 }]}>4.968</Text>
                <Text style={[styles.tabCell, styles.tabText, styles.tabFooter, { flex: 2 }]}>0</Text>
                <Text style={[styles.tabCell, styles.tabText, styles.tabFooter, { flex: 2, color: 'red' }]}>-100,0%</Text>
                <View style={styles.tabGap} />
                <Text style={[styles.tabCell, styles.tabText, styles.tabFooter, { flex: 3 }]}>R$ 56.036,59</Text>
                <Text style={[styles.tabCell, styles.tabText, styles.tabFooter, { flex: 3 }]}>R$ 0,00</Text>
                <Text style={[styles.tabCell, styles.tabText, styles.tabFooter, { flex: 2, color: 'red' }]}>-100,0%</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  _renderTabRow(pos) {
    const tabRow = this.state.tabsComparativas[pos].data.map((item, index) =>
      (<View key={index.toString()} data-id="bodyRow" style={[styles.tabRow]}>
        <Text style={[styles.tabCell, styles.tabText, { flex: 2 }]}>{item[0]}</Text>
        <View style={styles.tabGap} />
        <Text style={[styles.tabCell, styles.tabText, { flex: 2 }]}>{item[1]}</Text>
        <Text style={[styles.tabCell, styles.tabText, { flex: 2 }]}>{item[2]}</Text>
        <Text style={[styles.tabCell, styles.tabText, { flex: 2 }, (item[3].indexOf('-') != -1) ? { color: 'red' } : null]}>{item[3]}</Text>
        <View style={styles.tabGap} />
        <Text style={[styles.tabCell, styles.tabText, { flex: 3 }]}>{item[4]}</Text>
        <Text style={[styles.tabCell, styles.tabText, { flex: 3 }]}>{item[5]}</Text>
        <Text style={[styles.tabCell, styles.tabText, { flex: 2 }, (item[6].indexOf('-') != -1) ? { color: 'red' } : null]}>{item[6]}</Text>
      </View>)
      );

    return tabRow;
  }

  _renderTabs() {
    const tabs = this.props.extraInfo.map((button, index) => (
      <EI
        key={index.toString()}
        container={styles.extraInfo}
        contentStyle={[styles.content, global.boxShadow]}
      >
        {this.extraInfoScreens[index]}
      </EI>
    ));

    return tabs;
  }

  _renderCustomHeader() {
    return (
      <EIHeader
        containerStyle={{ height: 45 }}
        titleStyle={{ marginLeft: 30 }}
        current={this.props.currentInfo}
        buttons={this.props.extraInfo}
        acChangeTab={this.handleChangeTab}
      />
    );
  }

  handleChangeTab = (i) => {
    this.props.acChangeTab(i);
    if (this.state.scrollY < 106 && this.state.scrollY < 512) {
      this.scrollView.scrollTo({ y: 200, animated: true });
    }
  }

  handleScroll = ({ nativeEvent }) => {
    this.setState({
      scrollY: nativeEvent.contentOffset.y,
      listHeight: new Animated.Value(nativeEvent.contentOffset.y),
    });
  }
}

const mapStateToProps = state => ({
  cartButton: state.client.cartButton,
  extraInfo: state.client.extraInfo,
  uniqueClient: state.assistant.client,
  currentInfo: state.client.currentInfo,
  infoPointer: state.client.infoPointer,
  previous: state.clients.previous,
  client: state.clients.client,
  assClient: state.assistant.client,
  next: state.clients.next,
  window: state.global.window,
  context: state.global.context,
  tableDropDown: state.catalog.tableDropDown,
  catalogButtons: state.catalog.buttons,
  currentTable: state.assistant.currentTable,
  carts: state.catalog.carts,
});


export default connect(mapStateToProps,
  {
    ...actionsMenu,
    ...actionsCliente,
    acCurrentClient,
    acNextClient,
    acPreviousClient,
    acUpdateButtons,
    acCurrentTable,
    acResetButtons,
    acSetDropdownCarts,
    acCurrentProduct,
  }
)(Client);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  extraInfo: {
    width: '100%',
  },
  content: {
    elevation: 3,
    height: 300,
  },
  backArrow: {
    fontFamily: Font.C,
    fontSize: 30,
    marginTop: 12,
    transform: [{ rotate: '180deg' }],
    color: 'rgba(102, 102, 102, 0.5)'
  },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  text: {
    fontSize: 15,
    fontFamily: Font.AMedium
  },
  vwAttributes: {
    flexDirection: 'row',
    paddingTop: 15,
    justifyContent: 'flex-start',
    paddingLeft: 31,
    paddingRight: 30,
  },
  attributesTitle: {
    fontFamily: Font.BLight,
    fontSize: 22,
    color: 'black',
    paddingLeft: 30
  },
  icCart: {
    fontSize: 35,
    fontFamily: Font.C,
    color: '#999',
    marginTop: 12
  },
  lblClient: {
    fontFamily: Font.BSemiBold,
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.9)',
    letterSpacing: 0.7,
  },
  txtClient: {
    fontFamily: Font.ALight,
    fontSize: 15,
    color: 'black',
    marginTop: 2,
    letterSpacing: 0.7,
  },
  flexOne: {
    flex: 1,
  },
  spacingNumbers: {
    letterSpacing: 1
  },
  ddTables: {
    fontSize: 18,
    fontFamily: Font.BThin,
    color: 'rgba(0, 0, 0, 0.6)',
    marginLeft: 12,
  },
  rowDiscount: {
    width: '100%',
    maxWidth: 1024,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clientExtraInfo: {
    marginRight: 30,
    marginBottom: 19,
  },
  vwSelectTable: {
    position: 'absolute',
    top: 40,
    alignItems: 'center',
    width: 105,
    backgroundColor: 'rgba(236, 238, 237, 0.84)',
    borderWidth: 1,
    borderBottomEndRadius: 12,
    borderBottomLeftRadius: 12,
    borderColor: '#999',
    borderTopWidth: 0,
    height: 113,
    zIndex: 3,
  },
  paddingTop: { paddingTop: 19 },
  horizontalWidth: { width: 230 },

  tabTitle: {
    color: '#00698C',
    fontFamily: Font.BSemiBold,
    fontSize: 14,
    // paddingLeft: 12,
    flex: 1,
    textAlign: 'center'
  },
  tabHead: {
    fontFamily: Font.BSemiBold,
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,.05)',
  },
  tabCell: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tabGap: { width: 2, flexShrink: 1 },
  tabBody: {},
  tabText: {
    fontFamily: Font.ARegular,
    fontSize: 14,
    textAlign: 'center',
  },
  tabFooter: {
    backgroundColor: 'rgba(255,255,255,.6)',
    fontFamily: Font.ASemiBold,
  },
  tabTotal: {
    fontFamily: Font.BSemiBold,
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,.6)',
  },
  tabRow: {
    flexDirection: 'row',
  },
  subTitleComparativo: {
    fontFamily: Font.BSemiBold,
    fontSize: 18,
    color: 'black',
    paddingRight: 30
  },
});

const AddressInfo = ({ label, info, postalCode, city, state }) => (
  <View style={{ marginRight: 15 }}>
    <View style={{ height: 55 }}>
      <Text style={styles.lblClient}>{label}</Text>
      <Text style={styles.txtClient}>
        {info.toUpperCase()}
      </Text>
    </View>
    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.txtClient}>{city.toUpperCase()} - </Text>
      <Text style={styles.txtClient}>{state.toUpperCase()}</Text>
    </View>
    <Text style={styles.txtClient}>
      {postalCode}
    </Text>
  </View>
);

const DefaultInfo = ({ label, info,  isCurrency }) => (
  <ClientField
    label={label}
    msg={info}
    container={{ height: 36, marginRight: 15, marginBottom: 10 }}
    vwLabel={styles.flexOne}
    vwText={styles.flexOne}
    styleText={styles.spacingNumbers}
    isCurrency={isCurrency}
  />
);

const DiscountInfo = (props) => (
  <View style={{ flex: 1 }}>
    <View style={styles.rowDiscount}>
      <View style={styles.horizontalWidth}>
        <ClientField
          label="VALIDADE"
          container={styles.clientExtraInfo}
          msg="20/05/19"
          vwLabel={styles.flexOne}
          vwText={styles.flexOne}
          styleText={styles.spacingNumbers}
        />
        <ClientField
          label={props.labels[0]}
          msg={props.infos[0]}
          container={styles.clientExtraInfo}
          vwLabel={styles.flexOne}
          vwText={styles.flexOne}
          styleText={styles.spacingNumbers}
        />
        <ClientField
          label={props.labels[3]}
          msg={props.infos[3]}
          container={styles.clientExtraInfo}
          vwLabel={styles.flex}
          vwText={styles.flexOne}
          styleText={styles.spacingNumbers}
        />
      </View>
      <View style={styles.horizontalWidth}>
        <DropTable
          actions={[
            {
              func: props.acUpdateButtons,
              params: ['tableSelector'],
            }
          ]}
          currentTable={props.currentTable.name}
          shouldChangeBorder={props.catalogButtons[5].isChosen}
          containerStyle={[styles.clientExtraInfo, { marginBottom: 13 }]}
          maxLength={6}
          isDisabled
        />
        <SimpleDropDown
          vwStyle={styles.vwSelectTable}
          passObject
          options={props.tableDropDown.options}
          isVisible={props.catalogButtons[5].isChosen}
          acUpdateCurrent={props.acCurrentTable}
          clientId={props.client.sf_id}
        />
        <ClientField
          label={props.labels[1]}
          msg={props.infos[1]}
          container={styles.clientExtraInfo}
          vwLabel={styles.flexOne}
          vwText={styles.flexOne}
          styleText={styles.spacingNumbers}
        />
        <ClientField
          label={props.labels[4]}
          msg={props.infos[4]}
          container={styles.clientExtraInfo}
          vwLabel={styles.flexOne}
          vwText={styles.flexOne}
          styleText={styles.spacingNumbers}
        />
      </View>
      <View style={styles.horizontalWidth}>
        <View style={[styles.clientExtraInfo, { marginBottom: 0, height: 42 }]} />
        <ClientField
          label={props.labels[2]}
          msg={props.infos[2]}
          container={styles.clientExtraInfo}
          vwLabel={styles.flexOne}
          vwText={styles.flexOne}
          styleText={styles.spacingNumbers}
        />
        <ClientField
          label={props.labels[5]}
          msg={props.infos[5]}
          container={styles.clientExtraInfo}
          vwLabel={styles.flexOne}
          vwText={styles.flexOne}
          styleText={styles.spacingNumbers}
        />
      </View>
    </View>
  </View>
);