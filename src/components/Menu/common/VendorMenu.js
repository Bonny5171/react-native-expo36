import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert, } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { Button, Row, ModalMask, Fade, ImageLoad } from '../..';
import { Font } from '../../../assets/fonts/font_names';
import { companyIcon, logo } from '../../../assets/images';
import global from '../../../assets/styles/global';
import { acResetPopCart } from '../../../redux/actions/pages/cart';
import { acResetPageProd } from '../../../redux/actions/pages/product';
import { acToggleMask, acToggleGlobalMask } from '../../../redux/actions/global';
import { acCloseCatalogModals } from '../../../redux/actions/pages/catalog';
import { acCloseSubMenus, acToggleSubmenuAdmin } from '../../../redux/actions/pages/menu';
import { resetNavigate } from '../../../utils/routing/Functions';

class VendorMenu extends React.PureComponent {
  componentWillUnmount() {
    this.props.acResetMenu();
  }

  render() {
    // As keys sao as mesmas posições do vetor na store
    // Icones do menu de vendedores
    const {
      vendor,
      subMenuIcon,
      container,
      navigation,
      vendorIcons,
      acUpdateButtons,
      acSubMenuCatalog,
      acUpdateContext,
      acResetSubMenu,
      acCatalogCover,
      acResetNavigation,
      acToggleMask
    } = this.props;
    const icons = vendorIcons.map(curr => {
      const isChosen = vendor[curr.key].isChosen;
      const button = (
        <Button
          turnOffOpacity
          disabled={isChosen && !curr.hasSubmenu}
          isChosen={isChosen}
          key={curr.key}
          txtMsg={curr.txtMsg}
          shadow
          action={() => this.navigate(curr)}
          onLongPress={() => this.onLongPress(curr.name)}
          changeColor
          chosenColor="#0085B2"
          nChosenColor="rgba(0,0,0,0.3)"
          tchbStyle={{ marginTop: 25, zIndex: 2, backgroundColor: 'white' }}
          txtStyle={global.menuIcon}
        />
      );
      if (this.props.isCompleteCat && curr.key === 3) {
        return null;
      }
      if (this.props.isCompleteCat && curr.key === 1) {
        return null;
      }
      if (curr.hasSubmenu) {
        return (
          <Row
            style={{ width: '100%', justifyContent: 'center', zIndex: 2 }}
            key={curr.key}
          >
            {button}
            <Text
              style={[
                global.menuIcon,
                {
                  position: 'absolute',
                  color: vendor[curr.key].isChosen ? '#0085B2' : '#999',
                  fontSize: 18,
                  right: 1,
                  top: 36
                }
              ]}
            >
              K
            </Text>
          </Row>
        );
      }
      return button;
    });

    const isCatalogActive = vendor[0].isChosen;
    const icCatalog = isCatalogActive && global.activeBtnShadow;
    // Para os icones do menu lateral não se ajustarem a altura do scrollview inteiro
    const dim = this.props.window;
    const { height } = dim;
    return (
      <View style={container}>
        <View style={{ height, width: '100%', alignItems: 'center' }}>
          <Image
            source={logo}
            style={{ height: 50, width: 50, marginTop: 20, backgroundColor: 'white' }}
            resizeMode="contain"
          />
          <Row style={{ justifyContent: 'center', width: '100%',  zIndex: 2, alignItems: 'center', marginTop: 35, backgroundColor: 'white' }}>
            <TouchableOpacity
              activeOpacity={isCatalogActive ? 1 : 0.7}
              style={{ flexDirection: 'row', justifyContent: 'center' }}
              onLongPress={() => {
                if (!isCatalogActive) {
                  acUpdateButtons('vendor', 'catalog');
                  resetNavigate('catalog', this.props.navigation);
                }
                // if (isCatalogActive) {
                //   this.props.acCloseSubMenus();
                //   if (this.props.globalMask) {
                //     this.props.acToggleGlobalMask();
                //   }
                //   acSubMenuCatalog();
                //   acToggleMask();
                // } else {
                //   acUpdateButtons('vendor', 'catalog');
                //   acSubMenuCatalog(false);
                // }
              }}
              onPress={() => {
                if (!isCatalogActive) {
                  acUpdateButtons('vendor', 'catalog');
                  resetNavigate('catalog', this.props.navigation);
                }
              }}
            >
              <Text style={[global.menuIcon, icCatalog]}>{subMenuIcon}</Text>
            </TouchableOpacity>
            {/* <Text
              style={[
                global.menuIcon,
                {
                  position: 'absolute',
                  color: isCatalogActive ? '#0085B2' : 'rgba(0, 0, 0, 0.3)',
                  fontSize: 18,
                  right: 1
                }
              ]}
            >
              K
            </Text> */}
          </Row>
          {icons}
          <Button
            turnOffOpacity
            txtMsg="~"
            tchbStyle={[{ marginTop: 25, zIndex: 2, backgroundColor: 'white' }, { transform: [{ translateX: -2 }] }]}
            txtStyle={global.menuIcon}
            shadow
            rdType="admin"
            rdName="logOut"
            action={() => {
              const title = 'Confirm';
              const msg = 'Tem certeza que deseja sair da aplicação ?';
              if (Platform.OS === 'web') {
                window.Electron.dialog.showMessageBox({
                  type: 'question',
                  title,
                  message: msg,
                  buttons: ['Não', 'Sim']
                }, (buttonIndex) => {
                  if (buttonIndex === 1) {
                    resetNavigate('logOut', this.props.navigation);
                    acUpdateContext('Setup');
                    acResetSubMenu();
                  }
                });
              } else {
                Alert.alert(
                  title,
                  msg,
                  [
                    {
                      text: 'Sim',
                      onPress: () => {
                        resetNavigate('logOut', this.props.navigation);
                        acUpdateContext('Setup');
                        acResetSubMenu();
                      },
                    },
                    {
                      text: 'Não',
                      onPress: () => {
                        console.log('Cancelado logoff');
                      },
                      style: 'cancel',
                    },
                  ],
                  { cancelable: true },
                );
              }
            }}
            changeColor
            chosenColor="#0085B2"
            nChosenColor="rgba(0,0,0,0.3)"
          />
          <View style={{ flexGrow: 1, width: '100%' }} />
          <Button
            turnOffOpacity
            isChosen={this.props.syncButton.isChosen}
            txtMsg={this.props.syncButton.icon}
            shadow
            changeColor
            chosenColor="#0085B2"
            nChosenColor="rgba(0,0,0,0.3)"
            action={() => {
              this.props.acToggleSync();
              if (!this.props.gPanel.id !== 0 && !this.props.gPanel.isVisible) this.props.acSetPanel(0);
              this.props.acTogglePanel();
              this.props.acToggleGlobalMask();
            }}
            tchbStyle={{ marginBottom: 28, zIndex: 2 }}
            txtStyle={global.menuIcon}
          />
          <TouchableOpacity
            style={{ zIndex: 2, marginBottom: 27, backgroundColor: 'white' }}
            onPress={() => {
              resetNavigate('assistant', this.props.navigation);
              acResetSubMenu();
              acCatalogCover();
              acUpdateContext('Admin');
              acResetNavigation('vendor');
              if (this.props.globalMask) this.props.acToggleGlobalMask();
              if (this.props.gPanel.isVisible) {
                this.props.acToggleSync();
                this.props.acTogglePanel();
              }
              if (this.props.isCompleteCat) this.props.acToggleCompleteCat();
            }}
          >
            <Text style={styles.menuIcon}>8</Text>
          </TouchableOpacity>
          <ModalMask
            container={{ width: '100%', marginLeft: -2 }}
            visible={this.props.isMaskActive}
            action={this.props.toggleMask}
          />
        </View>
      </View>
    );
  }

