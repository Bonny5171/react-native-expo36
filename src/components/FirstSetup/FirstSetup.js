import React from 'react';
import { View, Text } from 'react-native';
import { Font } from '../../assets/fonts/font_names';
import { IconProgressBar } from '../../components';
import global from '../../assets/styles/global';

class FirstSetup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      iProgressBar,
      nextStep,
      indeterminate,
      retry,
      // changePorcent,
      // changeIndeterminate,
      // changeRetry,
    } = this.props;

    return (
      <View style={{maxWidth:1024, paddingHorizontal: 40, paddingTop: 30,}}>
        <Text style={[global.p1,{lineHeight:24}]}>
          Estamos baixando os dados necessários para o seu primeiro acesso.{'\n'}
          Isso pode levar algum tempo...
        </Text>
        <View style={
            {
              flexDirection: 'row',
              marginTop: 60,
              justifyContent: 'center'
            }
          }
        >
          <IconProgressBar
            txt="PRODUTOS"
            icon={3}
            nextStep={nextStep}
            percent={iProgressBar.product}
            indeterminate={indeterminate.product}
            db="PRODUCTS"
            retry={retry}
            // changePorcent={changePorcent}
            // changeIndeterminate={changeIndeterminate}
            // changeRetry={changeRetry}
            service="product"
          />
          <IconProgressBar
            txt="CLIENTES"
            icon={4}
            nextStep={nextStep}
            percent={iProgressBar.account}
            indeterminate={indeterminate.account}
            db="ACCOUNTS"
            retry={retry}
            // changePorcent={changePorcent}
            // changeIndeterminate={changeIndeterminate}
            // changeRetry={changeRetry}
            service="account"
          />
          <IconProgressBar
            txt="SETUP"
            icon={8}
            nextStep={nextStep}
            percent={iProgressBar.setup}
            indeterminate={indeterminate.setup}
            db="SETUP"
            retry={retry}
            // changePorcent={changePorcent}
            // changeIndeterminate={changeIndeterminate}
            // changeRetry={changeRetry}
            service="setup"
          />
          <IconProgressBar
            txt="PEDIDOS"
            icon={5}
            nextStep={nextStep}
            percent={iProgressBar.order}
            indeterminate={indeterminate.order}
            db="ORDERS"
            retry={retry}
            // changePorcent={changePorcent}
            // changeIndeterminate={changeIndeterminate}
            // changeRetry={changeRetry}
            service="order"
          />
        </View>
      </View>
    );
  }
}

export default FirstSetup;