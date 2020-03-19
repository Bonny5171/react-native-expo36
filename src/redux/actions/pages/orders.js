export const ORDERS_TOGGLE_LIST = 'toggle_list_orders';
export const ORDERS_TOGGLE_SORT = 'toggle_sort_orders';
export const ORDERS_RESET_PAGE = 'reset_page_orders';
export const ORDERS_RESET_BUTTONS = 'reset_buttons_orders';


export const acToggleListOrders = () => ({
  type: ORDERS_TOGGLE_LIST,
});

export const acResetPageOrders = () => ({
  type: ORDERS_RESET_PAGE,
});

export const acToggleSortOrders = (name) => ({
  type: ORDERS_TOGGLE_SORT,
  name
});

export const acUpdateComponent = (type, name) => {
  return {
    type: 'update_orders_' + type,
    name
  };
};

export const acResetButtons = () => {
  return {
    type: ORDERS_RESET_BUTTONS
  };
};