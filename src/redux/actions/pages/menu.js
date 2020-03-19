export const TOGGLE_SYNC = 'toggle_sync';
export const acUpdateButtons = (menu, name) => {
  // O parâmetro menu deve conter o nome do menu atual (vendor, setup ou admin)
  // name é o nome do botão a ser atualizado
  return {
    type: 'update_' + menu,
    name
  };
};

export const acSubMenuCatalog = () => {
  return {
    type: 'submenu_catalog',
  };
};

export const acSubMenuIcon = (payload) => {
  // Payload = novo icone
  return {
    type: 'submenu_icon',
    payload
  };
};
export const acToggleSync = () => {
  return {
    type: TOGGLE_SYNC
  };
};
export const acResetNavigation = (type) => {
  return {
    type: `reset_navigation_${type}`
  };
};

export const acResetSubMenu = () => {
  return {
    type: 'reset_submenu'
  };
};

export const acResetMenu = () => {
  return {
    type: 'reset_menu'
  };
};

export const acCloseSubMenus = () => {
  return {
    type: 'close_subMenus'
  };
};

export const acToggleSubmenuAdmin = (property) => {
  return {
    type: 'toggle_submenu_admin',
    property,
  };
};

export const acUpdateSideMenu = (pointer, newIcon, routePointer, context) => {
  return {
    type: 'update_side_menu',
    pointer,
    routePointer,
    newIcon,
    context,
  };
};

export const acToggleAbout = () => {
  return {
    type: 'toggle_about'
  };
};

