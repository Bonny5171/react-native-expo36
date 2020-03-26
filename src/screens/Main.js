import React from 'react';
import {
  Platform,
  Text,
  View,
  AsyncStorage,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { WebBrowser } from 'expo';
import { decode } from 'base-64';
import { acSetUserInfo, acSetToast, acSetAppName } from '../redux/actions/global';
import { auth, orgId } from '../../config';
import { backgroundAdmin, apps, semImg } from '../assets/images';
import { Font } from '../assets/fonts/font_names';
import { SimpleButton, InfoMsg, } from '../components';
import Button from '../components/Button';
import LoadIndicator from '../components/LoadIndicator/LoadIndicator';
import global from '../assets/styles/global';
import { ToastStyles } from '../components/Toaster';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

class MainScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.logos = [{
      appDevName: 'DIV1',
      img: apps.logoGrendene
    },
    {
      appDevName: 'DVE',
      img: apps.logoMelissa,
    }
  ];
    this.state = {
      loading: true,
      orgId,
      apps: [],
      appId: undefined,
      comunidades: [],
      ddlComunidade: false,
      currentComunidade: {
        name: '',
      },
      webViewLogin: false
    };
  }

  async componentDidMount() {
    this._mounted = true;

    try {
      let result = null;
      if (Platform.OS === 'web') {
        // window.webSqlManager.removeAll('userId', false);
        const url = window.location.href;
        const response = url.split('?')[1];
        if (response) {
          const hasResponse = response.includes('p');
          if (hasResponse) {
            result = response.substr(2, url.length);
            window.localStorage.clientInfo = atob(result);
          }
        }
      } else {
        result = JSON.parse(await AsyncStorage.getItem('clientInfo'));
        this.props.acSetUserInfo(result);
        console.log('main -> RESULTADO RECEBIDO E SALVO', result);
      }

      if (result) {
        console.log('Logged In\n Client Info', result);
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'def' })],
        });

        this.props.navigation.dispatch(resetAction);
      }
      await this.retrieveApps();
    } catch (error) {
      console.log('Error', error);
    }
    if (this._mounted) this.setState({ loading: false });
  }

  componentWillUnmount() {
    this._mounted = false;
  }
  render() {
    const containerStyle = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    };
    
    if (this.state.webViewLogin) {
      return (
        <WebView
          useWebKit
          source={{ uri: 'http://auth-dev-dot-crmgrendene.appspot.com/login?domain=grendene--crm00' }}
          originWhitelist={['*']}
          style={{ marginTop: 20 }}
          onMessage={event => {
            const result = event.nativeEvent.data;

            // alert(result)
            this.save(result);
            // this.props.acToggleFlag('isAuthenticated');
            this.props.navigation.navigate('def');
          }}
          javaScriptEnabled
          javaScriptEnabledAndroid
          domStorageEnabled
        />
      );
    }

    if (this.state.appId) {
      return this._renderSecondPage();
    }

    return (
      <ImageBackground
        source={backgroundAdmin}
        style={{ flex: 1, paddingLeft: 30, paddingTop: 13 }}
        resizeMode="cover"
      >
        <Text style={global.h1}>ACESSO</Text>
        {
          this.state.hasError && !this.state.loading ?
            (
              <TryAgain
                retry={() => this.retrieveApps(true)}
              />
            )
            :
            (
              <LoadIndicator
                isLoading={this.state.loading}
                size="large"
                containerStyle={{ flex: 1, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={[global.h4, { marginTop: 60 }]}>Seja bem-vindo ao aplicativo de vendas da Grendene!</Text>
                <Text style={[global.h4, { marginTop: 30 }]}>Defina abaixo em qual divisão você quer atuar:</Text>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  {/* {this._renderApps()} */}
                  <TouchableOpacity onPress={() => {
                    if (Platform.OS === 'web') {
                      window.location.href = 'http://auth-dev-dot-crmgrendene.appspot.com/login?domain=grendene--crm00';
                    } else {
                      this.setState({ webViewLogin: true })
                    }
                  }}>
                    <Text>Logar</Text>
                  </TouchableOpacity>
                </View>
              </LoadIndicator>              
            )
        }
      </ImageBackground>
    );
  }

  _renderSecondPage() {
    const communities = this.state.comunidades.map(comunidade => (
      <View key={comunidade.name} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <SimpleButton
          tchbStyle={{ height: 75, width: 175, borderRadius: 10 }}
          msg={comunidade.name.toUpperCase()}
          action={() => {
            this._openWebBrowserAsync(comunidade);
            const appName = this.state.app.DeveloperName__c  || '';
            if (Platform.OS === 'web') {
              window.localStorage.appDevName = appName;
            } else {
              AsyncStorage.setItem('appDevName', appName);
            }
            this.props.acSetAppName(appName);
          }}
        />
      </View>
    ));

    return (
      <ImageBackground source={backgroundAdmin} style={[global.container, { paddingTop: 13 }]} resizeMode="cover">
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <Button
            txtStyle={{
              fontFamily: Font.C,
              fontSize: 30,
              marginTop: 1,
              transform: [{ rotate: '180deg' }],
              color: 'rgba(102, 102, 102, 0.5)'
            }}
            action={() => {
              if (this._mounted) {
                this.setState({ appId: '', hasError: false });
              }
            }}
            txtMsg="v"
          />
          <Text style={global.h1}>ACESSO</Text>
        </View>
        <View style={{ flexGrow: 1, marginHorizontal: 30 }}>
          <Text style={[global.h4, { marginTop: 60 }]}>
            Você escolheu a divisão <Text style={[global.h4, { fontFamily: Font.ABold }]}>{this.state.currentComunidade.name}</Text> para atuar.
          </Text>
          {
            this.state.hasError && !this.state.loading ?
              (
                <TryAgain
                  retry={() => this.retrieveCommunities(this.state.app)}
                />
              )
              :
              (
                <React.Fragment>
                  {communities.length > 0 && (
                    <Text style={[global.h4, { marginTop: 30 }]}>
                      Defina abaixo o seu perfil e na sequência faça o seu login.
                    </Text>
                  )
                  }
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: '60%', maxWidth: 600, alignSelf: 'center', marginBottom: 40 }}>
                    <LoadIndicator
                      isLoading={this.state.loading}
                      size="large"
                      containerStyle={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
                    >
                      {communities}
                    </LoadIndicator>
                  </View>
                </React.Fragment>
              )
          }
        </View>
      </ImageBackground>
    );
  }

  _openWebBrowserAsync = async (comunidade) => {
    let result = 'cancel';
    if (Platform.OS === 'web') {
      const host = process.env.NODE_ENV === 'production' ? auth.client : auth.dev;
      const indexAuth = `${host}org/${this.state.orgId}/login` +
        `?app_id=${this.state.appId}` +
        `&login_url=${encodeURI(comunidade.key)}`;
      window.location.href = indexAuth;
    } else {
      const host = __DEV__ ? auth.dev : auth.client;
      const redirectUrl = __DEV__ ? 'exp://127.0.0.1:19000' : `exp://exp.host/@${Constants.manifest.extra.account}/${Constants.manifest.name}/--/`;
      console.log(redirectUrl);
      const indexAuth = `${host}org/${this.state.orgId}/login` +
        `?app_id=${this.state.appId}` +
        `&login_url=${encodeURI(comunidade.key)}` +
        `&base_url=${encodeURI(redirectUrl)}`;
      result = await WebBrowser.openAuthSessionAsync(indexAuth, redirectUrl);
    }

    if (result.type === 'success' && Platform.OS !== 'web') {
      try {
        console.log('CLIQUEI NO BOTAÕ LOGIN... E ESTOU TENTANDO SALVAR O result', result);
        await this.save(result);
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'def' })],
        });

        this.props.navigation.dispatch(resetAction);
      } catch (e) {
        console.log('error promisse', e);
      }
    }
  }

  _renderApps = () => {
    return (
      <Apps
        isMounted={this._mounted}
        logos={this.logos}
        apps={this.state.apps}
        appId={this.state.appId}
        orgId={this.state.orgId}
        setState={this.updateState}
        retrieveCommunities={this.retrieveCommunities}
      />
    );
  }

  updateState = (params) => {
    if (this._mounted) this.setState(params);
  }

  save = result => {
    console.log('RESULT recebido no "save()"', result);
    const promises = [];
    try {
      let promise = {};
      // const objectRes = decode(result.url.split('?')[1].substr(2, result.length));
      const objectRes = decode(result);
      console.log('RESULT recebido e decodado: ', objectRes);

      promise = AsyncStorage.setItem('clientInfo', objectRes);
      promises.push(promise);
    } catch (err) {
      console.log(err);
    }
    return Promise.all(promises);
  }

  retrieveApps = async (shouldToggleLoad) => {
    if (this.state.hasError && this.props.message) {
      // Esconde Toast
      this.props.acSetToast({ text: '', shouldClose: true });
    }
    if (shouldToggleLoad && this._mounted) {
      this.setState({ loading: true });
    }
    let url;
    if (Platform.OS === 'web') {
      url = process.env.NODE_ENV === 'production' ? auth.client : auth.dev;
    } else {
      url = __DEV__ ? auth.dev : auth.client;
    }
    try {
      const URL = `${url}/org/${this.state.orgId}/app`;
      if (this.timeout) clearTimeout(this.timeout);
      const response = await fetch(URL);
      // console.log('response', response);
      if (response.ok) {
        const apps = await response.json();
        if (this._mounted && Array.isArray(apps)) {
          // console.log('apps', apps);
          this.setState({ apps });
        } else {
          throw 'Nenhuma divisão foi retornada do servidor';
        }
      } else {
        throw response.error;
      }
    } catch (error) {
      if (this._mounted) {
        // console.log('error1', error);
        // console.log('error', error.message);
        this.props.acSetToast({
          text: typeof error === 'string' ? error : error.message,
          styles: ToastStyles.error,
          shouldOpen: true
        });
        this.setState({ hasError: true });
      }
    }
    if (shouldToggleLoad && this._mounted) this.setState({ loading: false });
  }

  retrieveCommunities = async (app) => {
    if (this.state.hasError && this.props.message) {
      // Esconde Toast
      this.props.acSetToast({ text: '', shouldClose: true });
    }
    if (this._mounted) this.setState({ loading: true });
    try {
      let host = '';
      if (Platform.OS === 'web') {
        host = process.env.NODE_ENV === 'production' ? auth.client : auth.dev;
      } else {
        host = __DEV__ ? auth.dev : auth.client;
      }
      const URL = `${host}org/${this.state.orgId}/app/${this.state.appId}/loginurl`;
      const response = await fetch(URL);
      if (response.ok) {
        const body = await response.json();
        if (!Array.isArray(body)) {
          throw 'Nenhuma comunidade foi retornada do servidor';
        }

        const comunidades = body.map(comum => {
          return { key: comum.Url__c, name: comum.Name };
        });
        if (comunidades.length === 0) {
          throw response.error || 'Nenhuma comunidade foi retornada do servidor';
        } else if (this._mounted) {
          this.setState({ comunidades });
        }
      }
    } catch (error) {
      if (this._mounted) {
        this.props.acSetToast({
          text: typeof error === 'string' ? error : error.message,
          styles: ToastStyles.error,
          shouldOpen: true
        });
        this.setState({ hasError: true });
      }
    }
    if (this._mounted) this.setState({ loading: false });
  }
}
const mapStateToProps = (state) => ({
  message: state.global.message,
});

