import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground  } from 'react-native';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import { acCloseToast, } from '../../redux/actions/global';
import SimpleButton from '../../components/SimpleButton';
import { cartBoxClicked } from '../../services/Pages/Cart/Queries';
import { Font } from '../../assets/fonts/font_names';
import { acCurrentClient } from '../../redux/actions/pages/client';
import { acSetCarts, acSetDropdownCarts, acCurrentDropDown, } from '../../redux/actions/pages/catalog';
import { acUpdateButtons } from '../../redux/actions/pages/menu';

class Success extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      pedido: '',
    };
  }

  redirect() {
    const { context } = this.props;
    if (context === 'Admin') {
      this.props.acCloseToast();
      this.props.acUpdateButtons('admin', 'orders');
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'carrinhos' })],
      });
      this.props.navigation.dispatch(resetAction);
    }

    if (context === 'Vendedor') {
      this.props.acCloseToast();
      this.props.acUpdateButtons('vendor', 'catalog');
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'catalog' })],
      });
      this.props.navigation.dispatch(resetAction);
    }
  }

  async componentDidMount() {
    const { dropdown } = this.props;

    const pedido = dropdown.current.key.split('-')[0];
    this.setState({ pedido });

    const timeout = 6000;
    this.timer = setTimeout(() => {
      this.redirect();
    }, timeout);
  }

  redirectToOrder = () => {
    clearTimeout(this.timer);
    this.props.acCloseToast();
    this.props.acUpdateButtons('admin', 'orders');
    const { dropdown, carts, acSetDropdownCarts, acCurrentClient, } = this.props;
    cartBoxClicked(carts, dropdown.current.key, acSetDropdownCarts, acCurrentClient, this.props.appDevName);
    const goToCarrnho = this.props.navigation.getParam('BackSpace', '');
    this.props.navigation.navigate('order', { goToCarrnho: goToCarrnho });
  }

  render() {
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
    const labelBtn = this.props.context === 'Vendedor' ? 'VOLTAR AO CATÁLOGO' : 'VOLTAR AOS CARRINHOS';
    return (
      <ImageBackground source={background} style={{ flex: 1, justifyContent: 'center', height: '100%', width: '100%', position: 'absolute', zIndex: 3 }} resizeMode="cover">
        <View style={styles.ctnSucesso}>
          <Text style={styles.icoSucesso}>n</Text>
          <Text style={styles.parabens}>Parabéns, pedido concluído!</Text>
          <View style={styles.ctnInfo}>
            <Text style={styles.info}>Você poderá acompanhá-lo pelo código </Text>
            <TouchableOpacity onPress={this.redirectToOrder}>
              <Text style={styles.code}>{this.state.pedido}</Text>
            </TouchableOpacity>
            <Text style={styles.info}>.</Text>
          </View>
          <SimpleButton
            msg={labelBtn}
            action={() => {
              clearTimeout(this.timer);
              this.redirect();
            }}
          />
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
   dropdown: state.catalog.dropdown,
    context: state.global.context,
      carts: state.catalog.carts,
      appDevName: state.global.appDevName
});

const mapDispatchToProps = {
  acCloseToast,
  acCurrentClient,
  acSetDropdownCarts,
  acCurrentDropDown,
  acSetCarts,
  acUpdateButtons,
};

export default connect(mapStateToProps, mapDispatchToProps)(Success);


const styles = StyleSheet.create({
  ctnSucesso: {
    alignItems: 'center',
  },
  icoSucesso: {
    fontFamily: Font.C,
    fontSize: 56,
    color: 'rgba(0,0,0,.5)',
    marginBottom: 10,
  },
  parabens: {
    fontFamily: Font.ALight,
    fontSize: 28,
    color: 'rgba(0,0,0,.8)',
  },
  ctnInfo: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 80,
  },
  info: {
    fontFamily: Font.ALight,
    fontSize: 18,
    color: 'rgba(0,0,0,.8)',
  },
  code: {
    fontFamily: Font.BSemiBold,
    fontSize: 24,
    color: '#0085B2',
    textDecorationLine: 'underline',
    transform: [{ translateY: -5 }],
  }
});