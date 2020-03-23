import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { SimpleButton, Button, IconActionless as IA, Fade, SwitchButton, Gradient, TextLimit, ArrowNavigator } from '../../../../components';
import { ColorColumn, Grid } from '.';
import { Font } from '../../../../assets/fonts/font_names';
import global from '../../../../assets/styles/global';
import { first } from './functions';
import SrvProduct from '../../../../services/Product';
import SrvOrder from '../../../../services/Order/';
import { asyncForEach, extractSizes, AtivaGrades, atualizarCarrinhos, getEmbalamentoPadrao, } from '../../../../utils/CommonFns';
import { acQtGradesSelected } from '../../../../redux/actions/pages/catalog';
import { acToggleZoom, acSetToast, } from '../../../../redux/actions/global';

class Right extends React.Component {
  constructor(props) {
    super(props);
    // Flags que controlam se a View/List esta sendo movida
    // Quando ela esta sendo movida, ela nao entra em um if()
    // que possue o metodo para mover as outras
    this.gradeList = false;
    this.colorList = false;
    this.gridView = false;
    this.gradeList = false;
    // PopUp Grade
    this.gradesView = false;
    this.scrollView = false;

    this.rowHeight = 55;
    this.itemRowWidth = 80;

    this.gridHeight = 0;
    this.pageHeight = 406;
    this.pageWidth = 430;
    this.gridHeight = 21 + (props.qtGradesSelected * this.rowHeight);
    this.gridWidth = 8 + (props.qtColorsSelected * this.itemRowWidth);
    this.state = {
      vertical: {
        currentPage: 0,
        hasPrevious: false,
        hasNext: this.gridHeight > this.pageHeight,
      },
      horizontal: {
        currentPage: 0,
        hasPrevious: false,
        hasNext: this.gridWidth > this.pageWidth,
      }
    };
    this.y = {
      position: 0,
      totalPages: this.gridHeight / this.pageHeight,
    };
    this.x = {
      position: 0,
      totalPages: this.gridWidth / this.pageWidth,
    };
  }

