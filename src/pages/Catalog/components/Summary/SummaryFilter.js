import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button, Fade, InputText, Filters } from '../../../../components';
import { Font } from '../../../../assets/fonts/font_names';
import global from '../../../../assets/styles/global';
import { DropDownView } from '../../../Clients/components';
import SrvProduct from '../../../../services/Product/';

class SummaryFilter extends React.PureComponent {
  state = {
    filters: {
      name: '',
      // situation: '',
      // sector: '',
      positivacao: {
        de: '',
        a: ''
      }
    }
  }

  render() {
    const {
      panelFilter,
      acUpdateCurrent,
    } = this.props;
    this.hasFilters = panelFilter.find(({ current }) => current !== '');

    return (
      <View style={global.flexOne}>
        <View style={{ borderBottomWidth: 1, width: '100%', borderBottomColor: '#CCC', paddingBottom: 10 }}>
          <Text style={[global.txtLabel, { fontSize: 11, marginBottom: 2 }]}>PRODUTO/CÓDIGO</Text>
          <InputText
            inputStyle={{ width: '100%' }}
            onChangeText={(text) => {
              acUpdateCurrent('produto', text, true);
            }
            }
            clearAction={() => acUpdateCurrent('produto', '', true)}
            value={panelFilter[9].current}
          />
        </View>
        <ScrollView style={[{ flex: 1, paddingTop: 20 }, global.separatorBorder]}>
          {/* dropArquetipo */}
          <Filters
            hasTitle
            title={panelFilter[0].desc.toUpperCase()}
            name={panelFilter[0].name}
            pointerFilter={0}
            setFilterStack={this.props.acSetFilterStack}
            currStack={panelFilter[0].currStack}
            filters={panelFilter[0].options}
            current={panelFilter[0].current}
            chooseFilter={this.chooseFilter}
            containerStyle={styles.vwFilters}
          />
          {/* "dropMarcas" */}
          <Filters
            hasTitle
            title={panelFilter[4].desc.toUpperCase()}
            name={panelFilter[4].name}
            pointerFilter={4}
            setFilterStack={this.props.acSetFilterStack}
            currStack={panelFilter[4].currStack}
            filters={panelFilter[4].options}
            current={panelFilter[4].current}
            chooseFilter={this.chooseFilter}
            containerStyle={styles.vwFilters}
          />
          {/* "dropMesLancamento" */}
          <Filters
            hasTitle
            title={panelFilter[5].desc.toUpperCase()}
            name={panelFilter[5].name}
            pointerFilter={5}
            setFilterStack={this.props.acSetFilterStack}
            currStack={panelFilter[5].currStack}
            filters={panelFilter[5].options}
            current={panelFilter[5].current}
            chooseFilter={this.chooseFilter}
            containerStyle={styles.vwFilters}
          />
          {/* "dropMesLancamento" */}
          <Filters
            hasTitle
            title={panelFilter[6].desc.toUpperCase()}
            name={panelFilter[6].name}
            pointerFilter={6}
            setFilterStack={this.props.acSetFilterStack}
            currStack={panelFilter[6].currStack}
            filters={panelFilter[6].options}
            current={panelFilter[6].current}
            chooseFilter={this.chooseFilter}
            containerStyle={styles.vwFilters}
          />
          {/* "dropTags" */}
          <Filters
             hasTitle
             title={panelFilter[13].desc.toUpperCase()}
             name={panelFilter[13].name}
             pointerFilter={13}
             setFilterStack={this.props.acSetFilterStack}
             currStack={panelFilter[13].currStack}
             filters={panelFilter[13].options}
             current={panelFilter[13].current}
             chooseFilter={this.chooseFilter}
             containerStyle={styles.vwFilters}
           />
        </ScrollView>
        <View style={{ paddingVertical: 15, alignItems: 'center' }}>
          <Button
            tchbStyle={styles.btnBuscar}
            txtMsg="BUSCAR"
            txtStyle={{
              fontSize: 16,
              color: 'white',
              fontFamily: Font.ASemiBold,
              textAlign: 'center',
            }}
            action={this.searchClicked}
          />
        </View>
      </View>
    );
  }

