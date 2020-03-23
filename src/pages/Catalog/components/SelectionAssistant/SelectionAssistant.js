import React from 'react';
import { Text, View, StyleSheet, ScrollView, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import global from '../../../../assets/styles/global';
import { Fade, IconActionless, Button, Panel, ModalMask, CurrentBtn } from '../../../../components';
import { Left, Right, GradePopUp, ColorPanel, Column, PopCurrentGrade } from '.';
import { SelectCart, CurrentCart } from '../FastSelection/common';
import * as catalogActions from '../../../../redux/actions/pages/catalog';
import { Font } from '../../../../assets/fonts/font_names';
import { agrupaProdutosNoCarrinho, calcLarguraDasGrades, getEmbalamentoPadrao } from '../../../../utils/CommonFns';
import SrvOrder from '../../../../services/Order/';
import { resetNavigate } from '../../../../utils/routing/Functions';
import { acToggleZoom, acToggleMask } from '../../../../redux/actions/global';

class SelectionAssistant extends React.PureComponent {
  componentDidMount() {
    const { assistantStores, acAddStore, } = this.props;
    if (assistantStores[0] !== undefined) {
      acAddStore(assistantStores);
    }
  }

  getSnapshotBeforeUpdate() {
    if (!this.props.assistantSelection.isOpen) {
      this.props.acDeselectAllColors();
      this.props.acDeselectAllGrades();
    }
    // if (this.props.keyboardState) this.scrollView.scrollTo({ y: 300, animated: true });
    // if (!this.props.keyboardState && this.y > 0) this.scrollView.scrollTo({ y: 0, animated: true });
    return null;
  }

  componentDidUpdate = () => {

  }

  goToCartPage = async () => {
    const cartDefault = this.props.carts.find(car => car.key === this.props.dropdown.current.key);
    cartDefault.products = await SrvOrder.getProdutos([{ quote_sfa_guid__c: cartDefault.key }], { fields: ['sf_segmento_negocio__c'] });
    this.props.acSetDropdownCarts({ current: cartDefault, isVisible: false });
    const wasInProduct = this.props.navigation.state.routeName === 'product';
    resetNavigate('carrinho', this.props.navigation, { wasInProduct });
  };

  getEmbalamento = ({ dropdown, product }) => {
    const productFiltrado = dropdown.current.products.filter(p => p.code === product.code);
    if (productFiltrado.length > 0) {
      return productFiltrado[0].ref4;
    }
    return '-';
  };

  render() {
    const {
      carts,
      dropdown,
      selectedCart,
      currentGrade,
      keyboardState,
      acClosePopUp,
      acOpenCloseAssistant,
      acOpenCloseDropDown,
      acToggleZoom,
      acSetGrades,
      acSetDefaultCurrentGrade,
      acAssistantClosePopUp,
      acSelectColor,
      acSelectedGrade,
      stores,
      grades,
      acCurrentGrade,
      acCurrentColor,
      acKeyboardState,
      assistantPopUps,
      cloneColorsStores,
      acAssistantPopUp,
      acRemoveColor,
      acCloneColorsStores,
      assistantSelection,
      acToggleMask,
      currentTable,
    } = this.props;
    const { product, isOpen } = assistantSelection;
    if (!dropdown.current) return null;
    const dropDownWidth = 220;
    const columns = [];
    let totalPares = 0;
    if (!product || product.code === undefined) return null;
    if (currentGrade.hasOwnProperty('sizes')) {
      currentGrade.sizes.forEach(({ value, quantity }) => {
        totalPares = quantity ? parseInt(totalPares) + parseInt(quantity) : totalPares;
        columns.push(<Column key={value} header={value} value={quantity} />);
      });
    }

    const productosAgrupados = agrupaProdutosNoCarrinho(dropdown.current.products);
    const productFiltrado = productosAgrupados.find(p => p.code === product.code);
    const embalamento = this.getEmbalamento({ dropdown, product });
    const produtoAgrupado = Object.assign({}, product, productFiltrado);
    const panelWidth = calcLarguraDasGrades(product.sizes);

    let totalAmount = 0;
    productosAgrupados.forEach((p) => { totalAmount += p.totalPrice; });
    if (totalAmount !== 0) {
      SrvOrder.updateCarrnho({ id: dropdown.current.key, }, { sf_grand_total: totalAmount });
    }

    return (
      <Fade style={styles.container} visible={isOpen && product !== {}}>

        <View style={{ height: this.props.window.height, width: '100%' }}>
          <View style={styles.header}>
            <Text style={[global.h3, { marginLeft: 25 }]}>SELEÇÃO PARA O CARRINHO</Text>
            {/* <IconActionless style={{ marginLeft: 15, fontSize: 27, color: 'rgba(0, 0, 0, 0.3)' }} msg="p" /> */}
            <CurrentBtn
              hasLink
              // icon={'"'}
              current={`${dropdown.current.name} (${productosAgrupados.length})`}
              onIconClick={() => {
                this.props.acPopSelectCart();
                this.props.acToggleMask();
              }}
              onLinkClick={this.goToCartPage}
              containerStyle={{ marginLeft: 15 }}
            />
            <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 25 }}>
              <Button
                tchbStyle={{ marginTop: 0 }}
                txtStyle={global.iconClose}
                txtMsg="t"
                actions={[
                  { func: this.props.acAssistant, params: [{ ...product, colors: product.colors }] },
                  { func: acClosePopUp, params: [] },
                  { func: acSetGrades, params: [[]] },
                  { func: acSetDefaultCurrentGrade, params: [] },
                  { func: acAssistantClosePopUp, params: [] },
                  {
                    // Fecha o dropdown caso ele esteja visível
                    func: selectedCart.isVisible ? acOpenCloseAssistant : () => null,
                    params: []
                  }
                ]}
              />
            </View>
          </View>
          <View style={styles.body}>
            {/* Lado esquerdo */}
            <Left
              product={product}
              acToggleZoom={acToggleZoom}
              embalamento={embalamento}
              currentColor={this.props.currentColor}
            />
            {/* Lado Direito */}
            <Right
              cart={selectedCart.current}
              carts={carts}
              product={product}
              stores={stores}
              grades={grades}
              dropdown={dropdown}
              acCurrentGrade={acCurrentGrade}
              acCurrentColor={acCurrentColor}
              acKeyboardState={acKeyboardState}
              acSetDefaultCurrentGrade={acSetDefaultCurrentGrade}
              assistantPopUps={assistantPopUps}
              cloneColorsStores={cloneColorsStores}
              acAssistantPopUp={acAssistantPopUp}
              acRemoveColor={acRemoveColor}
              acSelectedGrade={acSelectedGrade}
              acCloneColorsStores={acCloneColorsStores}
              assistantSelection={assistantSelection}
              acToggleMask={acToggleMask}
              acSetGrades={acSetGrades}
              acSetDropdownCarts={this.props.acSetDropdownCarts}
              currentTable={currentTable}
              produtoAgrupado={produtoAgrupado}
              embalamento={embalamento}
              acFlushGrades={this.props.acFlushGrades}
              acFlushCores={this.props.acFlushCores}
              acDeselectAllColors={this.props.acDeselectAllColors}
              acDeselectAllGrades={this.props.acDeselectAllGrades}
            />
          </View>
          {/* Grade atual */}
          <PopCurrentGrade
            currentGrade={currentGrade}
            columns={columns}
            keyboardState={keyboardState}
            totalPares={totalPares}
          />
          <ModalMask
            visible={this.props.modalMask}
            toggleModal={[
              { func: this.props.acClosePopUp, params: [] },
              { func: this.props.acToggleMask, params: [] },
              { func: this.props.acCloseCatalogModals, params: [] },
            ]}
          />
          <Panel
            hasSeparator
            isVisible={this.props.assistantPopUps[1].isChosen}
            pointerActiveContent={0}
            icon="z"
            title={`${this.props.grades.length} GRADES DISPONÍVEIS`}
            togglePop={() => {
              this.props.acClosePopUp();
              this.props.acToggleMask();
            }}
            panelWidth={panelWidth}
          >
            <GradePopUp
              product={product}
              sizes={product.sizes}
              grades={this.props.grades}
              colors={product.colors}
              acSelectedGrade={this.props.acSelectedGrade}
              typeComponent="AssistenteDeSelecao"
              currentProduct={this.props.assistantSelection.product}
              dropdown={this.props.dropdown}
              carts={this.props.carts}
              acSetDropdownCarts={this.props.acSetDropdownCarts}
              acSetGrades={this.props.acSetGrades}
              currentTable={this.props.currentTable}
              embalamento={embalamento}
              client={this.props.client}
              acSetCarts={this.props.acSetCarts}
            />
            <View />
          </Panel>
          {
            product &&
            <Panel
              hasSeparator
              isVisible={this.props.assistantPopUps[0].isChosen}
              pointerActiveContent={0}
              icon="y"
              title={product.colors ? `${product.colors.length} CORES DISPONÍVEIS` : ''}
              togglePop={() => {
                this.props.acClosePopUp();
                this.props.acToggleMask();
              }}
              panelWidth={357}
            >
              <ColorPanel
                visible={this.props.assistantPopUps[0].isChosen}
                colors={product.colors}
                acSelectColor={acSelectColor}
                acSelectedGrade={acSelectedGrade}
                typeComponent="AssistenteDeSelecao"
                carts={carts}
                dropdown={dropdown}
                acSetDropdownCarts={this.props.acSetDropdownCarts}
                grades={this.props.grades}
                acCurrentProduct={this.props.acCurrentProduct}
                currentProduct={this.props.assistantSelection.product}
                acSetGrades={acSetGrades}
                currentTable={currentTable}
                acAssistant={this.props.acAssistant}
              />
              <View />
            </Panel>
          }
        </View>
      </Fade>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 3
  },
  header: {
    height: 85,
    flexDirection: 'row',
    alignItems: 'center'
  },
  body: {
    flex: 1,
    flexDirection: 'row'
  },
  currentGrade: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#EEE',
    elevation: 1,
    borderRadius: 10,
    marginRight: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  goToCartPage: {
    fontFamily: Font.ARegular,
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#359EC2',
    marginLeft: 20,
  }
});


const mapStateToProps = (state) => ({
  modalMask: state.global.modalMask,
  qtGradesSelected: state.catalog.qtGradesSelected,
  cloneColorsStores: state.catalog.cloneColorsStores,
  grades: state.catalog.grades,
  carts: state.catalog.carts,
  currentTable: state.assistant.currentTable,
  dropdown: state.catalog.dropdown,
  selectedCart: state.catalog.selectedCart,
  currentGrade: state.catalog.currentGrade,
  currentColor: state.catalog.currentColor,
  keyboardState: state.catalog.keyboardState,
  stores: state.catalog.stores,
  assistantPopUps: state.catalog.assistantPopUps,
  assistantStores: state.assistant.stores,
  assistantSelection: state.catalog.assistantSelection,
  window: state.global.window,
  client: state.assistant.client,
});

const mapDispatchToProps = {
  acToggleZoom,
  acToggleMask,
  ...catalogActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectionAssistant);