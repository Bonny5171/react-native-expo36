import React from 'react';
import {
  Text,
  View,
  Button,
  Image,
  TextInput,
} from 'react-native';
// import Toaster, { ToastStyles } from '../components/Toaster';
import { connect } from 'react-redux';
// import { acNextStep, acNextScreen, changePorcent, changeIndeterminate, acResetPage, changeRetry, } from '../redux/actions/pages/setup';
import { acUpdateContext } from '../redux/actions/global';
import { onSync } from '../services/SyncDb';
// import SyncDbV2 from '../services/SyncDbV2'
// import squel from 'squel';
// import DB from '../services/SQLite';

// import Resource from '../services/Resource';
// import Product from '../services/Product';
// import TrackingChange from '../services/Repository/core/TrackingChange';
// import DeviceData from '../services/Repository/core/DeviceData';
// import DeviceInfo from '../services/DeviceInfo';
// import Account from '../services/Account/';
// import { getUserId } from '../services/Auth';

// import CalendarPicker from 'react-native-calendar-picker';

const _tcInstance = {};
const _ddInstance = {};

class TesteScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      value: 'Grendene 2019',
      selectedStartDate: null,
      visible: false,
    };

    this.onDateChange = this.onDateChange.bind(this);
    // this._DownLoadDb = this._DownLoadDb.bind(this);
    
    // const messages = [
      // { text: 'FYI' },
      // { text: 'Hooray!', styles: ToastStyles.success },
      // { text: 'Eek', styles: ToastStyles.warning },
      // { text: 'Oh noe!', styles: ToastStyles.error }
    // ];

    // Send each message 1 second apart
    // messages.forEach((message, i) => {
    //   setTimeout(() => this.setState({ message }), i * 1000);
    // });
  }

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }

  // _createInstanceTC = async (repo) => {
  //   if (!_tcInstance[repo]) {
  //     const deviceId = DeviceInfo.getDeviceId();
  //     _tcInstance[repo] = new TrackingChange(repo, deviceId);

  //     _tcInstance[repo].on('progress', (o) => {
  //       console.log(o);
  //     });
  //   }
  // }

  // _createInstanceDD = async (repo) => {
  //   if (!_ddInstance[repo]) {
  //     const userId = await getUserId();
  //     const deviceId = await DeviceInfo.getDeviceId();
  //     _ddInstance[repo] = new DeviceData(repo, userId, deviceId);

  //     _ddInstance[repo].on('progress', (o) => {
  //       console.log(o);
  //     });
  //   }
  // }

  // _getByFileName = async () => {
  //   const r = await Resource.getByFileName('218202074300_z', true);
  //   // console.log('r', r);
  //   this.setState(r);
  // }

  // onPress_startTC = async (repo) => {
  //   await this._createInstanceTC(repo);
  //   _tcInstance[repo].start();
  // }

  // onPress_stopTC = async (repo) => {
  //   await this._createInstanceTC(repo);
  //   _tcInstance[repo].stop();
  // }

  // onPress_clearTC = async (repo) => {
  //   await this._createInstanceTC(repo);
  //   _tcInstance[repo].removeAllSchemaAndData();
  // }

  // onPress_runTC = async (repo) => {
  //   await this._createInstanceTC(repo);
  //   _tcInstance[repo].run();
  // }


  // onPress_startDD = async (repo) => {
  //   await this._createInstanceDD(repo);
  //   _ddInstance[repo].start();
  // }

  // onPress_stopDD = async (repo) => {
  //   await this._createInstanceDD(repo);
  //   _ddInstance[repo].stop();
  // }

  // onPress_runDD = async (repo) => {
  //   await this._createInstanceDD(repo);
  //   _ddInstance[repo].run();
  // }

  // _setDeviceId = async () => {
  //   const device = await deviceInfo.registerDevice();

  //   await Account.saveParameter('CURRENT_DEVICE_ID', device.id);
  //   await Resource.saveParameter('CURRENT_DEVICE_ID', device.id);
  //   await Product.saveParameter('CURRENT_DEVICE_ID', device.id);
  //   await Setup.saveParameter('CURRENT_DEVICE_ID', device.id);
  // }

  // _setUserId = async () => {
  //   const userId = await getUserId();

  //   await Account.saveParameter('CURRENT_USER_ID', userId);
  //   await Resource.saveParameter('CURRENT_USER_ID', userId);
  //   await Product.saveParameter('CURRENT_USER_ID', userId);
  //   await Setup.saveParameter('CURRENT_USER_ID', userId);
  // }

  // _setAccount = async () => {
  //   await Account.testCRUD();
  // }

  _DownLoadDb = async () => {
    console.log('1111');

    // const { changePorcent, changeIndeterminate, changeRetry } = this.props;
    const deviceId = '111';
    const userId = '111';
    const appId = '111';
    
    const changePorcent = (payload) => {
      return {
          type: 'change_porc',
          payload
      };
    };
    const changeIndeterminate = (payload) => {
      return {
          type: 'change_indeterminate',
          payload
      };
    };
    const changeRetry = (payload) => {
      return {
          type: 'update_retry',
          payload
      };
    };

    // console.log('this.props', this.props);
    
    // console.log('onSync', SyncDbV2);
    onSync({ service: 'product', changePorcent, changeIndeterminate, changeRetry, deviceId, userId, appId });
    console.log('2222');
  }

  render() {
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';

    console.log('this.props.iProgressBar', this.props.iProgressBar);

    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
      }}
      >
        <Text>estou na pagina teste</Text>
        <Text>{this.props.iProgressBar.product}</Text>
        <Button
          title="Download DB"
          onPress={this._DownLoadDb}
        />

        {/* <TextInput
          // ref={ref => { this.txtInput = ref; }}
          underlineColorAndroid="transparent"
          onChangeText={(value) => {
            // props.onChangeText
            // this.setState({ value });
          }}
          onFocus={() => {
            this.setState({ visible: true });
          }}
          onBlur={() => {
            this.setState({ visible: false });
          }}
          value={startDate}
          spellCheck={false}
          // multiline={props.isTextArea}
          // numberOfLines={props.nrLines}
          // textAlignVertical={align}
          // maxLength={props.maxLength}
          // keyboardType={props.keyboardType}
          style={{
            fontSize: 18,
            // width: '100%',
            height: 20,
            paddingBottom: 3,
            paddingLeft: 8,
            paddingRight: 41,
            borderBottomColor: 'black',
            borderRadius: 3,
            borderWidth: 1,
            // fontFamily: Font.ALight,
          }}
        />
        {
          this.state.visible && <CalendarPicker
            onDateChange={this.onDateChange}
          />
        }

        <Text>{this.props.iProgressBar.product}</Text>
        <Image style={{ width: 500, height: 500, resizeMode: 'contain', borderWidth: 1, borderColor: 'red' }} source={{ uri: this.state.fullContent }} />
        <Button
          title="Download DB"
          onPress={this._DownLoadDb}
        />
        <Button
          title="fileName"
          onPress={this._getByFileName}
        />

        <Button
          title="Set DEVICE_ID"
          onPress={this._setDeviceId}
        />
        <Button
          title="Set USER_ID"
          onPress={this._setUserId}
        />
        <Button
          title="Set BlaBlaBla sf_account"
          onPress={this._setAccount}
        />

        <Button
          title="Start Order (device_data)"
          onPress={this.onPress_startDD.bind(this, 'order')}
        />
        <Button
          title="Stop Order (device_data)"
          onPress={this.onPress_stopDD.bind(this, 'order')}
        />
        <Button
          title="Run Order (device_data)"
          onPress={this.onPress_runDD.bind(this, 'order')}
        />

        <Button
          title="Start Product (tracking)"
          onPress={this.onPress_startTC.bind(this, 'product')}
        />
        <Button
          title="Stop Product (tracking)"
          onPress={this.onPress_stopTC.bind(this, 'product')}
        />
        <Button
          title="Run Product (tracking)"
          onPress={this.onPress_runTC.bind(this, 'product')}
        />
        <Button
          title="*** Clear *** Account (tracking)"
          onPress={this.onPress_clearTC.bind(this, 'account')}
        />

        <Button
          title="react-native-toaster -> INFO"
          onPress={() => {
            this.setState({ message: { text: 'Texto informativo' } });
          }}
        />
        <Button
          title="react-native-toaster -> SUCCESS"
          onPress={() => {
            this.setState({ message: { text: 'Opa deu certo!', styles: ToastStyles.success } });
          }}
        />
        <Button
          title="react-native-toaster -> WARNING"
          onPress={() => {
            this.setState({ message: { text: 'Atenção algo pode ter dado errado', styles: ToastStyles.warning } });
          }}
        />
        <Button
          title="react-native-toaster -> ERROR"
          onPress={() => {
            this.setState({ message: { text: 'Oh no! deu erro', styles: ToastStyles.error } });
          }}
        />
        <Toaster message={this.state.message} /> */}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  steps: state.setup.steps,
  screen: state.setup.screen,
  iProgressBar: state.setup.iProgressBar,
  indeterminate: state.setup.indeterminate,
  redirects: state.menu.redirects,
  context: state.global.context,
  retry: state.setup.retry,
}
);

export default connect(mapStateToProps, {
  // acNextStep,
  // acNextScreen,
  // changePorcent,
  // changeIndeterminate,
  // acUpdateContext,
  // acResetPage,
  // changeRetry,
})(TesteScreen);