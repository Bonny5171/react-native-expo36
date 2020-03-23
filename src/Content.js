import React from 'react';
import { View, ImageBackground, StatusBar, Dimensions, YellowBox, } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigator, createNavigationContainer } from 'react-navigation';
import * as Font from 'expo-font';
import Toaster from './components/Toaster';
import { Menu, ModalZoom, ModalVideo, ModalMask, GSItem, GSubmenu, Panel } from './components';
import { backgroundVendor, backgroundAdmin } from './assets/images';
import Routes from './utils/routing/Routes';
import { RightToLeft } from './utils/routing/Transitions';
import * as globalActions from './redux/actions/global';
import { acCloseSubMenus, acUpdateMenuAdmin, acUpdateButtons, acUpdateMenuVendedor, acUpdateSideMenu, acToggleSync } from './redux/actions/pages/menu';
import global from './assets/styles/global';
import { resetNavigate } from './utils/routing/Functions';
import SyncPanel from './screens/SyncPanel';
import DeviceInfo from './services/DeviceInfo';
import TrackingChange from './services/Repository/core/TrackingChange';
import { services } from '../config';
import { getUserId } from './services/Auth';
import DeviceData from './services/Repository/core/DeviceData';

// import { SF_ORG_ID } from 'react-native-dotenv'
// console.log('11 SF_ORG_ID >>>', SF_ORG_ID);
// console.log('22 process.envprocess.envprocess.env >>>', process.env);

const tcInstance = {};
const ddInstance = {};
const Stack = StackNavigator(Routes, {
  initialRouteName: 'def',
  //  initialRouteName: process.env.APP_INICIAL_ROUTE_NAME,
  headerMode: 'none',
  transparentCard: true,
  transitionConfig: RightToLeft
});

// ignore specific yellowbox warnings
YellowBox.ignoreWarnings(["Require cycle:", "Remote debugger"]);

export class Content extends React.PureComponent {
  constructor(props) {
    super(props);
    this.contadorEvento = 0;
    this.contadorTimeOut = 0;
    this.onResizeOptmizer = this.onResizeOptmizer.bind(this);
    this.onDimensionChange = this.onDimensionChange.bind(this);

    global.downloadResumable = undefined;
  }

  state = {
    fontLoaded: false
  };
  static router = Stack.router;

  componentWillUnmount() {
    this._mounted = false;
    Dimensions.removeEventListener('change', this.onResizeOptmizer);
  }

  async componentDidMount() {
    this._mounted = true;
    Dimensions.addEventListener('change', this.onResizeOptmizer);

    await Font.loadAsync({
      every_products: require('./assets/fonts/every_products.ttf'),

      'EncodeSans-Bold': require('./assets/fonts/EncodeSans-Bold.ttf'),
      'EncodeSans-Light': require('./assets/fonts/EncodeSans-Light.ttf'),
      'EncodeSans-Medium': require('./assets/fonts/EncodeSans-Medium.ttf'),
      'EncodeSans-Regular': require('./assets/fonts/EncodeSans-Regular.ttf'),
      'EncodeSans-SemiBold': require('./assets/fonts/EncodeSans-SemiBold.ttf'),
      'EncodeSans-Thin': require('./assets/fonts/EncodeSans-Thin.ttf'),

      'EncodeSansCondensed-Bold': require('./assets/fonts/EncodeSansCondensed-Bold.ttf'),
      'EncodeSansCondensed-Light': require('./assets/fonts/EncodeSansCondensed-Light.ttf'),
      'EncodeSansCondensed-Medium': require('./assets/fonts/EncodeSansCondensed-Medium.ttf'),
      'EncodeSansCondensed-Regular': require('./assets/fonts/EncodeSansCondensed-Regular.ttf'),
      'EncodeSansCondensed-SemiBold': require('./assets/fonts/EncodeSansCondensed-SemiBold.ttf'),
      'EncodeSansCondensed-Thin': require('./assets/fonts/EncodeSansCondensed-Thin.ttf')
    });

    this.setState({ fontLoaded: true });
  }

