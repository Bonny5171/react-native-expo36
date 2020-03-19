export const acUpdateButtons = name => {
  return {
    type: 'update_buttons',
    name
  };
};

export const acClosePopUp = () => {
  return {
    type: 'close_popup'
  };
};

export const acSetResultFinder = (isResultFinder, isHamburguer) => {
  return {
    type: 'set_result_finder',
    isResultFinder,
    isHamburguer
  };
};

export const acCurrentDropDown = payload => {
  return {
    type: 'current_dropdown',
    payload
  };
};

export const acOpenCloseDropDown = () => {
  return {
    type: 'openClose_dropdown'
  };
};

export const acForceChangeDropDown = () => {
  return {
    type: 'force_change_dropdown'
  };
};

export const acOpenCloseAssistant = () => {
  return {
    type: 'openClose_assistant'
  };
};

export const acSelectedCartDropDown = () => {
  return {
    type: 'assistant_dropdown'
  };
};

export const acSaveCart = cart => {
  // console.log('Add novo carrinho de compra', cart);
  return {
    type: 'save_cart',
    cart
  };
};

export const acDeleteCart = name => {
  return {
    type: 'delete_cart',
    name
  };
};

export const acAddCartProduct = product => {
  return {
    type: 'add_product',
    product
  };
};

export const acRemoveCartProduct = product => {
  return {
    type: 'remove_product',
    product
  };
};

export const acSelectProduct = (keyDestaque, keyProduct) => {
  return {
    type: 'select_product',
    keyDestaque,
    keyProduct
  };
};
export const acResetPointer = () => {
  return {
    type: 'reset_pointer'
  };
};

// View SeleÃ§Ã£o para o carrinho
export const acAssistant = (product, isInCart) => {
  return {
    type: 'assistant',
    product,
    isInCart
  };
};

// Cores
export const acAssistantPopUp = name => {
  // Abre/Fecha popup
  return {
    type: 'assistant_popup',
    name
  };
};

export const acAssistantClosePopUp = () => {
  // Fecha popup
  return {
    type: 'assistant_close_popup'
  };
};

export const acSelectColor = name => {
  return {
    type: 'select_color',
    name
  };
};

export const acDeselectAllColors = () => {
  return {
    type: 'deselect_all_colors',
  };
};
export const acRemoveColor = name => {
  // Remove a cor da lista de exibiÃ§Ã£o
  return {
    type: 'remove_color',
    name
  };
};
export const acCurrentColor = colors => {
  //  Define a cor atual
  return {
    type: 'current_color',
    colors
  };
};

// Grades
export const acUpdateGradeQuantity = payload => {
  return {
    type: 'input_grade',
    payload
  };
};

export const acSelectedGrade = name => {
  return {
    type: 'selected_grade',
    name
  };
};


export const acQtGradesSelected = qt => {
  return {
    type: 'qt_grades_selected',
    qt
  };
};

export const acDeselectAllGrades = () => {
  return {
    type: 'deselect_all_grades',
  };
};

export const acColorsGrades = colors => {
  return {
    type: 'colors_grades',
    colors
  };
};

export const acTextGrade = (name, grade, color, quantity) => {
  // Atualiza a entrada de texto que guarda a quantidade de grades/cor
  return {
    type: 'text_grade',
    name, // Nome(codigo) da cor
    grade, // Linha do input
    color, // Coluna do input
    quantity // Valor
  };
};

export const acInsertGradesColor = (product, cart) => {
  return {
    type: 'insert_into_cart',
    product,
    cart
  };
};

export const acCurrentGrade = grade => {
  // Define a grade atual, passando o Ã­ndice atual da lista
  return {
    type: 'current_grade',
    grade
  };
};

export const acSetDefaultCurrentGrade = () => {
  return {
    type: 'set_default_current_grade'
  };
};

export const acSelectList = payload => {
  return {
    type: 'select_product_list',
    payload
  };
};

export const acAddStore = stores => {
  return {
    type: 'add_store',
    stores
  };
};

export const acSaveGradesStore = () => {
  return {
    type: 'save_colors_store'
  };
};

export const acCloneColorsStores = () => {
  // Aplica as mesmas grades de cores para todas as lojas
  return {
    type: 'clone_colors'
  };
};

