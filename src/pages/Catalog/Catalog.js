import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import * as reducersCatalog from '../../redux/actions/pages/catalog';
import { acCurrentTable, acCheckDiscount } from '../../redux/actions/pages/assistant';
import { acCurrentProduct } from '../../redux/actions/pages/cart';
import * as reducersMenu from '../../redux/actions/pages/menu';
import * as reducersGlobal from '../../redux/actions/global';
import {
  SubMenu,
  Row,
  Button,
  Fade,
  IconActionless as IA,
  TranslucidHeader,
  SimpleDropDown,
  IconActionless,
  ModalMask,
  TextLimit,
  DropTable,
  Panel,
  DisableComponent,
  InfoMsg,
  PopUp,
  SortBy,
  CurrentBtn,
} from '../../components';
import {
  List,
  Cover,
  SummaryCart,
  DropDownView,
  SelectionAssistant,
  SummaryEmail,
  SummaryFilter,
  SummaryHamburguer,
  FastSelection,
  Colors
} from './components';
import global from '../../assets/styles/global';
import { Font } from '../../assets/fonts/font_names';
import { anyIsSelected, arrayIntoGroups } from '../../redux/reducers/pages/common/functions';
import SrvProduct from '../../services/Product/';
import SrvOrder from '../../services/Order/';
import { getMenu, getChildsOfMenu, getListByHamburguer } from '../../services/Pages/Catalog/Queries';
import { asyncForEach, atualizaCarrinhoAtual, agrupaProdutosNoCarrinho } from '../../utils/CommonFns';
import { obterQuantidaDeCaixas } from '../../services/Dimensions';
import { SelectCart } from './components/FastSelection/common';
import SelectTable from '../../components/SelectTable/SelectTable';
import { Option } from '../Assistant/components/DefineDiscounts';
import { resetNavigate } from '../../utils/routing/Functions';

const width = Platform.OS === 'web' ? '98%' : '100%';
export const HEADER_HEIGHT = 116;