  async componentDidUpdate(prevProps, prevState) {
    const { state, index } = this.props.navigation;
    if (state.routes[0].routeName === 'assistant' && this._mounted && !this.isSyncing) {
      this.startSync();
      this.isSyncing = true;
    }
  }
  render() {
    const { context, gPanel, navigation, modalZoom, zoomContent, acToggleZoom, video, modalVideo } = this.props;
    const background = context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
    if (!this.state.fontLoaded) return <View />;
    return (
      <ImageBackground source={background} style={{ flex: 1, flexDirection: 'row' }} resizeMode="cover">
        <StatusBar hidden />
        <Menu navigation={navigation} />
        <View style={global.flexOne}>
          <Stack navigation={navigation} />
          <ModalMask
            visible={this.props.globalMask}
            action={this.closeGlobalMask}
          />
          <Panel
            {...this.props.gPanel}
            togglePop={() => {
              this.props.acTogglePanel();
              this.props.acToggleSync();
              this.props.acToggleGlobalMask();
            }}
            activePointer={this.props.gPanelPointer}
          >
            <SyncPanel
              tcInstance={tcInstance}
              ddInstance={ddInstance}
            />
          </Panel>
          <OrderSubmenu
            isVisible={this.props.adminSubmenus.orders}
            navigation={this.props.navigation}
            context={this.props.context.toLowerCase()}
            acToggleGlobalMask={this.props.acToggleGlobalMask}
            acCloseSubMenus={this.props.acCloseSubMenus}
            acUpdateButtons={this.props.acUpdateButtons}
            acUpdateSideMenu={this.props.acUpdateSideMenu}
          />
        </View>
        <ModalZoom
          visible={modalZoom}
          content={zoomContent}
          toggleZoom={acToggleZoom}
          window={this.props.window}
        />
        <ModalVideo isVisible={modalVideo} video={video} />
        <Toaster message={this.props.message} acResetToast={this.props.acResetToast} />
      </ImageBackground>
    );
  }

  async startSync() {
    const isDeviceOnline = await DeviceInfo.isOnline();
    const deviceId = await DeviceInfo.getDeviceId();
    this.gotTCFlag = false;
    // Inicialização de todos as sincrinizações caso o sync esteja ativo
    services.forEach(async (cfg, index) => {
      // Desativa objetos de sincronização caso o sync geral não esteja ativado
      if (!this.props.shouldSync) {
        this.props.acStopAllSync();
      }
      // Se no config.js estiver ativado o sync, ele inicia o fluxo
      if (cfg.syncTranckingChange) {
        if (tcInstance[cfg.nome]) tcInstance[cfg.nome].stop();
        if (tcInstance[cfg.nome] === undefined) {
          tcInstance[cfg.nome] = new TrackingChange(cfg.nome, deviceId);
          // tcInstance[cfg.nome].param.set('TRACKING_CHANGE_ENABLED', false);
          const { TRACKING_CHANGE_ENABLED, TRACKING_CHANGE_LATEST_DATE, TRACKING_CHANGE_LATEST_STATUS } = await tcInstance[cfg.nome].param.getAll(['TRACKING_CHANGE_ENABLED', 'TRACKING_CHANGE_LATEST_DATE', 'TRACKING_CHANGE_LATEST_STATUS']);
          const isServiceSynced = TRACKING_CHANGE_LATEST_STATUS === 'success';
          if (TRACKING_CHANGE_ENABLED) {
            // Ativa FLAG de sincronização do app
            if (!this.gotTCFlag && !this.props.shouldSync) {
              await this.props.acToggleGSync(true);
              this.gotTCFlag = true;
            }


            // Inicializa a sincronização do serviço
            if (isDeviceOnline && cfg.syncTranckingChange) {
              tcInstance[cfg.nome].start();
              this.activateListener(cfg.nome);
            }
          }
           // Avalia se o serviço já foi sincronizando
          const date = new Date(TRACKING_CHANGE_LATEST_DATE).getTime();
          this.props.acUpdateService(cfg.nome, isServiceSynced ? 100 : 0);
          this.props.acServiceLastUpdate(cfg.nome, date);
          // console.log('date', date, isServiceSynced, isDeviceOnline);
        }
      }


      if (cfg.syncDeviceData) {
        if (ddInstance[cfg.nome]) ddInstance[cfg.nome].stop();
        if (ddInstance[cfg.nome] === undefined) {
          const userId = await getUserId();
          ddInstance[cfg.nome] = new DeviceData(cfg.nome, userId, deviceId);
        }
        const { DEVICE_DATA_LATEST_DATE, DEVICE_DATA_LATEST_STATUS } = await ddInstance[cfg.nome].param.getAll(['DEVICE_DATA_LATEST_DATE', 'DEVICE_DATA_LATEST_STATUS']);
        this.props.acUpdateService2(cfg.nome, DEVICE_DATA_LATEST_STATUS === 'success' ? 100 : 0);
        this.props.acServiceLastUpdate(cfg.nome, DEVICE_DATA_LATEST_DATE);
        if (this.props.shouldSync && isDeviceOnline && cfg.syncDeviceData) {
          ddInstance[cfg.nome].start();
          this.activateDDListener(cfg.nome);
        }
      }
    });
  }

