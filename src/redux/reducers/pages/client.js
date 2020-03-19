import { updateComponent } from './common/functions';

const INITIAL_STATE = {
  cartButton: false,
  infoPointer: 0,
  currentInfo: 'Informações Financeiras',
  extraInfo: [
    {
      name: 'Informações Financeiras',
      icon: 'A',
      isChosen: true
    },
    {
      // Nome a ser atualizado
      name: 'Localização',
      icon: 'B',
      isChosen: false
    },
    {
      name: 'Descontos',
      icon: 'C',
      isChosen: false
    },
    {
      name: 'Outras Informações',
      icon: '¨',
      isChosen: false
    },
  ],
  // Cliente definido atual
  client: {
    name: undefined,
    stores: [
      // {
      //   name: 'DEFAULT COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Miandiba',
      //   address: 'Rua Francisco Carvalho Barros, 60',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: true,
      //   isChosen: true,
      // },
      // {
      //   name: 'XYZAX COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Triunfo',
      //   address: 'Av. Pres. Getúlio Vargas, 214',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'GPAKO COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Salgueiro',
      //   address: 'Rua Franciso Sá, 427',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'EASDZ COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Ouricuri',
      //   address: 'Rua Maj. Rufino José Cunha, 197',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'ABDEU COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Miandiba',
      //   address: 'Rua Francisco Carvalho Barros, 60',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'QSDFA COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Triunfo',
      //   address: 'Av. Pres. Getúlio Vargas, 214',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'YUIJE COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Miandiba',
      //   address: 'Rua Maj. Rufino José Cunha, 197',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'XYZAX COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Triunfo',
      //   address: 'Av. Pres. Getúlio Vargas, 214',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'GPAKO COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Salgueiro',
      //   address: 'Rua Franciso Sá, 427',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'EASDZ COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Ouricuri',
      //   address: 'Rua Maj. Rufino José Cunha, 197',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'QSDFA COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Triunfo',
      //   address: 'Av. Pres. Getúlio Vargas, 214',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'YUIJE COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Miandiba',
      //   address: 'Rua Maj. Rufino José Cunha, 197',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'XYZAX COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Triunfo',
      //   address: 'Av. Pres. Getúlio Vargas, 214',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'QSDFA COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Triunfo',
      //   address: 'Av. Pres. Getúlio Vargas, 214',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'YUIJE COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Miandiba',
      //   address: 'Rua Maj. Rufino José Cunha, 197',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // {
      //   name: 'XYZAX COM.DE CALÇADOS LTDA',
      //   code: '1193007',
      //   city: 'PE',
      //   state: 'Triunfo',
      //   address: 'Av. Pres. Getúlio Vargas, 214',
      //   reason: 'A. A FEITOSA ME',
      //   headquarter: false,
      //   isChosen: false,
      // },
      // Pode adicionar quantas lojas quiser
    ],
    // billing: {
    //   type: 'ENDEREÇO DE COBRANÇA',
    //   address: 'Av. Pres. Getúlio Vargas, 214',
    //   postalCode: '44763521-1'
    // },
    // comercial: {
    //   type: 'ENDEREÇO COMERCIAL',
    //   address: 'Rua Maj. Rufino José Cunha, 197',
    //   postalCode: '88765532-1',
    //   city: 'Ouricuri',
    //   state: 'PE',
    // },
    // shipping: {
    //   type: 'ENDEREÇO DE ENTREGA',
    //   address: 'Av. Pres. Getúlio Vargas, 214',
    //   postalCode: '98564533-1',
    //   city: 'Ouricuri',
    //   state: 'PE',
    // },
    distributionCenter: {
      type: 'CENTRO DE DISTRIBUIÇÃO',
      address: 'Rua Franciso Sá, 427',
      postalCode: '88765532-1',
      city: 'Ouricuri',
      state: 'PE',
    },
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'update_cart': {
      return { ...state, cartButton: !state.cartButton };
    }
    case 'update_extrainfo': {
      const extraInfo = updateComponent(action.name, state.extraInfo);
      return { ...state, extraInfo };
    }
    case 'next_info': {
      const extraInfo = nextExtraInfo([...state.extraInfo]);
      return { ...state, extraInfo };
    }
    case 'previous_info': {
      const extraInfo = previousExtraInfo([...state.extraInfo]);
      return { ...state, extraInfo };
    }
    case 'search_client': {
      // Evoluir lógica de search para Dropdown com lista atualizável
      const client = state.clients.find(client => client.name.toLowerCase().includes(action.name));
      if (client !== undefined) return { ...state, client };
      return { ...state, client: { name: action.name } };
    }
    case 'current_client_one': {
      // console.log('clientCLIENT', action.client);
      return { ...state, client: action.client };
    }
    case 'update_stores': {
      const client = {
        ...state.client,
        stores: [state.client.stores[0], ...action.stores]
      };
      return { ...state, client };
    }
    case 'change_client_tab': {
      const { index } = action;
      // Label atual
      const currentInfo = state.extraInfo[index].name;
      const extraInfo = state.extraInfo.map((button, indexBtn) => {
        if (index === indexBtn) {
          return { ...button, isChosen: true };
        }
        if (button.isChosen) return { ...button, isChosen: false };
        return button;
      });

      return {
        ...state,
        extraInfo,
        currentInfo,
        infoPointer: index,
      };
    }
    case 'reset_client_page': {
      return { ...state, infoPointer: INITIAL_STATE.infoPointer, extraInfo: INITIAL_STATE.extraInfo };
    }
    case 'define_client_stores': {
      const stores = action.stores;
      const client = { ...state.client, stores };
      // console.log('NEW STORES', client.stores);
      return { ...state, client };
    }
    default:
      return state;
  }
};

const nextExtraInfo = (extraInfo) => {
  // Atualizando a próxima posição do array para true
  // Caso o ultimo icone esteja ativado, não devem ser feitas atualizações
  const last = extraInfo.length - 1;
  if (extraInfo[last].isChosen) {
    return extraInfo;
  }
  // Variável usada para checar quando atualizamos uma propriedade do vetor
  let updated = false;
  // Enquanto não encontrar o elemento true, não devemos atualizar
  let found = false;
  const newExtraInfo = extraInfo.map((curr, index) => {
    if (curr.isChosen) {
      curr = { ...curr, isChosen: false };
      found = true;
    // atualiza o primeiro caso nenhum objeto tenha sido atualizado
    // e esteja dentro do tamanho limite do extraInfo
    } else if (!updated && found && index <= extraInfo.length - 1) {
      curr = { ...curr, isChosen: true };
      updated = true;
    }
    return curr;
  });

  return newExtraInfo;
};

const previousExtraInfo = (extraInfo) => {
  // Atualizando o icone anterior para true
  // Caso o primeiro icone esteja ativado, não devem ser feitas atualizações
  if (extraInfo[0].isChosen) {
    return extraInfo;
  }

  const newExtraInfo = [...extraInfo];
  const size = newExtraInfo.length;
  let updated = false;
  let found = false;
  for (let i = size - 1; i >= 0; i -= 1) {
    if (newExtraInfo[i].isChosen) {
       newExtraInfo[i] = { ...newExtraInfo[i], isChosen: false };
       found = true;
    // Atualiza para ativado o icone anterior ao atual
    // caso já tenhamos encontrado o icone ativo
    } else if (!updated && found) {
      newExtraInfo[i] = { ...newExtraInfo[i], isChosen: true };
      updated = true;
    }
  }


  return newExtraInfo;
};

