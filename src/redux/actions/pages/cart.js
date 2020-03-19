export const acChooseChecks = (type, infos, index) => {
  return {
    type,
    infos,
    index,
  };
};

export const acUpdateForm = (field, payload, shdClearField) => {
  return {
    type: 'update_form',
    field,
    payload,
    shdClearField,
  };
};

export const acToggleProperty = (property) => {
  return {
    type: 'toggle_property',
    property,
  };
};

export const acAddStores = (stores) => {
  return {
    type: 'add_stores_cart',
    stores,
  };
};

export const acTogglePanel = () => {
  return {
    type: 'toggle_panel_cart'
  };
};

export const acTogglePopCartDesconto = () => {
  return {
    type: 'toggle_pop_cart_condicao_pagamento',
  };
};

// export const acToggleDropdown = (dropdown) => {
//   return {
//     type: 'toggle_dropdown_cart',
//     dropdown
//   };
// };

export const acSetEmbalamentos = (embalamentos) => {
  return {
    type: 'set_embalamentos',
    embalamentos
  };
};

export const acToggleCartuchoRule = () => {
  return {
    type: 'toggle_cartucho_rule',
  };
};

export const acResetPopCart = () => {
  return {
    type: 'reset_pops_cart',
  };
};
export const acSetPanel = (pointer, panel) => {
  return {
    type: 'set_panel_cart',
    pointer,
    panel,
  };
};

export const acCurrentProduct = (product, currentCor) => {
  return {
    type: 'current_product_cart',
    product,
    currentCor,
  };
};

export const acCurrentAcordeon = (pointerAcordeon) => {
  return {
    type: 'current_accordeon',
    pointerAcordeon,
  };
};

export const acToggleMenuBtn = (id) => {
  return {
    type: 'toggle_menu_btn_cart',
    id,
  };
};

export const acToggleSortBtn = (id) => {
  return {
    type: 'toggle_sort_btn_cart',
    id,
  };
};

export const acSetForm = (form) => {
  return {
    type: 'set_form',
    form,
  };
};

export const acCheckFormState = () => {
  return {
    type: 'check_form_state',
  };
};

export const acCheckPendencies = (products, shouldOpenPanel = true) => {
  return {
    type: 'check_pendencies',
    products,
    shouldOpenPanel,
  };
};


export const acResetCartPage = () => {
  return {
    type: 'reset_page_cart'
  };
};

export const setPreDataVisible = (preDataVisible) => {
  return {
    type: 'set_vibilidade__calendario_predata',
    preDataVisible
  };
};

export const setPeriodoDeEntregaVisible = (periodoDeEntregaVisible) => {
  return {
    type: 'set_vibilidade__calendario_previsao_entrega',
    periodoDeEntregaVisible,
  };
};


export const acAddProductToSelect = (model) => {
  return {
    type: 'add_model_copy',
    model,
  };
};

export const acRemoveProductToSelect = (model) => {
  return {
    type: 'remove_model_copy',
    model,
  };
};

export const acAddCopyCart = (cart) => {
  return {
    type: 'add_to_cart',
    cart,
  };
};

export const acRemoveCopyCart = (cart) => {
  return {
    type: 'remove_to_cart',
    cart,
  };
};

export const acResetCopyCart = () => {
  return {
    type: 'reset_to_cart',
  };
};

export const acResetCopyModel = () => {
  return {
    type: 'reset_model_copy'
  };
};

export const acSelectAllModel = (products) => {
  return {
    type: 'select_all_model_inCar',
    products
  };
};

export const acRemoveSelectAllModel = (products) => {
  return {
    type: 'remove_select_all_model_inCar',
    products
  };
};
