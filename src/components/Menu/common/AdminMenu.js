import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { companyIcon, logo } from '../../../assets/images';
import { Button, Row, IconActionless } from '../..';
import global from '../../../assets/styles/global';
import ModalMask from '../../ModalMask';
import { acResetPageProd } from '../../../redux/actions/pages/product';
import { Font } from '../../../assets/fonts/font_names';
import { resetNavigate } from '../../../utils/routing/Functions';
import ImageLoad from '../../ImageLoad';

class AdminMenu extends React.PureComponent {
  state = {
    animation: new Animated.Value(-100)
  };
  componentWillMount() {
    this.state.animation.addListener(value => {
      this._value = value;
    });
    Animated.spring(this.state.animation, {
      toValue: 0,
      duration: 650,
      useNativeDriver: true
    }).start();
  }

  componentDidUpdate() {
    if (this.props.admin[6].isChosen) {
      Animated.timing(this.state.animation, {
        toValue: -100,
        duration: 350,
        useNativeDriver: true
      }).start();
    }
  }

  componentWillUnmount() {
    this.props.acResetMenu();
  }

  render() {
    const {
      container,
      admin,
      navigation,
      acUpdateContext,
      acUpdateButtons,
      acResetSubMenu
    } = this.props;
      const icons = this.props.adminIcons.map(curr => {
      const isChosen = admin[curr.key].isChosen;
      const button = (
        <Button
          turnOffOpacity
          disabled={isChosen && !curr.hasSubmenu}
          isChosen={isChosen}
          key={curr.key}
          txtMsg={curr.txtMsg}
          shadow
          changeColor
          chosenColor="#0085B2"
          nChosenColor="rgba(0,0,0,0.3)"
          action={() => this.navigate(curr)}
          onLongPress={() => this.onLongPress(curr.name)}
          tchbStyle={{ marginTop: 15, zIndex: 2 }}
          txtStyle={global.menuIcon}
        />
      );

      if (curr.hasSubmenu) {
        return (
          <Row key={curr.key} style={{ zIndex: 2 }}>
            {button}
            <Text
              style={[
                global.menuIcon,
                {
                  position: 'absolute',
                  color: admin[curr.key].isChosen ? '#0085B2' : '#999',
                  fontSize: 18,
                  marginLeft: 45,
                  marginTop: 26
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
    const interpolatedOpacity = this.state.animation.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 1]
    });
    const animatedStyles = {
      opacity: interpolatedOpacity,
      transform: [{ translateX: this.state.animation }]
    };

    const dim = this.props.window;
    const { height } = dim;

    return (
      <View style={container}>
        <Animated.View style={[{ height, width: '100%', alignItems: 'center' }, animatedStyles]}>
          <TouchableOpacity style={{ zIndex: 2 }} onPress={this.handleAboutClick}>
            <Text style={[global.menuIcon, styles.icGear, this.props.btnAbout && [global.activeColor, { textShadowOffset: { height: 2, width: 0 },  }]]}>8</Text>
          </TouchableOpacity>
          <Button
            turnOffOpacity
            txtMsg="~"
            tchbStyle={{ marginTop: 15, zIndex: 2 }}
            txtStyle={[global.menuIcon, { transform: [{ translateX: -4 }] }]}
            shadow
            rdType="admin"
            rdName="logOut"
            isChosen={admin[6].isChosen}
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

          {/* Body */}
          {icons}
          {/* Botão de sync */}
          <View style={{ flexGrow: 1 }} />
          <Button
            turnOffOpacity
            isChosen={this.props.syncButton.isChosen}
            txtMsg={this.props.syncButton.icon}
            shadow
            changeColor
            chosenColor="#0085B2"
            nChosenColor="rgba(0,0,0,0.3)"
            action={() => {
              if (!this.props.gPanel.id !== 0 && !this.props.gPanel.isVisible) this.props.acSetPanel(0);
              this.props.acToggleSync();
              this.props.acTogglePanel();
              this.props.acToggleGlobalMask();
            }}
            tchbStyle={{ marginBottom: 27, zIndex: 2 }}
            txtStyle={global.menuIcon}
          />
          {/* Footer */}
          <TouchableOpacity
            style={{ marginBottom: 27, zIndex: 2 }}
            onPress={this.handleGClick}
          >
            <Image
              source={logo}
              style={{ height: 40, width: 40 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <ModalMask
            container={StyleSheet.absoluteFill}
            visible={this.props.isMaskActive}
            action={this.props.toggleMask}
          />
        </Animated.View>
      </View>
    );
  }

  handleGClick = () => {
    let route = 'catalog';
    if (this.props.client.fantasyName === undefined) {
      // alert('Defina um cliente');
      this.props.acSetToast({ text: 'Defina um cliente' });
      this.props.acUpdateButtons('admin', 'assistant');
      route = 'assistant';
    } else {
      this.props.acUpdateContext('Vendedor');
      this.props.acResetNavigation('admin');
    }
    this.togglePanel();
    resetNavigate(route, this.props.navigation);
  }

  handleAboutClick = () => {
    this.togglePanel();
    resetNavigate('about', this.props.navigation);
    this.props.acToggleAbout();
  }

  togglePanel() {
    if (this.props.gPanel.isVisible) {
      this.props.acToggleSync();
      this.props.acTogglePanel();
      this.props.acToggleGlobalMask();
    }
  }

  onLongPress = (name) => {
    // Fecha o painel de sync e mantém a máscara ativa quando o painel está aberto e um longpress é feito
    if (!this.props.globalMask) this.props.acToggleGlobalMask();
    if (this.props.gPanel.isVisible) {
      this.props.acTogglePanel();
      this.props.acToggleSync();
    }
    // console.log('longpress');
    // Se o icone que deu longPress possuirem submenu
    // Carrinhos
    if (name === 'orders') {
      this.props.acToggleSubmenuAdmin('orders');
    }
    // Pedidos
    if (name === 'clients') {
      this.props.acToggleSubmenuAdmin('clients');
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
    this.props.acUpdateButtons('admin', button.name);
    this.props.acResetSubMenu();
    let route = button.name;
    if (button.hasSubmenu) {
      // Se o botao clicado for da pg de carrinho
      // Trocamos a rota destino de acordo
      // Para a proxima vez  que clicar ir para o lugar certo
      if (button.key === 3) {
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
      if (button.key === 5) {
        // implementar logica de troca de rota ao mudar o submenu
      }
    }
    resetNavigate(route, this.props.navigation);
  }
}

export default AdminMenu;

const styles = StyleSheet.create({
  body: {
    alignItems: 'center'
  },
  icGear: {
    color: '#5473AA',
    fontSize: 47,
    marginTop: 27,
    marginBottom: 10,
    fontFamily: Font.C,
  }
});
