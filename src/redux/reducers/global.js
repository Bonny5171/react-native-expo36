import { Dimensions } from 'react-native';
import global from '../../assets/styles/global';
import { GLOBAL_APP_NAME, GLOBAL_TOGGLE_PANEL, GLOBAL_SET_PANEL, GLOBAL_TOGGLE_GSYNC, GLOBAL_UPDATE_SERVICE, GLOBAL_FORCE_SYNC, GLOBAL_SET_GSYNC, GLOBAL_STOP_ALL_SYNC, GLOBAL_UPDATE_SERVICE2, GLOBAL_LAST_UPDATE_SERVICE } from '../actions/global';
import { services } from '../../../config';

const window = Dimensions.get('window');

const INITIAL_STATE = {
  context: 'Admin',
  catalogCover: true,
  window,
  // Máscara usada para nas páginas
  modalMask: false,
  // Máscara que ficara por cima da página e os paineis, por estar no arquivo Content, (Modais globais)
  globalMask: false,
  modalZoom: false,
  modalVideo: false,
  video: null,
  zoomName: null,
  zoomContent: {
    source: null,
    label: '',
    sources: [],
    pointer: 0,
  },
  showToast: false,
  message: null,
  userInfo: {},
  appDevName: '',
  gPanel: {
    isVisible: false,
    title: '',
    icon: ''
  },
  gPanels: [
    {
      id: 0,
      title: 'SINCRONIZAÇÃO',
      icon: 'c'
    }
  ],
  gPanelPointer: 0,
  shouldSync: false,
  account: {
    label: 'Clientes',
    value: 0,
    value2: 0,
    type: 'down',
    icon: 4,
    isStopped: false,
  },
  product: {
    label: 'Produtos',
    value: 0,
    value2: 0,
    type: 'down',
    icon: 3,
    isStopped: false,
  },
  setup: {
    label: 'Configurações',
    value: 0, // '06/02/2019', // (0 a 100) ou data(mm/dd/yyyy)
    value2: 0,
    type: 'down',
    icon: 8,
    isStopped: false,
  },
  order: {
    label: 'Pedidos',
    value: 0,
    value2: 0,
    type: 'down',
    icon: 5,
    isStopped: false,
  },
  resource: {
    label: 'Mídias',
    value: 0,
    value2: 0,
    type: 'down',
    icon: ')',
    isStopped: false,
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'update_context': {
      const context = action.payload;
      return { ...state, context };
    }
    case 'catalog_cover': {
      const catalogCover = !state.catalogCover;
      return { ...state, catalogCover };
    }
    case 'change_dimension': {
      const { din } = action;
      const { window } = din;
      return { ...state, window };
    }
    case 'toggle_mask': {
      return { ...state, modalMask: !state.modalMask };
    }
    case 'remove_mask': {
      return { ...state, modalMask: false };
    }
    case 'toggle_global_mask': {
      return { ...state, globalMask: !state.globalMask };
    }
    case 'toggle_zoom': {
      let zoomContent = { ...INITIAL_STATE.zoomContent,  };

      if (action.newImg !== undefined) {
        const { newImg } = action;
        zoomContent = {
          source: newImg.url,
          label: newImg.name,
          sndLabel: newImg.sndLabel,
          isLocal: newImg.isLocal,
          sources: newImg.sources || [],
          pointer: newImg.pointer,
        };
      }
      const modalZoom = !state.modalZoom;

      return { ...state, zoomContent, modalZoom };
    }
    case 'toggle_video': {
      return { ...state, modalVideo: !state.modalVideo, video: action.newVideo };
    }
    case 'set_user_info': {
      return { ...state, userInfo: action.userInfo };
    }
    case 'set_open_tost': {
      return { ...state, showToast: true };
    }
    case 'set_close_tost': {
      return { ...state, showToast: false };
    }
    case 'add_tost': {
      return { ...state, message: action.message };
    }
    case 'reset_tost': {
      return { ...state, message: INITIAL_STATE.message };
    }
    case GLOBAL_APP_NAME: {
      return { ...state, appDevName: action.name };
    }
    case GLOBAL_SET_PANEL: {
      let gPanel = { ...state.gPanels[action.gPanelPointer] };
      if (action.gPanel) gPanel = { ...gPanel, isVisible: true, ...action.gPanel, };
      return {
        ...state,
        gPanelPointer: action.gPanelPointer,
        gPanel,
      };
    }
    case GLOBAL_TOGGLE_PANEL: {
      return {
        ...state,
        gPanel: {
          ...state.gPanel,
          isVisible: !state.gPanel.isVisible,
        }
      };
    }
    case GLOBAL_TOGGLE_GSYNC: {
      const shouldSync = !state.shouldSync;
      const servicesObj = {};
      services.forEach(({ nome }) => {
        if (!shouldSync) {
          // Mudança do estado para "parado" dos componentes de sincronização
          servicesObj[nome] = { ...state[nome], isStopped: true };
        } else {
          servicesObj[nome] =  { ...INITIAL_STATE[nome] };
        }
      });
      return {
        ...state,
        shouldSync,
        ...servicesObj,
      };
    }
    case GLOBAL_FORCE_SYNC: {
      const servicesObj = {};
      services.forEach(({ nome }) => {
        servicesObj[nome] =  { ...INITIAL_STATE[nome] };
      });
      return {
        ...state,
        ...servicesObj,
      };
    }
    case GLOBAL_UPDATE_SERVICE: {
      return {
        ...state,
        [action.repository]: {
          ...state[action.repository],
          value: action.percent,
        }
      };
    }
    case GLOBAL_UPDATE_SERVICE2: {
      return {
        ...state,
        [action.repository]: {
          ...state[action.repository],
          value2: action.percent,
        }
      };
    }
    case GLOBAL_SET_GSYNC: {
      return {
        ...state,
        shouldSync: action.shouldSync
      };
    }
    case GLOBAL_STOP_ALL_SYNC: {
      const servicesObj = disableAllSync(state);
      return {
        ...state,
        ...servicesObj,
      };
    }
    case GLOBAL_LAST_UPDATE_SERVICE: {
      return {
        ...state,
        [action.repository]: {
          ...state[action.repository],
          lastUpdate: action.date,
        }
      };
    }
    default:
      return { ...state };
  }
};


const disableAllSync = (state) => {
  const servicesObj = {};
  services.forEach(({ nome }) => {
    servicesObj[nome] =  { ...state[nome], isStopped: true, value: 0  };
  });
  return servicesObj;
};