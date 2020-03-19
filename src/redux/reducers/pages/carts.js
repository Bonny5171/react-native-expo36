import { CARTS_TOGGLE_LIST, CARTS_TOGGLE_SORT, CART_RESET_PAGE, CARTS_RESET_BUTTONS } from '../../actions/pages/carts';

const INITIAL_STATE = {
  // True = BOX, false = GRID
  listType: true,
  list: true,
  sort: [
    {
      name: 'name',
      isChosen: true,
      order: true,
    },
    {
      name: 'sector',
      isChosen: false,
      order: false,
    },
    {
      name: 'order',
      isChosen: false,
      order: false,
    },
    {
      name: 'status',
      isChosen: false,
      order: false,
    },
    {
      name: 'dtStatus',
      isChosen: false,
      order: false,
    },
    {
      name: 'total',
      isChosen: false,
      order: false,
    },
    {
      name: 'data',
      isChosen: false,
      order: false,
    },
    {
      name: 'cliente',
      isChosen: false,
      order: false,
    },
    {
      name: 'prevEmbarque',
      isChosen: false,
      order: false,
    },
  ],
  popUpFilter: [
    {
      current: '',
      name: 'dropSituacao',
      desc: 'situação',
      isChosen: false
    },
    {
      current: '',
      name: 'dropSetor',
      desc: 'setor',
      isChosen: false
    },
    {
      current: '',
      name: 'textName',
      desc: 'busca',
      isChosen: false
    },
    {
      current: '',
      name: 'textPositivacaoDe',
      desc: 'positivação de',
      isChosen: false
    },
    {
      current: '',
      name: 'textPositivacaoAte',
      desc: 'positivação até',
      isChosen: false
    },
    {
      current: '',
      name: 'dropTabelaDePreco',
      desc: 'tabela de preço',
      isChosen: false
    },
    {
      current: '',
      name: 'dropClients',
      desc: 'clientes',
      isChosen: false
    },
    {
      current: '',
      name: 'dropStatus',
      desc: 'status',
      isChosen: false
    },
  ],  
  data: [],
  buttons: [
    {
      name: 'sortPopUp',
      isChosen: false,
    },
    {
      name: 'sortCode',
      isChosen: false,
    },
    {
      name: 'copy',
      isChosen: false,
    },
    {
      name: 'delete',
      isChosen: false,
    },
  ],
  isResultFinder: false,
  panel: {
    isVisible: false,
    title: '',
    icon: ''
  },
  panels: [
    {
      id: 0,
      icon: 'l',
      title: 'FILTROS DE BUSCA',
    },
    {
      id: 1,
      icon: 'f',
      title: 'ÁREA DE TRANSFERÊNCIA',
      panelWidth: 400
    },
  ],
  panelPointer: 0,
  cartsCopy: [],
  clientCopy: [],
  filterBranches: [false, false],
  carts: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case 'set_cars_na_lista': {
    return { ...state, carts: action.carts };
  }
  case 'add_copy_cart': {
    return { ...state, cartsCopy: [...state.cartsCopy, action.cart], };
  }
  case 'remove_copy_cart': {
    return { ...state, cartsCopy: state.cartsCopy.filter(c => c.key !== action.cart.key) };
  }
  case 'reset_copy_cart': {
    return { ...state, cartsCopy: INITIAL_STATE.cartsCopy };
  }
  case 'add_cliente_copy': {
    return { ...state, clientCopy: [...state.clientCopy, action.client] };
  }
  case 'remove_cliente_copy': {
    return { ...state, clientCopy: state.clientCopy.filter(c => c.key !== action.client.key) };
  }
  case 'reset_cliente_copy': {
    return { ...state, clientCopy: INITIAL_STATE.clientCopy };
  }
  case CARTS_TOGGLE_LIST: {
    return {
      ...state,
      listType: !state.listType,
    };
  }
  case CARTS_TOGGLE_SORT: {
    const sort = updateIsChosen(action.name, state.sort);
    return {
      ...state,
      sort,
    };
  }
  case CART_RESET_PAGE:  {
    return INITIAL_STATE;
  }
  case 'update_carts_popup': {
    const buttons = toggleIsChosen(action.name, state.buttons);
    return { ...state, buttons };
  }
  case 'update_carts_dropdown': {
    const dropDowns = toggleIsChosen(action.name, state.popUpFilter);
    return { ...state, popUpFilter: dropDowns };
  }
  case 'update_carts_sort': {
    const sort = updateIsChosen(action.name, state.sort);
    return { ...state, sort };
  }
  case 'update_current_carts': {
    const property = action.isPanel ? 'panelFilter' : 'popUpFilter';
    const filters = toggleOption(action.name, action.newCurrent, state[property]);
    return { ...state, [property]: [...filters] };
  }
  case 'update_list': {
    return { ...state, list: !state.list };
  }
  case CARTS_RESET_BUTTONS: {
    return {
      ...state,
      buttons: INITIAL_STATE.buttons
    };
  }
  case 'update_carts_list': {
    return { ...state, list: !state.list };
  }
  case 'update_base': {
    return { ...state, data: [...action.clients], initialData: [...action.clients] };
  }
  case 'set_popup_filter_carts': {
    const { name, options } = action;
    const panelFilter = [];
    const popUpFilter = state.popUpFilter.map(filter => {
      if (filter.name === name) {
        filter.options = options;
      }
      panelFilter.push({ ...filter });
      return filter;
    });

    return {
      ...state,
      popUpFilter,
      panelFilter,
      initialPopUpFilter: [...state.popUpFilter],
    };
  }
  case 'set_panel_carts': {
    let panel = { ...state.panels[action.pointer] };
    if (action.panel) panel = { ...panel, isVisible: true, ...action.panel, };
    return { ...state, panelPointer: action.pointer, panel };
  }
  case 'toggle_panel_carts': {
    return { ...state, panel: { ...state.panel, isVisible: !state.panel.isVisible } };
  }
  case 'close_modals_carts': {
    const buttons = state.buttons.map(button => ({ ...button, isChosen: false }));
    return {
      ...state,
      buttons,
      panel: { ...state.panel, isVisible: false },
    };
  }
  case 'set_filter_stack_carts': {
    const { operator, pointerFilter } = action;
    const panelFilter = [...state.panelFilter];
    const filter = { ...panelFilter[pointerFilter] };

    filter.currStack = operator === 'add' ? filter.currStack + 1 : filter.currStack - 1;
    panelFilter[pointerFilter] = filter;

    return { ...state, popUpFitler: [...panelFilter], panelFilter };
  }
  case 'copy_panel_filter_carts': {
    return { ...state, popUpFilter: [...state.panelFilter] };
  }
  case 'set_result_finder_carts': {
    const { isResultFinder } = action;
    return { ...state, isResultFinder };
  }
  case 'update_dropdown_remove_item_carts': {
    const { popUpFilter } = state;
    const { filter } = action;

    const novoPopUpFilter = popUpFilter.map(pp => {
      if (filter === pp.name) {
        return { ...pp, current: '' };
      }
      return pp;
    });

    const isResultFinder = novoPopUpFilter
      .findIndex(filtro => filtro.current.length > 0) !== -1;

    return { ...state, popUpFilter: novoPopUpFilter, isResultFinder, panelFilter: [...novoPopUpFilter] };
  }
  case 'update_dropdown_remove_all_carts': {
    return {
      ...state,
      popUpFilter: state.initialPopUpFilter,
      panelFilter: [...state.initialPopUpFilter],
    };
  }
  default:
    return state;
  }
};

const toggleIsChosen = (name, components) => {
  const updatedComponents = components.map(c => {
    if (c.isChosen || c.name === name) {
      return { ...c, isChosen: !c.isChosen };
    }
    return c;
  });
  return updatedComponents;
};

const updateIsChosen = (name, components) => {
  const updatedComponents = components.map(sort => {
    const newSort = { ...sort };
    if (sort.isChosen && sort.name !== name) {
      return { ...newSort, isChosen: false };
    } else if (sort.name === name) {
      if (sort.order !== undefined) {
        return { ...newSort, isChosen: true, order: !sort.order };
      }
      return { ...newSort, isChosen: true };
    }

    return sort;
  });
  return updatedComponents;
};

const toggleOption = (name, newCurrent, array) => {
  const updatedCurrent = array.map((option) => {
    if (option.name === name) {
      return { ...option, current: option.current === newCurrent ? '' : newCurrent };
    }
    return option;
  });

  return updatedCurrent;
};