  componentWillUnmount = () => {
    this.x.position = 0;
    this.y.position = 0;
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.qtGradesSelected !== this.props.qtGradesSelected) this.updateArrows();
    if (prevProps.qtColorsSelected !== this.props.qtColorsSelected) this.updateArrows(true);
    return null;
  }

  componentDidMount = async () => {
    await eventGrades(this.props, this.props.acQtGradesSelected);
  }

  componentDidUpdate = (prevProps, prevState) => {

  }

  render() {
    const {
      carts,
      assistantPopUps,
      product,
      grades,
      stores,
      dropdown,
      cloneColorsStores,
      acAssistantPopUp,
      acRemoveColor,
      acCurrentColor,
      acSelectedGrade,
      acCurrentGrade,
      acCloneColorsStores,
      acKeyboardState,
      acSetDefaultCurrentGrade,
      acSetGrades,
      qtGradesSelected,
      qtColorsSelected,
      assistantSelection,
      currentTable,
      produtoAgrupado,
    } = this.props;
    this.gridHeight = 21 + (qtGradesSelected * this.rowHeight);
    this.gridWidth = 8 + (qtColorsSelected * this.itemRowWidth);
    this.y.totalPages = this.gridHeight / this.pageHeight;
    this.x.totalPages = this.gridWidth / this.pageWidth;
    const colorPopUp = assistantPopUps[0].isChosen;
    const gradesPopUp = assistantPopUps[1].isChosen;

    return (
      <View style={[styles.borderColor, { flex: 2.25, borderLeftWidth: 0.75, backgroundColor: 'white' }]}>
        <View style={[styles.borderColor, styles.header]}>
          <Text style={[global.h4, { marginLeft: 20 }]}>Defina cores, grades e quantidades</Text>
          <View style={{ flex: 1 }}>
            <SimpleButton
              tchbStyle={styles.btnInsert}
              txtStyle={styles.txtLink}
              msg="Limpar definições"
              action={async () => {
                  await SrvOrder.removerProdutosByModel(product.code, dropdown.current.key);
                  atualizarCarrinhos({ carts, acSetDropdownCarts: this.props.acSetDropdownCarts });
                  this.props.acDeselectAllColors();
                  this.props.acDeselectAllGrades();
                  this.props.acFlushGrades();
                  this.props.acFlushCores();
                }}
            />
          </View>
        </View>
        <View style={[styles.borderColor, { flex: 6, borderBottomWidth: 0.75 }]}>
          <Gradient
            range={['rgba(0,133,178, 0.15)', 'rgba(0,133,178, 0.09)', 'rgba(0,133,178, 0)']}
            webId="lineargradient-right"
            style={styles.linearGradient}
          />
          <View data-id="gradient" style={[styles.linearGradient, { zIndex: 4 }]}>
            {/*
                  stores.length > 1 ?
                    <FlatList
                      style={tabs}
                      horizontal
                      data={stores}
                      keyExtractor={item => item.name}
                      renderItem={({ item }) => {
                        return (
                          <Tab
                            key={item.name}
                            active={item.isActive}
                            name={item.name.toUpperCase()}
                            vwActive={tab.vwActive}
                            vwNotActive={tab.vwNotActive}
                            txtActive={tab.txtActive}
                            txtNotActive={tab.txtNotActive}
                            actions={[
                              { func: acSaveGradesStore, params: [] },
                              { func: acChangeTab, params: [item.name] }
                            ]}
                          />
                        );
                      }}
                    />
                  :
                    null
                */}
          </View>
          <View data-id="body" style={[styles.bodyBody, { zIndex: 5, paddingTop: stores.length > 1 ? 65 : 15 }]}>
            {/* lado Esquerdo do body */}
            <View
              data-no-scroll="no-scroll"
              style={{ flex: 1, maxWidth: 85, paddingTop: 27 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button
                  isChosen={colorPopUp}
                  tchbStyle={global.containerCenter}
                  txtStyle={[global.icon, { fontSize: 21 }]}
                  txtMsg="-"
                  actions={[{ func: acAssistantPopUp, params: ['colors'] }, { func: this.props.acToggleMask, params: [] }]}
                  shadow
                  changeColor
                  chosenColor="#0085B2"
                  nChosenColor="rgba(0, 0, 0, 0.3)"
                />
                <Text style={[[global.containerCenter, styles.txtSelection], { marginLeft: 3 }]}>CORES</Text>
              </View>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 35, paddingLeft: 5 }}
              >
                <TouchableOpacity
                  disabled={false}
                  activeOpacity={gradesPopUp ? 1 : 0.7}
                  onPress={() => {
                    const coresAtivas = product.colors.find(p => p.isChosen);
                    if (!coresAtivas) {
                      return this.props.acSetToast({ text: 'Selecione ao menos uma cor' });
                    }
                    this.props.acAssistantPopUp('grades');
                    this.props.acToggleMask();
                  }}
                >
                  <Text style={[global.icon, { fontSize: 21 }, gradesPopUp
                      ? [global.txtActiveShadow, global.activeColor]
                      : { color: 'rgba(0, 0, 0, 0.3)' }]}
                  >§
                  </Text>
                </TouchableOpacity>
                <Text style={styles.txtSelection}>GRADES</Text>
              </View>
              <FlatList
                scrollEnabled={false}
                data={grades}
                data-no-scroll="no-scroll"
                showsVerticalScrollIndicator={false}
                ref={flatList => { this._gradesList = flatList; }}
                renderItem={({ item, index }) => {
                    if (item.isChosen) this.selectedGrades = this.selectedGrades + 1;
                    return (
                      <Grade
                        grades={grades}
                        grade={item}
                        last={index === grades.length - 1}
                        index={index}
                        acSelectedGrade={acSelectedGrade}
                        product={product}
                        carts={carts}
                        dropdown={dropdown}
                        acSetDropdownCarts={this.props.acSetDropdownCarts}
                        colors={product.colors}
                        currentTable={currentTable}
                      />
                    );
                  }}
                keyExtractor={(item) => item.name}
              />
            </View>
            {/* lado Direito do body */}
            <View style={{ flex: 6, flexDirection: 'row', paddingLeft: 10 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, maxHeight: Platform.OS === 'web' ? 90 : 125 }}>
                  <FlatList
                    scrollEnabled={false}
                    data-no-scroll="no-scroll"
                    style={{ maxWidth: 430 }}
                    horizontal
                    data={assistantSelection.product.colors}
                    showsHorizontalScrollIndicator={false}
                    ref={flatList => { this._colorList = flatList; }}
                    renderItem={({ item, index }) => (
                      <ColorColumn
                        index={index}
                        color={item}
                        grades={grades}
                        acRemoveColor={acRemoveColor}
                        product={product}
                        carts={carts}
                        dropdown={dropdown}
                        acSetDropdownCarts={this.props.acSetDropdownCarts}
                        acSetGrades={acSetGrades}
                        acToggleZoom={this.props.acToggleZoom}
                        acFlushGrades={this.props.acFlushGrades}
                      />
                    )}
                    keyExtractor={(item) => item.name}
                  />
                </View>
                <View style={{ flex: 4.3 }}>
                  <ScrollView
                    style={{ maxWidth: 430 }}
                    horizontal
                    data-no-scroll="no-scroll"
                    scrollEnabled={false}
                    disableScrollViewPanResponder={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    ref={scrollView => { this._gridViewX = scrollView; }}
                  >
                    <ScrollView
                      contentContainerStyle={{ flexDirection: 'row' }}
                      data-no-scroll="no-scroll"
                        // onContentSizeChange={(width, height) => { console.log('HEIGHT', height); }}
                      ref={scrollView => { this._gridViewY = scrollView; }}
                      scrollEnabled={false}
                      disableScrollViewPanResponder={false}
                      showsHorizontalScrollIndicator={false}
                    >
                      <Grid
                        carts={carts}
                        product={produtoAgrupado}
                        stores={stores}
                        grades={grades}
                        dropdown={dropdown}
                        acCurrentGrade={acCurrentGrade}
                        acCurrentColor={acCurrentColor}
                        acKeyboardState={acKeyboardState}
                        acSetDefaultCurrentGrade={acSetDefaultCurrentGrade}
                        acSetDropdownCarts={this.props.acSetDropdownCarts}
                      />
                    </ScrollView>
                  </ScrollView>
                </View>
              </View>
              <View style={{ height: '100%', paddingHorizontal: 21 }}>
                <Fade visible={this.x.totalPages > 1} style={{ height: 90, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowNavigator
                    hasNext={this.state.horizontal.hasNext}
                    hasPrevious={this.state.horizontal.hasPrevious}
                    navigateToPrevious={() => this.navigateList(true, true)}
                    navigateToNext={() => this.navigateList(true, false)}
                  />
                </Fade>
                <Fade visible={this.y.totalPages > 1} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ArrowNavigator
                    isVertical
                    hasNext={this.state.vertical.hasNext}
                    hasPrevious={this.state.vertical.hasPrevious}
                    navigateToPrevious={() => this.navigateList(false, true)}
                    navigateToNext={() => this.navigateList(false)}
                  />
                </Fade>
              </View>
            </View>
          </View>
        </View>
        {/* FOOTER */}
        <View style={global.containerCenter} >
          {/*
            stores.length > 1 ?
              <View style={[global.containerCenter, { flexDirection: 'row' }]}>
                <Text style={global.text}>Copiar cores e grades para todas as lojas?</Text>
                <SwitchButton
                  active={cloneColorsStores}
                  actions={[
                    {
                      func: acCloneColorsStores,
                      params: []
                    }
                  ]}
                />
              </View>
            :
            null
          */}
        </View>
      </View>
    );
  }

  navigateList = (isHorizontal, toPrevious) => {
    // Mudando os parâmetros para as alterações serem no objeto/state horizontal ou vertical
    // Que são responsáveis por mover a malha e lista, seja horizontal ou vertical
    const grid = isHorizontal ? '_gridViewX' : '_gridViewY';
    const list =  isHorizontal ? '_colorList' : '_gradesList';
    const pageDimension = isHorizontal ? this.pageWidth : this.pageHeight;
    const orientation = isHorizontal ? 'x' : 'y';
    // Se navegar "toPrevious" deve subtrair para subir o GRID
    const operation = toPrevious ? 'subtract' : 'sum';
    const nextPosition = this[operation](this[orientation].position, pageDimension);
    // console.log('this[orientation]', orientation, this[orientation], this.gridWidth, nextPosition);
    if (nextPosition >= 0 && nextPosition <= pageDimension) {
      this[orientation].position = this[operation](this[orientation].position, pageDimension);
      this[grid].scrollTo({ [orientation]: this[orientation].position, animated: true });
      this[list].scrollToOffset({ offset: this[orientation].position, animated: true });

      // Atualiza as setas de navegação para ativadas ou desativadas
      this.updateArrows(isHorizontal, toPrevious, true);
    }
  }

  updateArrows = (isHorizontal, toPrevious, isNavigation) => {
    const orientation = isHorizontal ? 'x' : 'y';
    const stateOrientation  = isHorizontal ? 'horizontal' : 'vertical';
    const operation = toPrevious ? 'subtract' : 'sum';
    let currentPage = this.state[stateOrientation].currentPage;
    if (isNavigation) currentPage = this[operation](this.state[stateOrientation].currentPage, 1);
    const hasNext = currentPage < Math.trunc(this[orientation].totalPages);
    // console.log('this[orientation+TotalPages]', this.rowHeight, this.props.qtGradesSelected, this[orientation + 'TotalPages'], hasNext);
    const hasPrevious = currentPage > 0;
    this.setState({
      [stateOrientation]: {
        currentPage,
        hasNext,
        hasPrevious,
      }
    });
  }
  sum = (a, b) => a + b;
  subtract = (a, b) => a - b;
}

const mapStateToProps = (state) => ({
  qtGradesSelected: state.catalog.qtGradesSelected,
  qtColorsSelected: state.catalog.qtColorsSelected,
});
const mapDispatchToProps = {
  acQtGradesSelected,
  acToggleZoom,
  acSetToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(Right);

const paginate = (arr, perpage, page) => {
  return arr.slice(perpage * (page - 1), perpage * page);
};

const eventGrades = async ({
  assistantSelection,  
  acSetGrades,
  grades,
  product,
  dropdown,
}, acQtGradesSelected) => {
  let gradesCurrent = grades.length === 0 && assistantSelection.isOpen ? await SrvProduct.getGrades(product.code) : grades;
  const sizes = extractSizes(gradesCurrent);
  product.sizes = sizes;

  gradesCurrent = AtivaGrades(gradesCurrent, dropdown, assistantSelection.product.code);
  acSetGrades(paginate(gradesCurrent.grades, 30, 1));
  acQtGradesSelected(gradesCurrent.qtSelected);
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.75,
  },
  btnInsert: {
    alignSelf: 'flex-end',
    marginRight: 15,
    borderRadius: null,
    backgroundColor: null,
    elevation: null,
    shadowOffset: null,
    shadowRadius: null,
    shadowColor: null,
    shadowOpacity: null
  },
  txtLink: {
    color: '#0085B2',
    fontSize: 13,
    fontWeight: null,
    textDecorationLine: 'underline',
    fontFamily: Font.ARegular,
  },
  borderColor: {
    borderColor: 'rgba(0, 0, 0, 0.2)'
  },
  linearGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    height: 55,
    width: '100%',
    paddingLeft: 20,
    zIndex: 4,
  },
  bodyBody: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 65,
    paddingLeft: 19,
  },
  txtSelection: {
    fontFamily: Font.ASemiBold,
    fontSize: 10,
    color: 'black',
    letterSpacing: 1,
    marginLeft: 10
  },
  vwIT: {
    justifyContent: 'center',
    height: 45,
    width: 70,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#999',
    paddingLeft: Platform.OS === 'web' ? 22 : 13
  },
});