  searchClicked = async (shouldResetSearch) => {
    const {
      panelFilter,
      currentTable,
      sortButtons,
    } = this.props;
    if (!this.hasFilters) {
      this.chooseFilter({ option: 'TODOS MODELOS' }, 12, 'busca');
    }
    this.props.toggleIsQuering();
    this.props.acCopyPanelFilter();
    this.props.acToggleMask();
    let filters = {
      name: panelFilter[9].current,
      arquetipo: panelFilter[0].current,
      grupo: panelFilter[1].current,
      status: panelFilter[2].current,
      tamanho: panelFilter[3].current,
      marca: panelFilter[4].current,
      genero: panelFilter[6].current,
      mesLancamento: panelFilter[5].current,
      tag: panelFilter[13].current,
      cor: panelFilter[7].filters,
      positivacao: {
        de: this.state.filters.positivacao.de,
        a: this.state.filters.positivacao.a
      }
    };
    if (shouldResetSearch) filters = {};

    await this.props.acClosePopUp();
    // Timeout para aguardar o painel terminar de fechar
    await setTimeout(async () => {
      this.props.setListHeight(0);

      const order = sortButtons.find(p => p.isActive);
      const data = await SrvProduct.filter(
        filters,
        currentTable.code,
        [order.prop],
        order.isAscendant,
        this.props.client.sf_id,
        this.props.isCompleteCat
      );

      this.props.acSetDataV2(data);
      this.props.acSetResultFinder(true);
      this.props.toggleIsQuering();
    }, 600);
  }

  clearInput = () => {
    this.props.acUpdateCurrent('produto', '');
    if (this.selectedFilters === 1) this.searchClicked(true);
  }
  chooseFilter = (item, index, name) => {
    this.props.acUpdateComponent('dropdown', name);
    this.props.acUpdateCurrent(name, item.option, true);
  }

  _renderGrupo() {
    const stl = {
      position: 'absolute',
      marginLeft: 410,
      marginTop: 124,
      width: 150,
      maxHeight: 200,
    };

    const {
      acUpdateComponent, acCopyPanelFilter,
      acUpdateCurrent, panelFilter
    } = this.props;

    return (
      <Fade visible={panelFilter[1].isChosen} style={stl}>
        <DropDownView
          vwStyle={{ paddingBottom: 6, maxHeight: 190, }}
          name="dropGrupo"
          acUpdateComponent={acUpdateComponent}
          acUpdateCurrent={acUpdateCurrent}
          isVisible
          options={panelFilter[1].options}
        />
      </Fade>
    );
  }

  _renderStatus() {
    const stl = {
      position: 'absolute',
      marginLeft: 580,
      marginTop: 124,
      width: 150,
      maxHeight: 200,
    };

    const {
      acUpdateComponent,
      acUpdateCurrent, panelFilter
    } = this.props;

    return (
      <Fade visible={panelFilter[2].isChosen} style={stl}>

        <DropDownView
          vwStyle={{ paddingBottom: 6, maxHeight: 190, }}
          name="dropStatus"
          acUpdateComponent={acUpdateComponent}
          acUpdateCurrent={acUpdateCurrent}
          isVisible
          options={panelFilter[2].options}
        />
      </Fade>
    );
  }

  _renderTamanhos() {
    const stl = {
      position: 'absolute',
      marginLeft: 750,
      marginTop: 124,
      width: 150,
    };

    const {
      acUpdateComponent,
      acUpdateCurrent, panelFilter
    } = this.props;

    return (
      <Fade visible={panelFilter[3].isChosen} style={stl}>
        <DropDownView
          vwStyle={{ paddingBottom: 6, maxHeight: 190, }}
          name="dropTamanhos"
          acUpdateComponent={acUpdateComponent}
          acUpdateCurrent={acUpdateCurrent}
          isVisible
          checkOption
          options={panelFilter[3].options}
          arrayPos={3}
        />
      </Fade>
    );
  }

  _renderCores() {
    const stl = {
      position: 'absolute',
      marginLeft: 460,
      marginTop: 211,
      width: 200,
      maxHeight: 200,
    };

    const {
      acUpdateComponent,
      acUpdateCurrent, panelFilter
    } = this.props;

    return (
      <Fade visible={panelFilter[6].isChosen} style={stl}>
        <DropDownView
          vwStyle={{ paddingBottom: 6, maxHeight: 190, }}
          name="dropCor"
          acUpdateComponent={acUpdateComponent}
          acUpdateCurrent={acUpdateCurrent}
          isVisible
          options={panelFilter[6].options}
          arrayPos={6}
          checkOption
        />
      </Fade>
    );
  }
}


export default SummaryFilter;

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      width: '100%',
    },
    vwFilters: {
      marginBottom: 12,
    },
    header: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 15
    },
    icMail: {
      fontFamily: Font.C,
      color: 'rgba(0, 0, 0, 0.3)',
      fontSize: 30
    },
    goToCartPage: {
      fontFamily: Font.ALight,
      fontSize: 18,
      textDecorationLine: 'underline',
      color: '#359EC2',
    },
    buttons: {
      backgroundColor: '#0085B2',
      height: 40,
      borderRadius: 45,
      justifyContent: 'center',
    },
    txtButtons: {
      fontSize: 20,
      color: 'white',
      fontFamily: Font.ALight,
      textAlign: 'center'
    },
    btnBuscar: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 36,
      width: 115,
      borderRadius: 45,
      backgroundColor: '#0085B2',
      shadowOffset: { height: 1, width: 1 },
      shadowRadius: 8,
      shadowColor: 'rgba(0, 0, 0, 0.3)',
    },
  }
);