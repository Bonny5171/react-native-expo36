import React from 'react';
import { Text, View, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { SimpleButton, SwitchButton, DisableComponent } from '../components';
import { Font } from '../assets/fonts/font_names';
import global from '../assets/styles/global';
import { services } from '../../config';
import DeviceInfo from '../services/DeviceInfo';
import TrackingChange from '../services/Repository/core/TrackingChange';
import { getUserId } from '../services/Auth';
import DeviceData from '../services/Repository/core/DeviceData';
import { acToggleGSync, acUpdateService, acForceSync, acUpdateService2, acServiceLastUpdate, acStopAllSync } from '../redux/actions/global';
class SyncPanel extends React.Component {
  constructor(props) {
    super(props);
    // Verifica quantos serviços está atualizado
    let servicesSyncing = 0;
    let servicesStopped = false;
    this.disabledServices = 0;
    services.forEach(({ nome }, index) => {
      const serviceOff = !services[index].syncDeviceData && !services[index].syncTranckingChange;
      if (!services[index].syncDeviceData && !services[index].syncTranckingChange) this.disabledServices += 1;
      // Se precisar sincronizar device data, levar em consideração a porncetagem para determinar o serviço como concluído
      const ddSync = services[index].syncDeviceData ? this.props[nome].value2 === 100 : true;
      const ttSync = services[index].syncTranckingChange ? this.props[nome].value === 100 : true;
      if (ttSync && ddSync && !serviceOff) servicesSyncing += 1;
      if (this.props[nome].isStopped) {
        servicesStopped = true;
        servicesSyncing += 1;
      }
    });
    this.totalServices = this.disabledServices > 0 ? services.length - this.disabledServices : services.length;
    let servicesDone = false;
    if (servicesSyncing >= this.totalServices) {
      servicesDone = true;
      servicesSyncing = 0;
    }
    // Mensagem de status geral (Sincronizando ou parado)
    const status = this.getStatus(servicesDone,  this.totalServices - servicesSyncing, servicesStopped);
    // types: up, down, date
    this.state = {
      servicesSyncing: servicesSyncing === 0 && !servicesDone ? this.totalServices : servicesSyncing,
      status,
    };
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  componentDidUpdate(prevProps) {
    // Atualiza total de serviços sincronizados
    let servicesDone = 0;
    let prevServicesDone = 0;
    services.forEach(({ nome }, index) => {
      // Verificações para opcionalizar a verificação de serviço concluído, caso no config.js esteja desabilitado o servico de DD ou TT
      const serviceOff = !services[index].syncDeviceData && !services[index].syncTranckingChange;
      const ddSync = services[index].syncDeviceData ? this.props[nome].value2 === 100 : true;
      const ttSync = services[index].syncTranckingChange ? this.props[nome].value === 100 : true;
      const prevDDSync = services[index].syncDeviceData ? prevProps[nome].value2 === 100 : true;
      const prevTTSync = services[index].syncTranckingChange ? prevProps[nome].value === 100 : true;
      if (ttSync && ddSync && !serviceOff) servicesDone += 1;
      if (prevTTSync && prevDDSync && !serviceOff) prevServicesDone += 1;
    });
    const servicesSyncing = this.totalServices - servicesDone;
    const allServicesSyncing = servicesDone === this.totalServices;
    // Se o total de serviços terminados foi alterado, atualizamos quantos restam do total
    if (prevServicesDone !== servicesDone && this._mounted) {
      this.updateStatus(allServicesSyncing, servicesSyncing);
    }

    // Ao mudar o switch S/N de ativado para desativado, devemos mudar a mensagem de status
    if (prevProps.shouldSync !== this.props.shouldSync) {
      this.updateStatus(allServicesSyncing, servicesSyncing);
    }
  }

  render() {
    return (
      <View style={global.flexOne}>
        <View style={{ marginBottom: 12 }}>
          <View style={styles.ctnTitle}>
            <Text style={[styles.itemLabel, { marginBottom: 6 }]}>DADOS</Text>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Text style={styles.statusValue}>{this.state.status}</Text>
              <SyncIndicator
                isSyncing={this.state.servicesSyncing > 0}
                isStopped={this.state.status === 'Parado   '}
                checkStyle={{ transform: [{ translateX: 2 }] }}
                loadStyle={{ marginLeft: 7, marginRight: 2 }}
              />
            </View>
          </View>

          {/*
          Lista de dados para sincronização
          */}
          <SyncItem
            item={this.props.setup}
            service={services[0]}
          />
          <SyncItem
            item={this.props.account}
            service={services[1]}
          />
          <SyncItem
            item={this.props.product}
            service={services[2]}
          />
          <SyncItem
            item={this.props.order}
            service={services[3]}
          />
          <SyncItem
            item={this.props.resource}
            service={services[4]}
          />
        </View>
        {/* Total de bytes consumidos */}
        <View style={{ flex: 1 }} />
        <View style={{ height: 150, alignSelf: 'flex-end', width: '100%', paddingVertical: 16, borderTopWidth: 1, borderColor: '#ccc' }}>
          <Text style={[styles.itemLabel, { textAlign: 'left', marginBottom: 0 }]}>CONFIGURAÇÕES</Text>
          <View style={{ flex: 1, paddingLeft: 31 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 }}>
              <Text style={styles.dadoTexto}>Agend. Automátivo</Text>
              <SwitchButton
                isDisabled={this.state.servicesSyncing > 0 || this.totalServices === 0}
                active={this.props.shouldSync}
                action={this.handleSwitchClicked}
                circleFrom={Platform.OS === 'web' ? -12 : 2}
                circleTo={Platform.OS === 'web' ? 12.5 : 25.5}
                container={{ height: 36, width: 66 }}
                txtStyle={{ fontSize: 14 }}
                circleStyle={{ fontSize: 30 }}
              />
            </View>
            <SimpleButton
              disabled={this.state.servicesSyncing > 0 || this.totalServices === 0}
              msg="SINCRONIZAR"
              action={() => {
                this.props.acForceSync();
                this.actionAll('run');
                this.updateStatus(false, this.totalServices);
              }}
              tchbStyle={{ height: 38 }}
              txtStyle={{ fontSize: 14 }}
            />
          </View>
        </View>
      </View>
    );
  }

  async startSync(shouldSync) {
    const deviceId = await DeviceInfo.getDeviceId();
    // Inicialização de todos as sincrinizações caso o sync esteja ativo
      services.forEach(async (cfg, index) => {
        // Se no config.js estiver ativado o sync, ele inicia o fluxo
        if (cfg.syncTranckingChange) {
          if (this.props.tcInstance[cfg.nome]) this.props.tcInstance[cfg.nome].stop();
          if (this.props.tcInstance[cfg.nome] === undefined) {
            this.props.tcInstance[cfg.nome] = new TrackingChange(cfg.nome, deviceId);
          }
          this.props.tcInstance[cfg.nome].param.set('TRACKING_CHANGE_ENABLED', shouldSync);
          // Inicializa sincronização de um serviço
          this.props.tcInstance[cfg.nome].start();
          // Ativa observador para atualizr as porcentagens
          this.activateListener(cfg.nome);
        }

        if (cfg.syncDeviceData) {
          if (this.props.ddInstance[cfg.nome]) this.props.ddInstance[cfg.nome].stop();
          if (this.props.ddInstance[cfg.nome] === undefined) {
            const userId = await getUserId();
            this.props.ddInstance[cfg.nome] = new DeviceData(cfg.nome, userId, deviceId);
          }
          this.props.ddInstance[cfg.nome].param.set('DEVICE_DATA_ENABLED', shouldSync);
          this.props.ddInstance[cfg.nome].start();
          this.activateDDListener(cfg.nome);
        }
      });
  }

  async actionAll(action) {
    // Ações para sincronização
    // Inicia - 'start'
    // Para - 'stop'
    // Run - 'força'

    services.forEach((cfg) => {
      if (this.props.tcInstance[cfg.nome]) {
        // Executa ação no serviço específico, para descida e subida de dados
        this.props.tcInstance[cfg.nome][action]();
        // Caso não seja o de parar é necessário manter as porcentagens atualizadas
        if (action !== 'stop') {
          this.activateListener(cfg.nome);
        } else {
          this.props.tcInstance[cfg.nome].param.set('TRACKING_CHANGE_ENABLED', false);
        }
      }
      if (this.props.ddInstance[cfg.nome]) {
        this.props.ddInstance[cfg.nome][action]();
        if (action !== 'stop') {
          this.activateDDListener(cfg.nome);
        } else {
          this.props.ddInstance[cfg.nome].param.set('DEVICE_DATA_ENABLED', false);
        }
      }
    });
  }

  handleSwitchClicked = () => {
    // Iniciar sincronismo se ele estava desligado ou pará-lo
    if (!this.props.shouldSync) {
      this.startSync(true);
    } else {
      this.actionAll('stop');
    }
    services.forEach(async ({ nome }) => {
      if (this.props.tcInstance[nome]) await this.props.tcInstance[nome].param.set('TRACKING_CHANGE_ENABLED', !this.props.shouldSync);
      if (this.props.ddInstance[nome]) await this.props.ddInstance[nome].param.set('DEVICE_DATA_ENABLED', !this.props.shouldSync);
    });
    this.props.acToggleGSync();
  }

  activateListener(name) {
    if (this.props.tcInstance[name]) {
      this.props.tcInstance[name].on('progress', (o) => {
        if (o.percent === 100) {
          const now = Date.now();
          this.props.acServiceLastUpdate(o.repository, now);
          this.props.tcInstance[name].param.set('TRACKING_CHANGE_LATEST_STATUS', 'success');
          this.props.tcInstance[name].param.set('TRACKING_CHANGE_LATEST_DATE', "strftime('%Y-%m-%dT%H:%M:%fZ', 'now', 'localtime')");
        }
        // Atualiza a porcentagem do serviço correspondente
        this.props.acUpdateService(o.repository, o.percent);
      });
    }
  }

  activateDDListener = (name) => {
    if (this.props.ddInstance[name]) {
      this.props.ddInstance[name].on('progress', (o) => {
        if (o.percent === 100) {
          const now = Date.now();
          this.props.acServiceLastUpdate(o.repository, now);
          this.props.ddInstance[name].param.set('DEVICE_DATA_LATEST_STATUS', 'success');
          this.props.ddInstance[name].param.set('DEVICE_DATA_LATEST_DATE', "strftime('%Y-%m-%dT%H:%M:%fZ', 'now', 'localtime')");
        }
        // Atualiza a porcentagem do serviço correspondente
        this.props.acUpdateService2(o.repository, o.percent);
      });
    }
  }

  getStatus(servicesDone, servicesSyncing, servicesStopped) {
    let msg = !servicesDone && servicesSyncing <= this.totalServices ? `Sincronizando ${servicesSyncing === 0 ? this.totalServices : servicesSyncing}` : 'Atualizado';
    if ((!this.props.shouldSync && servicesDone) || servicesStopped) msg = 'Parado   ';
    return msg;
  }

  updateStatus(allServicesSyncing, servicesSyncing) {
    const status = this.getStatus(allServicesSyncing, servicesSyncing);
    this.setState({ servicesSyncing, status });
  }
}

function SyncItem(props) {
  if (!props.service.syncDeviceData && !props.service.syncTranckingChange) return null;
  const statProps = {
    rotateIcon: null,
    label: null,
  };
  const { value, value2, isStopped, lastUpdate, type, label } = props.item;
  const ddIsSyncing = props.service.syncDeviceData ? value2 !== 100 : false;
  const ddSync = props.service.syncDeviceData ? value2 === 100 : true;
  const ttSync = props.service.syncTranckingChange ? value === 100 : true;
  const ttIsSyncing = props.service.syncTranckingChange ? value !== 100 : false;
  // Download
  statProps.rotateIcon = '90deg';
  statProps.label = 'Recebendo ' + value + '%';
  if (ttSync && ddSync) statProps.label = 'Atualizado';
  // Upload
  statProps.rotateIcon2 = '-90deg';
  statProps.label2 = 'Enviando ' + value2 + '%';
  if (isStopped) {
    if (ttSync) statProps.label = 'Atualizado';
    if (ddSync) statProps.label2 = 'Atualizado';
    statProps.label = 'Parado';
    statProps.label2 = 'Parado';
  }
  // debugger;
  if (ttSync && ddSync) {
    statProps.label = 'Atualizado há ' + getTimeSince(lastUpdate);
  }
  return (
    <View data-id="syncItem" style={styles.ctnData}>
      <View style={styles.dado}>
        <Text style={styles.dadoIcone}>{props.item.icon}</Text>
        <View style={styles.ctnDados}>
          <View style={[styles.dadoCtnTexto, { transform: [{ translateY: 2 }] }]}>
            <Text style={styles.dadoTexto}>{label}</Text>
            <SyncIndicator
              isStopped={isStopped}
              isSyncing={ttIsSyncing || ddIsSyncing}
              hasSynced={ttSync && ddSync}
              checkStyle={{ transform: [{ translateX: 2 }] }}
              loadStyle={{ transform: [{ translateY: -2 }], marginRight: 2 }}
            />
          </View>
        </View>
      </View>
      <View style={styles.statusCtn}>
        {type !== 'date' && ((ttIsSyncing || ddIsSyncing) || props.statusValue === 'Parado') ?
          (
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              {
                props.service.syncTranckingChange ?
                (
                  <Status
                    label={statProps.label}
                    rotateZ={statProps.rotateIcon}
                    isDone={ttSync}
                  />
                )
                :
                  <View style={{ flex: 1 }} />
              }
              <DisableComponent
                isDisabled={!props.service.syncDeviceData}
              >
                <Status
                  label={statProps.label2}
                  rotateZ={statProps.rotateIcon2}
                  isDone={ddSync}
                  containerStyle={{ marginLeft: 5 }}
                />
              </DisableComponent>
            </View>
          )
          :
            <Text style={styles.statusValue}>{statProps.label}</Text>
        }
      </View>
    </View>
  );
}

// https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
// http://momentjs.com/

function getTimeSince(date) {
  let seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + ' anos';
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + ' meses';
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + ' dias';
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + ' horas';
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + ' minutos';
  }
  return Math.floor(seconds) + ' segundos';
}

const styles = StyleSheet.create({
  ctnTitle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  ctnData: { height: 62, paddingBottom: 20 },
  ctnDados: {
    flexGrow: 1,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.15)',
    marginLeft: 10,
  },
  itemLabel: {
    fontFamily: Font.BBold,
    fontSize: 12,
    marginBottom: 4,
  },
  dadoTexto: {
    fontFamily: Font.ARegular,
    fontSize: 14
  },
  dado: { flexDirection: 'row', },
  dadoCtnTexto: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  dadoIcone: {
    fontFamily: Font.C,
    fontSize: 24,
    opacity: 0.5,
  },
  iconStatus: {
    fontFamily: Font.C,
    fontSize: 12,
  },
  statusValue: {
    fontFamily: Font.ARegular,
    fontSize: 12,
    opacity: 0.5,
  },
  statusCtn: {
    flexDirection: 'row',
    paddingLeft: 40,
    marginTop: 2,
  },
});

