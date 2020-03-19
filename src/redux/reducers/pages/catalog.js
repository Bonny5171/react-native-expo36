import moment from 'moment';
import { updateComponent, updateCurrent, closePopUp, openClosePopUp, toggleOption } from './common/functions';

const cartDefault = {
  name: 'Carrinho Padrão',
  products: [],
  standard: true,
  isDefault: true,
  isChosen: true,
  client: '',
  created: {
    day: moment().day(),
    month: moment()
      .format('MMMM')
      .substring(0, 3)
      .toUpperCase(),
    year: moment().year()
  },
  nItens: 36,
  valor: '4K'
};

const sumaryEmail = {
  products: [
    {
      key: '1',
      name: 'GRENDHA ARUBA CHIM AD',
      code: '17113',
      imagemSelected: true,
      cartelaDeCoresSelected: false,
      gradesSelected: false,
      composicaoSelected: false
    },
    {
      key: '2',
      name: 'MORMAII QUIVER II DEDO AD',
      code: '15450',
      imagemSelected: false,
      cartelaDeCoresSelected: true,
      gradesSelected: true,
      composicaoSelected: false
    },
    {
      key: '3',
      name: 'AVAIANA DE PAU',
      code: '66666',
      imagemSelected: false,
      cartelaDeCoresSelected: false,
      gradesSelected: false,
      composicaoSelected: false
    }
  ]
};

const INITIAL_STATE = {
  // Carrinho atual
  dropdown: {
    current: {
      products: []
    },
    isVisible: false
  },

  carts: [],

  selectedCart: {
    current: cartDefault,
    isVisible: false,
    isOpen: false
  },

  buttons: [
    {
      name: 'price',
      isChosen: false,
      noPanel: true,
    },
    {
      name: 'mail',
      isChosen: false
    },
    {
      name: 'cart',
      isChosen: false
    },
    {
      name: 'filter',
      isChosen: false
    },
    {
      name: 'submenu',
      isChosen: false,
      isPop: true,
    },
    {
      name: 'dropTable',
      isChosen: false,
    },
    {
      name: 'order',
      isChosen: false,
      noPanel: true,
      isPop: true,
    }
  ],

  // Produto atual para preencher as Tabs
  currentProduct: {
    pointerPrevious: null,
    pointerCurrent: null,
    pointerNext: null,
    pointerRow: null,
  },
  previousProduct: {},
  nextProduct: {},
  pointerPrevious: 0,
  pointerCurrent: 0,
  pointerNext: 0,
  pointerRow: 0,
  leftProduct: false,
  rightProduct: false,
  rowLength: null,
  horizontalListLength: null,
  isHorizontalList: false,
  // Variável para fazer as grades e cores escolhidas começarem com um 4x4
  startingGrid: true,

  // DEFINE PRODUTO ALTERADO.
  product_change: '',

  /** ************************************************** */
  // Assistente de seleção, ligado/desligado
  selectList: false,

  // Exibe ou não o menu inicial de bolinhas [+, email, carrinho].
  selectOpt: false,

  // View Assistente de seleção
  productsChecked: [],

  produtosSelecionados: [],

  // Houver do botão  "email"
  btnEnvelope: false,

  // Houver do botão  "carrinho"
  btnCarrinho: false,

  // Selecao de carrinho
  selecaoCarrinho: false,

  /** *************************************************** */

  colorsPopUp: false,
  // View Assistente de seleção
  assistantSelection: {
    isOpen: false,
    product: {} // Calçado atual
  },
  // Cores disponíveis para o calçado atual
  // A cor atual é o indíce selecionado na lista da grade, ex. colors[currentColor].uri
  // As cores serão guardadas em um vetor contento os requires() que importam o endereço das respectivas cores
  currentColor: 0,
  // Grades disponíveis
  grades: [],

  assistantPopUps: [
    {
      name: 'colors',
      isChosen: false
    },
    {
      name: 'grades',
      isChosen: false
    }
  ],

  currentGrade: {},

  tableDropDown: {
    current: 'AGO/18',
    options: [
      {
        name: 'AGO/18'
      },
      {
        name: 'SET/18'
      },
      {
        name: 'OUT/18'
      },
      {
        name: 'NOV/18'
      },
      {
        name: 'DEZ/18'
      },
      {
        name: 'JAN/19'
      },
      {
        name: 'FEV/19'
      }
    ]
  },

  cloneColorsStores: false,

  stores: [],

  data: [],

  dataV2: [],

  sumaryEmail,
  // Relacionado ao detalhe do produto
  imgButtons: [false, false],

  ponteiroProduto: ['', ''],
  panelFilter: [],
  popUpFilter: [
    {
      current: '',
      name: 'dropArquetipo',
      desc: 'Arquétipo',
      isChosen: false,
      currStack: 1,
      options: [{ key: '1', option: 'Arq 1' }, { key: '2', option: 'Arq 2' }, { key: '3', option: 'Arq 3' }]
    },
    {
      current: '',
      name: 'dropGrupo',
      desc: 'Grupo',
      isChosen: false,
      currStack: 1,
      options: [{ key: '1', option: 'Grupo 1' }, { key: '2', option: 'Grupo 2' }, { key: '3', option: 'Grupo 3' }]
    },
    {
      current: '',
      name: 'dropStatus',
      desc: 'Status',
      isChosen: false,
      currStack: 1,
      options: [
        { key: '1', option: 'nova cor' },
        { key: '2', option: '1º giro' },
        { key: '3', option: '2º giro' },
        { key: '4', option: '3º giro' }
      ]
    },
    { // 3
      current: '',
      name: 'dropTamanhos',
      desc: 'Tamanhos',
      isChosen: false,
      currStack: 1,
      options: [
        { key: '1', option: '33', isChosen: false },
        { key: '2', option: '34', isChosen: false },
        { key: '3', option: '35', isChosen: false },
        { key: '4', option: '36', isChosen: false },
        { key: '5', option: '37', isChosen: false },
        { key: '6', option: '38', isChosen: false },
        { key: '7', option: '39', isChosen: false }
      ],
      filters: []
    },
    {
      current: '',
      name: 'dropMarcas',
      desc: 'Marcas',
      isChosen: false,
      currStack: 1,
      options: [{ key: '1', option: 'Ipanema' }, { key: '2', option: 'Cartago' }, { key: '3', option: 'Rider' }]
    },
    {
      current: '',
      name: 'dropMesLancamento',
      desc: 'Lançamento',
      isChosen: false,
      currStack: 1,
      options: [{ key: '1', option: 'Janeiro' }, { key: '2', option: 'Fevereiro' }, { key: '3', option: 'Março' }]
    },
    { // 6
      current: '',
      name: 'dropGenero',
      desc: 'Gênero',
      isChosen: false,
      currStack: 1,
      options: []
    },
    {
      current: '',
      name: 'dropCor',
      desc: 'Cor',
      isChosen: false,
      currStack: 1,
      options: [
        { key: '1', option: 'Cor 1', isChosen: false },
        { key: '2', option: 'Cor 2', isChosen: false },
        { key: '3', option: 'Cor 3', isChosen: false }
      ],
      filters: []
    },
    {
      current: '',
      name: 'categoria',
      desc: 'Categoria',
      isChosen: false
    },

    {
      current: '',
      name: 'produto',
      desc: 'Produto / Código',
      isChosen: false
    },
    { // 10
      current: '',
      name: 'faixaDePrecoDe',
      desc: 'Faixa de Preço de:',
      isChosen: false
    },
    {
      current: '',
      name: 'faixaDePrecoAte',
      desc: 'Faixa de Preço a:',
      isChosen: false
    },
    {
      current: '',
      isChosen: false,
      desc: 'busca',
      name: 'busca',
    },
    { // 13
      current: '',
      name: 'dropTags',
      desc: 'Etiquetas',
      isChosen: false,
      currStack: 1,
      options: []
    },
  ],

  hambuguerFilter: {
    coll1: '',
    expanded1: false,
    s1: false,
    coll2: '',
    s2: false,
    expanded2: false,
    coll3: '',
    expanded3: false,
    s3: false,
    coll4: '',
    s4: false
  },
  selectedHamburguerFilter: null,
  chosenHFID: 0,
  hamburguerMenu: null,
  initialHamburguerMenu: null,
  isResultFinder: false,

  keyboardState: false,

  horizontalPage: 0,

  openDetail: true,

  popSelectCart: false,

  panel: {
    isVisible: false,
    title: '',
    icon: ''
  },
  panelPointer: 0,
  // A ordem dos paineis estÃ¡ sendo usada nas chamadas da função acSetPanel,
  // Existentes no Item.js, entÃ£o cautela verifique os números passados e não altere a ordem
  panels: [
    /* {
      isVisible: false,
      title: 'MENU',
      icon: 'I'
    }, */
    {
      id: 0,
      icon: 'y',
      title: 'X CORES DISPONÍVEIS',
    },
    {
      id: 1,
      icon: '',
      title: 'LISTA DE PREÇOS',
    },
    {
      id: 2,
      icon: 'p',
      title: 'RESUMO DO CARRINHO',
    },
    {
      id: 3,
      icon: 'W',
      title: 'RESUMO DO E-MAIL',
    },
    {
      id: 4,
      icon: 'l',
      title: 'FILTROS DE BUSCA',
    },
    {
      id: 5,
      icon: 'C',
      title: 'DESCONTOS E PRAZOS',
    },
  ],
  qtGradesSelected: 0,
  qtColorsSelected: 0,

  initialPopUpFilter: null,

  sortButtons: [
    {
      id: 0,
      label: 'nome',
      prop: 'cat.name1',
      isAscendant: true,
      isActive: true
    },
    {
      id: 1,
      label: 'código',
      prop: 'cat.ref1',
      isAscendant: false,
      isActive: false
    },
    // {
    //   id: 2,
    //   label: 'preço',
    //   prop: 'cat.sfa_prices_arr',
    //   isAscendant: false,
    //   isActive: false
    // },
  ],
};