class Catalog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: new Animated.Value(0),
      statusBindList: 'Buscando...',
      isQuering: 'none',
      isCompleteCat: this.props.isCompleteCat || props.checkboxes[1],
      isShowCase: props.checkboxes[1]
    };

    this._gettingData = true;
    this.btnMenuClicked = this.btnMenuClicked.bind(this);
  }

  componentWillUnmount() {
    this.props.acResetButtons();
    this.props.acResetPageCat();
  }

  async componentDidMount() {
    await this.getCatalog();

    this._gettingData = false;

    setTimeout(async () => {
      if (this.props.hamburguerMenu === null) {
        const menu = {};
        const level1 = await getMenu();

        menu.level1 = level1.map(({ label1, api1, api2, api3 }) => ({
          label1,
          api1,
          api2,
          api3
        }));
        menu.level1 = [{ label1: 'DESTAQUES', api1: null, api2: null, api3: null, isDefault: true }, ...menu.level1];
        const selectAll = { label: 'TODOS', hasChildren: false };
        let level2 = null;
        let level3 = null;
        let level4 = null;
        // Pega filhos do PRIMEIRO nível do menu, se houverem
        asyncForEach(menu.level1, async lv1 => {
          lv1.hasChildren = false;
          lv1.isChosen = lv1.isDefault;
          level2 = null;
          level3 = null;
          level4 = null;
          // Se o API2 eh diferente de nulo, ele possui filhos abaixo
          if (lv1.api1 !== null) {
            lv1.hasChildren = true;
            lv1.hasChildrenSelected = false;
            if (level2 === null) level2 = [selectAll, ...(await getChildsOfMenu(lv1.api1))];
            asyncForEach(level2, async lv2 => {
              lv2.isChosen = false;
              lv2.hasChildren = false;
              // Se o nivel DOIS possuir filhos, pega-los para cada opcao
              if (lv1.api2 !== null) {
                if (lv2.label !== selectAll.label) {
                  lv2.hasChildren = true;
                  if (level3 === null) level3 = [selectAll, ...(await getChildsOfMenu(lv1.api2))];
                  asyncForEach(level3, async lv3 => {
                    lv3.isChosen = false;
                    lv3.hasChildren = false;
                    // Se o nivel TRES possuir filhos, pega-los para cada opcao
                    if (lv1.api3 !== null) {
                      if (lv3.label !== selectAll.label) {
                        lv3.hasChildren = true;
                        if (level4 === null) level4 = [selectAll, ...(await getChildsOfMenu(lv1.api3))];
                        lv3.level4 = level4.map(lv4 => ({ ...lv4, hasChildren: false, isChosen: false }));
                      }
                    }
                  });
                  lv2.level3 = level3;
                }
              }
            });
            lv1.level2 = level2;
            lv1.hasChildren = true;
          }
        });
        // console.log('menu', menu);
        this.props.acSetHambOptions(menu);
      }

      const { client, currentTable, } = this.props;
      atualizaCarrinhoAtual({ client, currentTable, acSetCarts: this.props.acSetCarts, acSetDropdownCarts: this.props.acSetDropdownCarts, });
    }, 0);

    await this.bindFilters();

    this.setState({ isQuering: 'auto' });
  }

  async getCatalog() {
    const { currentTable } = this.props;
    this.props.acSetDataV2(await SrvProduct.getCatalogo(currentTable.code, this.props.client.sf_id, this.props.isCompleteCat));
  }

  bindFilters = async () => {
    const { acSetPopUpFilter, currentTable, isCompleteCat } = this.props;
    const { sf_id } = this.props.client;
    acSetPopUpFilter('dropArquetipo', await SrvProduct.getArquetipos(currentTable, sf_id, isCompleteCat));
    acSetPopUpFilter('dropGrupo', await SrvProduct.getGrupos(currentTable, sf_id, isCompleteCat));
    acSetPopUpFilter('dropStatus', await SrvProduct.getStatus(currentTable, sf_id, isCompleteCat));
    acSetPopUpFilter('dropTamanhos', await SrvProduct.getTamanhos(currentTable, sf_id, isCompleteCat));
    acSetPopUpFilter('dropMarcas', await SrvProduct.getMarcas(currentTable, sf_id, isCompleteCat));
    acSetPopUpFilter('dropMesLancamento', await SrvProduct.getMesLancamento(currentTable, sf_id, isCompleteCat));
    acSetPopUpFilter('dropTags', await SrvProduct.getTags(currentTable, sf_id, isCompleteCat));
    // acSetPopUpFilter('dropCor', await SrvProduct.getCores(filters));
    acSetPopUpFilter('dropGenero', await SrvProduct.getGeneros(currentTable, sf_id, isCompleteCat));
  }

  btnMenuClicked(index, isPop) {
    const isFlagButton = index === 0 && this.props.modalMask;
    if (isFlagButton || isPop) this.props.acToggleMask();
  }

  setListHeight = (y) => {
    this.setState({ listHeight: new Animated.Value(y) });
  }

  toggleIsQuering = () => this.setState({ isQuering: this.state.isQuering === 'auto' ? 'none' : 'auto' });

  filterByMenu = async (coll, hambuguerFilter, isBreadCrumb) => {
    const { hamburguerMenu, currentTable } = this.props;
    const { coll1, coll2, coll3, coll4 } = this.props.hambuguerFilter;
    this.setListHeight(0);
    this.toggleIsQuering();
    if (coll === 0) {
      await this.getCatalog();
      this.props.acSetResultFinder(false);
    } else {
      // Pegando os labels usados para filtrarz
      const level1 = hamburguerMenu.level1[coll1];

      const filters = {
        lv1: {
          label: level1.label1,
          api: null
        },
        lv2: null,
        lv3: null,
        lv4: null
      };

      if (coll2 !== '') {
        const level2 = level1.level2[coll2];
        filters.lv2 = { label: level2.label, api: level1.label1 === 'TODOS' ? null : level1.api1 };
        if (coll3 !== '' && level2.hasChildren) {
          const level3 = level2.level3[coll3];
          filters.lv3 = { label: level3.label };
          filters.lv3.api = level2.label === 'TODOS' ? null : level1.api2;
          if (coll4 !== '' && level3.hasChildren) {
            const level4 = level3.level4[coll4];
            filters.lv4 = { label: level4.label };
            filters.lv4.api = level3.label === 'TODOS' ? null : level1.api3;
          }
        }
      }
      const newList = await getListByHamburguer(filters, currentTable.code, this.props.appDevName, this.props.client.sf_id, this.props.isCompleteCat);
      // console.log('FILTER MENU', filters);
      // console.log('newList', newList);
      // console.log('this.props.dataV2', this.props.dataV2);
      this.qtd = obterQuantidaDeCaixas(this.props);
      const productsM = arrayIntoGroups(newList, this.qtd);
      // console.log('productsM', productsM)
      const data = productsM.map((products, index) => ({
        key: index.toString(),
        exhibition: filters.lv1.label,
        products
      }));

      if (data.length === 0) {
        data.push({
          key: '0',
          exhibition: filters.lv1.label,
          products: newList
        });
      }
      // console.log('data', data);
      this.props.acSetDataV2(data);
      this.props.acSetResultFinder(true, true);
      this.props.acSetBreadCrumb(filters);
    }
    if (this.state.isQuering) this.toggleIsQuering();
  };

  _renderMask = () =>
    this.props.modalMask && (
      <ModalMask
        visible
        toggleModal={[
          { func: this.props.acToggleMask, params: [] },
          { func: this.props.acCloseCatalogModals, params: [] },
          { func: this.props.acCloseSubMenus, params: [] },
          { func: this.clearPanelFilters, params: [] },
        ]}
      />
    );

  _renderHead = () => {
    const { client, modalMask } = this.props;
    const menuButtons = this._renderButtons();
    let name = '';
    let prodLength = 0;

    if (this.props.dropdown.current) {
      prodLength = (agrupaProdutosNoCarrinho(this.props.dropdown.current.products)).length;
      if (this.props.dropdown.current.name) {
        name = this.props.dropdown.current.name.length > 30 ? `${this.props.dropdown.current.name.substr(0, 30)}...` : this.props.dropdown.current.name;
      }
    }
    // console.log('this.state.listHeight', this.state.listHeight);

    return (
      <TranslucidHeader startingHeight={100} content={[styles.vwHeader, { width }]} y={this.state.listHeight}>
        <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 30, alignItems: 'center' }}>
          <Row style={{ flex: 2 }}>
            <Text style={[global.titlePagina, { marginLeft: 0 }]}>CATÁLOGO </Text>
            <DisableComponent
              isDisabled={this.state.isCompleteCat && !this.state.isShowCase}
            >
              <View style={{ flex: 1, paddingLeft: 10, top: -5 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.acToggleMask();
                    this.props.acSetPanel(5);
                    this.props.acTogglePanel();
                  }}
                  disabled={this.props.discountCheckboxes.length === 0}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <React.Fragment>
                    <TextLimit
                      style={global.titleNomeCliente}
                      msg={client.fantasyName !== undefined ? client.fantasyName.toUpperCase() : ''}
                      maxLength={17}
                    />
                    {client.code ? (<Text style={global.codigoCliente}>{client.code === '' ? '' : ` (${client.code})`}</Text>) : null}
                  </React.Fragment>
                </TouchableOpacity>
                <Text style={global.setorCliente}>
                  {this.props.client.sector}
                </Text>
              </View>
            </DisableComponent>
          </Row>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 20 }}>
            {menuButtons}
          </View>
        </View>
        <View style={{ width: '100%', height: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 35 }}>
          {
            // controle de carrinho
            (this.props.dropdown.current && this.props.dataV2.length > 0) &&
            (
              <CurrentBtn
                notVisible={this.state.isCompleteCat}
                hasLink
                icon={'"'}
                current={`${name} (${prodLength})`}
                onIconClick={this.handleIconCart}
                onLinkClick={this.handleLinkCart}
                containerStyle={{ marginRight: 13 }}
              />
            )
          }
          {/* controle de tabela de preço */}
          <CurrentBtn
            hasLink
            isUpper
            icon="/"
            current={this.props.currentTable.name}
            maxLength={20}
            onIconClick={this.handleTableClick}
            onLinkClick={this.handleTableClick}
            containerStyle={{ marginRight: 2 }}
          />
        </View>
        {this._renderMask()}
        {this.currentModal}
      </TranslucidHeader>
    );
  };

  sortBy = async (prop, id, isAscendant) => {
    const { popUpFilter, acToggleSortBtn, currentTable, acSetDataV2, sortButtons } = this.props;

    await acToggleSortBtn(id);

    let filters = {
      name: popUpFilter[9].current,
      arquetipo: popUpFilter[0].current,
      grupo: popUpFilter[1].current,
      status: popUpFilter[2].current,
      tamanho: popUpFilter[3].current,
      marca: popUpFilter[4].current,
      genero: popUpFilter[6].current,
      mesLancamento: popUpFilter[5].current,
      cor: popUpFilter[7].filters,
    };

    this.setListHeight(0);

    const order = sortButtons.find(p => p.isActive);
    const data = await SrvProduct.filter(
      filters,
      currentTable.code,
      [order.prop],
      order.isAscendant,
      this.props.client.sf_id,
      this.props.isCompleteCat,
    );
    await acSetDataV2(data);
  }

  _renderBody = () => {
    const { dropdown, carts, buttons, hamburguerMenu, popUpFilter, isResultFinder, dataV2, data } = this.props;

    const shadow = this.state.backgroundColor === 'rgba(255, 255, 255, 1)';

    let modeList = 'DESTAQUES';
    let isHamb = false;
    if (hamburguerMenu !== null) {
      if (!hamburguerMenu.level1[0].isChosen) {
        modeList = 'HAMBURGUER';
        isHamb = true;
      }
    }
    const isFiltering = popUpFilter.filter(filtro => filtro.current !== '').length > 0 && isResultFinder;
    if (isFiltering) {
      // console.log('entrei', isHamb);
      modeList = 'GRID';
    }
    // console.log('modeList', modeList);
    // console.log('dataV2.length', dataV2.length);
    // console.log('modeList', modeList, popUpFilter.filter(filtro => filtro.current !== '').length > 0, isResultFinder);

    const {
      window: { height }
    } = this.props;
    const { isCatalogTouchable, statusBindList } = this.state;

    return (
      <View style={{ height }} pointerEvents={isCatalogTouchable}>
        {/* Lista possui 3 modos de visualizaÃ§Ã£o:
          "DESTAQUES" -> Exibe lista de destaques com scroll horizontal.
          "HAMBURGUER" -> Exibe resultado do menu hamburguer, com a primeira linhas de destaques abaixo grid.
          "GRID" -> Exibe resultado de busca tode em formato Grid.
        */}
        {(this.state.isQuering === 'auto' && (dataV2.length > 0 || isFiltering)) || isHamb ? (
          <List
            height={height}
            onScroll={event => {
              this.setListHeight(event.nativeEvent.contentOffset.y);
            }}
            {...this.props}
            custonStyle={{ marginTop: 55 }}
            resizeMode={modeList}
            data={dataV2}
            isHamb={isHamb}
            filterByMenu={this.filterByMenu}
            toggleIsQuering={this.toggleIsQuering}
            isQuering={this.state.isQuering}
            isCompleteCat={this.state.isCompleteCat}
            isShowCase={this.state.isShowCase}
            selectTable={this.selectTable}
          />
        ) : dataV2.length === 0 && this.state.isQuering === 'auto' ? (
          <InfoMsg
            firstMsgBold
            icon="E"
            firstMsg={this.state.isCompleteCat ? ['Hmm..', '', 'não encontramos nenhum modelo'] : ['Hmm... para esta', 'tabela de preço e este cliente', 'não encontramos nenhum modelo']}
            sndMsg={this.state.isCompleteCat ? 'Tente outra tabela de preço' : 'Tente com outra tabela de preço ou cliente'}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#333" />
          </View>
            )}

        {/* Gradiente e animação */}
        <Fade visible={shadow} duration={150} style={{ position: 'absolute', width: '100%', marginTop: HEADER_HEIGHT }}>
          {Platform.OS === 'web' ? (
              <View
                style={{ height: 10, width: '100%' }}
                colors={['rgba(0, 0, 0, 0.15)', 'rgba(0, 0, 0, 0.10)', 'rgba(0, 0, 0, 0)']}
                data-id="lineargradient-catalog"
              />
            ) : (
              <LinearGradient
                style={{ height: 10, width: '100%' }}
                colors={['rgba(0, 0, 0, 0.15)', 'rgba(0, 0, 0, 0.10)', 'rgba(0, 0, 0, 0)']}
              />
              )}
        </Fade>
      </View>
    );
  };

  _renderButtons = () => {
    const { buttons, acUpdateButtons, isResultFinder, acToggleMask, acSetPopUpFilter } = this.props;

    const buttonsToMap = [
      { txtMsg: 'R', params: 'price', noMask: true },
      { txtMsg: 'W', params: 'mail', tchbStyle: { marginLeft: 10 }, disabled: this.state.isCompleteCat },
      { txtMsg: 'p', params: 'cart', disabled: this.state.isCompleteCat },
      { txtMsg: 'l', params: 'filter' },
      { txtMsg: 'I', params: 'submenu' },
      { txtMsg: 'k', params: 'order', },
    ];

    this.currentModal = [];
    const menuButtons = [];

    if (isResultFinder) {
      menuButtons.push(
        <Button
          key="6"
          turnOffOpacity
          tchbStyle={{ height: 40, justifyContent: 'center', zIndex: 2, marginRight: 10 }}
          txtMsg="k"
          isChosen={buttons[6].isChosen}
          shadow
          changeColor
          chosenColor="#0085B2"
          nChosenColor="rgba(0, 0, 0, 0.3)"
          action={acUpdateButtons}
          params={['order']}
          txtStyle={styles.icMenu}
          actions={[
            { func: this.btnMenuClicked, params: [6, buttons[6].isPop] },
          ]}
        />
      );
    }

    // Index = 0
    menuButtons.push(
      <Button
        key="0"
        turnOffOpacity
        tchbStyle={{ height: 40, justifyContent: 'center', zIndex: 2, marginRight: 10 }}
        txtMsg="R"
        isChosen={buttons[0].isChosen}
        shadow
        changeColor
        chosenColor="#0085B2"
        nChosenColor="rgba(0, 0, 0, 0.3)"
        action={acUpdateButtons}
        params={['price']}
        txtStyle={styles.icMenu}
        actions={[{ func: this.btnMenuClicked, params: [0] }]}
      />
    );

    // Index = 1
    if (!buttonsToMap[1].disabled) {
      menuButtons.push(
        <Button
          key="1"
          turnOffOpacity
          tchbStyle={{ height: 40, justifyContent: 'center', zIndex: 2, marginRight: 10 }}
          txtMsg="W"
          isChosen={buttons[1].isChosen}
          shadow
          changeColor
          chosenColor="#0085B2"
          nChosenColor="rgba(0, 0, 0, 0.3)"
          action={acUpdateButtons}
          params={['mail']}
          actions={[
            {
              func: this.openPanel,
            },
            {
              func: this.props.acSetPanel,
              params: [3],
            },
            {
              func: this.props.acTogglePanel
            }
          ]}
          txtStyle={styles.icMenu}
        />
      );
    }

    // RETIRANDO O BOTÃO DE CARRINHO DO TOPO DO CATÁLOGO
    // Index = 2
    // if (!buttonsToMap[2].disabled) {
    //   menuButtons.push(
    //     <Button
    //       key="2"
    //       turnOffOpacity
    //       tchbStyle={{ height: 40, justifyContent: 'center', zIndex: 2, marginRight: 10 }}
    //       txtMsg="p"
    //       isChosen={buttons[2].isChosen}
    //       shadow
    //       changeColor
    //       chosenColor="#0085B2"
    //       nChosenColor="rgba(0, 0, 0, 0.3)"
    //       action={acUpdateButtons}
    //       params={['cart']}
    //       txtStyle={styles.icMenu}
    //       actions={[
    //         {
    //           func: this.openPanel,
    //         },
    //         {
    //           func: this.props.acSetPanel,
    //           params: [2],
    //         },
    //         {
    //           func: this.props.acTogglePanel
    //         }
    //       ]}
    //     />
    //   );
    // }

    // Index = 3
    menuButtons.push(
      <Button
        key="3"
        turnOffOpacity
        tchbStyle={{ height: 40, justifyContent: 'center', zIndex: 2, marginRight: 10 }}
        txtMsg="l"
        isChosen={buttons[3].isChosen}
        shadow
        changeColor
        chosenColor="#0085B2"
        nChosenColor="rgba(0, 0, 0, 0.3)"
        action={acUpdateButtons}
        params={['filter']}
        txtStyle={styles.icMenu}
        actions={[
          {
            func: this.openPanel,
          },
          {
            func: this.props.acSetPanel,
            params: [4],
          },
          {
            func: this.props.acTogglePanel
          }
        ]}
      />
    );

    menuButtons.push(
      <Button
        key="4"
        disabled={buttonsToMap[4].disabled}
        turnOffOpacity
        tchbStyle={{ height: 40, justifyContent: 'center', zIndex: 2, marginRight: 0 }}
        txtMsg="I"
        isChosen={buttons[4].isChosen}
        shadow
        changeColor
        chosenColor="#0085B2"
        nChosenColor="rgba(0, 0, 0, 0.3)"
        action={acUpdateButtons}
        params={['submenu']}
        txtStyle={styles.icMenu}
        actions={[
          { func: this.btnMenuClicked, params: [4, buttons[4].isPop] },
        ]}
      />
    );
    if (this.props.dataV2.length > 0) return menuButtons;
    return null;
  };

  render() {
    const header = this._renderHead();
    const body = this._renderBody();
    const {
      vendor,
      buttons,
      carts,
      popSelectCart,
      panel,
      currentProduct,
      catalogCover,
      subMenuCatalog,
      catalogMenuItems,
      assistantSelection,
      sortButtons
    } = this.props;
    let panelWidth = null;
    switch (panel.id) {
      case 0: {
        panelWidth = 357;
        break;
      }
      case 2: {
        panelWidth = 525;
        break;
      }
      case 3: {
        panelWidth = 597;
        break;
      }
      default: {
        panelWidth = 325;
        break;
      }
    }
    let qtColors = 0;
    if (currentProduct.colors) qtColors = currentProduct.colors.length;
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
    const isCatalogActive = vendor[0].isChosen;

    return (
      <View style={{ flex: 1 }} pointerEvents={this.state.isQuering}>
        <ImageBackground resizeMode="cover" source={background} style={{ flex: 1, flexDirection: 'column' }}>
          {body}
          {this._renderMask()}
          {header}
          <SubMenu
            visible={subMenuCatalog}
            button={isCatalogActive}
            items={catalogMenuItems}
            params={['vendor', 'catalog']}
            {...this.props}
          />
          <SelectionAssistant
            navigation={this.props.navigation}
          />

          {/* PopUp de Filtro */}
          <DisableComponent
            isDisabled={this.state.isCompleteCat || this.props.dataV2.length === 0}
          >
            <FastSelection {...this.props} />
          </DisableComponent>
          {/* PopUp de Filtro */}
          <Panel
            noHeader
            defaultStyle={false}
            isVisible={this.props.buttons[4].isChosen}
            togglePop={this.togglePanel}
          >
            <SummaryHamburguer
              isVisible
              carts={carts}
              headerHeight={HEADER_HEIGHT}
              filterByMenu={this.filterByMenu}
              headerColumns={['PRODUTO', 'CÓDIGO', 'IMAGEM', 'CARTELA DE CORES', 'GRADES', 'COMPOSIÇÃO']}
              {...this.props}
            />
          </Panel>
          <Panel
            pointerActiveContent={this.props.panelPointer}
            {...this.props.panel}
            panelWidth={panelWidth}
            togglePop={() => {
              this.props.acClosePopUp();
              this.props.acToggleMask();
            }}
          >
            <Colors currentProduct={this.props.currentProduct} />
            <SelectTable
              modalMask={this.props.modalMask}
              currentTable={this.props.currentTable}
              options={this.props.availableTables}
              toggleIsQuering={this.toggleIsQuering}
              selectTable={this.selectTable}
              togglePanel={this.togglePanel}
              beforeUpdate={() => {
                this.toggleIsQuering();
              }}
              acCurrentTable={this.props.acCurrentTable}
            />
            <SummaryCart
              visible={buttons[2].isChosen}
              headerHeight={HEADER_HEIGHT}
              headerColumns={['PRODUTO', 'PREÇO LISTA', 'CÓDIGO', 'GRUPO', 'CATEGORIA', 'LINHA']}
              {...this.props}
              acCurrentProduct={this.props.acCurrentProduct}
            />
            <SummaryEmail
              visible={buttons[3].isChosen}
              carts={carts}
              headerHeight={HEADER_HEIGHT}
              headerColumns={['PRODUTO', 'CÓDIGO', 'IMAGEM', 'CARTELA DE CORES', 'GRADES', 'COMPOSIÇÃO']}
              {...this.props}
            />
            <SummaryFilter
              visible
              carts={carts}
              headerHeight={HEADER_HEIGHT}
              headerColumns={['PRODUTO', 'CÓDIGO', 'IMAGEM', 'CARTELA DE CORES', 'GRADES', 'COMPOSIÇÃO']}
              toggleIsQuering={this.toggleIsQuering}
              setListHeight={this.setListHeight}
              {...this.props}
            />
            <DefineDiscountAndTerms
              options={this.props.discountCheckboxes}
              acCheckDiscount={this.props.acCheckDiscount}
            />
          </Panel>
          <Panel
            isVisible={this.props.popSelectCart}
            icon="p"
            title="LISTA DE CARRINHOS"
            togglePop={() => {
              // Mantém a máscara ativa quando o painel de seleção de carrinhos estiver em cima de qualquer outro
              if (!panel.isVisible && popSelectCart) this.props.acToggleMask();
              this.props.acPopSelectCart();
            }}
          >
            <SelectCart
              isVisible
              togglePop={() => {
                this.props.acPopSelectCart();
                this.props.acToggleMask();
              }}
              client={this.props.client}
              currentTable={this.props.currentTable}
            />
          </Panel>
          <PopUp
            isVisible={buttons[6].isChosen}
            containerStyle={styles.sortPop}
          >
            {
              sortButtons.map(({ id, label, isAscendant, isActive, prop }) => (
                <SortBy
                  key={id}
                  isUp={isAscendant}
                  isActive={isActive}
                  hasArrows
                  type={label}
                  toggle={() => this.sortBy(prop, id, isAscendant, isActive)}
                  containerStyle={styles.vwSort}
                />
              ))
            }
          </PopUp>
          <Cover show={catalogCover} {...this.props} />
        </ImageBackground>
      </View>
    );
  }

  clearPanelFilters = () => {
    const hasFilters = this.props.popUpFilter.find(({ current }) => current !== '');
    if (!hasFilters) {
      setTimeout(() => {
        this.props.acClearPanelFilters();
      }, 550);
    }
  }

  selectTable = async (table) => {
    // Voltando lista do catálogo para o estado inicial
    await this.props.acTogglePonteiroProduto();
    this.props.acSetDataV2(await SrvProduct.getCatalogo(table.code, this.props.client.sf_id, this.props.isCompleteCat));
    this.props.acUpdateCurrentRemoveAll();
    this.props.acSetResultFinder(false);
    this.props.acClearFilterHamburguer();

    const { client, acSetDropdownCarts, } = this.props;
    await SrvOrder.criarCarrinhoPadrao(client, table);
    atualizaCarrinhoAtual({
      client,
      currentTable: table,
      acSetCarts: this.props.acSetCarts,
      acSetDropdownCarts,
    });

    await this.bindFilters();
    this.toggleIsQuering();
  }

  togglePanel = () => {
    this.props.acClosePopUp();
    this.props.acToggleMask();
  }

  openPanel = () => {
    if (!this.props.modalMask) this.props.acToggleMask();
  }


  handleTableClick = () => {
    this.props.acSetPanel(1);
    this.props.acTogglePanel();
    this.props.acToggleMask();
  }

  handleIconCart = () => {
    this.props.acClosePopStock();
    this.props.acPopSelectCart();
    this.props.acToggleMask();
  }

  handleLinkCart = () => {
    resetNavigate('carrinho', this.props.navigation, { wasInCatalog: true });
  }
}

