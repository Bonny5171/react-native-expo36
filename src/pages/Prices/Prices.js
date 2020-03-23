import React from 'react';
import { View, ImageBackground, Text } from 'react-native';
import { connect } from 'react-redux';
import { InfoMsg } from '../../components';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import global from '../../assets/styles/global';

class Prices extends React.Component {
  render() {
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
    return (
      <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
        <Text style={global.titlePagina}>PREÇOS</Text>
        <View style={[global.containerCenter, { position: 'absolute', height: '100%', width: '100%' }]}>
          <InfoMsg
            icon="8"
            firstMsg="Estamos desenvolvendo esta página."
            sndMsg="Fique de olho nas próximas atualizações do aplicativo!"
          />
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  context: state.global.context
});

export default connect(mapStateToProps, null)(Prices);