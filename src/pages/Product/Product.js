import React from 'react';
import { ImageBackground, Button, Animated, Platform, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import * as reducersGlobal from '../../redux/actions/global';
import * as reducersProduct from '../../redux/actions/pages/product';
import * as reducersCatalog from '../../redux/actions/pages/catalog';
import { TranslucidHeader, Panel, ModalMask } from '../../components';

import {
  Head, Details, KnowMore, Promotional, ProductRanking,
  CampaignBanner, BreadCrumb,
} from './components';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import { List, Colors, SelectionAssistant, } from '../../pages/Catalog/components';
import { SelectCart } from '../Catalog/components/FastSelection/common';

const HEADER_HEIGHT = 116;

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: new Animated.Value(0),
      enableScrollViewScroll: true,
    };
    this.setScrollView = this.setScrollView.bind(this);
  }

  componentDidMount() {
    this.state.listHeight.addListener((value) => { this._value = value; });
  }

  componentWillUnmount() {
    this.props.acCloseAssistant();
    this.props.acResetPageProd();
  }

  setListHeight(y) {
    this.setState({ listHeight: new Animated.Value(y) });
  }

  render() {
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
    return (
      <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
        <TranslucidHeader
          startingHeight={10}
          container={{
            zIndex: 2
          }}
          content={[{
            height: HEADER_HEIGHT,
            alignItems: 'center',
          }, { width: '100%' }]}
          y={this.state.listHeight}
        >
          <Head
            {...this.props}
            listHeight={this.state.listHeight}
            toggleSetPanel={this.toggleSetPanel}
          />
        </TranslucidHeader>
        <View
          onStartShouldSetResponderCapture={() => {
            this.setState({ enableScrollViewScroll: true });
          }}
        >
          <ScrollView
            scrollEnabled={this.state.enableScrollViewScroll}
            contentContainerStyle={{
              flexDirection: 'column',
              height: Platform.OS === 'web' ? this.props.window.height : null,
            }}
            ref={scrollView => { this._gridViewY = scrollView; }}
            scrollEventThrottle={16}
            onScroll={(event) => {
              this.setListHeight(event.nativeEvent.contentOffset.y);
            }}
          >
            <BreadCrumb categoria="LINHA FEMININA" subCategoria="CHINELOS" />
            <Details {...this.props} />
            <KnowMore
              setScrollView={this.setScrollView}
              scrollView={this._gridViewY}
              enableScrollViewScroll={this.state.enableScrollViewScroll}
              scrollTo={this.scrollTo}
              {...this.props}
            />
            <Promotional {...this.props} />
            <ProductRanking {...this.props} />
            {/* <CampaignBanner {...this.props} /> */}
            {/* <List
              {...this.props}
              data={this.props.data.slice(0, 2)}
              resizeMode="DESTAQUES"
            /> */}
            <View style={{ marginBottom: 30 }} />
          </ScrollView>
        </View>
        <ModalMask
          visible={this.props.modalMask}
          toggleModal={[
            {
              func: this.props.acToggleMask,
              params: [],
            },
            {
              func: this.props.acResetPageProd,
              params: []
            },
          ]}
        />
        <SelectionAssistant
          navigation={this.props.navigation}
        />
        <Panel
          isVisible={this.props.isPanelVisible}
          togglePop={() => {
            this.props.acToggleMask();
            this.props.acResetPageProd();
          }}
          panelWidth={450}
          containerStyle={{ zIndex: 3 }}
        >
          <Colors
            currentProduct={this.props.currentProduct}
            page={this.props.navigation.state.routeName}
          />
        </Panel>
        <Panel
          pointerActiveContent={this.props.panelPointer}
          {...this.props.panel}
          togglePop={this.togglePanel}
        >
          <SelectCart
            isVisible
            togglePop={this.togglePanel}
            client={this.props.client}
            currentTable={this.props.currentTable}
          />
        </Panel>
      </ImageBackground>
    );
  }

  scrollTo = () => {
    if (this.state.listHeight._value < 320 && this.state.listHeight._value < 746) {
      this._gridViewY.scrollTo({ y: 445, animated: true });
    }
  }

  setScrollView(bool) {
    this.setState({ enableScrollViewScroll: bool });
  }

  togglePanel = () => {
    this.props.acTogglePanelProdc();
    this.props.acToggleMask();
  }

  toggleSetPanel = (id) => {
    this.props.acSetPanelProd(id);
    this.props.acTogglePanelProdc();
    this.props.acToggleMask();
  }
}

const mapStateToProps = state => ({
  redirects: state.menu.redirects,
  context: state.global.context,
  window: state.global.window,
  modalMask: state.global.modalMask,
  product: state.product.product,
  data: state.product.data,
  openDetail: state.product.openDetail,
  ponteiroProduto: state.product.ponteiroProduto,
  isPanelVisible: state.product.isPanelVisible,
  client: state.assistant.client,
  currentTable: state.assistant.currentTable,
  assistantSelection: state.catalog.assistantSelection,
  panelPointer: state.product.panelPointer,
  panel: state.product.panel,
  checkboxes: state.assistant.checkboxes,
  isCompleteCat: state.catalog.isCompleteCat,
  // TODO: refatorar essas prosp @Luis
  dropdown: state.catalog.dropdown,
  carts: state.catalog.carts,
  selectedCart: state.catalog.selectedCart,
  assistantPopUps: state.catalog.assistantPopUps,
  colors: state.catalog.colors,
  currentColor: state.catalog.currentColor,
  grades: state.catalog.grades,
  visibleGrades: state.catalog.visibleGrades,
  colorsGradesUpdated: state.catalog.colorsGradesUpdated,
  currentGrade: state.catalog.currentGrade,
  selectList: state.catalog.selectList,
  stores: state.catalog.stores,
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
  produtosSelecionados: state.catalog.produtosSelecionados,
  selectOpt: state.catalog.selectOpt,
  productsChecked: state.catalog.productsChecked,
  btnEnvelope: state.catalog.btnEnvelope,
  btnCarrinho: state.catalog.btnCarrinho,
  popUpFilter: state.catalog.popUpFilter,
  hambuguerFilter: state.catalog.hambuguerFilter,
  tableDropDown: state.catalog.tableDropDown,
  imgButtons: state.catalog.imgButtons,
  isResultFinder: state.catalog.isResultFinder,
  keyboardState: state.catalog.keyboardState,
  selecaoCarrinho: state.catalog.selecaoCarrinho,
  horizontalList: state.catalog.horizontalList,
  isHorizontalList: state.catalog.isHorizontalList,
  product_change: state.catalog.product_change,
  buttons: state.product.buttons,
}
);

export default connect(mapStateToProps, {
  ...reducersGlobal,
  ...reducersProduct,
  ...reducersCatalog,

})(Product);
