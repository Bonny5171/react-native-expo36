import React from 'react';
import {
  View, StyleSheet,
  Platform, Keyboard,
  ImageBackground,
  Animated, Text, TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import global from '../../assets/styles/global';
import { acCurrentClient as acSetCurrentClient } from '../../redux/actions/pages/client';
import * as reducersClients from '../../redux/actions/pages/clients';
import * as ordersActions from '../../redux/actions/pages/orders';
import { acToggleMask } from '../../redux/actions/global';
import { acSetCarts, acSetDropdownCarts } from '../../redux/actions/pages/catalog';
import { acCurrentProduct } from '../../redux/actions/pages/cart';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import { Font } from '../../assets/fonts/font_names';
import { Button, Fade, Title, Row, TranslucidHeader, ModalMask, IconActionless, InfoMsg,
  Panel, TableList, FormatDate, SortBy, TextLimit, Price, DisableComponent, } from '../../components';
import { FilterPopUp, RowData, SummaryList, SortPopUp, } from './components';
import { HEADER_HEIGHT } from '../Catalog/Catalog';
import SrvClients from '../../services/Account';
import SrvOrder from '../../services/Order';
import { anyIsSelected } from '../../redux/reducers/pages/common/functions';
import { getSituations } from '../../services/Pages/Clients/Queries';
import { asyncForEach } from '../../utils/CommonFns';
import { OrderSubmenu } from '../Carrinhos/Carrinhos';
import { acCloseSubMenus } from '../../redux/actions/pages/menu';
import { BtnToggleList } from '../Clients/Clients';
import { cartBoxClicked } from '../../services/Pages/Cart/Queries';

class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: new Animated.Value(0)
    };
    this._isFirstMount = true;
    this.setListHeight = this.setListHeight.bind(this);
    this.btnMenuClicked = this.btnMenuClicked.bind(this);
    // this.props.acCurrentClient = this.props.acCurrentClient.bind(this);
  }

  async componentDidMount() {
    const { context, } = this.props;

    let orders = [];
    if (context === 'Admin') {
      orders = await SrvOrder.getPedidos();
    } else if (context === 'Vendedor') {
      const filtro = [{ sf_account_id: this.props.client.sf_id }, ];
      orders = await SrvOrder.getPedidos(filtro);
    }

    await asyncForEach(orders, async (car) => {
      car.products = await SrvOrder
        .getProdutos(
          [{ quote_sfa_guid__c: car.key }],
          { fields: ['sf_segmento_negocio__c'] }
        );
    });
    orders = orders.filter(c => c.products.length > 0);
    this.props.acSetCarts(orders);

    const cartDefault = orders.find(car => car.isDefault);
    this.props.acSetDropdownCarts({
      current: cartDefault,
      isVisible: false
    });

    const ordersFormatadas = orders.map(item => { return { option: item.client, key: item.clientId }; });
    this.props.acSetPopUpFilter('dropClients', ordersFormatadas);

    this._isFirstMount = false;
  }

  componentWillUnmount() {
    this.props.acResetPageOrders();
  }

  render() {
    // console.log('this.props.carts', this.props.carts);
    // Imagem do plano de fundo
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
    return (
      <ImageBackground source={background} style={styles.content} resizeMode="cover">
        {/* Body */}
        <View style={{ flex: 1 }}>
          <View style={styles.body}>
            {this._renderList()}
          </View>

          <ModalMask
            container={StyleSheet.absoluteFill}
            visible={this.props.modalMask}
            toggleModal={[
              { func: this.props.acToggleMask, params: [] },
              { func: this.props.acCloseSubMenus, params: [] },
              { func: this.props.acResetButtons, params: [] }
            ]}
          />
          {/* Header */}
          <TranslucidHeader
            startingHeight={100}
            content={styles.header}
            y={this.state.listHeight}
          >
            {this._renderHeader()}
          </TranslucidHeader>
        </View>
        { /* PopUp Sort */}
        <SortPopUp
          isVisible={this.props.buttons[0].isChosen}
          sortName={this.sortName}
          {...this.props}
          orderList={this.orderList}
        />
        {/* PopUp Filtro */}
        <Panel
          {...this.props.panel}
          pointerActiveContent={this.props.panelPointer}
          togglePop={() => {
            this.props.acTogglePanel();
            this.props.acToggleMask();
          }}
        >
          <FilterPopUp
            isVisible
            SrvClients={SrvClients}
            {...this.props}
          />
        </Panel>
      </ImageBackground>
    );
  }

  _renderHeader() {
    const {
      buttons,
      list,
      acUpdateComponent,
    } = this.props;
    return (
      <View>
        <Row style={{ width: '100%' }}>
          <Title style={styles.title} msg="PEDIDOS" />
          {
            this.props.context === 'Vendedor' &&
            <View style={{ flex: 1, paddingLeft: 10, paddingTop: 20, }}>
              <Text data-id="boxTituloCliente" style={[global.titleNomeCliente, { marginTop: 6 }]}>
                {this.props.client.fantasyName !== undefined ? this.props.client.fantasyName : ''}
                {this.props.client.code && (
                  <Text style={[global.codigoCliente, { marginTop: 12 }]}>
                    {this.props.client.code !== '' ? ` (${this.props.client.code})` : ''}
                  </Text>
                )
                }
              </Text>
              <Text style={global.setorCliente}>
                {this.props.client.sector}
              </Text>
            </View>
          }
          <View style={{ flexGrow: 1 }} />

          <DisableComponent isDisabled={this.props.carts.length === 0}>
            <Fade visible={this.props.listType} style={vwOrderBy}>
              <Button
                txtStyle={icOrderBy}
                txtMsg="k"
                isChosen={buttons[0].isChosen}
                shadow
                changeColor
                chosenColor="#0085B2"
                nChosenColor="rgba(0,0,0,.3)"
                rdAction={acUpdateComponent}
                rdName="sortPopUp"
                rdType="popup"
                actions={[{ func: this.btnMenuClicked, params: [0] }]}
              />
            </Fade>
            <Button
              tchbStyle={tchbFilter}
              txtStyle={styles.icFilter}
              txtMsg="l"
              isChosen={buttons[1].isChosen}
              shadow
              changeColor
              chosenColor="#0085B2"
              nChosenColor="rgba(0,0,0,.3)"
              action={() => {
                this.props.acToggleMask();
                this.props.acSetPanel(0);
                this.props.acTogglePanel();
              }}
            />
          </DisableComponent>

          <ModalMask
            container={StyleSheet.absoluteFill}
            visible={this.props.modalMask}
            toggleModal={[
              { func: this.props.acToggleMask, params: [] },
              { func: this.props.acCloseSubMenus, params: [] },
              { func: this.props.acResetButtons, params: [] }
            ]}
          />
        </Row>
        <DisableComponent isDisabled={this.props.carts.length === 0}>
          <BtnToggleList
            isActive={this.props.listType}
            action={() => {
              this.props.acToggleListOrders();
              if (this.props.modalMask) this.props.acToggleMask();
              if (this.props.buttons[0].isChosen) {
                this.props.acUpdateComponent('popup', 'sortPopUp');
                this.btnMenuClicked(0);
              }
            }}
            containerStyle={{
              marginRight: 40,
              marginTop: 5,
            }}
          />
        </DisableComponent>
      </View>
    );
  }

  _renderList() {
    if (this.props.carts.length === 0 && this._isFirstMount) {
      return (
        <InfoMsg
          firstMsgBold
          icon="5"
          firstMsg={['A página de', 'pedidos', 'está vazia.']}
          sndMsg="Talvez seja o momento de concluir alguma venda!"
        />
      );
    }
    if (!this.props.listType) {
      return (
        <TableList
          setListHeight={this.setListHeight}
          loadMore={() => { }}
          data={this.props.carts}
          sort={this.props.sort}
          header={(props) => <HeaderTL {...props} />}
          row={(item, index, props) => <RowTL item={item} {...props} />}
          orderList={this.orderList}
          navigation={this.props.navigation}
          appDevName={this.props.appDevName}
          acSetDropdownCarts={this.props.acSetDropdownCarts}
          acSetCurrentClient={this.props.acSetCurrentClient}
          acToggleSortOrders={this.props.acToggleSortOrders}
          containerStyle={{ marginTop: 108 }}
        />
      );
    }

    return (
      <View style={styles.vwList}>
        <SummaryList
          setListHeight={this.setListHeight}
          loadMore={() => { }}
          {...this.props}
          data={this.props.carts}
        />
      </View>
    );
  }

  setListHeight(y) {
    this.setState({ listHeight: new Animated.Value(y) });
  }

  btnMenuClicked() {
    // Se o modal atual for desativado, tira a máscara
    const isAnyModalOpen = anyIsSelected(this.props.buttons, 'isChosen');
    // Se um modal estiver ativo, precisa manter a máscara ativa
    if (isAnyModalOpen === undefined) {
      this.props.acToggleMask();
    } else if (!this.props.modalMask) {
      // Se a máscara não estiver ativa, ativaremos ela qando o modal abrir
      this.props.acToggleMask();
    }
  }

  toggleIsQuering = () => {
    this.setState({ isQuering: this.state.isQuering === 'auto' ? 'none' : 'auto' });
  }

  clearPanelFilters = () => {
    const hasFilters = this.props.popUpFilter.find(({ current }) => current !== '');
    if (!hasFilters) {
      setTimeout(() => {
        this.props.acClearPanelFilters();
      }, 550);
    }
  }

  sortName = async () => {
    SrvClients.get(this.props.acSetClients, ['sf_name']);
  }

  orderList = async (orderBy, isDesc) => {
    const carts = await SrvOrder.getPedidos([], orderBy, isDesc);
    this.props.acSetCarts(carts);
  }
}

const mapStateToProps = state => ({
  buttons: state.orders.buttons,
  sort: state.orders.sort,
  popUpFilter: state.clients.popUpFilter,
  panelFilter: state.clients.panelFilter,
  list: state.clients.list,
  panel: state.clients.panel,
  panelPointer: state.clients.panelPointer,
  data: state.clients.data,
  client: state.assistant.client,
  isResultFinder: state.clients.isResultFinder,
  context: state.global.context,
  window: state.global.window,
  modalMask: state.global.modalMask,
  carts: state.catalog.carts,
  dropdown: state.catalog.dropdown,
  listType: state.orders.listType,
  currentTable: state.assistant.currentTable,
});

export default connect(mapStateToProps,
  {
    ...reducersClients,
    ...ordersActions,
    acToggleMask,
    acSetCarts,
    acCloseSubMenus,
    acSetDropdownCarts,
    acCurrentProduct,
    acSetCurrentClient,
  })(Orders);

const icOrderBy = {
  fontFamily: Font.C,
  fontSize: 32,
  color: 'rgba(102, 102, 102, 0.5)',
  zIndex: 2,
};
const vwOrderBy = {
  marginTop: 30,
  marginRight: 10,
  zIndex: 2,
};
const tchbFilter = {
  marginTop: 30,
  marginRight: 32,
  zIndex: 2,
};

