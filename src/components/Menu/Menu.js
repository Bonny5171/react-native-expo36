import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Platform } from 'react-native';
import * as acMenu from '../../redux/actions/pages/menu';
import { acCloseCatalogModals, acClosePopUp, acToggleCompleteCat } from '../../redux/actions/pages/catalog';
import { acCloseClientModals } from '../../redux/actions/pages/clients';
import { acUpdateContext, acCatalogCover, acToggleMask, acToggleGlobalMask, acSetToast, acSetPanel, acTogglePanel } from '../../redux/actions/global';
import { acResetAssistant } from '../../redux/actions/pages/assistant';
import { IconActionless } from '../../components';
import { VendorMenu, AdminMenu } from './common';
import global from '../../assets/styles/global';
import { acResetPageProd } from '../../redux/actions/pages/product';
import { acResetPopCart } from '../../redux/actions/pages/cart';

class Menu extends React.PureComponent {
  render() {
    const { context } = this.props;
    const isMaskActive = this.props.modalMask || this.props.globalMask;
    if (context === 'Setup') {
      return (
        <View style={styles.container}>
          <IconActionless style={[global.activeBtnShadow, styles.icSetup]} msg="1" action={() => null} />
        </View>
      );
    } else if (context === 'Admin') {
      return (
        <AdminMenu
          {...this.props}
          container={styles.container}
          isMaskActive={isMaskActive}
          toggleMask={this.adminToggleMask}
        />
      );
    } else if (context === 'Vendedor') {
      return (
        <VendorMenu
          {...this.props}
          container={styles.container}
          isMaskActive={isMaskActive}
          toggleMask={this.vendorToggleMask}
        />
      );
    }
  }

  vendorToggleMask = () => {
    this.toggleMask();
    this.props.acCloseCatalogModals();
    this.props.acCloseSubMenus();
    this.props.acResetPopCart();
    this.props.acResetPageProd();
    this.props.acClosePopUp();
  }

  adminToggleMask = () => {
    this.toggleMask();
    this.props.acCloseClientModals();
    this.props.acCloseSubMenus();
  }

  toggleMask = () => {
    if (this.props.syncButton.isChosen) this.props.acToggleSync();
    // Chaveia a propriedade que define a mascara ativa dependendo se a global (do app) foi ativada, ou a local (da pagina)
    let toggleMask = this.props.globalMask ? 'acToggleGlobalMask' : 'acToggleMask';
    this.props[toggleMask]();
    if (this.props.gPanel.isVisible) this.props.acTogglePanel();
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  context: state.global.context,
  window: state.global.window,
  modalMask: state.global.modalMask,
  globalMask: state.global.globalMask,
  vendor: state.menu.vendor,
  admin: state.menu.admin,
  adminSubmenus: state.menu.adminSubmenus,
  vendorIcons: state.menu.vendorIcons,
  adminIcons: state.menu.adminIcons,
  subMenuCatalog: state.menu.subMenuCatalog,
  subMenuIcon: state.menu.subMenuIcon,
  syncButton: state.menu.syncButton,
  btnAbout: state.menu.btnAbout,
  client: state.assistant.client,
  isCompleteCat: state.catalog.isCompleteCat,
  gPanel: state.global.gPanel,
  gPanelPointer: state.global.gPanelPointer,
});

const mapDispatchToProps = {
  ...acMenu,
  acUpdateContext,
  acCatalogCover,
  acResetAssistant,
  acToggleMask,
  acCloseCatalogModals,
  acCloseClientModals,
  acToggleGlobalMask,
  acResetPageProd,
  acResetPopCart,
  acClosePopUp,
  acToggleCompleteCat,
  acSetToast,
  acSetPanel,
  acTogglePanel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu);

export const styles = StyleSheet.create({
  container: {
    flex: 0.12,
    zIndex: 6,
    maxWidth: Platform.OS === 'web' ? '4.5%' : '9%',
    minWidth: 100,
    elevation: 7,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowOffset: { height: 1, width: 1 },
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowRadius: 8
  },
  icSetup: {
    fontSize: 35,
    marginTop: 20
  }
});