export default (state = INITIAL_STATE, action) => {
  // console.log('REDUCERS DE CATALOG', action.type);

  switch (action.type) {
    case 'set_car_selected': {
      const { carts } = action.payload;
      return { ...state, carts };
    }
    case 'update_btn_envelop': {
      const { btnEnvelope } = action.payload;
      return { ...state, btnEnvelope };
    }
    case 'update_btn_carrinho': {
      const { btnCarrinho } = action.payload;
      return { ...state, btnCarrinho };
    }
    case 'visualiza_selecao_carrinho': {
      const { selecaoCarrinho } = action.payload;
      return { ...state, selecaoCarrinho };
    }
    case 'update_buttons': {
      const buttons = updateComponent(action.name, state.buttons);
      return {
        ...state,
        buttons,
        selectOpt: false,
        imgButtons: action.name === 'price' ? state.imgButtons : INITIAL_STATE.imgButtons,
      };
    }
    case 'close_popup': {
      const buttons = closePopUp(state.buttons);
      return {
        ...state,
        buttons,
        colorsPopUp: INITIAL_STATE.colorsPopUp,
        panel: { ...state.panel, isVisible: false },
        assistantPopUps: INITIAL_STATE.assistantPopUps,
        imgButtons: INITIAL_STATE.imgButtons,
      };
    }
    case 'set_result_finder': {
      const { isResultFinder, isHamburguer } = action;
      return { ...state, isResultFinder, isHamburguer, ponteiroProduto: INITIAL_STATE.ponteiroProduto };
    }
    case 'openClose_dropdown': {
      const dropdown = { ...state.dropdown };
      dropdown.isVisible = !state.dropdown.isVisible;
      return { ...state, dropdown };
    }
    case 'force_change_dropdown': {
      const dropdown = { ...state.dropdown };
      dropdown.isVisible = state.dropdown.isVisible;
      return { ...state, dropdown };
    }
    case 'current_dropdown': {
      const newState = currentDropDown({ ...state }, action.payload);
      return newState;
    }
    case 'save_cart': {
      const { cart } = action;
      const oldCarts = [...state.carts];
      const newCart = {
        ...cart,
        products: []
      };

      // Adiciona novo cart no vetor
      const carts = oldCarts.map(cart => (cart.isChosen ? { ...cart, isChosen: false } : cart));
      carts.push({ ...newCart, isChosen: true });
      return { ...state, carts, dropdown: { ...state.dropdown, current: newCart } };
    }
    case 'delete_cart': {
      let carts = [...state.carts];
      removeCart(carts, action.name);
      carts = carts.map((cart, index) => {
        if (index === 0) return { ...cart, isChosen: true };
        if (cart.isChosen) return { ...cart, isChosen: false };
        return cart;
      });
      return { ...state, carts };
    }
    case 'add_product': {
      const dropdown = { ...state.dropdown };
      const { product } = action;
      dropdown.current.products.push(product);
      dropdown.current.products.sort((p1, p2) => p1.name > p2.name);
      return { ...state, product_change: product.ref1, dropdown, popSelectCart: false };
    }
    case 'update_product_dropdown': {
      const dropdown = { ...state.dropdown };
      const { productInfo } = action;
      dropdown.current.products = dropdown.current.products.map(product => {
        if (product.ref1 === productInfo.ref1) return { ...product, ...productInfo };
        return product;
      });
      return { ...state, product_change: productInfo.ref1, dropdown, popSelectCart: false };
    }
    case 'update_product_sel_grades': {
      const current = { ...action.dropdown.current };
      const { productInfo } = action;
      // Procura o produto do carrinho atual que possua
      current.products = current.products.map(product => {
        const isRef1Equal = product.ref1 === productInfo.code;
        const isRef2Equal = productInfo.colors.find(c => product.ref1 === productInfo.code && c.key === product.ref2);
        if (isRef1Equal && isRef2Equal) return { ...product, ...productInfo };
        return product;
      });
      return { ...state, product_change: productInfo.ref1, dropdown: { ...state.dropdown, current }, popSelectCart: false };
    }
    case 'remove_product': {
      const dropdown = { ...state.dropdown };
      const { product } = action;
      const filteredItems = dropdown.current.products.filter(item => item.ref1 !== product.code);

      dropdown.current.products = filteredItems;
      return { ...state, product_change: product.ref1, dropdown };
    }
    case 'assistant_dropdown': {
      const selectedCart = { ...state.selectedCart };
      selectedCart.isVisible = !state.selectedCart.isVisible;
      return { ...state, selectedCart };
    }
    case 'openClose_assistant': {
      const selectedCart = { ...state.selectedCart };
      selectedCart.isOpen = !state.selectedCart.isOpen;
      return { ...state, selectedCart };
    }
    case 'select_product': {
      const { keyDestaque, keyProduct } = action;
      let novoPonteiro = ['', ''];
      if (`${keyDestaque}${keyProduct}` === `${state.ponteiroProduto[0]}${state.ponteiroProduto[1]}`) { novoPonteiro = [keyDestaque, keyProduct]; }
      return { ...state, ponteiroProduto: novoPonteiro };
    }
    case 'reset_pointer': {
      return { ...state, ponteiroProduto: INITIAL_STATE.ponteiroProduto };
    }
    case 'reset_buttons_catalog': {
      return { ...state, buttons: INITIAL_STATE.buttons };
    }
    case 'assistant': {
      return {
        ...state,
        assistantSelection: {
          isOpen: action.isInCart ? state.assistantPopUps.isOpen : !state.assistantSelection.isOpen,
          product: action.product
        },
        imgButtons: INITIAL_STATE.imgButtons,
      };
    }
    case 'assistant_popup': {
      const assistantPopUps = openClosePopUp(action.name, [...state.assistantPopUps]);
      return { ...state, assistantPopUps };
    }
    case 'assistant_close_popup': {
      return {
        ...state,
        assistantPopUps: INITIAL_STATE.assistantPopUps
      };
    }
    case 'select_color': {
      const product = { ...state.assistantSelection.product };
      let qtColorsSelected = state.qtColorsSelected;
      const colors = product.colors.map(curr => {
        if (curr.code === action.name) {
          const isChosen = !curr.isChosen;
          qtColorsSelected = isChosen ? qtColorsSelected + 1 : qtColorsSelected - 1;
          return { ...curr, isChosen };
        }
        return curr;
      });

      // console.log('colors', colors);
      return {
        ...state,
        assistantSelection: {
          ...state.assistantSelection,
          product: {
            ...state.assistantSelection.product,
            colors
          }
        },
        currentProduct: {
          ...state.currentProduct,
          ...state.assistantSelection.product,
            colors
        },
        qtColorsSelected,
      };
    }
    case 'remove_color': {
      const colors = changeBoolean(state.assistantSelection.product.colors, action.name);
      return {
        ...state,
        assistantSelection: {
          ...state.assistantSelection,
          product: {
            ...state.assistantSelection.product,
            colors
          }
        },
        currentProduct: {
          ...state.currentProduct,
          ...state.assistantSelection.product,
            colors
        },
        qtColorsSelected: state.qtColorsSelected - 1
      };
    }
    case 'current_color': {
      const currentProduct = {
        ...state.currentProduct,
        colors: action.colors,
        colorsLength: action.colors.length
      };

      return {
        ...state,
        currentColor: action.position,
        currentProduct
      };
    }
    case 'update_grade_colors': {
      const colors = [...state.colors];
      for (let i = 0; i < state.grades.length; i += 1) {
        colors[i].grades = state.grades.map(grade => (grade.isChosen ? { ...grade } : null));
      }
      return { ...state, colors };
    }
    case 'add_grade': {
      const colors = [...state.colors];
      colors.grades.push(action.grade);
      return { ...state, colors };
    }
    case 'selected_grade': {
      let qtGradesSelected = state.qtGradesSelected;
      const grades = state.grades.map(curr => {
        if (curr.name === action.name) {
          const isChosen = !curr.isChosen;
          qtGradesSelected = isChosen ? qtGradesSelected + 1 : qtGradesSelected - 1;
          return { ...curr, isChosen };
        }
        return curr;
      });

      return { ...state, grades, qtGradesSelected };
    }
    case 'colors_grades': {
      const newState = { ...state };
      newState.colors = action.colors;
      newState.colorsGradesUpdated = !state.colorsGradesUpdated;
      return { ...state, ...newState };
    }
    case 'text_grade': {
      // Muda o valor do texto de um Input
      const product = { ...state.assistantSelection.product };
      const newGrades = product.colors[action.color].grades.map((grade, index) => {
        if (index === action.grade) {
          return { ...grade, quantity: action.quantity };
        }
        return grade;
      });

      const newColors = product.colors.map((color, index) => {
        if (index === action.color) {
          return { ...color, grades: newGrades };
        }
        return color;
      });
      product.colors = newColors;
      const assistantSelection = { ...state.assistantSelection, product };
      return { ...state, assistantSelection };
    }
    case 'insert_into_cart': {
      const selectedCart = { ...state.selectedCart };
      const { products } = selectedCart.current;
      const { product } = action;
      product.stores = [...state.stores];
      let inserted = false;

      // Salva o Grid Atual de Cores x Grade no Carrinho, de acordo com as suas respectivas lojas
      product.stores = state.stores.map(store => {
        if (store.isActive) {
          store.colors = state.assistantSelection.product.colors.map(color => ({ ...color }));
        } else if (state.cloneColorsStores) {
          // Aplica para todos os carrinhos se a variável de clone estiver true
          store.colors = state.assistantSelection.product.colors.map(color => ({ ...color }));
        }

        return store;
      });

      // Atualiza a lista de grades/cor caso  o produto ja esteja no carrinho
      products.some((curr, index) => {
        if (curr.name === product.name) {
          products.splice(index, 1, product);
          inserted = true;
          return true;
        }
        return false;
      });

      if (!inserted) {
        products.push(product);
      }
      const newState = {
        ...state,
        assistantSelection: {
          ...state.assistantSelection,
          product: { ...state.assistantSelection.product }
        }
      };

      newState.dropdown.current.products = selectedCart.current.products;

      return { ...state, ...newState };
    }
    case 'current_grade': {
      const currentGrade = { ...state.grades[action.grade] };
      return { ...state, currentGrade };
    }
    case 'set_default_current_grade': {
      return { ...state, currentGrade: INITIAL_STATE.currentGrade };
    }
    case 'select_product_list': {
      const { selectList } = action.payload;
      return { ...state, selectList };
    }
    case 'select_opt': {
      const { selectOpt } = action.payload;
      return { ...state, selectOpt };
    }
    case 'add_store': {
      const stores = [];
      action.stores.forEach((store, index) => {
        stores.push({
          name: store.name, // Nome da loja
          colors: [], // Cores contendo grades do produto atual
          isActive: index === 0 // INITIAL_STATE será sempre com a primeira aba ativa
        });
      });

      // if (stores[1] !== undefined) {
      //   if (stores[0].name === stores[1].name) {
      //     stores.shift();
      //   }
      // }
      return { ...state, stores };
    }
    case 'save_colors_store': {
      const colors = state.assistantSelection.product.colors.map(curr => ({ ...curr }));
      const stores = state.stores.map(store => {
        if (store.isActive) {
          return { ...store, colors };
        }

        return store;
      });
      return { ...state, stores };
    }
    case 'clone_colors': {
      return { ...state, cloneColorsStores: !state.cloneColorsStores };
    }
    case 'change_tab': {
      // Evitando mutações
      const newState = {
        ...state,
        assistantSelection: {
          ...state.assistantSelection,
          product: { ...state.assistantSelection.product }
        }
      };

      // Salva o Grid Atual de Cores x Grade na respectiva loja
      newState.stores = state.stores.map(store => {
        if (store.isActive) {
          store.colors = state.assistantSelection.product.colors.map(color => ({ ...color }));
        }

        return store;
      });

      // Muda Tab Ativa
      newState.stores = newState.stores.map(store => {
        if (store.name === action.name) {
          if (store.colors.length === 0) {
            // Preenche com um 9888899vetor de grades para cada cor, caso não tenha ainda
            store.colors = state.assistantSelection.product.colors.map(color => {
              // Evitando mutação de objetos internos
              const grades = color.grades.map(grade => ({ ...grade }));
              return { ...color, grades };
            });

            store.colors.forEach((color, index) => {
              store.colors[index].grades = [];
              state.grades.forEach(grade => {
                store.colors[index].grades.push({
                  name: grade.name,
                  quantity: ''
                });
              });
            });
          }
          // Atualizando somente as grades e cores exibidas (Conforme alterada na tab ativa)
          // Pega o Grid de Cores x Grade da próxima loja
          newState.assistantSelection.product.colors = store.colors.map((color, indexColor) => {
            const { isChosen } = newState.assistantSelection.product.colors[indexColor];
            const grades = color.grades.map((grade, indexGrade) => {
              const { isChosen } = newState.grades[indexGrade];
              return { ...grade, isChosen };
            });
            return { ...color, grades, isChosen };
          });
          return { ...store, isActive: true };
        }
        return { ...store, isActive: false };
      });

      return { ...state, ...newState };
    }
    case 'current_product': {
      const { pointerRow, pointerCurrent, pointerNext, pointerPrevious } = action.pointers;
      const newProducts = {
        previous: action.rowData[pointerPrevious],
        current: action.produto,
        next: action.rowData[pointerNext]
      };
      const pointers = { ...action.pointers };
      const ponteiroProduto =
        `${action.keyDestaque}${pointerRow}` === `${state.ponteiroProduto[0]}${state.ponteiroProduto[1]}`
          ? ['', '']
          : [action.keyDestaque, pointerRow.toString()];
      // Tentativa de navegar para a direita sem produtos posteriores com a lista horizontal
      // console.log('ponteiroProduto', ponteiroProduto);
      newProducts.current.colors = action.colors;
      newProducts.current.colorsLength = action.colors.length;
      newProducts.current.gallery = action.gallery;

      if (pointerRow === action.horizontalListLength - 1 && action.horizontalList) {
        return {
          ...state,
          previousProduct: newProducts.previous,
          currentProduct: action.produto,
          nextProduct: state.nextProduct,
          ...pointers, // retorna os mesmos ponteiros para não mover a seta
          rightProduct: true,
          leftProduct: false,
          ponteiroProduto,
          imgButtons: INITIAL_STATE.imgButtons,
        };
      }

      // Tentativa de navegar para a esquerda sem produtos anteriores existirem
      if (newProducts.previous === undefined) {
        // console.log('1892', pointerRow);
        return {
          ...state,
          previousProduct: newProducts.previous,
          currentProduct: newProducts.current,
          nextProduct: newProducts.next,
          pointerPrevious,
          pointerCurrent,
          pointerNext,
          pointerRow,
          leftProduct: true,
          rightProduct: false,
          ponteiroProduto,
          colorsPopUp: INITIAL_STATE.colorsPopUp,
          imgButtons: INITIAL_STATE.imgButtons,
        };
      } else if (pointerRow === action.rowData.length - 1 && !action.horizontalList) {
        // Tentativa de navegar para a direita sem produtos posteriores
        return {
          ...state,
          previousProduct: newProducts.previous,
          currentProduct: newProducts.current,
          nextProduct: null,
          pointerPrevious: state.pointerPrevious,
          pointerCurrent,
          pointerNext,
          pointerRow,
          rightProduct: true,
          leftProduct: false,
          ponteiroProduto,
          colorsPopUp: INITIAL_STATE.colorsPopUp,
          imgButtons: INITIAL_STATE.imgButtons,
        };
      }

      return {
        ...state,
        previousProduct: newProducts.previous,
        currentProduct: newProducts.current,
        nextProduct: newProducts.next,
        ...pointers,
        horizontalListLength: action.horizontalListLenth,
        isHorizontalList: action.isHorizontalList,
        leftProduct: false,
        rightProduct: false,
        ponteiroProduto,
        colorsPopUp: INITIAL_STATE.colorsPopUp,
        imgButtons: INITIAL_STATE.imgButtons,
      };
    }
    case 'row_length': {
      return { ...state, rowLength: action.rowLength };
    }
    case 'colors_popup': {
      return { ...state, colorsPopUp: !state.colorsPopUp };
    }
    case 'change_color': {
      const currentProduct = { ...state.currentProduct };
      let currentColor = null;
      currentProduct.colors = state.currentProduct.colors.map((color, index) => {
        if (color.code === action.code) {
          currentColor = index;
          return {
            ...color,
            isShowing: true,
            imgButtons: INITIAL_STATE.imgButtons
          };
        }
        return {
          ...color,
          isShowing: false,
          imgButtons: INITIAL_STATE.imgButtons
        };
      });

      return { ...state, currentProduct, currentColor };
    }
    case 'pointer_colors': {
      const colors = [...currentProduct.colors];
      colors[action.pointer] = { ...colors[action.pointer], isShowing: true };
      colors[state.currentColor] = { ...colors[state.currentColor], isShowing: false };
      const currentProduct = { ...currentProduct, colors };
      return { ...state, currentColor: action.pointer, currentProduct };
    }
    case 'update_curr_color': {
      return {
        ...state,
        currentColor: action.pointer
      };
    }
    case 'update_gallery': {
      const gallery = state.currentProduct.gallery.map(x => {
        if (x.key === action.itemKey) {
          x.selected = true;
        } else {
          x.selected = false;
        }
        return x;
      });

      return {
        ...state,
        currentProduct: { ...state.currentProduct, gallery },
        imgButtons: INITIAL_STATE.imgButtons
      };
    }
    case 'change_gallery': {
      let currentColor = null;
      state.currentProduct.gallery.map(source => {
        let url = '';
        state.currentProduct.colors.some((color, index) => {
          if (color.name === action.payload) {
            url = color.uri;
            currentColor = index;
            return true;
          }
          return false;
        });

        return {
          ...source,
          url,
          imgButtons: INITIAL_STATE.imgButtons
        };
      });
      const gallery = state.currentProduct.galleries[action.pointerGallery] ? [...state.currentProduct.galleries[action.pointerGallery]] : [];
      const currentProduct = {
        ...state.currentProduct,
        pointerGallery: action.pointerGallery,
        currentColor,
        gallery
      };
      return { ...state, currentProduct };
    }
    case 'reset_colors': {
      return { ...state, colorsPopUp: INITIAL_STATE.colorsPopUp };
    }
    case 'expanded_catalog': {
      const data = toggleExpCatalog(state.dataV2, action.catalog);
      return { ...state, data };
    }
    case 'selected_summary_email': {
      const { sumaryEmail } = state;
      const newSumaryEmail = {
        products: []
      };
      newSumaryEmail.products = sumaryEmail.products.map(item => {
        if (item.key === action.payload.key) {
          return action.payload;
        }
        return item;
      });
      return { ...state, sumaryEmail: newSumaryEmail };
    }
    case 'starting_grid': {
      const newState = { ...state };
      // Inicia a grade com o número de elementos que passarmos no segundo parÃ¢metro
      newState.assistantSelection.product.colors = chooseYElements(state.assistantSelection.product.colors);
      newState.grades = chooseYElements(state.grades);
      newState.startingGrid = true;
      return { ...state, ...newState };
    }
    case 'checked_product': {
      const { productsChecked } = action;
      return { ...state, productsChecked };
    }

    case 'checked_product_email': {
      const productsChecked = [...state.productsChecked];
      const { produto } = action;

      productsChecked.forEach(component => {
        if (component.code === produto.code) {
          component.imagemSelected = produto.imagemSelected;
          component.cartelaDeCoresSelected = produto.cartelaDeCoresSelected;
          component.gradesSelected = produto.gradesSelected;
          component.composicaoSelected = produto.composicaoSelected;
        }
      });

      return { ...state, productsChecked };
    }

    /* INICIO */
    case 'add_checked_product': {
      const productsChecked = [...state.productsChecked];
      const { produto } = action;
      productsChecked.push(produto);

      return { ...state, productsChecked, product_change: produto.code };
    }
    case 'remove_checked_product': {
      const productsChecked = [...state.productsChecked];
      const { produto } = action;

      const filteredItems = productsChecked.filter(item => item.code !== produto.code);

      return { ...state, productsChecked: filteredItems, product_change: produto.code };
    }
    /* FINAL */

    case 'update_dropdown': {
      const dropDowns = updateComponent(action.name, state.popUpFilter);
      return { ...state, popUpFilter: dropDowns };
    }
    case 'update_filter_hamburgue': {
      let { level, hambuguerFilter } = action;
      hambuguerFilter = { ...state.hambuguerFilter, ...hambuguerFilter };
      const fstChanged = hambuguerFilter.coll1 !== state.hambuguerFilter.coll1;
      const sndChanged = hambuguerFilter.coll2 !== state.hambuguerFilter.coll2;
      const thrdChanged = hambuguerFilter.coll3 !== state.hambuguerFilter.coll3;
      // Ao clicar em um mesmo nível, em uma mesma opção, contrair os níveis abaixo
      if (level === 'First') {
        // console.log('fstChanged', fstChanged);
        // Se algum subnÃ­vel estiver expandido e mudar o primeiro nível, colpasa os inferiores ao primeiro
        if ((hambuguerFilter.expanded1 || hambuguerFilter.expanded2) && fstChanged) {
          // console.log('CHANGING');
          hambuguerFilter.expanded1 = false;
          hambuguerFilter.coll2 = '';
          hambuguerFilter.expanded2 = false;
          hambuguerFilter.coll3 = '';
        }
        // Expande o nível 2
        hambuguerFilter.expanded1 = fstChanged ? true : !state.hambuguerFilter.expanded1;
        // Fecha o nível 3 e 4
        hambuguerFilter.expanded2 = false;
        hambuguerFilter.expanded3 = false;
      }

      if (level === 'Second') {
        if (hambuguerFilter.expanded2) {
          hambuguerFilter.expanded2 = false;
          hambuguerFilter.coll3 = '';
        }
        hambuguerFilter.expanded2 = sndChanged ? true : !state.hambuguerFilter.expanded2;
      }

      if (level === 'Third') {
        if (hambuguerFilter.expanded3) {
          hambuguerFilter.expanded3 = false;
          hambuguerFilter.coll4 = '';
        }
        hambuguerFilter.expanded3 = thrdChanged ? true : !state.hambuguerFilter.expanded3;
      }
      // console.log('hambuguerFilter', hambuguerFilter);

      return { ...state, hambuguerFilter, ponteiroProduto: INITIAL_STATE.ponteiroProduto };
    }
    case 'current_dropTables': {
      const panels = [...state.panels];
      panels[state.panelPointer] = { ...panels[state.panelPointer], isVisible: false };
      return { ...state, tableDropDown: { ...state.tableDropDown, current: action.name, isVisible: false }, panels };
    }
    case 'update_current_cat': {
      let popUpFilter;
      const property = action.isPanel ? 'panelFilter' : 'popUpFilter';
      if (action.name === 'categoria') return state;
      if (action.name === 'busca') {
        popUpFilter = [...state[property]];
      }
      if (action.name !== 'dropCor' && action.name !== 'dropTamanhos') {
        popUpFilter = toggleOption(action.name, action.newCurrent, state[property]);
      } else {
        const option = state[property][action.arrayPos].options[action.index];
        const newOption = { ...option, isChosen: !option.isChosen };
        let qtSelected = 0;
        const newOptions = state[property][action.arrayPos].options.map((option, index) => {
          if (
            (option.isChosen && option.option !== newOption.option) ||
            (newOption.isChosen && newOption.option === option.option)
          ) { qtSelected += 1; }
          if (index === action.index) {
            return newOption;
          }
          return option;
        });

        // console.log('newFilter', newFilter);
        popUpFilter = state[property].map((filter, index) => {
          if (index === action.arrayPos) {
            const options = newOptions;
            if (qtSelected > 1) {
              filter.current = '...';
            } else if (qtSelected === 1) {
              newOptions.forEach((option, index) => {
                if (newOptions[index + 1] !== undefined) {
                  if (!newOptions[index + 1].isChosen && option.isChosen) filter.current = option.option;
                } else if (newOptions[index].isChosen && option.isChosen) filter.current = option.option;
              });
            } else {
              filter.current = '';
            }
            const filters = [...filter.filters];

            // Insere a nova opção selecionada
            if (newOption.isChosen) {
              filters.push(newOption.option);
            } else if (!newOption.isChosen) {
              filters.forEach((filter, index) => {
                if (filter === newOption.option) {
                  filters.splice(index, 1);
                }
              });
            }
            // console.log('filters', filters);

            filter.qtSelected = qtSelected;
            return { ...filter, options, filters };
          }
          return filter;
        });
      }
      // Se algum filtro foi aplicado, o "TODOS OS MODELOS" não deve coexistir com os outros filtros,
      // na migalha da busca
      if (action.name !== 'busca' && popUpFilter[12].current === 'TODOS MODELOS') {
        popUpFilter = toggleOption('busca', '', popUpFilter);
      }

      // console.log('popUpFilter', popUpFilter)
      return { ...state, [property]: popUpFilter };
    }
    case 'update_dropdown_remove_item_catalog': {
      const { popUpFilter } = state;
      const { filter } = action;
      const novoPopUpFilter = popUpFilter.map(pp => {
        if (filter === pp.name) {
          pp.current = '';
        }
        return pp;
      });

      const isResultFinder = novoPopUpFilter.findIndex(filtro => filtro.current.length > 0) !== -1;

      return { ...state, popUpFilter: novoPopUpFilter, isResultFinder, panelFilter: [...novoPopUpFilter] };
    }
    case 'copy_panel_filter': {
      return { ...state, popUpFilter: [...state.panelFilter] };
    }
    case 'update_clear_filter_hamburgue': {
      const isResultFinder = false;
      return {
        ...state,
        hambuguerFilter: INITIAL_STATE.hambuguerFilter,
        isResultFinder,
        ponteiroProduto: INITIAL_STATE.ponteiroProduto,
        selectedHamburguerFilter: INITIAL_STATE.selectedHamburguerFilter
      };
    }
    case 'update_dropdown_remove_all': {
      const level1 = state.initialHamburguerMenu.level1.map((lv1, index) =>
        index === 0 ? { ...lv1, isChosen: true } : lv1
      );
      const hamburguerMenu = { level1 };
      return {
        ...state,
        popUpFilter: state.initialPopUpFilter,
        panelFilter: [...state.initialPopUpFilter],
        chosenHFID: INITIAL_STATE.chosenHFID,
        hamburguerMenu
      };
    }
    case 'buttons_detail_product': {
      const imgButtons = state.imgButtons.map(() => false);

      if (!state.imgButtons[action.index]) {
        imgButtons[action.index] = true;
      } else {
        imgButtons[action.index] = false;
      }

      return { ...state, imgButtons };
    }
    case 'close_all_select_options': {
      const popUpFilter = closeAllSelectOptions(state.popUpFilter);
      return { ...state, popUpFilter };
    }
    case 'keyboard_state': {
      return { ...state, keyboardState: !state.keyboardState };
    }
    case 'close_modals_catalog': {
      const buttons = state.buttons.map((button) => {
        if (button.name === 'price' && button.isChosen) return button;
        return { ...button, isChosen: false };
      });
      return {
        ...state,
        buttons,
        tableDropDown: {
          ...state.tableDropDown,
          isVisible: false
        },
        imgButtons: INITIAL_STATE.imgButtons,
        dropdown: {
          ...state.dropdown,
          current: state.dropdown.current,
          name: '',
          isVisible: false
        },
        popSelectCart: INITIAL_STATE.popSelectCart,
        colorsPopUp: INITIAL_STATE.colorsPopUp,
        panel: { ...state.panel, isVisible: false },
      };
    }
    case 'set_product': {
      return { ...state, currentProduct: action.product };
    }
    case 'enrich_product': {
      const withoutGallery = action.product;
      delete withoutGallery.gallery;
      return { ...state, currentProduct: { ...state.currentProduct, ...withoutGallery } };
    }
    case 'set_dataV2': {
      const { dataV2 } = action;
      return { ...state, dataV2 };
    }
    case 'set_popup_filter': {
      const { name, options } = action;
      const panelFilter = [];
      const popUpFilter = state.popUpFilter.map(filter => {
        if (filter.name === name) {
          filter.options = options;
        }
        panelFilter.push({ ...filter });
        return filter;
      });

      return { ...state, popUpFilter, initialPopUpFilter: [...state.popUpFilter], panelFilter };
    }

    case 'set_colors_current_product': {
      const { currentProduct } = action;

      return {
        ...state,
        currentProduct
      };
    }
    case 'pop_select_cart': {
      const { dropdown } = state;
      const carts = state.carts.map(cart => (cart.name === dropdown.current.name ? dropdown.current : cart));
      return { ...state, popSelectCart: !state.popSelectCart, carts };
    }
    case 'select_cart': {
      const { index } = action;
      const currCart = { ...state.carts[index], isChosen: true };
      const carts = state.carts.map(cart => (cart.isChosen ? { ...cart, isChosen: false } : cart));
      carts.splice(index, 1, currCart);

      return { ...state, carts, dropdown: { ...state.dropdown, current: currCart } };
    }
    case 'set_hamburguer_options': {
      const { hamburguerMenu } = action;
      // console.log('hamburguerMenu', hamburguerMenu);
      return { ...state, hamburguerMenu, initialHamburguerMenu: hamburguerMenu };
    }
    case 'has_children_selected': {
      const { coll1, coll2, coll3, coll4 } = state.hambuguerFilter;
      const hambuguerFilter = { ...state.hambuguerFilter };
      const { id } = action;

      let level1 = [...state.initialHamburguerMenu.level1];
      // Se possuir filhos, a flag de filho selecionado será desativada para todas as opções
      // E ativada para a opção selecionada
      if (level1[id].hasChildren) {
        // console.log('state.hambuguerFilter', state.hambuguerFilter);
        level1 = deselectOptions(level1);
        level1[id].isChosen = true;
        level1[id].hasChildrenSelected = true;
        hambuguerFilter.s1 = true;
      }
      if (coll1 !== 0) {
        if (level1[id].hasChildren) {
          level1[id].level2 = deselectOptions(level1[id].level2);
          level1[id].level2[coll2].isChosen = true;
          hambuguerFilter.s2 = true;
        }
        const obj2 = level1[id].level2[coll2];
        if (obj2.hasChildren) {
          obj2.level3 = deselectOptions(obj2.level3);
          const obj3 = obj2.level3[coll3];
          obj3.isChosen = true;
          hambuguerFilter.s3 = true;
          if (obj3.hasChildren) {
            obj3.level4 = deselectOptions(obj3.level4);
            obj3.level4[coll4].isChosen = true;
            hambuguerFilter.s4 = true;
          }
        }
      }
      const hamburguerMenu = { level1 };
      // console.log('NEW ', hamburguerMenu);
      // Atualizando props de "selecionado" do menu
      // console.log('hambuguerFilter', hambuguerFilter);
      const selectedHamburguerFilter = { ...hambuguerFilter };
      return { ...state, hamburguerMenu, chosenHFID: action.id, hambuguerFilter, selectedHamburguerFilter };
    }
    case 'set_bread_crumb': {
      // TODOS MODELOS não pode ser exibido com qualquer filtro,
      // Então retiramos ele dos filtros
      if (state.popUpFilter[12].current === 'TODOS MODELOS') {
        return {
          ...state,
          hamburguerBreadCrumb: action.filters,
          popUpFilter: INITIAL_STATE.popUpFilter
        };
      }
      return { ...state, hamburguerBreadCrumb: action.filters };
    }
    case 'set_grades': {
      return {
        ...state,
        grades: action.grades,
      };
    }
    case 'clear_one_filter_hamb': {
      const { coll1, coll2, coll3, coll4 } = state.selectedHamburguerFilter;
      let hambuguerFilter = { ...state.selectedHamburguerFilter };
      const { lv } = action;
      let level1 = [...state.hamburguerMenu.level1];

      switch (lv) {
        case 1: {
          level1 = [...state.hamburguerMenu.level1];
          level1[coll1].level2[0].isChosen = true;
          level1[coll1].level2[coll2].isChosen = false;
          const obj2 = level1[coll1].level2[coll2];
          if (obj2.hasChildren) {
            // console.log('obj2', obj2);
            const obj3 = obj2.level3[coll3];
            obj3.isChosen = false;
            if (obj3.hasChildren) obj3.level4[0].isChosen = false;
          }
          hambuguerFilter = {
            ...INITIAL_STATE.hambuguerFilter,
            coll1: state.hambuguerFilter.coll1,
            s1: state.hambuguerFilter.s1
          };
          // console.log('level1', level1);
          break;
        }
        case 2: {
          if (coll3 !== '') {
            level1[coll1].level2[coll2].level3[0].isChosen = true;
            level1[coll1].level2[coll2].level3[coll3].isChosen = false;
          }
          if (coll4 !== '') {
            level1[coll1].level2[coll2].level3[coll3].level4[coll4].isChosen = false;
            level1[coll1].level2[coll2].level3[coll3].level4[coll4].hasChildrenSelected = false;
          }
          hambuguerFilter = { ...state.hambuguerFilter, s3: false, coll3: 0, s4: false, coll4: '' };
          break;
        }
        case 3: {
          if (coll4 !== '') {
            level1[coll1].level2[coll2].level3[coll3].level4[0].isChosen = true;
            level1[coll1].level2[coll2].level3[coll3].level4[coll4].isChosen = false;
          }
          hambuguerFilter = { ...state.hambuguerFilter, coll4: 0, s4: false };
          // console.log('hambuguerFilter', hambuguerFilter);
          break;
        }
        default: {
          break;
        }
      }
      const hamburguerMenu = { level1 };
      return { ...state, hambuguerFilter, hamburguerMenu, selectedHamburguerFilter: hambuguerFilter };
    }
    case 'change_prices': {
      return { ...state, prices: action.prices };
    }
    case 'navigate_color': {
      const nextPointer = state.currentColor + 1;
      const previousPointer = state.currentColor - 1;
      if (action.isRight) return { ...state, currentColor: nextPointer };
      return { ...state, currentColor: previousPointer };
    }
    case 'set_color': {
      if (action.pointer === state.currentColor) return state;
      return { ...state, currentColor: action.pointer };
    }
    case 'reset_page': {
      // console.log('CALLED');
      const popUpFilter = resetStringProp(state.popUpFilter, 'current', '');
      return {
        ...state,
        popUpFilter,
        selectedHamburguerFilter: INITIAL_STATE.selectedHamburguerFilter,
        assistantSelection: INITIAL_STATE.assistantSelection,
        chosenHFID: INITIAL_STATE.chosenHFID,
        btnCarrinho: INITIAL_STATE.btnCarrinho,
        btnEnvelope: INITIAL_STATE.btnEnvelope,
        selectOpt: INITIAL_STATE.selectOpt,
        selectList: INITIAL_STATE.selectList,
        hamburguerMenu: state.initialHamburguerMenu,
        hambuguerFilter: INITIAL_STATE.hambuguerFilter,
        ponteiroProduto: INITIAL_STATE.ponteiroProduto,
        // currentColor: INITIAL_STATE.currentColor,
        panel: INITIAL_STATE.panel,
        popSelectCart: INITIAL_STATE.popSelectCart,
        buttons: INITIAL_STATE.buttons,
        imgButtons: INITIAL_STATE.imgButtons,
      };
    }
    case 'set_cars': {
      return { ...state, carts: action.carts };
    }
    case 'set_dropdown_carts': {
      let products =  [...state.dropdown.current.products];
      if (action.dropdown.current && action.dropdown.current.products) {
        products =  [...action.dropdown.current.products];
      }
      return {
        ...state,
        dropdown: {
          ...state.dropdown,
          current: {
            ...action.dropdown.current,
            products
          }
        },
      };
    }
    case 'set_dropdown_cartsV2': {
      return { ...state, dropdown: action.dropdown };
    }
    case 'reset_ponteiro_prod': {
      return { ...state, ponteiroProduto: INITIAL_STATE.ponteiroProduto };
    }
    case 'set_panel_catalog': {
      let panel = { ...state.panels[action.pointer] };
      if (action.panel) panel = { ...panel, isVisible: true, ...action.panel, };
      return {
        ...state,
        panelPointer: action.pointer,
        panel,
        imgButtons: INITIAL_STATE.imgButtons,
      };
    }
    case 'toggle_panel_catalog': {
      return { ...state, panel: { ...state.panel, isVisible: !state.panel.isVisible, } };
    }
    case 'deselect_all_grades': {
      return { ...state, qtGradesSelected: INITIAL_STATE.qtGradesSelected };
    }
    case 'deselect_all_colors': {
      return { ...state, qtColorsSelected: INITIAL_STATE.qtColorsSelected };
    }
    case 'qt_grades_selected': {
      return {
        ...state,
        qtGradesSelected: action.qt,
      };
    }
    case 'set_curr_prod': {
      return {
        ...state,
        currentProduct: action.newProd,
      };
    }
    case 'sort_cart_by': {
      const { property, isAscendant } = action;
      const products = [...state.dropdown.current.products];

      products.sort((a, b) => {
        if (typeof a[property] === 'object') {
          return isAscendant ?
            a[property].getTime() > b[property].getTime()
            :
            a[property].getTime() < b[property].getTime();
        }
        return isAscendant ?
          a[property] > b[property]
          :
          a[property] < b[property];
      });

      const dropdown = {
        ...state.dropdown,
        current: {
          ...state.dropdown.current,
          products,
        },
      };
      return {
        ...state,
        dropdown,
      };
    }
    case 'set_filter_stack': {
      const { operator, pointerFilter } = action;
      const panelFilter = [...state.panelFilter];
      const filter = { ...panelFilter[pointerFilter] };

      filter.currStack = operator === 'add' ? filter.currStack + 1 : filter.currStack - 1;
      panelFilter[pointerFilter] = filter;

      return { ...state, popUpFilter: [...panelFilter], panelFilter };
    }
    case 'clear_panel_filters': {
      return { ...state, panelFilter: [...state.initialPopUpFilter] };
    }
    case 'toggle_sort_btn_catalog': {
      const { id } = action;
      const sortButtons = state.sortButtons.map(btn => {
        btn.isActive = false;
        const sameBtnClicked = btn.id === id;
        if (sameBtnClicked) {
          btn.isAscendant = !btn.isAscendant;
          btn.isActive = true;
        }
        return btn;
      });
      return { ...state, sortButtons };
    }
    case 'flush_grades': {
      const objGrades = [...state.grades];
      const grades = objGrades.map(curr => {
        return { ...curr, isChosen: false };
      });
      return { ...state, grades, qtGradesSelected: 0 };
    }
    case 'flush_cores': {
      const product = { ...state.assistantSelection.product };
      const colors = product.colors.map(curr => {
        return { ...curr, isChosen: false };
      });
      return {
        ...state,
        assistantSelection: {
          ...state.assistantSelection,
          product: {
            ...state.assistantSelection.product,
            colors
          }
        },
        currentProduct: {
          ...state.currentProduct,
          ...state.assistantSelection.product,
            colors
        },
      };
    }
    case 'close_pop_stock': {
      return {
        ...state,
        imgButtons: INITIAL_STATE.imgButtons
      };
    }
    case 'close_assistant': {
      return {
        ...state,
        assistantSelection: INITIAL_STATE.assistantSelection,
      };
    }
    case 'update_qt_selected': {
       let qtColorsSelected = 0;
      state.currentProduct.colors.forEach((c) => {
        if (c.isChosen) qtColorsSelected += 1;
      });
      let qtGradesSelected = 0;
      state.grades.forEach((c) => {
        if (c.isChosen) qtGradesSelected += 1;
      });
      return { ...state, qtColorsSelected, qtGradesSelected };
    }
    case 'toggle_complete_cat': {
      return {
        ...state,
        isCompleteCat: !state.isCompleteCat,
      };
    }
    default:
      return state;
  }
};