let styles = StyleSheet.create({
  vwList: {
    height: '100%'
  },
  title: {
    fontFamily: Font.AThin,
    marginLeft: 30,
    marginTop: 20,
    marginRight: 10,
    fontSize: 42,
    color: 'rgba(102, 102, 102, 0.5)',
  },
  content: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
  },
  row: {
    flexDirection: 'row',
  },
  icFilter: {
    fontFamily: Font.C,
    fontSize: 32,
    color: 'rgba(102, 102, 102, 0.5)',
  },
  // tchbList: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   alignSelf: 'flex-end',
  //   backgroundColor: '#DDD',
  //   height: 25,
  //   width: 31,
  //   marginRight: 32,
  //   marginTop: 5,
  //   bottom: 5,
  // },
  // icList: {
  //   ...Platform.select({
  //     ios: {
  //       position: 'absolute',
  //       right: 6,
  //     }
  //   }),
  //   fontFamily: Font.C,
  //   fontSize: 35,
  //   textAlign: 'center',
  //   color: 'rgba(102, 102, 102, 0.5)',
  // },
  // icViewType: {
  //   fontFamily: Font.C,
  //   fontSize: 25,
  //   marginLeft: 960,
  //   marginTop: 15,
  //   color: 'rgba(102, 102, 102, 0.5)',
  // },
  body: {
    flex: 1,
  },
  // listContainer: {
  //   flex: 1,
  //   width: '100%',
  // },
  // btnBuscar: {
  //   backgroundColor: '#0085B2',
  //   height: 40,
  //   width: 105,
  //   borderRadius: 45,
  //   paddingTop: 6,
  // },
  // txtBuscar: {
  //   fontSize: 17,
  //   color: 'white',
  //   fontFamily: Font.ASemiBold,
  //   textAlign: 'center',
  // },
  vwFPU: {
    position: 'absolute',
    marginTop: 65,
    width: 964,
    height: 350,
    ...Platform.select({
      web: {
        right: -54,
      }
    }),
  },
  vwSPU: {
    position: 'absolute',
    right: 85,
    marginTop: 65,
  },
  // vwClientBox: {
  //   alignItems: 'center',
  //   backgroundColor: '#ffffff',
  //   elevation: 2,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowColor: 'rgba(0, 0, 0, 0.3)',
  //   shadowRadius: 6,
  //   height: 240,
  //   marginTop: 20,
  //   paddingTop: 20,
  //   paddingBottom: 13,
  //   marginLeft: 20,
  // },
  // txtColumn: {
  //   fontSize: 14,
  //   fontFamily: Font.AMedium,
  // },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const RowTL = (props) => {
  const { item } = props;

  return (
    <TouchableOpacity
      onPress={() => {
        cartBoxClicked(props.data, item.key, props.acSetDropdownCarts, props.acSetCurrentClient, props.appDevName);
        props.navigation.navigate('order', { BackSpace: true, });
      }}
      style={{ flexDirection: 'row', alignItems: 'center', height: 40, width: '100%' }}
    >
      <View style={global.containerCenter}>
        <TextLimit
          msg={item.client.toUpperCase()}
          style={[global.txtColumn, { color: '#535456', fontFamily: Font.ASemiBold }]}
          maxLength={11}
        />
      </View>
      <View style={global.containerCenter}>
        {/* SETOR DO CLIENTE */}
        <TextLimit
          msg=""
          style={global.txtColumn}
          maxLength={11}
        />
      </View>
      <View style={global.containerCenter}>
        {/* ID DO PEDIDO */}
        {/* MAX LENGTH E PROPEIDADE TEMPORÁRIA */}
        <TextLimit
          msg={item.key}
          style={global.txtColumn}
          maxLength={8}
        />
      </View>
      <View style={global.containerCenter}>
        {/* STATUS DO PEDIDO */}
        <TextLimit
          msg=""
          style={global.txtColumn}
          maxLength={11}
        />
      </View>
      <View style={global.containerCenter}>
        {/* DT.STATUS DO PEDIDO */}
        <TextLimit
          msg=""
          style={global.txtColumn}
          maxLength={11}
        />
      </View>
      <View style={global.containerCenter}>
        {/* VALOR TOTAL DO PEDIDO */}
        <Price
          style={global.txtColumn}
          price={item.totalAmount}
        />
      </View>
    </TouchableOpacity>
  );
};

