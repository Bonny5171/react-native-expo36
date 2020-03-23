import React from 'react';
import { StyleSheet, View, Text, Platform, Animated } from 'react-native';
import { Font } from '../../assets/fonts/font_names';
import { IconProgressBar, SimpleButton } from '../../components';
import global from '../../assets/styles/global';
import { onSync } from '../../services/SyncDb';
import deviceInfo from '../../services/DeviceInfo';
import { getUserId, getAppId } from '../../services/Auth';

class Media extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
    };
  }

  async componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      { toValue: 1, duration: 1000, }
    ).start();

    if (
      this.props.iProgressBar.product === 100 &&
      this.props.iProgressBar.account === 100 &&
      this.props.iProgressBar.setup === 100
    ) {
      let deviceId, userId, appId;
      deviceId = await deviceInfo.getDeviceId();
      userId = await getUserId();
      appId = await getAppId();

      await onSync({
        service: 'resource',
        changePorcent: this.props.changePorcent,
        changeIndeterminate: this.props.changeIndeterminate,
        changeRetry: this.props.changeRetry,
        deviceId,
        userId,
        appId
      });
    }
  }
  async componentWillMount() {
    // onSync({ service: 'product', changePorcent: this.props.changePorcent, changeIndeterminate: this.props.changeIndeterminate });
  }

  render() {
    const { nextStep, indeterminate, retry, } = this.props;
    return (
      <Animated.View style={{ maxWidth: 1024, paddingLeft: 40, paddingTop: 30, opacity: this.state.fadeAnim }}>
        <Text style={[global.p1, { lineHeight: 24 }]}>
          Quase lá! Agora só faltam as mídias (fotos em alta qualidade, vídeos etc).
          {'\n'} 
          Se você quiser, já pode começar a usar o aplicativo, enquanto as mídias vão sendo carregadas,{'\n'}
          ou aguarde até o término do carregamento.
        </Text>
        <View style={[styleMedia.vwButtons, { justifyContent: 'center', marginTop: 60, paddingRight: 30 }]}>
          <IconProgressBar
            txt="MÍDIAS"
            icon=")"
            nextStep={nextStep}
            percent={this.props.iProgressBar.resource}
            indeterminate={indeterminate.resource}
            db="MÍDIAS"
            retry={retry}
            changePorcent={this.props.changePorcent}
            changeIndeterminate={this.props.changeIndeterminate}
            service="resource"
            changeRetry={this.props.changeRetry}
          />
          {/* <SimpleButton
              tchbStyle={{
                height: 45,
                marginTop: 60,
                marginLeft: 100
              }}
              msg="QUERO COMEÇAR A USAR"
              actions={this.props.actions}
            /> */}
        </View>
      </Animated.View>
    );
  }
}

export default Media;

let styleMedia = {};
if (Platform.OS === 'web') {
  styleMedia = StyleSheet.create({
    p: {
      fontFamily: Font.ALight,
      fontSize: 28,
      marginLeft: -30,
      lineHeight: 35,
      color: 'black',
    },
    vwMedia: {
      marginTop: 5,
    },
    icMedia: {
      fontSize: 85,
      color: '#999',
    },
    txtMedia: {
      fontFamily: Font.ASemiBold,
      color: '#999',
      marginLeft: 15,
      fontSize: 23
    },
    btnStart: {
      backgroundColor: '#0085B2',
      height: 45,
      width: 310,
      borderRadius: 45,
      paddingTop: 7,
      marginLeft: 285,
      marginTop: 55,
    },
    txtStart: {
      fontSize: 20,
      color: 'white',
      fontFamily: Font.ASemiBold,
      textAlign: 'center',
    },
    vwButtons: {
      flexDirection: 'row',
      paddingTop: 20,
    }
  });
} else {
  styleMedia = StyleSheet.create({
    p: {
      fontFamily: Font.ALight,
      fontSize: 21,
      marginLeft: -20,
      lineHeight: 35,
      color: 'black',
    },
    icone: {
      marginLeft: 75,
      marginTop: 10,
      fontSize: 75,
    },
    btnStart: {
      backgroundColor: '#0085B2',
      height: 40,
      width: 250,
      borderRadius: 45,
      paddingTop: 7,
      marginLeft: 280,
      marginTop: 60,
    },
    txtStart: {
      fontSize: 18,
      color: 'white',
      fontFamily: Font.ASemiBold,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    vwButtons: {
      flexDirection: 'row',
      paddingTop: 30,
    },
    txtMedia: {
      color: '#999',
      fontFamily: Font.ASemiBold,
      marginLeft: 9,
      fontSize: 23
    },
    vwMedia: {
      marginLeft: 10,
      marginTop: 15
    },
    icMedia: {
      fontSize: 75,
      color: '#999',
    }
  });
}