const Grade = ({ colors, grades, grade, acSelectedGrade, product, carts, dropdown, acSetDropdownCarts, currentTable, }) => {
  const { isChosen, name } = grade;
  if (isChosen) {
    return (
      <View
        style={{
          alignItems: 'center', flexDirection: 'row', height: 45, marginTop: first(grades) === grade ? 10 : 5
        }}
      >
        <TouchableOpacity
          onPress={async () => {
            acSelectedGrade(name);

            await SrvOrder.removerProdutosByGrade(product.code, name, dropdown.current.key);

            const cartDefault = carts.find(car => car.key === dropdown.current.key);
            let embalamentoPadrao = await getEmbalamentoPadrao(dropdown.current.sf_account_id);
            let sf_unit_price = null;
            if (embalamentoPadrao) {
              const price = product.prices.find(p => p.label === embalamentoPadrao);
              if (!price) {
                embalamentoPadrao = product.prices[0].name4;
              }
              sf_unit_price = price ? price.sf_unit_price : product.prices[0].sf_unit_price;
            } else if (product.prices.length > 0) {
              embalamentoPadrao = product.prices[0].ref4;
              sf_unit_price = product.prices[0].sf_unit_price;
            }

            // Reincere as linhas das cores ativas.
            if (grades.filter(g => g.isChosen).length === 1) {
              await asyncForEach(colors.filter(c => c.isChosen), async (cor) => {
                await SrvOrder.addProduto({
                  quote_sfa_guid__c: dropdown.current.key,
                  ref1: product.code,
                  ref2: cor.code,
                  ref4: embalamentoPadrao,
                  sf_unit_price,
                  sf_description: product.name,
                  sf_photo_file_name__c: `${product.code}${cor.code}00`,
                });
              });
            }

            atualizarCarrinhos({ carts, acSetDropdownCarts, });
          }}
          style={global.containerCenter}
        >
          <Text style={[global.iconClose, { fontSize: 19 }]}>t</Text>
        </TouchableOpacity>
        <Text
          style={[global.containerCenter, { textDecorationLine: 'underline', fontFamily: Font.ALight, color: 'rgba(0,0, 0, 0.6)' }]}
        >
          {name}
        </Text>
      </View>
    );
  }
  return null;
};