const HeaderTL = ({ sort, acToggleSortOrders, orderList }) => {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <SortBy
        hasArrows
        isActive={sort[0].isChosen}
        isUp={sort[0].order}
        type="CLIENTE"
        toggle={() => {
          acToggleSortOrders(sort[0].name);
          orderList(['sf_nome_cliente__c'], !sort[0].order);
        }}
        containerStyle={global.containerCenter}
        txtStyle={global.txtColumn}
      />
      <SortBy
        hasArrows
        isActive={sort[1].isChosen}
        isUp={sort[1].order}
        type="SETOR"
        toggle={() => {
          acToggleSortOrders(sort[1].name);
          // orderList(['sf_sector'], sort[1].order);
        }}
        containerStyle={global.containerCenter}
        txtStyle={global.txtColumn}
      />
      <SortBy
        hasArrows
        isActive={sort[2].isChosen}
        isUp={sort[2].order}
        type="PEDIDO"
        toggle={() => {
          acToggleSortOrders(sort[2].name);
          orderList(['id'], !sort[2].order);
        }}
        containerStyle={global.containerCenter}
        txtStyle={global.txtColumn}
      />
      <SortBy
        hasArrows
        isActive={sort[3].isChosen}
        isUp={sort[3].order}
        type="STATUS"
        toggle={() => {
          acToggleSortOrders(sort[3].name);
          // orderList(['sf_status'], sort[3].order);
        }}
        containerStyle={global.containerCenter}
        txtStyle={global.txtColumn}
      />
      <SortBy
        hasArrows
        isActive={sort[4].isChosen}
        isUp={sort[4].order}
        type="DT.STATUS"
        toggle={() => {
          acToggleSortOrders(sort[4].name);
          // orderList(['sf_dt_status'], sort[4].order);
        }}
        containerStyle={global.containerCenter}
        txtStyle={global.txtColumn}
      />
      <SortBy
        hasArrows
        isActive={sort[5].isChosen}
        isUp={sort[5].order}
        type="VALOR"
        toggle={() => {
          acToggleSortOrders(sort[5].name);
          orderList(['sf_total_amount'], !sort[5].order);
        }}
        containerStyle={global.containerCenter}
        txtStyle={global.txtColumn}
      />
    </View>
  );
};