const mapStateToProps = (state) => ({
  setup: state.global.setup,
  product: state.global.product,
  account: state.global.account,
  order: state.global.order,
  resource: state.global.resource,
  shouldSync: state.global.shouldSync,
});

const mapDispatchToProps = {
  acStopAllSync,
  acServiceLastUpdate,
  acToggleGSync,
  acForceSync,
  acUpdateService,
  acUpdateService2,
};

export default connect(mapStateToProps, mapDispatchToProps)(SyncPanel);


const SyncIndicator = ({ hasSynced, isSyncing, isStopped, loadStyle, checkStyle }) => {
  if (isStopped && !hasSynced) {
    return <Text style={{ fontSize: 22, color: '#CCC' }}>-</Text>;
  }

  if (isSyncing) {
    return (
      <ActivityIndicator
        color="#0085B2"
        style={loadStyle}
      />
    );
  }
  return (
    <Text style={[global.iconChecked, checkStyle]}>(</Text>
  );
};

const Status = ({ label, rotateZ, containerStyle, isDone }) => (
  <View style={[{ flexDirection: 'row' }, containerStyle]}>
    <View style={{ transform: [{ translateX: -3 }, { translateY: 1,  }] }}>
      <Text style={[styles.iconStatus, { transform: [{ rotateZ }] }]}>*</Text>
    </View>
    <Text style={styles.statusValue}>{isDone ? 'Atualizado' : label}</Text>
  </View>
);