const mapStateToProps = state => ({
  context: state.global.context,
  appDevName: state.global.appDevName,
  catalogCover: state.global.catalogCover,
  modalMask: state.global.modalMask,
  window: state.global.window,
  subMenuCatalog: state.menu.subMenuCatalog,
  catalogMenuItems: state.menu.catalogMenuItems,
  vendor: state.menu.vendor,
  buttons: state.catalog.buttons,
  dropdown: state.catalog.dropdown,
  carts: state.catalog.carts,
  selectedCart: state.catalog.selectedCart,
  data: state.catalog.data,
  dataV2: state.catalog.dataV2,
  assistantPopUps: state.catalog.assistantPopUps,
  colors: state.catalog.colors,
  currentColor: state.catalog.currentColor,
  grades: state.catalog.grades,
  visibleGrades: state.catalog.visibleGrades,
  assistantSelection: state.catalog.assistantSelection,
  colorsGradesUpdated: state.catalog.colorsGradesUpdated,
  currentGrade: state.catalog.currentGrade,
  selectList: state.catalog.selectList,
  stores: state.catalog.stores,
  assistantStores: state.assistant.stores,
  cloneColorsStores: state.catalog.cloneColorsStores,
  previousProduct: state.catalog.previousProduct,
  currentProduct: state.catalog.currentProduct,
  nextProduct: state.catalog.nextProduct,
  pointerPrevious: state.catalog.pointerPrevious,
  pointerCurrent: state.catalog.pointerCurrent,
  pointerNext: state.catalog.pointerNext,
  pointerRow: state.catalog.pointerRow,
  leftProduct: state.catalog.leftProduct,
  rightProduct: state.catalog.rightProduct,
  rowLength: state.catalog.rowLength,
  colorsPopUp: state.catalog.colorsPopUp,
  sumaryEmail: state.catalog.sumaryEmail,
  buttonPlus: state.catalog.buttonPlus,
  ponteiroProduto: state.catalog.ponteiroProduto,
  produtosSelecionados: state.catalog.produtosSelecionados,
  selectOpt: state.catalog.selectOpt,
  productsChecked: state.catalog.productsChecked,
  btnEnvelope: state.catalog.btnEnvelope,
  btnCarrinho: state.catalog.btnCarrinho,
  popUpFilter: state.catalog.popUpFilter,
  tableDropDown: state.catalog.tableDropDown,
  imgButtons: state.catalog.imgButtons,
  isResultFinder: state.catalog.isResultFinder,
  keyboardState: state.catalog.keyboardState,
  selecaoCarrinho: state.catalog.selecaoCarrinho,
  horizontalList: state.catalog.horizontalList,
  isHorizontalList: state.catalog.isHorizontalList,
  listType: state.catalog.listType,
  product_change: state.catalog.product_change,
  openDetail: state.catalog.openDetail,
  popSelectCart: state.catalog.popSelectCart,
  hamburguerMenu: state.catalog.hamburguerMenu,
  hambuguerFilter: state.catalog.hambuguerFilter,
  chosenHFID: state.catalog.chosenHFID,
  selectedHamburguerFilter: state.catalog.selectedHamburguerFilter,
  panelPointer: state.catalog.panelPointer,
  panel: state.catalog.panel,
  client: state.assistant.client,
  availableTables: state.assistant.availableTables,
  currentTable: state.assistant.currentTable,
  gradesPopUp: state.catalog.gradesPopUp,
  panelFilter: state.catalog.panelFilter,
  sortButtons: state.catalog.sortButtons,
  discountCheckboxes: state.assistant.discountCheckboxes,
  checkboxes: state.assistant.checkboxes,
  isCompleteCat: state.catalog.isCompleteCat,
});
export default connect(
  mapStateToProps,
  {
    ...reducersMenu,
    ...reducersGlobal,
    ...reducersCatalog,
    acCurrentTable,
    acCurrentProduct,
    acCheckDiscount,
  }
)(Catalog);

