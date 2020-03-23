import React from 'react';
import { ImageBackground, Animated, ScrollView, } from 'react-native';
import { connect } from 'react-redux';
import { TranslucidHeader, FadeTabs, ModalMask } from '../../components';
import { Head, ClientDetails } from './components';
import { Footer } from '../../pages/Carrinho/components';
import { TabEntrega, TabEspelho, TabFechamento } from '../../pages/Carrinho/components/Tabs';
import TabProdutos from '../../pages/Carrinho/components/Tabs/Produtos/index';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import { acResetPopCart, acSetPanel, acCurrentProduct, acCurrentAcordeon, acSetForm, acCheckFormState } from '../../redux/actions/pages/cart';
import { acSetGrades,  } from '../../redux/actions/pages/catalog';
import { acToggleMask } from '../../redux/actions/global';
import { agrupaProdutosNoCarrinho } from '../../utils/CommonFns';
import { getFormFechamento } from '../../services/Pages/Cart/Queries';

const HEADER_HEIGHT = 120;

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: new Animated.Value(0),
      activeTab: 0,
      products: [],
    };
    this.setCurrentTab = this.setCurrentTab.bind(this);
  }

  componentDidMount() {
    if (this.props.modalMask) this.props.acToggleMask();
    this.loadProducts();
  }

  async loadForm() {
    const { acSetForm, acCheckFormState } = this.props;
    const form = await getFormFechamento(this.props.dropdown.current.key);
    await acSetForm(form);
    acCheckFormState();
  }

  loadProducts() {
    const products = agrupaProdutosNoCarrinho(this.props.dropdown.current.products);
    this.setState({ products });
  }

  async getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.dropdown !== this.props.dropdown) {
      this.loadProducts();
      await this.loadForm();
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {

  }

  componentWillUnmount() {
    this.props.acCurrentProduct({ });
    this.props.acCurrentAcordeon(null);
    this.props.acResetPopCart();
    this.props.acSetGrades([]);
  }

  setListHeight(y) {
    this.setState({ listHeight: new Animated.Value(y) });
  }

  setCurrentTab(index) {
    this.setState({ activeTab: index });
  }

  getCartName() {
    const cartName = this.props.carts.filter(cart => cart.isChosen === true);
    return (cartName.length > 0) ? cartName[0].name : '';
  }

  render() {
    const { client, } = this.props;
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
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
          <Head acSetPanel={this.props.acSetPanel} client={{ fantasyName: client.fantasyName, code: client.code, sector: client.sector, cartName: this.getCartName() }} listHeight={this.state.listHeight} navigation={this.props.navigation} />
        </TranslucidHeader>
        <ScrollView
          style={{ flex: 1 }}
          onScroll={(event) => {
            this.setListHeight(event.nativeEvent.contentOffset.y);
          }}
        >
          <ClientDetails
            clientU="Admin"
            {...this.props}
          />
          <FadeTabs
            tabs={[
              { name: 'Produtos', active: this.state.activeTab === 0 },
              { name: 'Entrega', active: this.state.activeTab === 1 },
              { name: 'Fechamento', active: this.state.activeTab === 2 },
              // { name: 'Espelho', active: this.state.activeTab === 3 },
            ]}
            activeTab={this.state.activeTab}
            acChangeTab={this.setCurrentTab}
            txtTab={{ fontSize: 16 }}
            contentStyle={{ paddingBottom: 100 }}
          >
            <TabProdutos type="Order" products={this.state.products} />
            <TabEntrega type="Order" client={this.props.client} />
            <TabFechamento type="Order" client={this.props.client} />
            {/* <TabEspelho type="Order" /> */}
          </FadeTabs>
        </ScrollView>
        <Footer
          products={this.state.products}
          dropdown={this.props.dropdown}
          currentTable={this.props.currentTable}
          isOrderReady={this.props.isOrderReady}
          navigation={this.props.navigation}
          checkOrderState={this.checkOrderState}
          acCheckPendencies={this.props.acCheckPendencies}
          acToggleMask={this.props.acToggleMask}
          acTogglePanel={this.props.acTogglePanel}
          acSetPanel={this.props.acSetPanel}
          type="Order"
        />
        <ModalMask
          visible={this.props.modalMask}
          toggleModal={[
            { func: this.props.acToggleMask, params: [] },
            { func: this.props.acResetPopCart, params: [] },
          ]}
        />
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
             panel: state.cart.panel,
      panelPointer: state.cart.panelPointer,
    currentProduct: state.cart.currentProduct,
         modalMask: state.global.modalMask,
             carts: state.catalog.carts,
   assistantPopUps: state.catalog.assistantPopUps,
            grades: state.catalog.grades,
          dropdown: state.catalog.dropdown,
assistantSelection: state.catalog.assistantSelection,
            client: state.client.client,
      currentTable: state.assistant.currentTable,
});

const mapDispatchToProps = {
  acToggleMask,
  acResetPopCart,
  acSetPanel,
  acCurrentProduct,
  acSetGrades,
  acCurrentAcordeon,
  acSetForm,
  acCheckFormState,
};
export default connect(mapStateToProps, mapDispatchToProps)(Order);
