export const acSetProduct = (payload) => {
  return {
    type: 'set_product',
    payload
  };
};

export const acCurrentBox = (index, right, current) => {
  return {
    type: 'current_box',
    index,
    right,
    current,
  };
};

export const acChangeInfo = (index) => {
  return {
    type: 'current_info',
    index,
  };
};

export const acResetArrows = () => {
  return {
    type: 'reset_arrows',
  };
};

export const acResetPageProd = () => {
  return {
    type: 'reset_page_product',
  };
};

export const acTogglePanelProd = (pointer) => {
  return {
    type: 'toggle_panel_product',
    pointer
  };
};


export const acSetPanelProd = (pointer, panel) => {
  return {
    type: 'set_panel_product',
    pointer,
    panel
  };
};

export const acTogglePanelProdc = () => {
  return {
    type: 'toggle_panel_product_c'
  };
};