const deselectOptions = (array, index) => {
  const options = array.map((obj, index) => {
    const option = { ...obj };
    if (obj.hasChildrenSelected) option.hasChildrenSelected = false;
    if (obj.isChosen) option.isChosen = false;
    return option;
  });
  return options;
};

const closeAllSelectOptions = listFilters => {
  return listFilters.map(f => {
    f.isChosen = false;
    return f;
  });
};

const resetStringProp = (array, prop, defaultValue) => array.map(obj => ({ ...obj, [prop]: defaultValue }));

const currentDropDown = (newState, nextCart) => {
  // Caso haja algum carrinho atual, salvamos ele na lista de dropdown novamente
  if (newState.dropdown.current.name !== '') {
    if (newState.carts.findIndex(c => c.key === newState.dropdown.current.key) === -1) {
      newState.carts.push(newState.dropdown.current);
    }
  }

  removeCart(newState.carts, nextCart.name);

  // Atualizando o carrinho atual
  return {
    ...newState,
    dropdown: {
      ...newState.dropdown,
      current: nextCart
    },
  };
};

const removeCart = (carts, name) => {
  for (let i = carts.length - 1; i >= 0; i -= 1) {
    if (carts[i].name === name) {
      carts.splice(i, 1);
    }
  }
};

const changeBoolean = (array, name, prop = 'name') => {
  let updatedArray = [];
  updatedArray = array.map(curr => {
    if (curr[prop] === name) {
      return { ...curr, isChosen: !curr.isChosen };
    }
    return { ...curr };
  });

  return updatedArray;
};

const toggleExpCatalog = (data, isCatalog) => {
  const newData = data.map(section => toggleHiddenProducts(section, isCatalog));
  return newData;
};

const toggleHiddenProducts = (section, isCatalog) => {
  let newProducts = [];
  if (!isCatalog) {
    newProducts = section.products.map(product =>
      product.isExpanded ? { ...product, isHidden: !product.isHidden } : product
    );
  } else {
    newProducts = section.products.map(product =>
      !product.isHidden && product.isExpanded ? { ...product, isHidden: true } : product
    );
  }

  return { ...section, products: newProducts };
};

const chooseYElements = (array, number = 0) => {
  const initialGrid = [];
  for (let i = 0; i < array.length; i += 1) {
    if (i < number) {
      initialGrid.push({ ...array[i], isChosen: true });
    } else {
      initialGrid.push({ ...array[i], isChosen: false });
    }
  }

  return initialGrid;
};

const navigateTo = (array, prop, isRight, pointer) => {
  if (isRight) return array[pointer + 1][prop];
  return array[pointer - 1][prop];
};