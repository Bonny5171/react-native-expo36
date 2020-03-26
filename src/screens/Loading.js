import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { getInitialRouteName, getLocalStorage } from '../services/Auth';
import { acUpdateContext, acSetAppName,  } from '../redux/actions/global';
import DeviceInfo from '../services/DeviceInfo';

class Loading extends React.Component {
  state = {
    feedback: '',
  };

  async componentDidMount() {
    this._mounted = true;
    const app = await getLocalStorage('appDevName');
    this.props.acSetAppName(app);
    try {

      // DEFINE ROTA INICIAL
      const initialRouteName = await getInitialRouteName();
      console.log('ROTA INCIAL', initialRouteName);

      // UNICO PONTO DE REGISTRO DO DEVICE
      let deviceId = await DeviceInfo.getDeviceId();
      if (deviceId === null && (initialRouteName === 'app' || initialRouteName === 'setup')) {
        // VERIFICA SE TEM INTERNET
        if (await DeviceInfo.isOnline() === false) {
          // this.props.acCallAlertGlobal('error', null, 'Sem conexão com a internet');
          // this.setState({ loading: false });
          alert('Sem conexão com a internet');
          return false;
        }

        // REGISTRA DEVICE
        const register = await DeviceInfo.registerDevice();
        if (!register.registered) {
          // this.props.acCallAlertGlobal('error', null, register.message);
          // this.setState({ loading: false });
          alert(register.message);
          return false;
        }
      }

      

      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: initialRouteName })],
      });
      if (initialRouteName === 'setup' || initialRouteName === 'main') this.props.acUpdateContext('Setup');
      this.props.navigation.dispatch(resetAction);
    } catch (error) {
      console.log('Erro ao definir pagina inicial do app.', error);
      if (this._mounted) this.setState({ feedback: 'O browser somente não suporta o aplicativo.' });
    }
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

    return (
      <View style={containerStyle}>
        <Text>LOADING ...</Text>
        <Text>{this.state.feedback}</Text>
      </View>
    );
  }
}

export default connect(null, {
  acUpdateContext,
  acSetAppName,
})(Loading);