  activateListener(name) {
    tcInstance[name].on('progress', (o) => {
      if (o.percent === 100) {
        const now = Date.now();
        this.props.acServiceLastUpdate(o.repository, now);
        tcInstance[name].param.set('TRACKING_CHANGE_LATEST_STATUS', 'success');
        tcInstance[name].param.set('TRACKING_CHANGE_LATEST_DATE', "strftime('%Y-%m-%dT%H:%M:%fZ', 'now', 'localtime')");
        // tcInstance[name].param.getAll(['TRACKING_CHANGE_LATEST_DATE']);
        // .then(({ TRACKING_CHANGE_LATEST_DATE }) => {
          // console.log('DATA SALVA', (new Date(TRACKING_CHANGE_LATEST_DATE)))
        // });
      }
      // Atualiza a porcentagem do serviço correspondente
      this.props.acUpdateService(o.repository, o.percent);
    });
  }
  activateDDListener = (name) => {
    if (ddInstance[name]) {
      ddInstance[name].on('progress', (o) => {
        if (o.percent === 100) {
          const now = Date.now();
          this.props.acServiceLastUpdate(o.repository, now);
          ddInstance[name].param.set('DEVICE_DATA_LATEST_STATUS', 'success');
          ddInstance[name].param.set('DEVICE_DATA_LATEST_DATE', "strftime('%Y-%m-%dT%H:%M:%fZ', 'now', 'localtime')");
        }
        // Atualiza a porcentagem do serviço correspondente
        this.props.acUpdateService2(o.repository, o.percent);
      });
    }
  }

  onResizeOptmizer(dim) {
    this.contadorEvento += 1;
    setTimeout(() => {
      this.contadorTimeOut += 1;
      // console.log('RESIZING', this.contadorTimeOut, this.contadorEvento);
      if (this.contadorTimeOut === this.contadorEvento) {
        // console.log('DONE');
        this.onDimensionChange(dim);
        this.contadorEvento = 0;
        this.contadorTimeOut = 0;
      }
    }, 350);
}

  onDimensionChange = dim => {
    // console.log('transferindo eventos para o componente Content...', dim);
    this.props.acChangeDimension(dim);
  }

  closeGlobalMask = () => {
    this.props.acToggleGlobalMask();
    this.props.acCloseSubMenus();

    if (this.props.gPanel.isVisible) {
      this.props.acTogglePanel();
    }
  }
}

const mapStateToProps = state => ({
  context: state.global.context,
  modalZoom: state.global.modalZoom,
  modalVideo: state.global.modalVideo,
  modalMask: state.global.modalMask,
  globalMask: state.global.globalMask,
  zoomContent: state.global.zoomContent,
  video: state.global.video,
  window: state.global.window,
  message: state.global.message,
  gPanel: state.global.gPanel,
  gPanelPointer: state.global.gPanelPointer,
  adminSubmenus: state.menu.adminSubmenus,
  shouldSync: state.global.shouldSync,
});

const mapDispatchToProps = {
  ...globalActions,
  acCloseSubMenus,
  acToggleSync,
  acUpdateSideMenu,
  acUpdateButtons,
};

const AppContainer = createNavigationContainer(Content);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);


export const OrderSubmenu = (props) => {
  const btn = {
    name: 'orders',
    route: 'carrinhos',
    icon: 'p',
    key: props.context === 'vendedor' ? 0 : 3,
  };
  return (
    <GSubmenu
      isVisible={props.isVisible}
      containerStyle={{ position: 'absolute', top: props.context === 'admin' ? 286 : 158, left: 0, }}
    >
      <GSItem
        icon="5"
        msg="PEDIDOS"
        disabled={props.navigation.state.routes[0].routeName === 'orders'}
        action={() => {
          btn.icon = '5';
          btn.route = 'orders';
          handleMenuClick(props, btn, props.context, 0);
        }}
      />
      <GSItem
        icon="p"
        msg="CARRINHOS"
        disabled={props.navigation.state.routes[0].routeName === 'carrinhos'}
        action={() => {
          handleMenuClick(props, btn, props.context, 1);
        }}
      />
    </GSubmenu>
);
};

const handleMenuClick = (props, btn, context, pointer) => {
  // redefinição do nome contexto para usar na lógica de atualizar btns
  const tContext = context === 'vendedor' ? 'vendor' : context;
  props.acCloseSubMenus();
  // Atualiza botao atual no menu lateral
  props.acUpdateButtons(tContext, btn.name);
  // Atualiza icone do botao que possui submenu
  props.acUpdateSideMenu(btn.key, btn.icon, pointer, context);
  props.acToggleGlobalMask();
  // Navega
  resetNavigate(btn.route, props.navigation);
};