import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { DropDownView } from '.';
import SrvClients from '../../../services/Account';
import { Button, Fade, Row, InputText, SimpleButton, Filters } from '../../../components';
import global from '../../../assets/styles/global';

class FilterPopUp extends React.Component {
  constructor(props) {
    super(props);
    let txtName = '';
    if (this.props.panelFilter[2]) {
      txtName = this.props.panelFilter[2].current !== 'TODOS OS CLIENTES' ? this.props.panelFilter[2].current : '';
    }
    this.state = {
      txtName
    };
  }
  render() {
      const {
        acUpdateComponent, acFilterList, panelFilter, SrvClients,
        acSetResultFinder, acUpdateCurrent, acToggleMask
      } = this.props;
      if (!this.props.isVisible) return null;
      this.hasFilters = panelFilter.find(({ current }) => current !== '') || this.state.txtName !== '';
      return (
        <View style={global.flexOne}>
          <View style={{ borderBottomWidth: 1, width: '100%', borderBottomColor: '#CCC', paddingBottom: 10 }}>
            <Text style={[global.txtLabel, { fontSize: 11, marginBottom: 2 }]}>CLIENTE(NOME OU CÓDIGO)</Text>
            <InputText
              inputStyle={{ width: '100%' }}
              onChangeText={(text) => {
                this.setState({ txtName: text });
              }
              }
              clearAction={() => {
                this.setState({ txtName: '' });
                this.props.acUpdateCurrent('textName', '', true);
              }}
              value={this.state.txtName}
            />
          </View>
          <ScrollView style={[{ flex: 1, paddingTop: 20 }, global.separatorBorder]}>
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
          </ScrollView>
          <View style={{ paddingVertical: 15, alignItems: 'center' }}>
            <SimpleButton
              msg="BUSCAR"
              action={this.searchClicked}
              tchbStyle={{ height: 36 }}
            />
          </View>
        </View>
      );
  }

  chooseFilter = (item, index, name) => {
    this.props.acUpdateComponent('dropdown', name);
    this.props.acUpdateCurrent(name, item.option, true);
  }

  searchClicked = async () => {
    await this.props.acUpdateCurrent('textName', this.state.txtName, true);
    const { panelFilter } = this.props;
    let filters = {
      name: panelFilter[2].current,
      situation: panelFilter[0].current,
      sector: panelFilter[1].current,
      positivacao: {
        de: panelFilter[3].current,
        a: panelFilter[4].current
      }
    };
    if (!this.hasFilters) {
      filter = {};
      this.chooseFilter({ option: 'TODOS OS CLIENTES' }, 2, 'textName');
    }
    this.props.acCopyPanelFilter();
    this.props.acSetResultFinder(true);
    await SrvClients.filter(filters, this.props.acSetClients);
    this.props.acToggleMask();
    this.props.acCloseClientModals();
  }
}

export default FilterPopUp;

const styles = StyleSheet.create({
  vwFilters: {
    marginBottom: 12,
  },
});