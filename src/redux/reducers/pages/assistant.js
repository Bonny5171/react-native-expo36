import { nextStep, previousStep, updateComponent, toggleFlag, saveNextStep } from './common/functions';

const INITIAL_STATE = {
  screen: 0,
  steps: [true, false, false, false, false],
  prevSteps: [true, false, false, false, false],
  stepsAnswered: [false, false, false, false, false, false],
  checkboxes: [true, false],
  discountCheckboxes: [],
  dropdownTables: false,
  // Quando tiver os dados, pegar a primeira tabela disponível
  currentTable: { code: '', name: 'Buscando tabela de preço' },
  availableTables: [],

  // Vetor de lojas para Aba Visitar Cliente, passo 2
  initialStores: [],
  stores: [],
  filterBranches: [false, false],
  // Dropdown de definição de cliente
  dropdown: false,
  dropType: {
    isActive: false,
    current: 'TODOS', // GRUPO ECONOMICO === GRUPO EC.
  },
  typeOptions: null,
  chooseAll: false,
  isHqSelected: true,
  client: {}
};

export default (state = INITIAL_STATE, action) => {
  // console.log('REDUCER ASSISTANT', action.type);
  switch (action.type) {
    case 'next_step_assistant': {
      const steps = nextStep(state.steps);
      const stepsAnswered = saveNextStep(state.stepsAnswered, state.steps);
      let { screen } = state;

      if (state.screen < steps.length) {
        screen += 1;
      }

      const prevSteps = nextStep(state.prevSteps);

      return {
        ...state,
        steps,
        screen,
        prevSteps,
        stepsAnswered,
        filterBranches: state.filterBranches,
      };
    }
    case 'previous_step_assistant': {
      const steps = previousStep(state.steps, action.index);

      if (action.index === 0 && state.steps[action.index]) return state;
      let { screen } = state;

      if (state.screen < steps.length) {
        screen = action.index;
      }

      const prevSteps = previousStep(state.prevSteps, action.index);
      return {
        ...state,
        steps,
        screen,
        prevSteps
      };
    }
    case 'checkbox': {
      // Lógica para funcionar com radio group
      const checkboxes = radioFunction(state.checkboxes, action.position);
      return { ...state, checkboxes };
    }
    case 'discount_checkboxes': {
      const discountCheckboxes = toggleFlag(action.position, state.discountCheckboxes, 'isChosen');
      return { ...state, discountCheckboxes };
    }
    case 'dropdown_tables': {
      return { ...state, dropdownTables: !state.dropdownTables };
    }
    case 'filter_branches': {
      const filterBranches = [...state.filterBranches];
      let stores = [...state.stores];
      filterBranches[action.position] = !state.filterBranches[action.position];

      if (filterBranches[0] && action.position === 1) {
        filterBranches[0] = false;
        filterBranches[1] = true;
        stores = state.initialStores.map(store => ({ ...store, isChosen: !store.isChosen }));
      } else if (filterBranches[1] && action.position === 0) {
        filterBranches[0] = false;
        filterBranches[1] = false;
      }
      if (!filterBranches[0] && state.stores[0] !== undefined) stores = [state.stores[0]];
      return { ...state, filterBranches, stores };
    }
    case 'only_headequarter': {
      let stores = [];
      if (!state.filterBranches[0]) {
        stores = [state.initialStores.find(store => { return store.headquarter === true; })];
      } else {
        stores = [...state.initialStores];
      }
      return { ...state, stores };
    }
    case 'only_branches': {
      if (!state.filterBranches[0]) {
        // Se o switch button não estiver ativo, não podemos selecionar todas as filiais
        return state;
      }
      let stores = [...state.stores];
      if (stores.length === 1) {
        stores = action.stores.map((store, index) => ({ ...store,
          isChosen: !action.flag
        }));
      } else {
        stores = state.stores.map((store, index) => ({
          ...store, isChosen: !action.flag
        }));
      }
      const filterBranches = state.filterBranches.map((curr, index) => {
        if (index === 1) return !curr;
        return curr;
      });
      return { ...state, stores, filterBranches };
    }
    case 'load_stores': {
      return { ...state, stores: action.stores, initialStores: action.stores };
    }
    case 'choose_store': {
      const { filterBranches } = state;
      let stores = state.stores.map(store => {
        if (!store.headquarter) return store;
      });

      if (stores.length === 1) {
        stores = [];
        action.stores.forEach(store => {
          if (!store.headquarter) stores.push(store);
        });
      }

      const store = { ...stores[action.position] };
      if (!store.isChosen === false) {
        filterBranches[1] = false;
      }
      const newStore = { ...stores[action.position], isChosen: !store.isChosen };
      stores = stores.map((store) => {
        if (store.name === newStore.name) {
          return newStore;
        }
        return store;
      });

      return { ...state, stores, filterBranches };
    }
    case 'choose_store_2': {
      // nome _2 e flag isChosen TEMPORARIOS enquanto nao desmocar to do o fluxo de filiais
      const position = state.stores.length === 0 ? 0 : state.stores.length;
      const newStore = { name: action.store, isChosen: true, position, isHq: action.storeType === 'Matriz' };
      // console.log('newStore', newStore);
      // Se a loja já estiver selecionada, retorna o mesmo state
      let isStoreSelected = false;
      state.stores.forEach((store) => {
        if (store !== undefined) {
          if (store.name === newStore.name) isStoreSelected = true;
        }
        // console.log('state.stores', state.stores);
      });
      if (isStoreSelected) return state;
      const oldStores = [...state.stores];
      let isAnyHqSelected = newStore.isHq;
      if (oldStores[0] !== undefined) isAnyHqSelected = isAnyHqSelected && oldStores[0].isHq;
      if (oldStores.length === 1 && isAnyHqSelected) oldStores.pop();
      const stores = [...oldStores, newStore];

      // console.log('NEW STORES', stores, state.stores);
      return { ...state, stores };
    }
    case 'reset_page_assistant': {
      return {
        ...state,
        steps: INITIAL_STATE.steps,
        screen: INITIAL_STATE.screen,
      };
    }
    case 'reset_filterbranch': {
      // console.log('RESET FILTER BRANCHES');
      return {
        ...state,
        filterBranches: INITIAL_STATE.filterBranches,
      };
    }
    case 'toggle_dropdown': {
      return { ...state, dropdown: !state.dropdown };
    }
    case 'current_table': {
      return { ...state, currentTable: action.table };
    }
    case 'client_deleted': {
      const stepsAnswered = state.stepsAnswered.map((step, index) => {
        return index <= 1 ? step : false;
      });
      return { ...state, stepsAnswered };
    }
    case 'toggle_droptype': {
      const dropType = { ...state.dropType };
      // console.log('DROP TYPE', dropType.isActive);
      return { ...state, dropType: { ...dropType, isActive: !dropType.isActive } };
    }
    case 'curr_type': {
      const dropType = { ...state.dropType };
      dropType.current = action.current;
      return { ...state, dropType };
    }
    case 'unchoose_all_stores': {
      const steps = [...INITIAL_STATE.steps];
      const stepsAnswered = [...INITIAL_STATE.stepsAnswered];
      stepsAnswered[0] = true;
      stepsAnswered[1] = true;
      steps[0] = false;
      steps[1] = true;
      return { ...state, stores: INITIAL_STATE.stores, chooseAll: false, steps, stepsAnswered, isHqSelected: true };
    }
    case 'choose_all_stores': {
      const { chooseAll } = state;
      let stores = [];
      const allStoresSelected = state.stores.length === action.stores.length + 1;
      if (allStoresSelected) return { ...state, chooseAll: !chooseAll };
      if (!chooseAll) stores = [...action.stores];
      // Se a matriz for a única presente na lista de lojas selecionadas, ela sera adicionada manualmente uma vez
      if (state.stores.length === 1) {
        stores = [state.stores[0], ...action.stores];
      }
      // console.log('CHOOSE ALL stores', stores);
      return { ...state, stores, chooseAll: !chooseAll };
    }
    case 'unchoose_store': {
      const stores = [...state.stores];
      const position = stores.findIndex((store) => store.name === action.name);
      const isHqSelected = !stores[position].isHq;
      stores.splice(position, 1);
      // console.log('NEW STORESSS', action.name, position);
      return { ...state, stores, isHqSelected };
    }
    case 'toggle_hq': {
      const stores = [...state.stores];
      if (!state.isHqSelected) {
        // Insere Matriz nas lojas selecionadas
        const hq = { ...action.hq, isHq: true };
        if (stores.length > 0) {
          stores.unshift(hq);
        } else if (action.hq !== undefined) {
          stores.push(hq);
        }
      } else {
        // retira ...
        stores.shift();
      }
      return { ...state, isHqSelected: !state.isHqSelected, stores };
    }
    case 'set_type_options': {
      const stringElements = action.typeOptions.map(option => option.sf_developer_name.toUpperCase());
      return { ...state, typeOptions: ['TODOS', ...stringElements] };
    }
    case 'define_lista_preco': {
      return {
        ...state,
        availableTables: action.availableTables,
        currentTable: action.currentTable,
      };
    }
    case 'set_discount_checkboxes': {
      return {
        ...state,
        discountCheckboxes: action.discountCheckboxes,
      };
    }
    case 'current_client_ass': {
      return { ...state, client: action.client };
    }
    default: {
      return state;
    }
  }
};

const radioFunction = (array, position) => array.map((bool, index) => index === position);