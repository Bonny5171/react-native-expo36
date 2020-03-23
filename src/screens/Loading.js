import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { getInitialRouteName, getLocalStorage } from '../services/Auth';
import { acUpdateContext, acSetAppName,  } from '../redux/actions/global';
class Loading extends React.Component {
  state = {
    feedback: '',
  };

  async componentDidMount() {
    this._mounted = true;
    const app = await getLocalStorage('appDevName');
    this.props.acSetAppName(app);
    try {
      const initialRouteName = await getInitialRouteName();
      console.log('ROTA INCIAL', initialRouteName);

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