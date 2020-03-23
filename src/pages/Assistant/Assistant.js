import React from 'react';
import { View, Text, ImageBackground, AsyncStorage, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';
import * as assistantActions from '../../redux/actions/pages/assistant';
import { Steps, SimpleButton, FadeTabs, InfoMsg } from '../../components';
import { acFilterList, acSetClients } from '../../redux/actions/pages/clients';
import { acAddStore, acToggleCompleteCat } from '../../redux/actions/pages/catalog';
import { acSearchClient, acUpdateStores, acSetClientStores } from '../../redux/actions/pages/client';
import { acUpdateButtons } from '../../redux/actions/pages/menu';
import { acUpdateContext, acSetUserInfo, acSetToast, acUpdateService } from '../../redux/actions/global';
import { DefineClient, Header, DefineTable, DefineExhibition, Forward, DefineDiscounts } from './components';
import { OtherActions } from './components/Tabs';
import { backgroundAdmin, backgroundVendor } from '../../assets/images';
import global from '../../assets/styles/global';
import SrvClients from '../../services/Account/';
import SrvProduct from '../../services/Product';
import { assistant } from '../../services/Pages/Assistant';

class Assistant extends React.Component {
  constructor(props) {
    super(props);
    this.defaultSteps = [
      {
        id: 0,
        txtStep: 'Defina a exibição',
        txtStyle: global.step1,
      },
      {
        id: 1,
        txtStep: 'Defina o cliente',
        txtStyle: global.step,
      },
      {
        id: 2,
        txtStep: 'Defina a tabela',
        txtStyle: global.step,
      },
      {
        id: 3,
        txtStep: 'Defina os descontos',
        txtStyle: global.step,
      }
    ];
    this.state = {
      isInputActive: false,
      isQuering: true,
      activeTab: 0,
      stepsLabels: props.checkboxes[0] ? this.defaultSteps : this.defaultSteps.splice(0, 3),
      // haveClients: null,
    };
    this.checkboxesLabels = [
      'Catálogo (com geração de pedido)',
      'Mostruário (para uso do cliente, sem geração de pedido)'
    ];
    this.tabLabels = [
      {
        name: 'Visitar cliente',
        active: true,
      },
      {
        name: 'Outras opções',
        active: false,
      },
    ];
    this._mounted = false;
    this._result = false;
    this.isFirstRender = true;
    this.toggleInput = this.toggleInput.bind(this);
    this.setStateIndex = this.setStateIndex.bind(this);
    this.setSecondTab = this.setSecondTab.bind(this);
  }

  async componentDidMount() {
    this._mounted = true;
    await this.loadTables();
    const result = await assistant.getClients(this.props.appDevName);
    this._result = true;
    // console.log('resultsss', result);
    this.props.acSetClients(result);
    if (this._mounted) this.setState({ isQuering: false });
    // if (!this.state.haveClients && result.length > 0) this.setState({ haveClients: true });
    const usrInfo = JSON.parse(await AsyncStorage.getItem('clientInfo'));
    this.props.acSetUserInfo(usrInfo);
  }

  getSnapshotBeforeUpdate(prevProps) {
    // if (this.props.context !== 'Admin' && prevProps.context !== 'Vendedor') this.props.acUpdateContext('Admin');
    this.checkViewMode();
    this.isFirstRender = false;
    return null;
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    this._mounted = false;
    this.props.acResetAssistant();
  }

  render() {
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
    return (
      <ImageBackground style={{ flex: 1 }} source={background} resizeMode="cover">
        <View style={{ flex: 1 }}>
          <Header />
          {this._renderBody()}
        </View>
      </ImageBackground>
    );
  }

  _renderBody() {
    const {
      navigation,
      acUpdateContext,
      acUpdateButtons,
    } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <FadeTabs
          tabs={[
            {
              name: 'Visitar cliente',
              active: this.state.activeTab === 0
            },
            {
              name: 'Outras ações',
              active: this.state.activeTab === 1
            },
          ]}
          activeTab={this.state.activeTab}
          acChangeTab={this.setSecondTab}
        >
          <VisitClient
            isFirstRender={this.isFirstRender}
            stepsLabels={this.state.stepsLabels}
            checkboxesLabels={this.checkboxesLabels}
            toggleInput={this.toggleInput}
            result={this._result}
            checkViewMode={this.checkViewMode}
            isQuering={this.state.isQuering}
            {...this.props}
          />
          <OtherActions
            navigation={navigation}
            adminIcons={this.props.adminIcons}
            acUpdateButtons={acUpdateButtons}
            acUpdateContext={acUpdateContext}
            acSetPriceList={this.props.acSetPriceList}
            acToggleCompleteCat={this.props.acToggleCompleteCat}
          />
        </FadeTabs>
      </View>
    );
  }

  setSecondTab() {
    this.setState({ activeTab: this.state.activeTab === 0 ? 1 : 0 });
  }

  toggleInput() {
    this.setState({
      isInputActive: !this.state.isInputActive
    });
  }

  setStateIndex(i) {
    this.setState({ index: i });
  }

  _renderCustomTabBar = () => {
    if (Platform.OS === 'web') {
      return (
        <View
          colors={['rgba(0,133,178, 0.1)', 'rgba(0,133,178, 0)']}
          style={{ flexDirection: 'row' }}
          data-id="lineargradient-assistant"
        >
          {this.tabLabels.map(({ name, active }, i) => {
            return (
              <TouchableOpacity
                key={name}
                style={active ? global.vwActive : global.vwNotActive}
                onPress={() => null}
              >
                <Text style={active ? global.txtActive : global.txtNotActive}>{name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    return (
      <LinearGradient colors={['rgba(0,133,178, 0.1)', 'rgba(0,133,178, 0)']} style={{ flexDirection: 'row' }}>
        {this.tabLabels.map(({ name, active }, i) => {
          return (
            <TouchableOpacity
              key={i.toString()}
              style={active ? global.vwActive : global.vwNotActive}
              onPress={() => null}
            >
              <Text style={active ? global.txtActive : global.txtNotActive}>{name}</Text>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    );
  };

  checkViewMode = (checkbox) => {
    let stepsLabels = [...this.state.stepsLabels];
    if ((this.props.checkboxes[1] && this.state.stepsLabels.length === 4) || checkbox === 1) {
      stepsLabels.pop(this.state.stepsLabels.length - 1);
      this.setState({ stepsLabels });
    } else if ((this.props.checkboxes[0] && this.state.stepsLabels.length === 3) || checkbox === 0) {
      stepsLabels.push({
        id: 3,
        txtStep: 'Defina os descontos',
        txtStyle: global.step,
      });
      this.setState({ stepsLabels });
    }
  }

  loadTables = async () => {
    const lista = this.props.availableTables.length > 0 ? this.props.availableTables : await SrvProduct.getPriceList();
    const availableTables = lista;
    const currentTable = lista.length > 0 ? lista[0] : { code: '0000', name: 'NENHUMA TABELA ENCONTRADA' };
    this.props.acSetPriceList({
      availableTables,
      currentTable,
    });
  }
}

const mapStateToProps = state => (
  {
    screen: state.assistant.screen,
    steps: state.assistant.steps,
    prevSteps: state.assistant.prevSteps,
    checkboxes: state.assistant.checkboxes,
    filterBranches: state.assistant.filterBranches,
    stores: state.assistant.stores,
    dropdown: state.assistant.dropdown,
    defineTable: state.assistant.defineTable,
    dropdownTables: state.assistant.dropdownTables,
    currentTable: state.assistant.currentTable,
    availableTables: state.assistant.availableTables,
    data: state.clients.data,
    client: state.assistant.client,
    discountCheckboxes: state.assistant.discountCheckboxes,
    stepsAnswered: state.assistant.stepsAnswered,
    adminIcons: state.menu.adminIcons,
    context: state.global.context,
    appDevName: state.global.appDevName,
  }
);

export default connect(mapStateToProps, {
  ...assistantActions,
  acSearchClient,
  acFilterList,
  acUpdateStores,
  acSetClients,
  acUpdateContext,
  acUpdateButtons,
  acAddStore,
  acSetClientStores,
  acSetUserInfo,
  acToggleCompleteCat,
  acSetToast,
})(Assistant);

const VisitClient = (props) => {
  const {
    data,
    steps,
    screen,
    prevSteps,
    isFirstRender,
    toggleInput,
    stepsLabels,
    stepsAnswered,
    checkboxesLabels,
    result,
    acPreviousStep,
    acCheckDiscount,
    isQuering
  } = props;
  // console.log('isQuering', isQuering);
  // console.log('data.length', data.length);
  if (data.length === 0 && isFirstRender && result) {
    return (
      <InfoMsg
        icon="F"
        firstMsg="Não há clientes, vinculados ao seu perfil."
        sndMsg="Favor contatar um administrador"
      />
    );
  }
  const screens = [
    <DefineExhibition
      checkboxesLabels={checkboxesLabels}
      checkViewMode={props.checkViewMode}
      isQuering={isQuering}
      {...props}
    />,
    <DefineClient
      toggleInput={toggleInput}
      srvClients={SrvClients}
      {...props}
    />,
    <DefineTable
      stepsLabels={props.stepsLabels}
      {...props}
    />,
    <DefineDiscounts
      acCheckDiscount={acCheckDiscount}
      {...props}
    />
  ];
  return (
    <View style={{ flex: 1 }}>
      <Steps
        returnableSteps
        steps={steps}
        prevSteps={prevSteps}
        stepsAnswered={stepsAnswered}
        componentValues={stepsLabels}
        acPreviousStep={acPreviousStep}
      />
      <View style={{ flex: 1, maxWidth: 1024, }}>
        <View style={{ flex: 1, paddingLeft: 30, paddingTop: 32 }}>
          {screens[screen]}
        </View>
      </View>
    </View>
  );
};