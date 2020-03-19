export const GLOBAL_APP_NAME = 'set_app_name';
export const GLOBAL_SET_PANEL = 'set_panel_global';
export const GLOBAL_TOGGLE_PANEL = 'toggle_panel_global';
export const GLOBAL_TOGGLE_GSYNC = 'toggle_gsync_global';
export const GLOBAL_SET_GSYNC = 'set_gsync_global';
export const GLOBAL_UPDATE_SERVICE = 'update_service_global';
export const GLOBAL_FORCE_SYNC = 'force_sync_global';
export const GLOBAL_STOP_ALL_SYNC = 'stop_all_global';
export const GLOBAL_UPDATE_SERVICE2 = 'update_service2_global';
export const GLOBAL_LAST_UPDATE_SERVICE = 'last_update_service_global';

export const acUpdateContext = (payload) => {
  return {
    type: 'update_context',
    payload
  };
};

export const acCatalogCover = () => {
  return {
    type: 'catalog_cover'
  };
};

export const acChangeDimension = (din) => {
  return {
    type: 'change_dimension',
    din,
  };
};

export const acToggleMask = () => {
  return {
    type: 'toggle_mask'
  };
};

export const acRemoveMask = () => {
  return {
    type: 'remove_mask'
  };
};

export const acToggleGlobalMask = () => {
  return {
    type: 'toggle_global_mask'
  };
};

export const acToggleZoom = (newImg, isLocal) => {
  return {
    type: 'toggle_zoom',
    newImg,
    isLocal,
  };
};

export const acToggleVideo = (newVideo) => {
  return {
    type: 'toggle_video',
    newVideo,
  };
};

export const acSetUserInfo = (userInfo) => {
  return {
    type: 'set_user_info',
    userInfo
  };
};

export const acOpenToast = () => {
  return {
    type: 'set_open_tost',
  };
};

export const acCloseToast = () => {
  return {
    type: 'set_close_tost',
  };
};

export const acSetToast = (message) => {
  // Propriedades do objeto message importantes:
  // "shouldClose" com a prop text com string vazia fecha o Toast
  // "shouldOpen" força o Toast a abrir
  return {
    type: 'add_tost',
    message,
  };
};

export const acResetToast = () => {
  return {
    type: 'reset_tost',
  };
};


export const acSetAppName = (name) => {
  return {
    type: GLOBAL_APP_NAME,
    name,
  };
};
export const acSetPanel = (gPanelPointer, gPanel) => {
  return {
    type: GLOBAL_SET_PANEL,
    gPanelPointer,
    gPanel
  };
};

export const acTogglePanel = () => {
  return {
    type: GLOBAL_TOGGLE_PANEL
  };
};

export const acToggleGSync = (shouldSync) => {
  return {
    type: GLOBAL_TOGGLE_GSYNC,
    shouldSync
  };
};


export const acSetGSync = (shouldSync) => {
  return {
    type: GLOBAL_SET_GSYNC,
    shouldSync
  };
};

export const acForceSync = () => {
  return {
    type: GLOBAL_FORCE_SYNC
  };
};

export const acUpdateService = (repository, percent) => {
  return {
    type: GLOBAL_UPDATE_SERVICE,
    repository,
    percent
  };
};

export const acUpdateService2 = (repository, percent) => {
  return {
    type: GLOBAL_UPDATE_SERVICE2,
    repository,
    percent
  };
};


export const acServiceLastUpdate = (repository, date) => {
  return {
    type: GLOBAL_LAST_UPDATE_SERVICE,
    repository,
    date
  };
};

export const acStopAllSync = () => {
  return {
    type: GLOBAL_STOP_ALL_SYNC,
  };
};