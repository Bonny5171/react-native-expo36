import React, { cloneElement } from 'react';
import { ImageBackground, Animated, View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { TranslucidHeader, FadeTabs, Panel, ModalMask, TextLimit, IconActionless, SelectPanel, Success, } from '../../components';
import { Head, Footer, Copy, Catalog, } from './components';
import { TabEntrega, TabEspelho, } from './components/Tabs';
import TabProdutos from './components/Tabs/Produtos/index';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import { Font } from '../../assets/fonts/font_names';
import { Pops } from './components/Tabs/Produtos/common';
import * as cartActions from '../../redux/actions/pages/cart';
import {
  acSelectColor, acSelectedGrade, acClosePopUp, acSetDropdownCarts, acSetDropdownCartsV2, acSetGrades,
  acAssistant,
  acSetSelGrades,
  acCurrentDropDown, acSetProduct, acSetCarts,
} from '../../redux/actions/pages/catalog';
import { acToggleMask, acOpenToast, acCloseToast, acSetToast, } from '../../redux/actions/global';
import { GradePopUp, ColorPanel } from '../Catalog/components/SelectionAssistant';
import { SelectCart } from '../Catalog/components/FastSelection/common';
import global from '../../assets/styles/global';
import { agrupaProdutosNoCarrinho, calcLarguraDasGrades, atualizaCarrinhoAtual } from '../../utils/CommonFns';
import { getFormFechamento, FORM_FECHAMENTO, upsertFechamentoPE } from '../../services/Pages/Cart/Queries';
import CalendarPicker from 'react-native-calendar-picker';
import SrvClients from '../../services/Account';
import SrvOrder from '../../services/Order/';

const propsCalendar = {
  width: 350,
  height: 350,
  weekdays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
  months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  previousTitle: 'Anterior',
  nextTitle: 'Próximo',
};
const {
  PopEmbalamento,
  PopPendencias,
  PopCrossDocking,
  PopGradesPorLoja,
  PopPrazos,
  PopDescontos,
} = Pops;
const HEADER_HEIGHT = 120;

class Carrinho extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: new Animated.Value(0),
      activeTab: 0,
      products: [],
      wasInCarts: true,
      wasInProduct: this.props.navigation.getParam('wasInProduct'),
      currentTable: {
        name: '',
        code: '',
      },
      client: this.props.assClient,
      preData: '',
      startDate: '',
      endDate: '',
      footerOpen: false,
      footerHeight: new Animated.Value(100),
      selectedAll: false,
    };

    this.onPreDateChange = this.onPreDateChange.bind(this);
    this.onPeriodoDeEntregaChange = this.onPeriodoDeEntregaChange.bind(this);
  }

  selectAllProduct = () => {
    this.props.acSelectAllModel(this.state.products);
    this.setState({ selectedAll: !this.state.selectedAll });
  }

  removeCheckedAllModels = () => {
    this.setState({ selectedAll: false });
  }

  updateForm = async (field, value, column) => {
    this.props.acUpdateForm(field, value);
    let newValue = value;
    // Se for o periodo de entrega, concatenamos os valores para salvar em uma coluna no BD
    if (field === 'de' || field === 'a') {
      // Inserindo no banco o novo valor no lugar
      newValue = field === 'de' ? `${value}-${this.props.form.a}` : `${this.props.form.de}-${value}`;
    }
    await upsertFechamentoPE(this.props.dropdown.current.key, { [column]: newValue });
  }

  onPreDateChange(preData) {
    const value = preData.format('L');
    this.updateForm('preData', value, FORM_FECHAMENTO.PRE_DATA_ENTREGA);
    this.setState({ preData: value });
    this.props.setPreDataVisible(false);
  }

  onPeriodoDeEntregaChange(date, type) {
    const value = date.format('L');
    if (type === 'END_DATE') {
      this.setState({ endDate: value, periodoDeEntregaVisible: false, });
      this.updateForm('a', value, FORM_FECHAMENTO.PERIODO_ENTREGA);
    } else {
      this.setState({ startDate: value, endDate: '', });
      this.updateForm('de', value, FORM_FECHAMENTO.PERIODO_ENTREGA);
    }
  }

  async componentDidMount() {
    if (this.props.modalMask) this.props.acToggleMask();
    this.loadHeaderInfo();
    this.loadProducts();
    await this.checkOrderState();
  }

  async componentDidUpdate(prevProps, prevStates) {
    if (prevProps.dropdown.current.products !== this.props.dropdown.current.products
      || prevStates.activeTab !== this.state.activeTab) {
      await this.loadProducts();
      await this.loadForm();
      await this.checkOrderState();
    }
  }

  componentWillUnmount() {
    this.props.acCurrentProduct({});
    this.props.acCurrentAcordeon(null);
    this.props.acResetPopCart();
    this.props.acSetGrades([]);
    this.props.acResetCartPage();
    this.props.acResetCopyCart();
    this.props.acResetCopyModel();
  }

  setListHeight(y) {
    this.setState({ listHeight: new Animated.Value(y) });
  }

  setCurrentTab = (index) => {
    this.setState({ activeTab: index });
  }

  getCartName() {
    const cartName = this.props.carts.filter(cart => cart.isChosen === true);
    return (cartName.length > 0) ? cartName[0].name : '';
  }

  render() {
    const {
      panel, panelPointer, client, carts, dropdown, currentProduct,
      acSelectColor,
    } = this.props;
    if (!dropdown.current) return null;
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
    let panelWidth = null;
    let headerHeight = 129;
    switch (this.props.panel.id) {
      case 5: {
        panelWidth = calcLarguraDasGrades(currentProduct.sizes);
        break;
      }
      case 6: {
        panelWidth = 357;
        break;
      }
      case 7: {
        panelWidth = 325;
        break;
      }
      case 8: {
        panelWidth = 325;
        break;
      }
      case 11: {
        panelWidth = 400;
        break;
      }
      default: {
        panelWidth = 325;
        break;
      }
    }
    const embalamento = this.state.products[0];
    return (
      <ImageBackground data-id="containerCarrinho" source={background} style={{ flex: 1 }} resizeMode="cover">
        <TranslucidHeader
          startingHeight={80}
          container={{
            zIndex: 2,
          }}
          content={[{
            height: HEADER_HEIGHT,
            alignItems: 'center',
          }, { width: '100%' }]}
          y={this.state.listHeight}
        >
          <Head
            acSetPanel={this.props.acSetPanel}
            client={{ ...this.state.client, cartName: this.getCartName() }}
            listHeight={this.state.listHeight}
            navigation={this.props.navigation}
            isOrderReady={this.props.isOrderReady}
            wasInCarts={false}
            currentTable={this.state.currentTable}
            wasInProduct={this.state.wasInProduct}
            products={this.state.products}
            togglePanel={this.togglePanel}
            onFooter={this.onFooter}
            acRemoveSelectAllModel={this.props.acRemoveSelectAllModel}
            removeCheckedAllModels={this.removeCheckedAllModels}
          />
          {/* <View data-id="filtroCarrinho" style={{ paddingBottom: 20, paddingLeft: 30,  }}>
            <Text>Autocomplete de clientes, dropdown de lista de preço (tabela) e dropdown de carrinhos</Text>
          </View> */}
        </TranslucidHeader>
        <ScrollView
          style={{ flex: 1 }}
          onScroll={(event) => {
            this.setListHeight(event.nativeEvent.contentOffset.y);
          }}
        >
          <FadeTabs
            tabs={[
              {
                name: 'Produtos',
                active: this.state.activeTab === 0
              },
              {
                name: 'Entrega',
                active: this.state.activeTab === 1
              },
              {
                name: 'Espelho',
                active: this.state.activeTab === 2
              },
            ]}
            activeTab={this.state.activeTab}
            acChangeTab={this.setCurrentTab}
            // pTabWidth={null}
            txtTab={{ fontSize: 16 }}
            contentStyle={{ paddingBottom: 100 }}
            container={{ marginTop: 120 }}
          >
            <TabProdutos
              type="Carrinho"
              acCurrentProduct={this.props.acCurrentProduct}
              products={this.state.products}
              acSelectAllModel={this.props.acSelectAllModel}
              selectAllProduct={this.selectAllProduct}
              selectedAll={this.state.selectedAll}
            />
            <TabEntrega type="Carrinho" client={this.state.client} />
            <TabEspelho type="Carrinho" />
          </FadeTabs>
        </ScrollView>
        <Panel
          isVisible={panel.isVisible}
          pointerActiveContent={panelPointer}
          title={panel.title}
          icon={panel.icon}
          togglePop={this.togglePanel}
          panelWidth={panelWidth}
          headerHeight={headerHeight}
        >
          <PopCrossDocking />
          <PopPrazos
            acTogglePanel={this.props.acTogglePanel}
            acToggleMask={this.props.acToggleMask}
            carts={this.props.carts}
          />
          <PopEmbalamento
            grades={this.props.currentProduct && this.props.currentProduct.grades}
          />
          <PopGradesPorLoja />
          <PopPendencias
            dropdown={this.props.dropdown}
            currentProduct={this.props.currentProduct}
            isFechamentoDone={this.props.isFechamentoDone}
            isOrderReady={this.props.isOrderReady}
          />
          <CurrProductHeader
            product={this.props.currentProduct}
          >
            <GradePopUp
              visible
              sizes={this.props.currentProduct && this.props.currentProduct.sizes}
              grades={this.props.currentProduct && this.props.currentProduct.grades}
              acSelectedGrade={this.props.acSelectedGrade}
              acSetSelGrades={this.props.acSetSelGrades}
              dropdown={this.props.dropdown}
              currentProduct={this.props.currentProduct}
              acCurrentProduct={this.props.acCurrentProduct}
              typeComponent="DetalheCarrinho"
              carts={this.props.carts}
              acSetDropdownCartsV2={this.props.acSetDropdownCartsV2}
              acSetGrades={this.props.acSetGrades}
              acAssistant={() => {}}
              currentTable={this.props.currentTable}
              embalamento={embalamento}
              currentCor={this.props.currentCor}
              acSetProduct={this.props.acSetProduct}
            />
          </CurrProductHeader>
          <CurrProductHeader
            product={this.props.currentProduct}
          >
            <ColorPanel
              visible
              colors={this.props.assistantSelection.product && this.props.assistantSelection.product.colors}
              acSelectColor={acSelectColor}
              acSelectedGrade={acSelectedGrade}
              carts={carts}
              dropdown={dropdown}
              acSetDropdownCarts={this.props.acSetDropdownCarts}
              acSetGrades={this.props.acSetGrades}
              grades={this.props.grades}
              currentProduct={this.props.currentProduct}
              typeComponent="DetalheCarrinho"
              acCurrentProduct={this.props.acCurrentProduct}
              acAssistant={() => {}}
              currentTable={this.props.currentTable}
            />
          </CurrProductHeader>
          <SelectCart
            isVisible
            togglePop={this.togglePanel}
            acResetCopyCart={this.props.acResetCopyCart}
            acResetCopyModel={this.props.acResetCopyModel}
            client={this.props.client}
            currentTable={this.state.currentTable}
          />
          <SelectPanel
            isSimpleString
            selectedTitle="CONDIÇÃO DE PAGAMENTO SELECIONADA"
            current={this.props.form.condPag}
            options={this.props.condPagOptions}
            action={async (item) => {
              await this.togglePanel();
              setTimeout(async () => {
                this.props.acUpdateForm('condPag', item);
                await upsertFechamentoPE(this.props.dropdown.current.key, { [FORM_FECHAMENTO.COND_PAGAMENTO]: item });
              }, 450);
            }}
          />
          <PopDescontos
            acTogglePanel={this.props.acTogglePanel}
            acToggleMask={this.props.acToggleMask}
            carts={this.props.carts}
          />
          <Copy
            isVisible
            SrvClients={SrvClients}
            {...this.props}
            removeCheckedAllModels={this.removeCheckedAllModels}
          />
          <Catalog
            isVisible
            data={this.props.data}
            products={this.state.products}
            {...this.props}
          />
        </Panel>
        <ModalMask
          visible={this.props.modalMask}
          toggleModal={[
            { func: this.togglePanel },
            { func: this.props.acResetPopCart },
          ]}
        />
        <Footer
          products={this.state.products}
          dropdown={dropdown}
          currentTable={this.props.currentTable}
          isOrderReady={this.props.isOrderReady}
          navigation={this.props.navigation}
          checkOrderState={this.checkOrderState}
          acCheckPendencies={this.props.acCheckPendencies}
          acToggleMask={this.props.acToggleMask}
          acTogglePanel={this.props.acTogglePanel}
          acSetPanel={this.props.acSetPanel}
          acOpenToast={this.props.acOpenToast}
          acCurrentDropDown={this.props.acCurrentDropDown}
          type="Carrinho"
          acSetToast={this.props.acSetToast}
          client={this.state.client}
          preData={this.state.preData}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          toggleFooter={this.toggleFooter}
          footerOpen={this.state.footerOpen}
          footerHeight={this.state.footerHeight}
          onFooter={this.onFooter}
        />
        { this.props.showToast && <Success navigation={this.props.navigation} /> }
        {/* CALENDARIO PARA INPUT PRE-DATA */}
        {
          this.props.preDataVisible &&
          <TouchableOpacity
            onPress={() => { this.props.setPreDataVisible(false)}}
            style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <View style={{ backgroundColor: '#FFFFFF', width: 350, height: 350, justifyContent: 'center', alignItems: 'center', }}>
              <CalendarPicker
                onDateChange={this.onPreDateChange}
                {...propsCalendar}
                selectedDayColor="#0085B2"
                selectedDayTextColor="white"
              />
            </View>
          </TouchableOpacity>
        }
        {/* CALENDARIO PARA INPUT PERÍODO DE ENTREGA   */}
        {
          this.props.periodoDeEntregaVisible &&
          <TouchableOpacity
            onPress={() => { this.props.setPeriodoDeEntregaVisible(false)}}
            style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <View style={{ backgroundColor: '#FFFFFF', width: 350, height: 350, justifyContent: 'center', alignItems: 'center', }}>
              <CalendarPicker
                allowRangeSelection
                onDateChange={this.onPeriodoDeEntregaChange}
                selectedDayColor="#0085B2"
                selectedDayTextColor="white"
                {...propsCalendar}
              />
            </View>
          </TouchableOpacity>

        }
      </ImageBackground>
    );
  }

  onFooter = () => {
    // Se esta fechado, vai abrir e a mascara é adicionada.
    if (!this.state.footerOpen) {
      this.props.acToggleMask();
    }

    let altura = this.state.footerOpen ? 100 : 514;
    Animated.timing(this.state.footerHeight, {
      toValue: altura,
      duration: 250,
      tension: 1,
      useNativeDriver: true
    }).start(({ finished }) => {
      if (finished) {
        this.toggleFooter();
      }
    });
  }

  togglePanel = () => {
    this.props.acTogglePanel();
    this.props.acToggleMask();
    if (this.state.footerOpen) {
      this.onFooter();
    }
  }

  toggleFooter = () => {
    this.setState({ footerOpen: !this.state.footerOpen });
  }

  loadProducts() {
    if (this.props.dropdown.current) {
      const products = agrupaProdutosNoCarrinho(this.props.dropdown.current.products);
      this.setState({ products });
    }
  }

  async loadHeaderInfo() {
    const wasInCarts = this.props.navigation.getParam('wasInCarts');
    const carrinhoSelecionado = this.props.navigation.getParam('carrinho');

    let currentTable = {
      name: this.props.currentTable.name,
      code: this.props.currentTable.code,
    };
    let client =  this.props.assClient;

    if (wasInCarts) {
      currentTable.name = this.props.dropdown.current.sf_pricebook2_name__c;
      client = this.props.client;

      currentTable = {
        name: carrinhoSelecionado.sf_pricebook2_name__c,
        code: carrinhoSelecionado.sf_pricebook2id,
      };

      const filtro = [
        { sf_account_id: client.sf_id },
        { sf_pricebook2id: currentTable.code },
      ];
      await SrvOrder.resetCarrinhoPadrao(filtro);
      await SrvOrder.updateCarrnho({ id: this.props.dropdown.current.key, sf_carrinho_selecionado__c: 'true', });
      atualizaCarrinhoAtual({
        client: { sf_id: carrinhoSelecionado.sf_account_id },
        currentTable: { code: carrinhoSelecionado.sf_pricebook2id },
        acSetCarts: this.props.acSetCarts,
        acSetDropdownCarts: this.props.acSetDropdownCarts,
      });
    }

    await this.setState({ wasInCarts, currentTable, client });
  }

  checkOrderState = async (shouldUpdatePanel) => {
    const isFormFetched = Object.values(this.props.form).find(f => f !== '');
    if (!isFormFetched) {
      await this.loadForm();
    }

    await this.props.acCheckFormState();
    if (this.props.dropdown.current) {
      this.props.acCheckPendencies(this.props.dropdown.current.products, shouldUpdatePanel);
    }
  }

  async loadForm() {
    if (this.props.dropdown.current) {
      const form = await getFormFechamento(this.props.dropdown.current.key);
      await this.props.acSetForm(form);
      this.props.acCheckFormState();
    }
  }
}

