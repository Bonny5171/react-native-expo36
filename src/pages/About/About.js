import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { Alert, ImageBackground, View, Text, Dimensions, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header } from './components';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import { Font } from '../../assets/fonts/font_names';
import global from '../../assets/styles/global';

import DeviceInfo from '../../services/DeviceInfo';
import DeviceUpdate from '../../services/DeviceUpdate';
import Db from '../../services/Repository/core/Db';

let deviceUpdateInstance = null;

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this._mounted = false;
  };

  async componentDidMount() {
    this._mounted = true;

    const deviceInfoArray = await Promise.all([
      DeviceInfo.getDeviceId(),
      DeviceInfo.getPlatformProperties(),
      DeviceInfo.getAppVersion()
    ]);

    const deviceId = deviceInfoArray[0];
    const platformProperties = deviceInfoArray[1];
    const appVersion = deviceInfoArray[2];

    if (deviceUpdateInstance === null) {
      deviceUpdateInstance = new DeviceUpdate(deviceId);
    }

    // if (this._mounted) {
    //   this.setState({
    //     app_version: appVersion,
    //     device_id: deviceId,
    //     platform_device_id: platformProperties.deviceId,
    //     platform: platformProperties.platformForUser + (platformProperties.platformType === 'web' ? ' [' + platformProperties.userAgent + ']' : ''),
    //   })
    // }

    const allSizesArray = await Promise.all([
      Db.size('resource', deviceId),
      Db.size('account', deviceId),
      Db.size('product', deviceId),
      Db.size('order', deviceId),
      Db.size('setup', deviceId)
    ])

    const totalSize = allSizesArray.reduce((partialSum, a) => partialSum + a);


    console.log(platformProperties)

    if (this._mounted) {
      this.setState({
        app_version: appVersion,
        device_id: deviceId,
        platform_device_id: platformProperties.deviceId,
        platform: platformProperties.platformForUser, //+ (platformProperties.platformType === 'web' ? ' (' + platformProperties.userAgent + ')' : ''),
        size_resource: this.prettyNumber(allSizesArray[0]),
        size_account: this.prettyNumber(allSizesArray[1]),
        size_product: this.prettyNumber(allSizesArray[2]),
        size_order: this.prettyNumber(allSizesArray[3]),
        size_setup: this.prettyNumber(allSizesArray[4]),
        size_total: this.prettyNumber(totalSize),
        loading: false,
        loading_check_version: false,
        isPlatformMacOS: platformProperties.platformName.toLowerCase().indexOf('mac') > -1
      })
    }
  }

  prettyNumber(pBytes, pUnits = 'si') {
    // Handle some special cases
    if (pBytes == 0) return '0 Bytes';
    if (pBytes == 1) return '1 Byte';
    if (pBytes == -1) return '-1 Byte';

    var bytes = Math.abs(pBytes)
    if (pUnits && pUnits.toLowerCase() && pUnits.toLowerCase() == 'si') {
      // SI units use the Metric representation based on 10^3 as a order of magnitude
      var orderOfMagnitude = Math.pow(10, 3);
      var abbreviations = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    } else {
      // IEC units use 2^10 as an order of magnitude
      var orderOfMagnitude = Math.pow(2, 10);
      var abbreviations = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    }
    var i = Math.floor(Math.log(bytes) / Math.log(orderOfMagnitude));
    var result = (bytes / Math.pow(orderOfMagnitude, i));

    // This will get the sign right
    if (pBytes < 0) {
      result *= -1;
    }

    // This bit here is purely for show. it drops the percision on numbers greater than 100 before the units.
    // it also always shows the full number of bytes if bytes is the unit.
    if (result >= 99.995 || i == 0) {
      return result.toFixed(0) + ' ' + abbreviations[i];
    } else {
      return result.toFixed(2) + ' ' + abbreviations[i];
    }
  }

  componentWillUnmount = () => {
    this._mounted = false;
  }

  render() {
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;

    return this.state.loading ? (
      <View style={[styles.sizeImage, styles.loadingImage]}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    ) : (
        <ImageBackground data-id="containerCarrinho" source={background} style={{ flex: 1 }} resizeMode="cover">
          <Header />
          <View style={{ flexDirection: 'row', marginTop: 50, paddingHorizontal: 50, maxWidth: 1024 }}>
            <View style={{ width: '60%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Item label='VERSÃO' value={this.state.app_version} />
                
                {(!this.state.loading_check_version && !this.state.isPlatformMacOS) &&
                <TouchableOpacity onPress={this._onPress_checkForUpdate} style={styles.btUpdateCtn}>
                  <Text style={styles.btUpdateTxt}>Obter atualizações</Text>
                </TouchableOpacity>}
                
                {this.state.loading_check_version &&
                <View style={[styles.sizeImage, styles.loadingImage]}>
                  <ActivityIndicator size="small" color="#333" />
                </View>}

              </View>
              <Item label='SISTEMA OPERACIONAL' value={this.state.platform}>
              </Item>
              <Item label='IDENTIFICADOR DO DISPOSITIVO' value={this.state.platform_device_id} />
              <Item label='IDENTIFICADOR DA INSTALAÇÃO' value={this.state.device_id} />
              {/* <Item label='ÚLTIMA ATUALIZAÇÃO' value='03/04/2019 16:03:00' /> */}
            </View>
            <View style={{ width: '40%' }}>
              <View style={[styles.item, { marginBottom: 12 }]}>
                {/* <Text style={[styles.itemLabel, { marginBottom: 6 }]}>DADOS</Text> */}
                <Dado icon="8" label="Configurações" value={this.state.size_setup} />
                <Dado icon="4" label="Clientes" value={this.state.size_account} />
                <Dado icon="3" label="Produtos" value={this.state.size_product} />
                <Dado icon="5" label="Pedidos" value={this.state.size_order} />
                <Dado icon=")" label="Recursos" value={this.state.size_resource} />
              </View>
              <View style={styles.item}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={styles.itemLabel}>CONSUMO</Text>
                  <Text>{this.state.size_total}</Text>
                </View>
                {/* <View style={styles.consumoBar}>
                <View style={styles.consumoProgress}></View>
              </View> */}
              </View>
            </View>
          </View>
        </ImageBackground>
      );
  }

  _onPress_checkForUpdate = async () => {
    this.setState({ loading_check_version: true });

    const { isAvailable, newVersion, message } = await deviceUpdateInstance.run();
    console.log(isAvailable);
    console.log(newVersion);
    console.log(message);
    
    this.setState({ loading_check_version: false });

    // nova versao disponivel
    if (isAvailable === true) {
      if (Platform.OS === 'web') {
        window.Electron.dialog.showMessageBox({
          type: 'info',
          title: `Versão`,
          message: `Nova atualização [${newVersion}] disponível, deseja aplicar neste momento?`,
          buttons: ['Atualizar', 'Cancelar']
        }, (buttonIndex) => {
          if (buttonIndex === 0) {
            DeviceUpdate.reload();
          }
        });
      } else {
        Alert.alert(
          `Versão`,
          `Nova atualização [${newVersion}] disponível, deseja aplicar neste momento?`,
          [
            {
              text: 'Cancelar',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Atualizar',
              onPress: () => {
                DeviceUpdate.reload()
              },
            },
          ],
          { cancelable: true },
        );
      }
    }
    
    else { // versao atualizada
      if (message !== null) {
        if (Platform.OS === 'web') {
          window.Electron.dialog.showErrorBox(`Versão`, message);
        }
        else {
          Alert.alert(`Versão`, message);
        }
        return;
      }

      if (Platform.OS === 'web') {
        window.Electron.dialog.showMessageBox({
          type: 'info',
          title: `Versão`,
          message: `O aplicativo está atualizado.`
        });
      }
      else {
        Alert.alert(`Versão`, `O aplicativo está atualizado.`);
      }
    }
  }
}

function Item(props) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>{props.label}</Text>
      <Text style={styles.itemValue}>{props.value}</Text>
    </View>
  )
}

