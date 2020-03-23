import React from 'react';
import { View, StyleSheet, Platform, ImageBackground, Animated, Text, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import * as cartsActions from '../../redux/actions/pages/carts';
import global from '../../assets/styles/global';
import { acCurrentClient as acSetCurrentClient } from '../../redux/actions/pages/client';
import { acToggleMask, acSetToast, acRemoveMask } from '../../redux/actions/global';
import { acSetDropdownCarts } from '../../redux/actions/pages/catalog';
import { acCurrentProduct } from '../../redux/actions/pages/cart';
import { acSetClients, acFilterList } from '../../redux/actions/pages/clients';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import { Font } from '../../assets/fonts/font_names';
import {
  Button, Fade, Title, Row, TranslucidHeader, ModalMask,
  InfoMsg, Panel, TableList, SortBy, Price, TextLimit, DisableComponent,
} from '../../components';
import { FilterPopUp, SummaryList, SortPopUp, Copy, } from './components';
import { HEADER_HEIGHT } from '../Catalog/Catalog';
import SrvOrder from '../../services/Order/';
import SrvProduct from '../../services/Product';
import SrvClients from '../../services/Account';
import { anyIsSelected } from '../../redux/reducers/pages/common/functions';
import { asyncForEach } from '../../utils/CommonFns';
import { acCloseSubMenus } from '../../redux/actions/pages/menu';
import { BtnToggleList } from '../Clients/Clients';
import { cartBoxClicked } from '../../services/Pages/Cart/Queries';

class Carrinhos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: new Animated.Value(0),
      selectList: false,
    };
    this._isFirstMount = true;
    this.setListHeight = this.setListHeight.bind(this);
    this.btnMenuClicked = this.btnMenuClicked.bind(this);
    this.btnPlusClicked = this.btnPlusClicked.bind(this);
  }

  btnPlusClicked() {
    this.setState({ selectList: !this.state.selectList });
  }

  renderPlusButton() {
    const plusStateStyle = this.state.selectList ? {
      color: 'rgba(0, 122, 176, 0.85)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowColor: '#0085B2',
      textShadowRadius: 8
    } : { color: 'rgba(102, 102, 102, 0.5)' };

    return (
      <View style={stylesLocal.container}>
        <View style={stylesLocal.row}>
          <TouchableOpacity
            activeOpacity={this.state.selectList ? 1 : 0.7}
            onPress={this.btnPlusClicked}
          >
            <View style={[stylesLocal.circle, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={[stylesLocal.iconPlus, plusStateStyle]}>h</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  loadData = async () => {
    const { context, sort } = this.props;

    let carts = [];
    if (context === 'Admin') {
      carts = await SrvOrder.getCarrinhos([], ['sf_name'], sort[0].order);
    } else if (context === 'Vendedor') {
      const filtro = [{ sf_account_id: this.props.client.sf_id }];
      carts = await SrvOrder.getCarrinhos(filtro, ['sf_name'], sort[0].order);
    }

    await asyncForEach(carts, async (car) => {
      car.products = await SrvOrder
        .getProdutos(
          [{ quote_sfa_guid__c: car.key }],
          { fields: ['sf_segmento_negocio__c'] }
        );
    });
    // carts = carts.filter(c => c.products.length > 0);
    await this.props.acSetCartsList(carts);

    const cartDefault = carts.find(car => car.isDefault);
    if (cartDefault) {
      this.props.acSetDropdownCarts({
        current: cartDefault,
        isVisible: false
      });
    }

    const tabelasDePreco = await SrvProduct.getPriceList();
    const tabelaFormatada = tabelasDePreco.map(item => { return { option: item.name, key: item.code }; });
    this.props.acSetPopUpFilter('dropTabelaDePreco', tabelaFormatada);

    const arrStatus = carts.map(c => c.status);
    const distinctStatus = [...new Set(arrStatus)];
    const arr = distinctStatus.map(c => { return { option: c, key: c }; });
    this.props.acSetPopUpFilter('dropStatus', arr);

    this._isFirstMount = false;
  }

  async componentDidMount() {
    this.loadData();
  }

  componentWillUnmount = () => {
    this.props.acResetCopyCart();
  }

  render() {
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
    return (
      <ImageBackground source={background} style={stylesLocal.content} resizeMode="cover">
        {/* Body */}
        <View style={{ flex: 1 }}>
          <View style={stylesLocal.body}>
            {this._renderList()}
          </View>

          <ModalMask
            container={StyleSheet.absoluteFill}
            visible={this.props.modalMask}
            toggleModal={[
              { func: this.props.acToggleMask },
              { func: this.props.acResetButtonsCarts, params: [] },
              { func: this.props.acCloseClientModals, params: [] },
            ]}
          />
          {/* Header */}
          <TranslucidHeader
            startingHeight={100}
            content={stylesLocal.header}
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
          <Copy
            isVisible
            SrvClients={SrvClients}
            {...this.props}
            loadList={this.loadData}
            btnPlusClicked={this.btnPlusClicked}
          />
        </Panel>
        {(this.props.carts.length > 0) && this.renderPlusButton()}
      </ImageBackground>
    );
  }

  deletar = () => {
    const names = this.props.cartsCopy.map(c => c.name);
    const title = 'Deletar';
    const msg = `Tem certeza que deseja deletar: "${names.join()}"?`;
    if (Platform.OS === 'web') {
      window.Electron.dialog.showMessageBox({
        type: 'question',
        title,
        message: msg,
        buttons: ['Não', 'Sim']
      }, async (buttonIndex) => {
        if (buttonIndex === 1) {
          await asyncForEach(this.props.cartsCopy, async (item) => {
            await SrvOrder.removerCarrinho(item.key);
            if (item.isDefault) {
              const filtro = [{
                sf_account_id: item.sf_account_id,
                sf_pricebook2id: item.sf_pricebook2id,
              }];
              const carts = await SrvOrder.getCarrinhos(filtro);
              if (carts.length > 0) {
                await SrvOrder.updateCarrnho({ id: carts[0].key, sf_carrinho_selecionado__c: 'true', });
              } else {
                if (this.props.context === 'Vendedor') {
                  await SrvOrder.criarCarrinhoPadrao(this.props.client, this.props.currentTable);
                }
              }
            }
          });
          this.props.acResetCopyCart();
          this.btnPlusClicked();
          this.loadData();
        }
      });
    } else {
      Alert.alert(
        title,
        msg,
        [
          {
            text: 'Sim',
            onPress: async () => {
              await asyncForEach(this.props.cartsCopy, async (item) => {
                await SrvOrder.removerCarrinho(item.key);

                if (item.isDefault) {
                  const filtro = [{
                    sf_account_id: item.sf_account_id,
                    sf_pricebook2id: item.sf_pricebook2id,
                  }];
                  const carts = await SrvOrder.getCarrinhos(filtro);
                  if (carts.length > 0) {
                    await SrvOrder.updateCarrnho({ id: carts[0].key, sf_carrinho_selecionado__c: 'true', });
                  } else {
                    if (this.props.context === 'Vendedor') {
                      await SrvOrder.criarCarrinhoPadrao(this.props.client, this.props.currentTable);
                    }
                  }
                }
              });
              this.props.acResetCopyCart();
              this.btnPlusClicked();
              this.loadData();
            },
          },
          {
            text: 'Não',
            onPress: () => {},
            style: 'cancel',
          },
        ],
        { cancelable: true },
      );
    }
  }

  _renderHeader() {
    const { buttons, list, } = this.props;
    const container = !list ? { height: 70 } : null;

    return (
      <View style={container}>
        <Row style={{ width: '100%' }}>
          <Title style={stylesLocal.title} msg="CARRINHOS" />
          {
            this.props.context === 'Vendedor' &&
            <View style={{ flex: 1, paddingLeft: 10, paddingTop: 20, }}>
              <Text data-id="boxTituloCliente" style={[global.titleNomeCliente, { marginTop: 6 }]}>
                {this.props.client.fantasyName !== undefined ? this.props.client.fantasyName : ''}
                <Text style={global.codigoCliente}>{this.props.client.code === '' ? '' : `(${this.props.client.code})`}</Text>
              </Text>
              <Text style={global.setorCliente}>
                {this.props.client.sector}
              </Text>
            </View>
          }

          <View style={{ flexGrow: 1 }} />

          {
            this.props.context === 'Admin' ?
            <Fade visible={this.props.cartsCopy.length > 0 && this.state.selectList} style={{ flexDirection: 'row', marginTop: 30 }}>
              <Button
                txtStyle={[icOrderBy, { marginRight: 10 }]}
                txtMsg="w"
                isChosen={buttons[3].isChosen}
                shadow
                changeColor
                chosenColor="#0085B2"
                nChosenColor="rgba(0,0,0,.3)"
                action={this.deletar}
              />
              <Button
                txtStyle={[icOrderBy, { marginRight: 10 }]}
                txtMsg="f"
                isChosen={buttons[2].isChosen}
                shadow
                changeColor
                chosenColor="#0085B2"
                nChosenColor="rgba(0,0,0,.3)"
                action={() => {
                  this.props.acToggleMask();
                  this.props.acSetPanel(1);
                  this.props.acTogglePanel();
                }}
              />
            </Fade>
            :
            <Fade visible={this.props.cartsCopy.length > 0} style={{ flexDirection: 'row', marginTop: 30 }}>
              <Button
                txtStyle={[icOrderBy, { marginRight: 10 }]}
                txtMsg="w"
                isChosen={buttons[3].isChosen}
                shadow
                changeColor
                chosenColor="#0085B2"
                nChosenColor="rgba(0,0,0,.3)"
                action={this.deletar}
              />           
            </Fade>
          }

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
                rdAction={this.props.acUpdateComponent}
                rdName="sortPopUp"
                rdType="popup"
                actions={[{ func: this.btnMenuClicked, params: [0] }]}
              />
            </Fade>
            <Button
              tchbStyle={tchbFilter}
              txtStyle={stylesLocal.icFilter}
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
              { func: this.props.acResetButtonsCarts, params: [] },
              { func: this.props.acCloseClientModals, params: [] },
            ]}
          />
        </Row>
        <DisableComponent isDisabled={this.props.carts.length === 0}>
          <BtnToggleList
            isActive={this.props.listType}
            action={() => {
              this.props.acToggleListCarts();
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
          icon="p"
          firstMsg={['A página de', 'carrinhos', 'está vazia.']}
          sndMsg="Partiu visitar clientes?"
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
          containerStyle={{ marginTop: 108 }}
          acSetDropdownCarts={this.props.acSetDropdownCarts}
          acSetCurrentClient={this.props.acSetCurrentClient}
          acToggleSortCarts={this.props.acToggleSortCarts}
        />
      );
    }

    return (
      <View style={{ height: '100%' }}>
        <SummaryList
          setListHeight={this.setListHeight}
          loadMore={() => console.log('load more...')}
          {...this.props}
          data={this.props.carts}
          acCurrentProduct={this.props.acCurrentProduct}
          selectList={this.state.selectList}
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
    const { context, } = this.props;

    let carts = [];
    if (context === 'Admin') {
      carts = await SrvOrder.getCarrinhos([], orderBy, isDesc);
    } else if (context === 'Vendedor') {
      const filtro = [{ sf_account_id: this.props.client.sf_id }];
      carts = await SrvOrder.getCarrinhos(filtro, orderBy, isDesc);
    }

    await asyncForEach(carts, async (car) => {
      car.products = await SrvOrder
        .getProdutos(
          [{ quote_sfa_guid__c: car.key }],
          { fields: ['sf_segmento_negocio__c'] }
        );
    });
    // carts = carts.filter(c => c.products.length > 0);
    this.props.acSetCartsList(carts);

    const cartDefault = carts.find(car => car.isDefault);
    if (cartDefault) {
      this.props.acSetDropdownCarts({
        current: cartDefault,
        isVisible: false
      });
    }
  }
}

const mapStateToProps = state => ({
         buttons: state.carts.buttons,
            sort: state.carts.sort,
     popUpFilter: state.carts.popUpFilter,
     panelFilter: state.carts.panelFilter,
            list: state.carts.list,
           panel: state.carts.panel,
    panelPointer: state.carts.panelPointer,
            data: state.carts.data,
        listType: state.carts.listType,
  isResultFinder: state.carts.isResultFinder,
         context: state.global.context,
          window: state.global.window,
       modalMask: state.global.modalMask,
      appDevName: state.global.appDevName,
           carts: state.carts.carts,
        dropdown: state.catalog.dropdown,
          client: state.assistant.client,
    currentTable: state.assistant.currentTable,
 availableTables: state.assistant.availableTables,
         clients: state.clients.data,
       cartsCopy: state.carts.cartsCopy,
      clientCopy: state.carts.clientCopy,
  filterBranches: state.assistant.filterBranches,
});

export default connect(mapStateToProps,
  {
    ...cartsActions,
    acToggleMask,
    acRemoveMask,
    acCloseSubMenus,
    acSetDropdownCarts,
    acCurrentProduct,
    acSetCurrentClient,
    acSetClients,
    acFilterList,
    acSetToast,
  })(Carrinhos);

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

let stylesLocal = StyleSheet.create({
  title: {
    fontFamily: Font.AThin,
    marginLeft: 30,
    marginTop: 20,
    fontSize: 42,
    color: 'rgba(102, 102, 102, 0.5)',
  },
  content: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
  },
  icFilter: {
    fontFamily: Font.C,
    fontSize: 32,
    color: 'rgba(102, 102, 102, 0.5)',
  },
  body: {
    flex: 1,
  },
  circle: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
  },
  iconPlus: {
    fontFamily: Font.C,
    fontSize: 32,
    color: 'rgba(102, 102, 102, 0.5)',
  },
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
});

const RowTL = (props) => {
  const { item } = props;
  const name = item.name ? item.name.toUpperCase() : 'NULL';
  const tabelaDePreco = item.sf_pricebook2_name__c ? item.sf_pricebook2_name__c.toUpperCase() : 'NULL';
  const status = item.status ? item.status.toUpperCase() : 'NULL';
  const dtStatus = item.updateAt
    ? `${moment(item.updateAt).day()}-${moment().format('MMMM').substring(0, 3).toUpperCase()}-${moment().year()}`
    : 'NULL';

  
  return (
    <TouchableOpacity
      onPress={async () => {
        await cartBoxClicked(props.data, item.key, props.acSetDropdownCarts, props.acSetCurrentClient, props.appDevName);
        props.navigation.navigate('carrinho', { BackSpace: true, wasInCarts: true, carrinho: item });
      }}
      style={{ flexDirection: 'row', alignItems: 'center', height: 40, width: '100%' }}
    >
      {/* NOME */}
      <View style={global.containerCenter}>
        <TextLimit
          msg={name}
          style={[global.txtColumn, { color: '#535456', fontFamily: Font.ASemiBold }]}
          maxLength={11}
        />
      </View>

      {/* TABELA DE PREÇO */}
      <View style={global.containerCenter}>
        <TextLimit
          msg={tabelaDePreco}
          style={global.txtColumn}
          maxLength={11}
        />
      </View>

      <View style={global.containerCenter}>
        {/* STATUS DO PEDIDO */}
        <TextLimit
          msg={status}
          style={global.txtColumn}
          maxLength={11}
        />
      </View>

      {/* DT.STATUS DO PEDIDO */}
      <View style={global.containerCenter}>
        <TextLimit
          msg={dtStatus}
          style={global.txtColumn}
        />
      </View>

      {/* VALOR TOTAL DO PEDIDO */}
      <View style={global.containerCenter}>
        <Price
          style={global.txtColumn}
          price={item.totalAmount}
        />
      </View>
    </TouchableOpacity>
  );
};

const HeaderTL = ({ sort, acToggleSortCarts, orderList }) => {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <SortBy
        hasArrows
        isActive={sort[0].isChosen}
        isUp={sort[0].order}
        type="NOME"
        toggle={() => {
          acToggleSortCarts(sort[0].name);
          orderList(['sf_name'], !sort[0].order);
        }}
        containerStyle={global.containerCenter}
        txtStyle={global.txtColumn}
      />
      <SortBy
        hasArrows
        isActive={sort[1].isChosen}
        isUp={sort[1].order}
        type="TABELA DE PREÇO"
        toggle={() => {
          acToggleSortCarts(sort[1].name);
          orderList(['sf_pricebook2_name__c'], sort[1].order);
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
          acToggleSortCarts(sort[3].name);
          orderList(['sf_status'], sort[3].order);
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
          acToggleSortCarts(sort[4].name);
          orderList(['updated_at'], sort[4].order);
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
          acToggleSortCarts(sort[5].name);
          orderList(['sf_grand_total'], !sort[5].order);
        }}
        containerStyle={global.containerCenter}
        txtStyle={global.txtColumn}
      />
    </View>
  );
};