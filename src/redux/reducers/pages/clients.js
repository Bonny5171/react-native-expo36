import { updateCurrent, toggleOption } from './common/functions';

const INITIAL_STATE = {
  initialPopUpFilter: [],

  // True = Lista em Box, False = Lista em Grid
  list: true,

  // Cliente anterior, atual e seguinte para a navegação
  previous: null,
  previousId: null,
  client: null,
  next: null,
  nextId: null,

  buttons: [
    {
      name: 'sortPopUp',
      isChosen: false,
    },
    {
      name: 'filterPopUp',
      isChosen: false,
    },
  ],

  sort: [
    {
      name: 'sortCliente',
      isChosen: false
    },
    {
      name: 'sortCode',
      isChosen: false,
      // False = decresente, True = Ascendente
      order: false,
    },
    {
      name: 'sortName',
      isChosen: true,
      order: true,
    },
    {
      name: 'sortSetor',
      isChosen: false,
      order: false,
    },
    {
      name: 'sortStatus',
      isChosen: false,
      order: false,
    },
    {
      name: 'sortPontual',
      isChosen: false,
      order: false,
    },
    {
      name: 'sortEncarte',
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
  ],

  data: [],

  // define se status é resultado de um filtro.
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
  ],
  panelPointer: 0,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'set_result_finder_clients': {
      const { isResultFinder } = action;
      return { ...state, isResultFinder };
    }
    case 'update_popup': {
      const buttons = toggleIsChosen(action.name, state.buttons);
      return { ...state, buttons };
    }
    case 'update_dropdown': {
      const dropDowns = toggleIsChosen(action.name, state.popUpFilter);
      return { ...state, popUpFilter: dropDowns };
    }
    case 'update_sort': {
      const sort = updateIsChosen(action.name, state.sort);
      return { ...state, sort };
    }
    case 'update_current': {
      const property = action.isPanel ? 'panelFilter' : 'popUpFilter';
      const filters = toggleOption(action.name, action.newCurrent, state[property]);
      return { ...state, [property]: [...filters] };
    }
    case 'update_list': {
      return { ...state, list: !state.list };
    }
    case 'filter_list_clientes': {
      const { data } = action;
      const buttons = [
        { name: 'sortPopUp', isChosen: false },
        { name: 'filterPopUp', isChosen: false },
      ];
      return { ...state, buttons, data };
    }
    case 'current_client': {
      const { client, pointers } = action;
      let { previous, next } = action;
      // Se o anteior é nulo, o ponteiro
      if (previous === null) {
        const lastIndex = state.data.length - 1;
        previous = state.data[lastIndex];
        pointers.previous = lastIndex - 1;
      }

      if (next === null) {
        next = state.data[0];
        pointers.next = 0;
      }
      // console.log('pointers', pointers);
      // console.log('previous', previous);
      // console.log('client', client);
      // console.log('next', next);
      return {
        ...state,
        previous,
        previousPointer: pointers.previous - 1,
        client,
        next,
        nextPointer: pointers.next + 1,
      };
    }
    case 'next_client': {
      // Atualiza o cliente anterior com o atual
      const previous = state.client;
      const previousPointer = state.previousPointer + 1;
      // console.log('previousPointer', previousPointer);
      // Pega o cliente atual(atualizado) na posição e o próximo
      const client = action.nextClient;
      // Pega o próximo cliente
      // console.log('RED NEW CURRENT', action.nextClient);
      let nextPointer = state.nextPointer + 1;
      if (nextPointer > state.data.length - 1) nextPointer = 0;
      // console.log('nextPointer', nextPointer);
      const next = state.data[nextPointer];

      return {
        ...state,
        previous,
        previousPointer,
        client,
        next,
        nextPointer,
      };
    }
    case 'previous_client': {
      let previousPointer = state.previousPointer - 1;
      let nextPointer = state.nextPointer - 1;
      if (previousPointer < 0 || previousPointer > state.data.length - 1) {
        previousPointer = state.data.length - 1;
        nextPointer = 0;
      } else if (nextPointer === -1) nextPointer = state.data.length - 1;
      // console.log('previousPointer', previousPointer, nextPointer, state.nextPointer);
      const previous = state.data[previousPointer];
      const client = action.previousClient;
      let next = state.data[nextPointer];

      if (next.fantasyName === client.fantasyName) {
        nextPointer += 1;
        if (nextPointer >= state.data.length) nextPointer = 0;
        next = state.data[nextPointer];
      }

      return {
        ...state,
        previous,
        previousPointer,
        client,
        next,
        nextPointer,
      };
    }
    case 'update_base': {
      // console.log('UPDATE BASE');
      return { ...state, data: [...action.clients], initialData: [...action.clients] };
    }

    case 'update_dropdown_remove_item_clients': {
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
    case 'update_dropdown_remove_all_client': {
      return {
        ...state,
        popUpFilter: state.initialPopUpFilter,
        panelFilter: [...state.initialPopUpFilter],
      };
    }
    case 'close_modals_clients': {
      const buttons = state.buttons.map(button => ({ ...button, isChosen: false }));
      return {
        ...state,
        buttons,
        panel: { ...state.panel, isVisible: false },
      };
    }
    case 'set_panel_clients': {
      let panel = { ...state.panels[action.pointer] };
      if (action.panel) panel = { ...panel, isVisible: true, ...action.panel, };
      return { ...state, panelPointer: action.pointer, panel };
    }
    case 'toggle_panel_clients': {
      return { ...state, panel: { ...state.panel, isVisible: !state.panel.isVisible } };
    }
    case 'copy_panel_filter_clients': {
      return { ...state, popUpFilter: [...state.panelFilter] };
    }
    case 'set_popup_filter_clients': {
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
    case 'set_filter_stack_clients': {
      const { operator, pointerFilter } = action;
      const panelFilter = [...state.panelFilter];
      const filter = { ...panelFilter[pointerFilter] };

      filter.currStack = operator === 'add' ? filter.currStack + 1 : filter.currStack - 1;
      panelFilter[pointerFilter] = filter;

      return { ...state, popUpFitler: [...panelFilter], panelFilter };
    }
    case 'clear_panel_filters_clients': {
      return { ...state, panelFilter: [...state.initialPopUpFilter] };
    }
    case 'reset_page_clients': {
      return { ...state,
        popUpFilter: state.initialPopUpFilter,
        panelFilter: [...state.initialPopUpFilter],
        sort: INITIAL_STATE.sort,
        buttons: INITIAL_STATE.buttons,
        list: INITIAL_STATE.list,
      };
    }
    default:
      return state;
  }
};

const filtar = (filters, data) => {
  const {
    name,
    situation,
    sector,
    positivacao,
    code,
  } = filters;
  let dataFilter = Object.assign([], data);
  if (name) dataFilter = dataFilter.filter((el) => el.fantasyName.toLowerCase().includes(name.toLowerCase()));
  if (name) dataFilter = dataFilter.filter((el) => el.fantasyName.toLowerCase().indexOf(name.toLowerCase()) > -1);
  if (situation) dataFilter = dataFilter.filter((el) => el.situation === situation);
  if (sector) dataFilter = dataFilter.filter((el) => el.sector === sector);
  if (code) dataFilter = dataFilter.filter((el) => el.code === code);
  if (positivacao !== undefined) {
    if (positivacao.de) {
      dataFilter = dataFilter.filter((el) => {
        const key = parseInt(el.key, 0);
        const de = parseInt(positivacao.de, 0);
        if (de && key) {
          return de <= key;
        }
        return false;
      });
    }
    if (positivacao.a) {
      dataFilter = dataFilter.filter((el) => {
        const key = parseInt(el.key, 0);
        const a = parseInt(positivacao.a, 0);
        if (a && key) {
          return a >= key;
        }
        return false;
      });
    }
  }
  return dataFilter;
};

export const updateIsChosen = (name, components) => {
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

const toggleIsChosen = (name, components) => {
  const updatedComponents = components.map(c => {
    if (c.isChosen || c.name === name) {
      return { ...c, isChosen: !c.isChosen };
    }
    return c;
  });
  return updatedComponents;
};