import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { TagsFilter, DropTable } from '../../../../components';
import SrvProduct from '../../../../services/Product';
import { Font } from '../../../../assets/fonts/font_names';
import global from '../../../../assets/styles/global';
import {
  acSetResultFinder,
  acClearFilterHamburguer,
  acSetDataV2,
  acClearOneFilterHamb,
  acUpdateCurrentRemoveAll,
  acClosePopUp,
  acTogglePanel,
  acSetPanel,
  acPopSelectCart,
  acUpdateCurrentRemoveItem,
  acSelectProduct,
} from '../../../../redux/actions/pages/catalog';
import BreadCrumb from '../../../../components/BreadCrumb';
import { acToggleMask } from '../../../../redux/actions/global';
import { acCurrentTable } from '../../../../redux/actions/pages/assistant';

export class InformativeLine extends React.PureComponent {
  render() {
    const {
      isResultFinder,
      data,
      exibeLinhaInformativa,
      hasFilterTags,
      hasHamburguer,
      popUpFilter,
      hamburguerBreadCrumb,
      containerStyle,
      hamburguerMenu,
      selectedHamburguerFilter,
      acSetResultFinder,
      acClearOneFilterHamb
    } = this.props;
    if (!exibeLinhaInformativa) return null;
    return (
      <View style={[global.filterTags, { flexDirection: 'column', paddingLeft: 4  }, containerStyle]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 7,   }}>
          <BreadCrumb
            isVisible={hasHamburguer && selectedHamburguerFilter !== null}
            hamburguerMenu={hamburguerMenu}
            hamburguer={hamburguerBreadCrumb}
            chosenHFID={this.props.chosenHFID}
            hambuguerFilter={selectedHamburguerFilter}
            acClearOneFilterHamb={acClearOneFilterHamb}
            acSetResultFinder={acSetResultFinder}
            eventRemoveAll={this.eventRemoveAll}
            filterByMenu={this.props.filterByMenu}
            toggleIsQuering={this.props.toggleIsQuering}
          />
        </View>
        {isResultFinder && (
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={{ fontFamily: Font.BSemiBold, fontSize: 13 }}>
                {this.getTotalItens(data)} resultado(s) encontrado(s)
              </Text>
            </View>
            <TagsFilter
              panelIsVisible={this.props.panel.isVisible && hasFilterTags}
              popUpFilter={popUpFilter}
              eventRemoveAll={this.eventRemoveAll}
              eventRemoveItem={this.removeItem}
            />
          </View>
        )}
      </View>
    );
  }

  getTotalItens(data) {
    let total = 0;

    data.forEach(({ products }) => {
      total += products.length;
    });

    return total;
  }

  eventRemoveAll = async () => {
    const { currentTable } = this.props;
    this.props.toggleIsQuering();
    this.props.acUpdateCurrentRemoveAll();
    this.props.acSetResultFinder(false);
    this.props.acClearFilterHamburguer();
    const data = await SrvProduct.getCatalogo(currentTable.code, this.props.client.sf_id, this.props.isCompleteCat);
    await this.props.acSetDataV2(data);
    this.props.toggleIsQuering();
  };

  removeItem = async (name) => {
    const { currentTable, popUpFilter } = this.props;
    this.props.acUpdateCurrentRemoveItem(name);
    let filters = {
      name: popUpFilter[9].current,
      arquetipo: popUpFilter[0].current,
      grupo: popUpFilter[1].current,
      status: popUpFilter[2].current,
      tamanho: popUpFilter[3].current,
      marca: popUpFilter[4].current,
      genero: popUpFilter[6].current,
      mesLancamento: popUpFilter[5].current,
      cor: popUpFilter[7].filters,
      positivacao: {
        de: popUpFilter[10].current,
        a: popUpFilter[11].current
      }
    };
    this.props.toggleIsQuering();
    const hasFilter = popUpFilter.find(filter => filter.current !== '');
    let data = null;
    if (!hasFilter) {
      data = await SrvProduct.getCatalogo(currentTable.code, this.props.client.sf_id, this.props.isCompleteCat);
    } else {
      data = await SrvProduct.filter(filters, currentTable.code, [], true,  this.props.client.sf_id, this.props.isCompleteCat);
    }
    this.props.toggleIsQuering();
    this.props.acSelectProduct('', '');
    await this.props.acSetDataV2(data);
  }
}

const mapStateToProps = state => ({
  isResultFinder: state.catalog.isResultFinder,
  panel: state.catalog.panel,
  data: state.catalog.dataV2,
  popUpFilter: state.catalog.popUpFilter,
  chosenHFID: state.catalog.chosenHFID,
  hambuguerFilter: state.catalog.hambuguerFilter,
  hamburguerMenu: state.catalog.hamburguerMenu,
  selectedHamburguerFilter: state.catalog.selectedHamburguerFilter,
  hamburguerBreadCrumb: state.catalog.hamburguerBreadCrumb,
  modalMask: state.catalog.modalMask,
  currentTable: state.assistant.currentTable,
});

const mapDispatchToProps = {
  acUpdateCurrentRemoveAll,
  acSetResultFinder,
  acClearFilterHamburguer,
  acClearOneFilterHamb,
  acSetDataV2,
  acUpdateCurrentRemoveItem,
  acClosePopUp,
  acToggleMask,
  acCurrentTable,
  acTogglePanel,
  acSetPanel,
  acPopSelectCart,
  acSelectProduct,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InformativeLine);
