import React from 'react';
import {
  View, Text, StyleSheet,
  Platform, Keyboard, TouchableOpacity,
  ImageBackground, Animated,
} from 'react-native';
import { connect } from 'react-redux';
import * as reducersClients from '../../redux/actions/pages/clients';
import { acToggleMask } from '../../redux/actions/global';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import { Font } from '../../assets/fonts/font_names';
import { Button, Fade, Title, Row, TranslucidHeader, TableList, ModalMask, Panel, InfoMsg, DisableComponent } from '../../components';
import { SortPopUp, FilterPopUp, HeaderTL, SummaryList, RowData, } from './components';
import SrvClients from '../../services/Account/';
import { anyIsSelected } from '../../redux/reducers/pages/common/functions';
import { getSituations } from '../../services/Pages/Clients/Queries';
import { assistant } from '../../services/Pages/Assistant';

class Clients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: new Animated.Value(0),
      isQuering: 'none',
    };
    this._isFirstMount = true;
    this.setListHeight = this.setListHeight.bind(this);
    this.btnMenuClicked = this.btnMenuClicked.bind(this);
    // this.props.acCurrentClient = this.props.acCurrentClient.bind(this);
  }

  async componentDidMount() {
    this.toggleIsQuering();
    const result = await assistant.getClients(this.props.appDevName);
    this.props.acSetClients(result);
    this.props.acSetPopUpFilter('dropSituacao', await getSituations());
    this.state.listHeight.addListener((value) => { this._value = value; });
    this.toggleIsQuering();
    this._isFirstMount = false;
  }

  componentWillUnmount() {
    this.props.acResetPage();
  }
  render() {
    // Imagem do plano de fundo
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
    return (
      <ImageBackground
        pointerEvents={this.state.isQuering}
        source={background}
        style={stylesLocal.content}
        resizeMode="cover"
      >
        {/* Body */}
        <View style={{ flex: 1 }}>
          <View style={stylesLocal.body}>
            {this._renderList()}
          </View>

          <ModalMask
            container={StyleSheet.absoluteFill}
            visible={this.props.modalMask}
            toggleModal={[
              { func: this.props.acToggleMask, params: [] },
              { func: this.props.acCloseClientModals, params: [] },
              { func: this.clearPanelFilters, params: [] },
            ]}
          />
          {/* Header */}
          <TranslucidHeader
            startingHeight={200}
            content={stylesLocal.header}
            y={this.state.listHeight}
          >
            {this._renderHeader()}
          </TranslucidHeader>
        </View>
        { /* PopUp Sort */}
        <SortPopUp
          isVisible={this.props.buttons[0].isChosen}
          sortName={this.sortName}
          {...this.props}
        />
        {/* PopUp Filtro */}
        <Panel
          {...this.props.panel}
          pointerActiveContent={this.props.panelPointer}
          togglePop={() => {
            this.props.acTogglePanel();
            this.props.acToggleMask();
          }}
        >
          <FilterPopUp
            isVisible={this.props.panelFilter !== undefined}
            SrvClients={SrvClients}
            {...this.props}
          />
        </Panel>
      </ImageBackground>
    );
  }

  _renderHeader() {
    const {
      buttons,
      list,
      acUpdateList,
      acCloseClientModals,
      acUpdateComponent,
    } = this.props;

    return (
      <View>
        <Row style={{ width: '100%' }}>
          <Title style={stylesLocal.title} msg="CLIENTES" />
          <View style={{ flexGrow: 1 }} />
          <DisableComponent
            isDisabled={this.props.data.length === 0 && !this.props.isResultFinder}
          >
            <Fade visible={list} style={vwOrderBy}>
              <Button
                txtStyle={icOrderBy}
                txtMsg="k"
                isChosen={buttons[0].isChosen}
                shadow
                changeColor
                chosenColor="#0085B2"
                nChosenColor="rgba(0,0,0,.3)"
                rdAction={acUpdateComponent}
                rdName="sortPopUp"
                rdType="popup"
                actions={[{ func: this.btnMenuClicked, params: [0] }]}
              />
            </Fade>
            <Button
              tchbStyle={tchbFilter}
              txtStyle={stylesLocal.icFilter}
              txtMsg="l"
              isChosen={buttons[1].isChosen}
              shadow
              changeColor
              chosenColor="#0085B2"
              nChosenColor="rgba(0,0,0,.3)"
              action={() => {
                this.props.acToggleMask();
                this.props.acSetPanel(0);
                this.props.acTogglePanel();
              }}
            />
          </DisableComponent>
          <ModalMask
            container={StyleSheet.absoluteFill}
            visible={this.props.modalMask}
            toggleModal={[
              { func: this.props.acToggleMask, params: [] },
              { func: this.props.acCloseClientModals, params: [] },
            ]}
          />
        </Row>
        <DisableComponent
          isDisabled={this.props.data.length === 0 && !this.props.isResultFinder}
        >
          <BtnToggleList
            isActive={list}
            action={() => {
              acUpdateList();
              acCloseClientModals();
              if (this.props.modalMask) this.props.acToggleMask();
            }}
            containerStyle={{
              marginRight: 40,
              marginTop: 5,
            }}
          />
        </DisableComponent>
      </View>
    );
  }

  _renderList() {
    if (this.props.data.length === 0 && this._isFirstMount) {
      return (
        <InfoMsg
          icon="F"
          firstMsg="Ops! Não encontramos clientes para você."
          sndMsg="Seria bom falar com o suporte técnico."
        />
      );
    }
    if (this.props.list) {
      return (
        <View style={{ height: '100%' }}>
          <SummaryList
            setListHeight={this.setListHeight}
            loadMore={() => console.log('load more...')}
            {...this.props}
          />
        </View>
      );
    }

    return (
      <View style={stylesLocal.listContainer}>
        <TableList
          containerStyle={{ paddingTop: this.props.isResultFinder ? 55 : 108 }}
          headerHeight={55}
          header={HeaderTL}
          row={RowTL}
          {...this.props}
        />
      </View>
    );
  }

  setListHeight(y) {
    this.setState({ listHeight: new Animated.Value(y) });
  }

  btnMenuClicked() {
    if (this.props.modalMask) this.props.acToggleMask();
    // Se o modal atual for desativado, tira a máscara
    const isAnyModalOpen = anyIsSelected(this.props.buttons, 'isChosen');
    // Se um modal estiver ativo, precisa manter a máscara ativa
    if (isAnyModalOpen === undefined) {
      this.props.acToggleMask();
    } else if (!this.props.modalMask) {
      // Se a máscara não estiver ativa, ativaremos ela qando o modal abrir
      this.props.acToggleMask();
    }
  }

  toggleIsQuering = () => {
    this.setState({ isQuering: this.state.isQuering === 'auto' ? 'none' : 'auto' });
  }

  clearPanelFilters = () => {
    const hasFilters = this.props.popUpFilter.find(({ current }) => current !== '');
    if (!hasFilters) {
      setTimeout(() => {
        this.props.acClearPanelFilters();
      }, 550);
    }
  }

  sortName = async () => {
    SrvClients.get(this.props.acSetClients, ['sf_name']);
  }
}

