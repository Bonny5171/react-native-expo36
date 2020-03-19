export const acCartButton = (type, name) => {
  return { type: 'update_' + type, name };
};

export const acNextInfo = () => {
  return { type: 'next_info' };
};

export const acPreviousInfo = () => {
  return { type: 'previous_info' };
};

export const acSearchClient = (name) => {
  return {
    type: 'search_client',
    name
  };
};

export const acChooseStore = (position, stores) => {
  return {
    type: 'choose_store',
    position,
    stores
  };
};

export const acCurrentClient = (client) => {
  return {
    type: 'current_client_one',
    client
  };
};

export const acUpdateStores = (stores) => {
  return {
    type: 'update_stores',
    stores
  };
};

export const acChangeTab = (index) => {
  return {
    type: 'change_client_tab',
    index
  };
};

export const acResetPage = () => {
  return {
    type: 'reset_client_page',
  };
};

export const acSetClientStores = (stores) => {
  return {
    type: 'define_client_stores',
    stores
  };
};