export const acChangeTab = name => {
  return {
    type: 'change_tab',
    name
  };
};

export const acCurrentProduct = (
  rowData,
  pointers,
  rowLength,
  horizontalList,
  horizontalListLength,
  keyDestaque,
  colors,
  gallery,
  produto,
  isLongPress
) => {
  // console.log('keyDestaque', keyDestaque);
  return {
    type: 'current_product',
    rowData,
    pointers,
    rowLength,
    horizontalList,
    horizontalListLength,
    keyDestaque,
    colors,
    gallery,
    produto,
    isLongPress
  };
};

export const acColorsPopUp = () => {
  return {
    type: 'colors_popup'
  };
};

export const acChangeColor = code => {
  return {
    type: 'change_color',
    code
  };
};

export const acUpdateGallery = itemKey => {
  return {
    type: 'update_gallery',
    itemKey
  };
};

export const acResetColors = () => {
  return {
    type: 'reset_colors'
  };
};

export const acChangeGallery = (url, pointerGallery) => {
  return {
    type: 'change_gallery',
    payload: url,
    pointerGallery
  };
};

export const acToggleExpanded = catalog => {
  return {
    type: 'expanded_catalog',
    catalog
  };
};

export const acSelectedSummaryEmail = payload => {
  return {
    type: 'selected_summary_email',
    payload
  };
};

export const acSelectOpt = payload => {
  return {
    type: 'select_opt',
    payload
  };
};

export const acBtnEnvelop = payload => {
  return {
    type: 'update_btn_envelop',
    payload
  };
};

export const acCarrinho = payload => {
  return {
    type: 'update_btn_carrinho',
    payload
  };
};

export const acSelecaoCarrinho = payload => {
  return {
    type: 'visualiza_selecao_carrinho',
    payload
  };
};

export const acDefineCarrinhoSelecionado = payload => {
  return {
    type: 'set_car_selected',
    payload
  };
};

export const acCheckedProduct = productsChecked => {
  return {
    type: 'checked_product',
    productsChecked
  };
};

export const acUpdateProductEmail = produto => {
  return {
    type: 'checked_product_email',
    produto
  };
};

export const acAddCheckedProduct = produto => {
  return {
    type: 'add_checked_product',
    produto
  };
};

export const acRemoveCheckedProduct = produto => {
  return {
    type: 'remove_checked_product',
    produto
  };
};

export const acUpdateComponent = (type, name) => {
  return {
    type: 'update_' + type,
    name
  };
};


export const acCopyPanelFilter = () => {
  return {
    type: 'copy_panel_filter'
  };
};

export const acUpdateCurrent = (name, newCurrent, isPanel, index, arrayPos) => {
  return {
    type: 'update_current_cat',
    name,
    isPanel,
    newCurrent,
    index,
    arrayPos
  };
};

export const acSetFilterStack = (operator, pointerFilter) => {
  return {
    type: 'set_filter_stack',
    operator,
    pointerFilter,
  };
};

export const acUpdateCurrentRemoveItem = filter => {
  return {
    type: 'update_dropdown_remove_item_catalog',
    filter
  };
};

export const acUpdateCurrentRemoveAll = () => {
  return {
    type: 'update_dropdown_remove_all'
  };
};

export const acFilterHamburguer = (hambuguerFilter, level) => {
  return {
    type: 'update_filter_hamburgue',
    hambuguerFilter,
    level
  };
};

export const acClearFilterHamburguer = () => {
  return {
    type: 'update_clear_filter_hamburgue'
  };
};

export const acClearOneFilterHamb = lv => {
  return {
    type: 'clear_one_filter_hamb',
    lv
  };
};

export const acDetailProductBtn = index => {
  return {
    type: 'buttons_detail_product',
    index
  };
};

export const acCloseAllSelectOptions = () => {
  return {
    type: 'close_all_select_options'
  };
};

export const acKeyboardState = () => {
  return {
    type: 'keyboard_state'
  };
};

export const acRowLength = rowLength => {
  return {
    type: 'row_length',
    rowLength
  };
};