  onLongPress = (name) => {
    // Fecha o painel de sync e mantém a máscara ativa quando o painel está aberto e um longpress é feito
    if (!this.props.globalMask) this.props.acToggleGlobalMask();
    if (this.props.gPanel.isVisible) {
      this.props.acTogglePanel();
      this.props.acToggleSync();
    }
    // Se o icone que deu longPress possuirem submenu
    // Carrinhos
    if (name === 'orders') {
      this.props.acToggleSubmenuAdmin('orders');
    }
  }

  navigate = (button) => {
    if (this.props.modalMask) {
      this.props.acToggleMask();
    }
    if (this.props.globalMask) {
      this.props.acToggleGlobalMask();
    }
    if (this.props.gPanel.isVisible) {
      this.props.acTogglePanel();
    }
    this.props.acCloseSubMenus();
    this.props.acUpdateButtons('vendor', button.name);
    this.props.acResetSubMenu();
    let route = button.name;
    if (button.hasSubmenu) {
      // Se o botao clicado for da pg de carrinho
      // Trocamos a rota destino de acordo
      // Para a proxima vez  que clicar ir para o lugar certo
      if (button.key === 1) {
        switch (button.txtMsg) {
          case '5': {
            route = 'orders';
            break;
          }
          case 'p': {
            route = 'carrinhos';
            break;
          }
          default: {
            break;
          }
        }
      }
    }
    if (route !== this.props.navigation.state.routes[0].routeName) {
      resetNavigate(route, this.props.navigation);
    }
  }
}

const mapStateToProps = (state) => ({

});
const mapDispatchToProps = {
  acToggleGlobalMask,
  acCloseCatalogModals,
  acCloseSubMenus,
  acResetPopCart,
  acResetPageProd,
  acToggleSubmenuAdmin,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VendorMenu);

const styles = StyleSheet.create({
  menuIcon: {
    fontFamily: Font.C,
    fontSize: 35,
    color: 'rgba(0, 0, 0, 0.3)'
  }
});
