export const acNextStep = () => {
  return {
    type: 'next_step_assistant',
  };
};

export const acCheckBox = (position) => {
  return {
    type: 'checkbox',
    position
  };
};

export const acCheckDiscount = (position) => {
  return {
    type: 'discount_checkboxes',
    position
  };
};

export const acFilterBranches = (position) => {
  return {
    type: 'filter_branches',
    position
  };
};

export const acOnlyHQ = (stores) => {
  return {
    type: 'only_headequarter',
    stores
  };
};


export const acOnlyBranches = (stores, flag) => {
  return {
    type: 'only_branches',
    stores,
    flag
  };
};

export const acLoadStores = (stores) => {
  return {
    type: 'load_stores',
    stores
  };
};

export const acChooseStore = (position, stores, client) => {
  return {
    type: 'choose_store',
    position,
    stores,
    client,
  };
};

export const acResetAssistant = () => {
  return {
    type: 'reset_page_assistant'
  };
};

export const acToggleDropdown = () => {
  return {
    type: 'toggle_dropdown'
  };
};

export const acPreviousStep = (index) => {
  return {
    type: 'previous_step_assistant',
    index
  };
};

export const acToggleDefineTable = () => {
  return {
    type: 'dropdown_tables'
  };
};

export const acCurrentTable = (table) => {
  return {
    type: 'current_table',
    table
  };
};

export const acResetFilterBranches = () => {
  return {
    type: 'reset_filterbranch'
  };
};

export const acClientDeleted = () => {
  return {
    type: 'client_deleted',
  };
};

export const acCurrType = (current) => {
  return {
    type: 'curr_type',
    current
  };
};

export const acToggleDropType = () => {
  return {
    type: 'toggle_droptype',
  };
};

export const acChooseStore2 = (store, storeType) => {
  return {
    type: 'choose_store_2',
    store,
    storeType,
  };
};

export const acChooseAllStores = (stores) => {
  return {
    type: 'choose_all_stores',
    stores
  };
};

export const acUnchooseAllStores = () => {
  return {
    type: 'unchoose_all_stores'
  };
};


export const acUnchoooseStore = (name) => {
  return {
    type: 'unchoose_store',
    name,
  };
};

export const acSetTypeOptions = (typeOptions) => {
  return {
    type: 'set_type_options',
    typeOptions,
  };
};

export const acToggleHq = (hq) => {
  return {
    type: 'toggle_hq',
    hq,
  };
};

export const acSetPriceList = ({ availableTables, currentTable }) => {
  return {
    type: 'define_lista_preco',
    availableTables,
    currentTable,
  };
};

export const acSetDiscountCheckBoxes = ({ discountCheckboxes }) => {
  return {
    type: 'set_discount_checkboxes',
    discountCheckboxes,
  };
};

export const acCurrentClient = (client) => {
  return {
    type: 'current_client_ass',
    client,
  };
};

