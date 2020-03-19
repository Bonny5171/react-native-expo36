import { radioCheck, toggleCheck, toggleFlagG } from './common/functions';

const INITIAL_STATE = {
  shippingCheck: [true, false],
  productsCheck: [false, false, false, false, false],
  barCodesCheck: [false, false, false, false],
  products: ['macro pedido', 'mini pedidos', 'grades', 'imagens', 'NCM'],
  barCodes: ['Produto (EAN-13)', 'Produto/Cor/Número (EAN-13)', 'Produto/Cor (EAN-13)', 'Produto/Cor/Grade (Dun 14)'],
  // Informações selecionadas
  shipTo: null,
  sProducts: [],
  sBarCodes: [],
  // Fechamento
  form: {
    ordemCompra: '',
    preData: '',
    condPag: '',
    // periodoEntrega
    de: '',
    a: '',
    // fim
    reposicao: '',
    prazoAdd: '',
    descontoAdd: '',
    observacoes: '',
  },

  reposicao: true,
  condPag: false,
  condPagOptions: [
    '11428',
    '12856',
    '1428',
    '14284',
    '14284256',
    '1470',
    '21',
    '2124',
    '24739',
    '2689',
    '38'
  ],

  stores: [],

  panel: {
    isVisible: false,
    title: '',
    icon: '',
  },
  panelPointer: 0,
  // A ordem dos paineis está sendo usada nas chamadas da função acSetPanel,
  // Existentes no Item.js, então cautela verifique os números passados e não altere a ordem
  panels: [
    {
      id: 0,
      title: 'CROSSDOCKING',
      icon: 'X',
    },
    {
      id: 1,
      title: 'DEFINA O PRAZO ADICIONAL',
      icon: 'e',
    },
    {
      id: 2,
      title: 'DEFINA O EMBALAMENTO',
      icon: 'P',
    },
    {
      id: 3,
      title: 'DEFINA GRADES/LOJA',
      icon: '',
    },
    {
      id: 4,
      title: 'PENDÊNCIAS',
      icon: 'q',
    },
    {
      id: 5,
      title: 'X GRADES DISPONÍVEIS',
      icon: '§'
    },
    {
      id: 6,
      title: 'X CORES DISPONÍVEIS',
      icon: 'y'
    },
    {
      id: 7,
      title: 'LISTA DE CARRINHOS',
      icon: 'p',
    },
    {
      id: 8,
      title: 'CONDIÇÃO DE PAGAMENTO',
      icon: 'a',
    },
    {
      id: 9,
      title: 'DEFINA O DESCONTO',
      icon: 'e',
    },
    {
      id: 10,
      icon: 'f',
      title: 'ÁREA DE TRANSFERÊNCIA',
      panelWidth: 400
    },
    {
      id: 11,
      icon: '´',
      title: 'BUSCAR PRODUTO',
      panelWidth: 400
    },
  ],
  isPanelDescontosVisible: false,
  embalamentos: [],
  cartuchoRule: false,
  dropdowns: {
    embalamentos: false,
  },
  currentProduct: null,
  currentCor: null,
  pointerAcordeon: null,
  menuButtons: [false, false, false],
  sortButtons: [
    {
      id: 0,
      label: 'nome',
      prop: 'name',
      isAscendant: true,
      isActive: true
    },
    {
      id: 1,
      label: 'código',
      prop: 'code',
      isAscendant: false,
      isActive: false
    },
    {
      id: 2,
      label: 'segmento',
      prop: 'segment',
      isAscendant: false,
      isActive: false
    },
    {
      id: 3,
      label: 'data',
      prop: 'createdAt',
      isAscendant: false,
      isActive: false
    }
  ],
  isOrderReady: false,

  preDataVisible: false,
  periodoDeEntregaVisible: false,
  modelCopy: [],
  cartsCopy: [],
  selectAllProducts: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'add_to_cart': {
      return { ...state, cartsCopy: [...state.cartsCopy, action.cart], };
    }
    case 'remove_to_cart': {
      return { ...state, cartsCopy: state.cartsCopy.filter(c => c.key !== action.cart.key) };
    }
    case 'reset_to_cart': {
      return { ...state, cartsCopy: INITIAL_STATE.cartsCopy };
    }
    case 'add_model_copy': {
      return { ...state, modelCopy: [...state.modelCopy, action.model] };
    }
    case 'remove_model_copy': {
      return { ...state, modelCopy: state.modelCopy.filter(c => c.code !== action.model.code) };
    }
    case 'reset_model_copy': {
      return { ...state, modelCopy: INITIAL_STATE.modelCopy };
    }
    case 'set_vibilidade__calendario_predata': {
      return { ...state, preDataVisible: action.preDataVisible };
    }
    case 'set_vibilidade__calendario_previsao_entrega': {
      return { ...state, periodoDeEntregaVisible: action.periodoDeEntregaVisible };
    }

    case 'choose_address': {
      const shippingCheck = radioCheck(action.index, state.shippingCheck);
      return { ...state, shipTo: action.infos, shippingCheck };
    }
    case 'choose_products': {
      const { index } = action;
      const productsCheck = toggleCheck(index, state.productsCheck);
      const sProducts = shiftFromArray(state.sProducts, state.products, index);
      return { ...state, productsCheck, sProducts };
    }
    case 'choose_bar_codes': {
      const barCodesCheck = toggleCheck(action.index, state.barCodesCheck);
      const sBarCodes = shiftFromArray(state.sBarCodes, state.barCodes, action.index);
      return { ...state, barCodesCheck, sBarCodes };
    }
    case 'update_form': {
      const { field, payload, shdClearField } = action;
      const form = { ...state.form };
      form[field] = shdClearField ? '' : payload;

      return { ...state, form };
    }
    case 'toggle_property': {
      const { property } = action;
      return { ...state, [property]: !state[property] };
    }
    case 'add_stores_cart': {
      const stores = [];
      action.stores.map((dStore, index) => {
        const previousStore = action.stores[index - 1];
        const store = previousStore !== undefined ? previousStore : store;
        if (dStore.isChosen && store !== undefined) stores.push(store);
        if (dStore.headquarter && dStore !== undefined) stores.push(dStore);
      });

      if (action.stores[1] !== undefined) {
        if (action.stores[0].name === action.stores[1].name) {
          stores.shift();
        }
      }

      return { ...state, stores };
    }
    case 'set_panel_cart': {
      let panel = { ...state.panel, ...state.panels[action.pointer] };
      if (action.panel) panel = { ...panel, ...action.panel, isVisible: true };
      return { ...state, panelPointer: action.pointer, panel };
    }
    case 'toggle_panel_cart': {
      return { ...state, panel: { ...state.panel, isVisible: !state.panel.isVisible } };
    }
    case 'toggle_pop_cart_condicao_pagamento': {
      return { ...state, isPanelDescontosVisible: !state.isPanelDescontosVisible };
    }
    case 'set_embalamentos': {
      return { ...state, embalamentos: action.embalamentos };
    }
    case 'toggle_cartucho_rule': {
      return { ...state, cartuchoRule: !state.cartuchoRule };
    }
    case 'reset_pops_cart': {
      return { ...state, panel: { ...state.panel, isVisible: false }, menuButtons: INITIAL_STATE.menuButtons };
    }
    case 'current_product_cart': {
      if (action.product && action.currentCor) {
        return {
          ...state,
          currentProduct: action.product,
          colors: action.product.colors,
          currentCor: action.currentCor,
        };
      }
      return { ...state, currentProduct: action.product };
    }
    case 'current_accordeon': {
      return { ...state, pointerAcordeon: action.pointerAcordeon };
    }
    case 'toggle_menu_btn_cart': {
      const menuButtons = [...state.menuButtons];
      menuButtons[action.id] = !menuButtons[action.id];
      return { ...state, menuButtons };
    }
    case 'toggle_sort_btn_cart': {
      const { id } = action;
      const sortButtons = state.sortButtons.map(btn => {
        const sameBtnClicked = btn.id === id;
        //  Se o botão estiver ativo e for clicado novamente, só muda a orientação da ordem
        if (btn.isActive && sameBtnClicked) {
          return { ...btn, isAscendant: !btn.isAscendant };
        } else if (btn.isActive && !sameBtnClicked) {
          return { ...btn, isActive: false };
        } else if (btn.id === id) {
          return { ...btn, isActive: true };
        }
        return btn;
      });
      return { ...state, sortButtons };
    }
    case 'set_form': {
      const form = { ...state.form, ...action.form };
      // console.log('state.form', state.form);
      // console.log('form', form);
      return { ...state, form };
    }
    case 'check_form_state': {
      let isFechamentoDone = true;
      Object.keys(state.form).forEach(e => {
        if (state.form[e] === '' && e !== 'ordemCompra' && e !== 'observacoes') {
          isFechamentoDone = false;
        }
      });
      return { ...state, isFechamentoDone };
    }
    case 'check_pendencies': {
      const { products, shouldUpdatePanel } = action;
      // Somatório para verificar se tem algum dado faltando
      // Se o retorno for maior que 0, algum dado está nulo
      let checkSum = 0;
      if (products.length === 0) checkSum += 1;
      checkSum += containsNull(products, 'ref2');
      checkSum += containsNull(products, 'ref3');
      checkSum += containsNull(products, 'ref4');
      // checkSum += containsNull(products, 'prazo');
      // checkSum += products.filter(p => p.ref2 === null).length;
      checkSum += containsNull(products, 'quantity');
      // console.log('checkSum, state.isFechamentoDone', checkSum, state.isFechamentoDone, state.form);
      if (checkSum > 0 || !state.isFechamentoDone) {
        if (shouldUpdatePanel) {
          return {
            ...state,
            panel: { isVisible: action.shouldOpenPanel, ...state.panels[4] },
            panelPointer: 4,
            isOrderReady: false,
          };
        }

        return {
          ...state,
          isOrderReady: false,
        };
      }

      return { ...state, isOrderReady: true };
    }
    case 'reset_page_cart': {
      return {
        ...state,
        sortButtons: INITIAL_STATE.sortButtons
      };
    }
    case 'select_all_model_inCar': {
      const modelCopy = [];

      if (!state.selectAllProducts) {
        action.products.forEach(p => {
          modelCopy.push(p);
        });
      }

      return {
        ...state,
        selectAllProducts: !state.selectAllProducts,
        modelCopy
      };
    }
    case 'remove_select_all_model_inCar': {
      return {
        ...state,
        selectAllProducts: INITIAL_STATE.selectAllProducts,
        modelCopy: INITIAL_STATE.modelCopy
      };
    }
    default:
      return state;
  }
};

const shiftFromArray = (oldArray, content, position) => {
  const array = [...oldArray];
  const isChecked = array[position];
  const arrayPosition = array.indexOf(content[position]);
  if (isChecked) {
    array.push(array[position]);
  } else if (arrayPosition !== -1) {
    array.splice(arrayPosition, 1);
  }
  return array;
};

const containsNull = (array, property) => {
  return array.filter(o => o[property] === null || o[property] === '').length;
};