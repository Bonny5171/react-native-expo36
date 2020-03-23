import React from 'react';
import { View, ImageBackground, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import global from '../../assets/styles/global';
import { InfoMsg } from '../../components';

class Campaigns extends React.Component {
  render() {
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
    return (
      <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
        <View style={[global.containerCenter, { position: 'absolute', height: '100%', width: '100%' }]}>
          <InfoMsg
            icon="8"
            firstMsg="Estamos desenvolvendo esta página."
            sndMsg="Fique de olho nas próximas atualizações do aplicativo!"
          />
        </View>
        <View style={styles.header}>
          <Text style={global.titlePagina}>CAMPANHAS</Text>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  context: state.global.context
});

export default connect(mapStateToProps, null)(Campaigns);


const styles = StyleSheet.create({
  header: {
    height: 90,
  },
});