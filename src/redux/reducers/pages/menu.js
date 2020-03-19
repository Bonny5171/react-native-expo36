import { TOGGLE_SYNC } from '../../actions/pages/menu';

const INITIAL_STATE = {
  btnAbout: false,
  // Monitora botões do menu de vendedor (Ativo ou não)
  vendor: [
    {
      name: 'catalog',
      isChosen: true,
    },
    {
      name: 'orders',
      isChosen: false
    },
    {
      name: 'campaigns',
      isChosen: false
    },
    {
      name: 'client',
      isChosen: false
    },
    {
      name: 'logOut',
      isChosen: false
    },
    {
      name: 'teste',
      isChosen: false
    },
  ],

  // Botões da área administrativa
  admin: [
    {
      name: 'dashboard',
      isChosen: false,
    },
    {
      name: 'assistant',
      isChosen: true
    },
    {
      name: 'price',
      isChosen: false
    },
    {
      name: 'orders',
      isChosen: false
    },
    {
      name: 'campaigns',
      isChosen: false
    },
    {
      name: 'clients',
      isChosen: false
    },
    {
      name: 'logOut',
      isChosen: false
    },
  ],

  subMenuCatalog: false,
  subMenuIcon: '3',
  // Items do submenu do catalogo
  catalogMenuItems: [
    {
      key: 0, icon: '3', txt: 'CATÁLOGO SETORIZADO', params: 'catalog'
    },
    {
      key: 1, icon: 'X', txt: 'CATÁLOGO EXPANDIDO', params: 'catalog'
    },
    {
      key: 2, icon: 'I', txt: 'LISTAGEM', params: 'listCatalog'
    }
  ],

  adminIcons: [
    {
      key: 0,
      name: 'dashboard',
      txtMsg: '9',
    },
    {
      key: 1,
      name: 'assistant',
      txtMsg: '0',
    },
    {
      key: 2,
      name: 'price',
      txtMsg: 'a',
    },
    {
      // Opção do OtherAction.js: Pesquisar ou criar pedidos, carrinhos ou pré-pedidos
      //  usa o icone atual(txtMsg) para decidir para qual página ele deve navegar
      key: 3,
      name: 'orders',
      txtMsg: '5',
      hasSubmenu: true,
      label: 'pedidos',
      routes: [
        {
          route: 'orders',
          label: 'pedidos',
        },
        {
          route: 'carrinhos',
          label: 'carrinhos',
        },
        // pré-pedidos
      ],
      goTo: 'orders',
      routePointer: 0,
    },
    {
      key: 4,
      name: 'campaigns',
      txtMsg: 'b',
    },
    {
      key: 5,
      name: 'clients',
      txtMsg: '4',
      // hasSubmenu: true,
    }
  ],

  syncButton: {
    icon: 'c',
    isChosen: false,
  },
  // Visibilidade dos submenus da Pg.Carrinho e Pg.Clientes
  adminSubmenus: {
    orders: false,
    clients: false,
  },

  vendorIcons: [
    {
      key: 1,
      name: 'orders',
      txtMsg: '5',
      hasSubmenu: true,
      routes: [
        {
          route: 'orders',
          label: 'pedidos',
        },
        {
          route: 'carrinhos',
          label: 'carrinhos',
        },
        // pré-pedidos
      ],
      label: 'pedidos',
      goTo: 'orders',
      routePointer: 0,
    },
    {
      key: 2,
      name: 'campaigns',
      txtMsg: 'b',
    },
    {
      key: 3,
      name: 'client',
      txtMsg: 'H',
    }
    // {
    //   key: 5,
    //   name: 'teste',
    //   txtMsg: '2',
    //
    // }
  ],

  // vendorSubmenus: {
  //   catalog: false,
  // },
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'update_vendor': {
      // console.log('vendor', action.name);
      const newState = {...state};
      newState.vendor = updateButtons(action.name, [...state.vendor]);
      return { ...state, ...newState };
    }
    case 'update_admin': {
      const newState = { ...state };
      // console.log('admin', action.name);
      newState.admin = updateButtons(action.name, [...state.admin]);
      return { ...state, ...newState, btnAbout: false };
    }
    case 'submenu_catalog': {
      const subMenuCatalog = !state.subMenuCatalog;
      return { ...state, subMenuCatalog };
    }
    case 'submenu_icon': {
      const subMenuIcon = action.payload;
      return { ...state, subMenuIcon };
    }
    case 'reset_submenu': {
      const { subMenuIcon } = INITIAL_STATE;
      return { ...state, subMenuIcon };
    }
    case 'reset_navigation_vendor': {
      return { ...state, vendor: [...INITIAL_STATE.vendor] };
    }
    case 'reset_navigation_admin': {
      return { ...state, admin: [...INITIAL_STATE.admin] };
    }
    case 'reset_menu': {
      return { ...INITIAL_STATE };
    }
    case 'close_subMenus': {
      return {
        ...state,
        subMenuCatalog: INITIAL_STATE.subMenuCatalog,
        adminSubmenus: INITIAL_STATE.adminSubmenus,
        syncButton: INITIAL_STATE.syncButton
      };
    }
    case 'update_side_menu': {
      const { pointer, routePointer, newIcon, context } = action;
      // Pega nome do array que vai atualizar
      const arrayName = context === 'admin' ? 'adminIcons' : 'vendorIcons';

      // Botão que será atualizado
      const oldBtn = state[arrayName][pointer];

      // Atualizando botão com nova rota
      const newBtn = {
        ...oldBtn,
        txtMsg: newIcon,
        routePointer,
        goTo: oldBtn.routes[routePointer].route,
        label: oldBtn.routes[routePointer].label,
      };

      const newArray = Object.assign([...state[arrayName]], { [pointer]: newBtn });
      return { ...state, [arrayName]: newArray };
    }
    case 'toggle_submenu_admin': {
      const adminSubmenus = {
        ...state.adminSubmenus,
        [action.property]: !state.adminSubmenus[action.property]
      };
      // console.log('adminSubmenus', adminSubmenus);
      return { ...state, adminSubmenus };
    }
    case 'toggle_about': {
      // Deselecionando botões do menu lateral que estiverem selecionados
      const admin = state.admin.map((b) => b.isChosen ? { ...b, isChosen: false } : b);
      return { ...state, btnAbout: !state.btnAbout, admin };
    }
    case TOGGLE_SYNC: {
      return { ...state, syncButton: { ...state.syncButton, isChosen: !state.syncButton.isChosen } };
    }
    default:
      return { ...state };
  }
};

const updateButtons = (name, buttons) => {
  const updatedButtons = buttons.map(button => {
    // Mantém o botao ativo, caso ele seja clicado
    if (button.isChosen && name === button.name) {
      return button;
    }
    if (button.isChosen) {
      return { ...button, isChosen: false };
    } else if (button.name === name) {
      return { ...button, isChosen: true };
    }
    return button;
  });

  return updatedButtons;
};

const updateRedirects = (name, redirects) => {
  const updatedRedirects = redirects.map(page => {
    if (page.name !== '/' + name && !page.redirect) {
      page.redirect = true;
    } else {
      // Desativa outros redirects para evitar cair numa pagina e ser redirecionado automaticamente
      page.redirect = false;
    }
    return page;
  });

  return updatedRedirects;
};

const resetVendor = (vendor) => {
  const newVendor = vendor.map((curr, index) => {
    if (index === 0) {
      curr.isChosen = true;
    } else {
      curr.isChosen = false;
    }
    return curr;
  });
  return newVendor;
};