const isChosenEqual = (array, nextArray) => {
  const isModified = array.some((element, index) => {
    if (nextArray.length > 0 && element.isChosen !== nextArray[index].isChosen) {
      return true;
    }
    return false;
  });

  return isModified;
};

const Tab = ({
  name, active, vwActive, vwNotActive,
  txtActive, txtNotActive, actions
}) => {
  let view = vwNotActive;
  let txt = txtNotActive;
  if (active) {
    view = vwActive;
    txt = txtActive;
  }
  return (
    <View>
      <TouchableOpacity
        activeOpacity={1}
        style={[{ flex: 1 }, view]}
        onPress={() => actions.forEach(({ func, params }) => { func(...params); })}
      >
        <TextLimit
          style={txt}
          msg={name}
          maxLength={10}
        />
      </TouchableOpacity>
    </View>
  );
};

const tab = StyleSheet.create({
  vwActive: {
    width: 125,
    height: 100,
    alignItems: 'center',
    borderTopColor: '#2D7A8D',
    borderTopWidth: 3,
    padding: 5,
    paddingBottom: 2
  },
  vwNotActive: {
    width: 125,
    height: 100,
    alignItems: 'center',
    padding: 5,
    paddingBottom: 2
  },
  txtActive: {
    fontFamily: Font.ASemiBold,
    fontSize: 13,
    color: '#2D7A8D',
    textAlign: 'center'
  },
  txtNotActive: {
    fontFamily: Font.AMedium,
    fontSize: 12,
    color: '#4F9CAF',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 4,
  }
});