export const acHorizontalList = listLength => {
  return {
    type: 'horizontal_list',
    listLength
  };
};

export const acCloseCatalogModals = () => {
  return {
    type: 'close_modals_catalog'
  };
};

export const acSetProduct = product => {
  return {
    type: 'set_product',
    product
  };
};

export const acResetButtons = () => {
  return {
    type: 'reset_buttons_catalog'
  };
};

export const acSetDataV2 = dataV2 => {
  return {
    type: 'set_dataV2',
    dataV2
  };
};

export const acSetPopUpFilter = (name, options) => {
  return {
    type: 'set_popup_filter',
    name,
    options
  };
};

export const acToggleShouldClose = () => {
  return {
    type: 'should_close_plus'
  };
};

export const acPopSelectCart = () => {
  return {
    type: 'pop_select_cart'
  };
};

export const acSelectCart = (name, index) => {
  return {
    type: 'select_cart',
    name,
    index
  };
};

export const acSetHambOptions = hamburguerMenu => {
  return {
    type: 'set_hamburguer_options',
    hamburguerMenu
  };
};

export const acSetGrades = (grades) => {
  return {
    type: 'set_grades',
    grades,
  };
};

export const acHasChildrenSelected = id => {
  return {
    type: 'has_children_selected',
    id
  };
};

export const acSetBreadCrumb = filters => {
  return {
    type: 'set_bread_crumb',
    filters
  };
};

export const setClientDefaultCar = client => {
  return {
    type: 'setClientDefaultCar',
    client
  };
};

export const acChangePrice = prices => {
  return {
    type: 'change_prices',
    prices
  };
};

export const acResetPageCat = () => {
  return {
    type: 'reset_page'
  };
};

export const acSetCarts = carts => {
  return {
    type: 'set_cars',
    carts
  };
};

export const acSetDropdownCarts = dropdown => {
  return {
    type: 'set_dropdown_carts',
    dropdown
  };
};

export const acSetDropdownCartsV2 = dropdown => {
  return {
    type: 'set_dropdown_cartsV2',
    dropdown
  };
};

export const acNavigateColor = isRight => {
  return {
    type: 'navigate_color',
    isRight
  };
};

export const acSetCurrColor = pointer => {
  return {
    type: 'set_color',
    pointer
  };
};

export const acTogglePonteiroProduto = () => {
  return {
    type: 'reset_ponteiro_prod'
  };
};

export const acSetPanel = (pointer, panel) => {
  return {
    type: 'set_panel_catalog',
    pointer,
    panel
  };
};

export const acTogglePanel = () => {
  return {
    type: 'toggle_panel_catalog'
  };
};

export const acUpdateProdDropdown = (productInfo) => {
  return {
    type: 'update_product_dropdown',
    productInfo
  };
};

export const acSetSelGrades = (dropdown, productInfo) => {
  return {
    type: 'update_product_sel_grades',
    productInfo,
    dropdown,
  };
};

export const acSortCurrCartBy = (property, isAscendant) => {
  return {
    type: 'sort_cart_by',
    property,
    isAscendant,
  };
};

export const acSetCurrProd = (newProd) => {
  return {
    type: 'set_curr_prod',
    newProd,
  };
};
export const acClearPanelFilters = () => {
  return {
    type: 'clear_panel_filters'
  };
};

export const acToggleSortBtn = (id) => {
  return {
    type: 'toggle_sort_btn_catalog',
    id,
  };
};

export const acFlushGrades = () => {
  return {
    type: 'flush_grades'
  };
};

export const acFlushCores = () => {
  return {
    type: 'flush_cores'
  };
};

export const acClosePopStock = () => {
  return {
    type: 'close_pop_stock'
  };
};

export const acCloseAssistant = () => {
  return {
    type: 'close_assistant',
  };
};

export const acUpdateSelected = () => {
  return {
    type: 'update_qt_selected',
  };
};

export const acUpdateCurrColor = (pointer) => {
  return {
    type: 'update_curr_color',
    pointer
  };
};

export const acToggleCompleteCat = () => {
  return {
    type: 'toggle_complete_cat',
  };
};
export const acEnrichProduct = (product) => {
  return {
    type: 'enrich_product',
    product,
  };
};