function Dado(props) {
  return (
    <View style={styles.dado}>
      <Text style={[global.iconChecked, styles.dadoIcone]}>{props.icon}</Text>
      <View style={styles.dadoCtnTexto}>
        <Text style={styles.itemValue}>{props.label}</Text>
        <Text style={styles.itemValue}>{props.value}</Text>
      </View>
    </View>
  )

  // function Loadingd(props) {
  //   <View style={[styles.sizeImage, styles.loadingImage]}>
  //     <ActivityIndicator size="small" color="#333" />
  //   </View>
  // }
}

// About.propTypes = {
//   app_version: PropTypes.string,
//   device_id: PropTypes.string,
//   platform_device_id: PropTypes.string,
//   platform: PropTypes.string,
//   size_resource: PropTypes.number,
//   size_account: PropTypes.number,
//   size_product: PropTypes.number,
//   size_order: PropTypes.number,
//   size_setup: PropTypes.number,
//   size_total: PropTypes.number
// };

// About.defaultProps = {
//   app_version: '-',
//   device_id: '-',
//   platform_device_id: '-',
//   platform: '-',
// };

const styles = StyleSheet.create({
  sizeImage: {
    width: '95%',
    height: '75%'
  },
  loadingImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  item: {
    marginBottom: 20
  },
  itemLabel: {
    fontFamily: Font.BBold,
    fontSize: 12,
    marginBottom: 4,
  },
  itemValue: {
    fontFamily: Font.ARegular,
    fontSize: 14
  },
  dado: { flexDirection: 'row', },
  dadoCtnTexto: { marginLeft: 10, marginBottom: 20, flexDirection: 'row', flexGrow: 1, justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,.15)' },
  dadoIcone: {
    fontSize: 24,
    transform: [{ translateY: -4 }]
  },
  consumoBar: {
    backgroundColor: 'rgba(255,255,255,.5)',
    height: 12,
    width: '100%'
  },
  consumoProgress: {
    backgroundColor: '#0085B2',
    height: 12,
    width: '30%',
  },
  btUpdateCtn: {
    marginLeft: 20,
  },
  btUpdateTxt: {
    fontFamily: Font.ARegular,
    color: '#0085B2',
    textDecorationLine: 'underline',
    fontSize: 14,
    paddingLeft: 10
  },
})

export default About;