const mapStateToProps = state => ({
  panel: state.cart.panel,
  panelPointer: state.cart.panelPointer,
  form: state.cart.form,
  currentProduct: state.cart.currentProduct,
  isFechamentoDone: state.cart.isFechamentoDone,
  isOrderReady: state.cart.isOrderReady,
  condPagOptions: state.cart.condPagOptions,
  modalMask: state.global.modalMask,
  carts: state.catalog.carts,
  assistantPopUps: state.catalog.assistantPopUps,
  grades: state.catalog.grades,
  dropdown: state.catalog.dropdown,
  assistantSelection: state.catalog.assistantSelection,
  client: state.client.client,
  assClient: state.assistant.client,
  currentTable: state.assistant.currentTable,
  showToast: state.global.showToast,
  currentCor: state.cart.currentCor,
  preDataVisible: state.cart.preDataVisible,
  periodoDeEntregaVisible: state.cart.periodoDeEntregaVisible,
  modelCopy: state.cart.modelCopy,
  cartsCopy: state.cart.cartsCopy,
  data: state.catalog.data,
});

const mapDispatchToProps = {
  ...cartActions,
  acToggleMask,
  acCurrentDropDown,
  acSelectColor,
  acSelectedGrade,
  acClosePopUp,
  acSetDropdownCarts,
  acSetDropdownCartsV2,
  acSetGrades,
  acAssistant,
  acSetSelGrades,
  acOpenToast,
  acCloseToast,
  acSetProduct,
  acSetToast,
  acSetCarts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Carrinho);

const CurrProductHeader = (props) => {
  const name = props.product && props.product.name ? props.product.name.toUpperCase() : '';
  return (
    <View style={[global.flexOne, props.containerStyle]}>
      <View style={styles.vwProductInfo}>
        <Text style={styles.txtProductInfo}>{props.product.code} - {name.toUpperCase()}</Text>
      </View>
      {cloneElement(props.children, props)}
    </View>
  );
};


const styles = StyleSheet.create({
  vwProductInfo: {
    borderBottomWidth: 1,
    borderColor: '#CCC',
    width: '100%',
    paddingBottom: 11,
  },
  txtProductInfo: {
    fontFamily: Font.AThin,
    fontSize: 16,
    color: '#333',
  },
  listPanelsHeight: {
    // maxHeight:
  }
});

