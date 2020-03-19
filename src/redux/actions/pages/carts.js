export const CARTS_TOGGLE_LIST = 'toggle_list_carts';
export const CARTS_TOGGLE_SORT = 'toggle_sort_carts';
export const CART_RESET_PAGE = 'reset_page_carts';
export const CARTS_RESET_BUTTONS = 'reset_buttons_carts';

export const acToggleListCarts = () => ({
  type: CARTS_TOGGLE_LIST,
});

export const acResetPageCarts = () => ({
  type: CART_RESET_PAGE,
});

export const acResetButtonsCarts = () => ({
  type: CARTS_RESET_BUTTONS,
});

export const acToggleSortCarts = (name) => ({
  type: CARTS_TOGGLE_SORT,
  name
});

export const acUpdateComponent = (type, name) => {
  return {
    type: 'update_carts_' + type,
    name
  };
};

export const acSetPopUpFilter = (name, options) => {
  return {
    type: 'set_popup_filter_carts',
    name,
    options
  };
};

export const acSetPanel = (pointer, panel) => {
  return {
    type: 'set_panel_carts',
    pointer,
    panel
  };
};

export const acTogglePanel = () => {
  return {
    type: 'toggle_panel_carts'
  };
};

export const acUpdateCurrent = (name, newCurrent, isPanel) => {
  return {
    type: 'update_current_carts',
    name,
    newCurrent,
    isPanel,
  };
};

export const acCloseClientModals = () => {
  return {
    type: 'close_modals_carts'
  };
};

export const acSetFilterStack = (operator, pointerFilter) => {
  return {
    type: 'set_filter_stack_carts',
    operator,
    pointerFilter,
  };
};

export const acCopyPanelFilter = () => {
  return {
    type: 'copy_panel_filter_carts'
  };
};

export const acSetResultFinder = (isResultFinder) => {
  return {
    type: 'set_result_finder_carts',
    isResultFinder
  };
};


export const acUpdateCurrentRemoveItem = (filter) => {
  return {
    type: 'update_dropdown_remove_item_carts',
    filter,
  };
};

export const acUpdateCurrentRemoveAll = () => {
  return {
    type: 'update_dropdown_remove_all_carts',
  };
};

export const acAddCopyCart = (cart) => {
  return {
    type: 'add_copy_cart',
    cart,
  };
};

export const acRemoveCopyCart = (cart) => {
  return {
    type: 'remove_copy_cart',
    cart,
  };
};

export const acResetCopyCart = () => {
  return {
    type: 'reset_copy_cart',
  };
};

export const acAddCopyClient = (client) => {
  return {
    type: 'add_cliente_copy',
    client,
  };
};

export const acRemoveCopyClient = (client) => {
  return {
    type: 'remove_cliente_copy',
    client,
  };
};

export const acResetCopyClient = (client) => {
  return {
    type: 'reset_cliente_copy',
    client,
  };
};

export const acSetCartsList = (carts) => {
  return {
    type: 'set_cars_na_lista',
    carts,
  };
};