const styles = StyleSheet.create(
  {
    vwHeader: {
      height: HEADER_HEIGHT,
      alignItems: 'center',
    },
    title: {
      fontFamily: Font.AThin,
      marginLeft: 35,
      fontSize: 42,
      color: 'rgba(102, 102, 102, 0.5)',
    },
    client: {
      fontFamily: Font.BMedium,
      fontSize: 18,
      color: '#6C7073',
      marginTop: 2
    },
    clientType: {
      fontFamily: Font.Bmedium,
      fontSize: 16,
      color: '#A4A5A7'
    },
    icMenu: {
      fontFamily: Font.C,
      fontSize: 32,
      color: 'rgba(102, 102, 102, 0.4)',
    },
    icArrow: {
      position: 'absolute',
      bottom: 2,
      marginLeft: 7
    },
    vwSubMenu: {
      flex: 1,
      alignItems: 'center',
    },
    sortPop: {
      right: 234,
      top: 66,
      justifyContent: 'center',
    },
    vwSort: {
      marginLeft: 9
    },
  }
);


const DefineDiscountAndTerms = ({ options, acCheckDiscount }) => {
  if (options.length === 0) {
    return (
      <InfoMsg
        icon="C"
        firstMsg="Este cliente não possui descontos."
        sndMsg="Se desejar, pode começar as suas vendas!"
        containerStyle={{ justifyContent: null }}
      />
    );
  }
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={[coll, { marginRight: null }]}>
        <View style={[row, { alignItems: 'flex-end' }]}>
          <View style={cell1}>
            <Text>{}</Text>
          </View>
          <View style={cell}>
            <Text>DESCONTOS</Text>
          </View>
          <View style={cell}>
            <Text>PRAZOS</Text>
          </View>
        </View>
      </View>
      {
        options.map((opt, index) => {
          return (
            <Option
              key={index.toString()}
              index={index}
              opt={opt}
              lastDiscount={options.length - 1}
              acCheckDiscount={acCheckDiscount}
            />
          );
        }
        )
      }
    </View>
  );
};


const widthColl1 = 50;

const coll = {
  flexDirection: 'column',
  marginRight: 55,
};
const row = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
  width: (2 * 90) + widthColl1,
};
const cell = {
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center',
  width: 90
};
const cell1 = {
  ...cell,
  width: widthColl1
};