const mapDispatchToProps = {
  acSetUserInfo,
  acSetAppName,
  acSetToast
};


export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);

const extractClient = (response) => {
  try {
    console.log('RESPONSE', response);
    const arr = response.split('p')[1];
    const reponseData = arr.substr(1, response.length);
    return reponseData;
  } catch (err) {
    return err;
  }
};

const dropDownstyles = StyleSheet.create({
  txtLabel: {
    fontFamily: Font.ASemiBold,
    color: 'black',
    marginTop: 5,
    fontSize: 12,
    opacity: 0.9
  },
  container: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.87)',
    marginTop: 4,
    width: 400,
  },
  tchb: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vwInput: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  txtInput: {
    marginLeft: 15,
    fontFamily: Font.ABold,
    color: '#004C66',
  },
  icDropDown: {
    fontSize: 22,
    color: '#0085B2',
    transform: [{ rotate: '270deg' }],
  },
  vwArrow: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 6,
  }
});


const Apps = ({ apps, logos, setState, isMounted, retrieveCommunities }) => {
  return apps.map((app, index) => {
    let logo = logos.find(logo =>  logo.appDevName === app.DeveloperName__c);
    const img = logo ? logo.img : semImg;
    return (
      <View
        key={app.Name}
        style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}
      >
        <TouchableOpacity
          style={[global.defaultBox, global.boxShadow, { backgroundColor: 'white', height: 225, width: 255, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }]}
          onPress={async () => {
            if (isMounted) {
              await setState({ appId: app.Id, app, currentComunidade: { name: app.Name } });
              await retrieveCommunities(app);
            }
          }}
        >
          <Image
            style={{ height: '90%', width: '90%' }}
            resizeMode="cover"
            source={img}
          />
        </TouchableOpacity>
      </View>
    );
  });
};


const TryAgain = ({ retry }) => (
  <View style={global.containerCenter}>
    {/* <InfoMsg
      icon="F"
      firstMsg="Tivemos algum problema técnico."
      sndMsg="Tente contatar o suporte ou clicar no botão abaixo."
      iconStyle={{ fontSize: 50 }}
      fstStyle={{ fontSize: 20, lineHeight: 20 }}
      sndMsgStyle={{ fontSize: 14 }}
      containerStyle={{ height: null, flex: null, marginBottom: 20 }}
    />
    <SimpleButton
      action={retry}
      msg="TENTAR NOVAMENTE"
    /> */}
  </View>
);