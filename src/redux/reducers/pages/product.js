// import { colors } from '../../../pages/Catalog/components/Mock';
import { galleries } from './common/productMock';

const colors = [];

const gallery = [
  { key: '1', url: 'https://perfectroad.files.wordpress.com/2012/04/zaxy_5.png', selected: true },
  { key: '2', url: 'http://www.grendha.com.br/_arquivos/produtos_67_imagem_reduzida.png', selected: false },
  { key: '3', url: 'http://www.grendha.com.br/_arquivos/produtos_180_imagem_galeria_hover.png', selected: false },
  { key: '4', url: 'https://perfectroad.files.wordpress.com/2012/04/zaxy_5.png', selected: false },
];

const getRandomColor = () => {
  return Math.floor((Math.random() * gallery.length) - 1) + 1;
};

const INITIAL_STATE = {
  product: {
    currentGallery: '0000',
    currentColor: getRandomColor(),
    gallery: [
      { key: '1', url: 'https://perfectroad.files.wordpress.com/2012/04/zaxy_5.png', selected: true },
      { key: '2', url: 'http://www.grendha.com.br/_arquivos/produtos_67_imagem_reduzida.png', selected: false },
      { key: '3', url: 'http://www.grendha.com.br/_arquivos/produtos_180_imagem_galeria_hover.png', selected: false },
      { key: '4', url: 'https://perfectroad.files.wordpress.com/2012/04/zaxy_5.png', selected: false },
    ],
    regionalRanking: '',
    regionalSales: '',
    nationalRanking: '',
    nationalSales: '',
    price: 0,
    group: 0,
    category: '',
    line: '',
    colors,
    colorsLength: colors.length,
    sizes: [],
    key: '1',
    selected: false,
    isHidden: false,
    isExpanded: false,
    name: 'GRENDHA ARUBA CHIN AD',
    code: '123453',
    uri: '',
    tags: [
      { label: 'NOVO', color: 'red' },
      { label: '1 GIRO', color: '#678fd4' },
      { label: '2 GIRO', color: '#FF0DFF' },
      { label: '3 GIRO', color: '#E80C7A' },
      { label: '4 GIRO', color: '#FF07A8' },
      { label: '5 GIRO', color: 'black' },
    ]
  },

  data: [
    { key: '0', exhibition: 'Quem comprou este produto também comprou:', products: [] },
    { key: '1', exhibition: 'Chinelos femininos mais vendidos:', products: [] },
  ],

  openDetail: false,

  ponteiroProduto: ['', ''],

  // KnowMore
  currentContent: galleries[0][0],
  horizontalPointer: 0,
  horizontalGallery: galleries[0],
  currentInfo: 'Mídias',
  infoPointer: 0,
  buttons: [
    {
      icon: '7',
      isChosen: true,
      hasGallery: true,
      hasImageLoad: true,
      gallery: galleries[0],
      name: 'Mídias',
      // style:{marginLeft:10}
    },
    {
      icon: ',',
      isChosen: false,
      name: 'Percentuais de Cores',
      style: { marginLeft: 3 }
    },
    {
      icon: '&',
      isChosen: false,
      hasGallery: true,
      hasImageLoad: true,
      gallery: galleries[2],
      name: 'Acessórios',
      style: { marginLeft: 6 }
    },
    {
      icon: 'U',
      isChosen: false,
      hasGallery: true,
      hasImageLoad: true,
      gallery: galleries[3],
      name: 'MPVs',
      style: { marginLeft: 12 }
    },
    {
      icon: ';',
      isChosen: false,
      name: 'Especificações Ténicas',
      style: { marginLeft: 12 }
    },
  ],
  leftArrow: true,
  rightArrow: false,
  isPanelVisible: false,
  pointerPanel: 0,


  panel: {
    isVisible: false,
    title: '',
    icon: '',
  },
  panels: [
    {
      id: 0,
      icon: 'p',
      title: 'LISTA DE CARRINHOS',
    },
  ]
};

