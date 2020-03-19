import { ORDERS_TOGGLE_LIST, ORDERS_TOGGLE_SORT, ORDER_RESET_PAGE, ORDERS_RESET_PAGE, ORDERS_RESET_BUTTONS } from '../../actions/pages/orders';
import { updateIsChosen } from './clients';

const INITIAL_STATE = {
  // True = BOX, false = GRID
  listType: true,
  sort: [
    {
      name: 'codigo',
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
  buttons: [
    {
      name: 'sortPopUp',
      isChosen: false,
    },
    {
      name: 'sortCode',
      isChosen: false,
    },
  ],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case ORDERS_TOGGLE_LIST: {
    return {
      ...state,
      listType: !state.listType,
    };
  }
  case ORDERS_TOGGLE_SORT: {
    const sort = updateIsChosen(action.name, state.sort);
    return {
      ...state,
      sort,
    };
  }
  case ORDERS_RESET_PAGE:  {
    return INITIAL_STATE;
  }
  case ORDERS_RESET_BUTTONS: {
    return { ...state, buttons: INITIAL_STATE.buttons };
  }
  case 'update_orders_popup': {
    const buttons = toggleIsChosen(action.name, state.buttons);
    return { ...state, buttons };
  }
  case 'update_orders_dropdown': {
    const dropDowns = toggleIsChosen(action.name, state.popUpFilter);
    return { ...state, popUpFilter: dropDowns };
  }
  case 'update_orders_sort': {
    const sort = updateIsChosen(action.name, state.sort);
    return { ...state, sort };
  }
  // case 'update_orders_current': {
  //   const property = action.isPanel ? 'panelFilter' : 'popUpFilter';
  //   const filters = toggleOption(action.name, action.newCurrent, state[property]);
  //   return { ...state, [property]: [...filters] };
  // }
  case 'update_orders_list': {
    return { ...state, list: !state.list };
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