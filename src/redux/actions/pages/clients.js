export const acUpdateComponent = (type, name) => {
  return {
    type: 'update_' + type,
    name
  };
};

export const acUpdateCurrent = (name, newCurrent, isPanel) => {
  return {
    type: 'update_current',
    name,
    newCurrent,
    isPanel,
  };
};

export const acUpdateList = () => {
  return {
    type: 'update_list'
  };
};

export const acFilterList = (data) => {
  return {
    type: 'filter_list_clientes',
    data
  };
};

export const acCurrentClient = (previous, client, next, pointers, onlyOne) => {
  // console.log('action - previous', previous);
  // console.log('action - next', next);
  return {
    type: 'current_client',
    previous, // Object contendo os nomes do anterior e um antes do anterior
    client, // Object
    next, // Object contendo os nomes do próximo e um depois do próximo
    pointers, // Ponteiro que salva o ponteiro do cliente anterior e o seguinte do resultado da lista de clientes
    onlyOne,
  };
};

export const acNextClient = (nextClient) => {
  return {
    type: 'next_client',
    nextClient,
  };
};

export const acPreviousClient = (previousClient) => {
  return {
    type: 'previous_client',
    previousClient
  };
};

export const acSortList = (type, name) => {
  return {
    type: 'sort_list',
    name
  };
};

export const acSetClients = (clients) => {
  return {
    type: 'update_base',
    clients
  };
};

export const acUpdateCurrentRemoveItem = (filter) => {
  return {
    type: 'update_dropdown_remove_item_clients',
    filter,
  };
};

export const acUpdateCurrentRemoveAll = () => {
  return {
    type: 'update_dropdown_remove_all_client',
  };
};

export const acSetResultFinder = (isResultFinder) => {
  return {
    type: 'set_result_finder_clients',
    isResultFinder
  };
};

export const acCloseClientModals = () => {
  return {
    type: 'close_modals_clients'
  };
};

export const acSetPanel = (pointer, panel) => {
  return {
    type: 'set_panel_clients',
    pointer,
    panel
  };
};

export const acTogglePanel = () => {
  return {
    type: 'toggle_panel_clients'
  };
};

export const acCopyPanelFilter = () => {
  return {
    type: 'copy_panel_filter_clients'
  };
};

export const acSetPopUpFilter = (name, options) => {
  return {
    type: 'set_popup_filter_clients',
    name,
    options
  };
};


export const acSetFilterStack = (operator, pointerFilter) => {
  return {
    type: 'set_filter_stack_clients',
    operator,
    pointerFilter,
  };
};


export const acClearPanelFilters = () => {
  return {
    type: 'clear_panel_filters_clients'
  };
};

export const acResetPage = () => {
  return {
    type: 'reset_page_clients'
  };
};