export default (state = INITIAL_STATE, action) => {
  // console.log('PRODUCT', action.type);
  switch (action.type) {
    case 'set_product': {
      const product = action.payload;
      return { ...state, product };
    }
    case 'current_box': {
      let { horizontalPointer } = state;
      const { index } = action;
      if (action.current) {
        return {
          ...state,
          horizontalPointer: index,
          rightArrow: index === state.horizontalGallery.length - 1,
          leftArrow: index === 0,
          currentContent: state.horizontalGallery[index],
        };
      }

      // Se for para a direita, adicionaremos ao ponteiro horizontal
      if (action.right) {
        const rightBoundary = horizontalPointer + 2 >= state.horizontalGallery.length;
        horizontalPointer += 1;
        // Verifica se o ponteiro horizontal bate vai ficar fora dos limites do tamanho da lista horizontal
        if (rightBoundary) {
          return {
            ...state,
            horizontalPointer,
            rightArrow: true,
            leftArrow: false,
            currentContent: state.horizontalGallery[horizontalPointer],
          };
        }

        return {
          ...state,
          horizontalPointer,
          rightArrow: false,
          leftArrow: false,
          currentContent: state.horizontalGallery[horizontalPointer],
        };
      }
      horizontalPointer -= 1;
      // Quando o ponteiro horizontal ficar fora dos limites do tamanho da lista horizontal para a esqurda
      const leftBoundary = horizontalPointer - 1 < 0;
      if (leftBoundary) {
        return {
          ...state,
          horizontalPointer,
          rightArrow: false,
          leftArrow: true,
          currentContent: state.horizontalGallery[horizontalPointer],
        };
      }

      // console.log('Current Object', state.horizontalGallery[horizontalPointer]);
      return {
        ...state,
        horizontalPointer,
        rightArrow: false,
        leftArrow: false,
        currentContent: state.horizontalGallery[horizontalPointer],
      };
    }
    case 'current_info': {
      const { index } = action;
      // Label atual
      const currentInfo = state.buttons[index].name;
      const buttons = state.buttons.map((button, indexBtn) => {
        if (index === indexBtn) {
          return { ...button, isChosen: true };
        }
        if (button.isChosen) return { ...button, isChosen: false };
        return button;
      });

      if (galleries[index] !== undefined) {
        return {
          ...state,
          buttons,
          currentInfo,
          infoPointer: index,
          horizontalGallery: galleries[index],
          currentContent: galleries[index][0],
        };
      }

      return {
        ...state,
        buttons,
        currentInfo,
        infoPointer: index,
        horizontalGallery: galleries[index],
      };
    }
    case 'reset_arrows': {
      return {
        ...state,
        leftArrow: INITIAL_STATE.leftArrow,
        rightArrow: INITIAL_STATE.rightArrow,
        horizontalPointer: INITIAL_STATE.horizontalPointer,
      };
    }
    case 'reset_page_product': {
      return {
        ...state,
        infoPointer: INITIAL_STATE.infoPointer,
        horizontalPointer: INITIAL_STATE.horizontalPointer,
        horizontalGallery: galleries[0],
        currentContent: galleries[0][0],
        buttons: INITIAL_STATE.buttons,
      };
    }
    case 'toggle_panel_product': {
      return {
        ...state,
        isPanelVisible: !state.isPanelVisible,
        pointerPanel: action.pointer || state.pointerPanel,
      };
    }
    case 'set_panel_product': {
      let panel = { ...state.panels[action.pointer] };
      if (action.panel) panel = { ...panel, isVisible: true, ...action.panel, };
      return {
        ...state,
        panelPointer: action.pointer,
        panel,
      };
    }
    case 'toggle_panel_product_c': {
      return {
        ...state,
        panel: {
          ...state.panel,
          isVisible: !state.panel.isVisible
        }
      };
    }
    default:
      return state;
  }
};