const mapStateToProps = state => ({
  buttons: state.clients.buttons,
  sort: state.clients.sort,
  popUpFilter: state.clients.popUpFilter,
  panelFilter: state.clients.panelFilter,
  list: state.clients.list,
  panel: state.clients.panel,
  panelPointer: state.clients.panelPointer,
  data: state.clients.data,
  client: state.clients.client,
  isResultFinder: state.clients.isResultFinder,
  context: state.global.context,
  window: state.global.window,
  modalMask: state.global.modalMask,
  appDevName: state.global.appDevName,
});

export default connect(mapStateToProps,
  {
    ...reducersClients,
    acToggleMask
  })(Clients);

const icOrderBy = {
  fontFamily: Font.C,
  fontSize: 32,
  color: 'rgba(102, 102, 102, 0.5)',
  zIndex: 2,
};
const vwOrderBy = {
  marginTop: 30,
  marginRight: 10,
  zIndex: 2,
};
const tchbFilter = {
  marginTop: 30,
  marginRight: 32,
  zIndex: 2,
};

let stylesLocal = StyleSheet.create({
  title: {
    fontFamily: Font.AThin,
    marginLeft: 30,
    marginTop: 20,
    fontSize: 42,
    color: 'rgba(102, 102, 102, 0.5)',
  },
  content: {
    flex: 1,
  },
  header: {
    height: 116,
  },
  row: {
    flexDirection: 'row',
  },
  icFilter: {
    fontFamily: Font.C,
    fontSize: 32,
    color: 'rgba(102, 102, 102, 0.5)',
  },
  tchbList: {
    alignSelf: 'flex-end',
    backgroundColor: '#DDD',
    height: 18,
    width: 24,
  },
  icList: {
    transform: [{ translateX: -3 }, { translateY: -3 }],
    fontFamily: Font.C,
    fontSize: 24,
    color: 'rgba(102, 102, 102, 0.5)',
  },
  body: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  vwFPU: {
    position: 'absolute',
    marginTop: 65,
    width: 964,
    height: 350,
    ...Platform.select({
      web: {
        right: -54,
      }
    }),
  },
  vwSPU: {
    position: 'absolute',
    right: 85,
    marginTop: 65,
  },
});

const RowTL = (item, index, props) => {
  const next = props.data[index + 1];
  const previous = props.data[index - 1];
  const nextClient = next !== undefined ? { fantasyName: next.fantasyName, key: next.key } : null;
  const previousClient = previous !== undefined ? { fantasyName: previous.fantasyName, key: previous.key } : null;
  return (
    <RowData
      key={index.toString()}
      next={nextClient}
      index={index}
      previous={previousClient}
      data={props.data}
      acCurrentClient={props.acCurrentClient}
      navigation={props.navigation}
      {...item}
    />
  );
};

export const BtnToggleList = (props) => (
  <TouchableOpacity
    style={[stylesLocal.tchbList, props.containerStyle]}
    onPress={props.action}
  >
    <Text style={stylesLocal.icList}>
      { props.isActive ? '[' : ']' }
    </Text>
  </TouchableOpacity>
);