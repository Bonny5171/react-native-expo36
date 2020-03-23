import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { DropDown, DropDownView, SimpleButton } from '../../../components';
import { Font } from '../../../assets/fonts/font_names';
import global from '../../../assets/styles/global';
import { Forward } from '.';

class DefineTable extends React.Component {
  render() {
    const {
      navigation,
      stepsLabels,
      currentTable,
      dropdownTables,
      availableTables,
      acCurrentTable,
      acUpdateContext,
      acToggleDefineTable,
    } = this.props;
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={styles.container}>
          <Text style={styles.label}>TABELAS DISPONÍVEIS</Text>
          <View>
            <DropDown
              container={[global.dropdownBox, { width: stepsLabels.length === 4 ? 625 : 430 }]}
              acOpenCloseDropDown={acToggleDefineTable}
              current={currentTable}
              maxLength={30}
              shouldUpperCase
            />
            <DropDownView
              isVisible={dropdownTables}
              vwStyle={[{ width: stepsLabels.length === 4 ? 625 : 430 }, { transform: [{ translateY: -8 }] }]}
              maxHeight={265}
              options={availableTables}
              acToggleDropdown={acToggleDefineTable}
              updateCurrent={acCurrentTable}
              fullObject
              isSimpleString={false}
              txtItemStyle={{ fontSize: 16 }}
              maxLength={30}
              shouldUpperCase
            />
          </View>
        </View>
        {
          stepsLabels.length === 4 ?
            <Forward
              containerStyle={{ marginTop: 18, marginRight: 96 }}
              disabled={currentTable.name === 'Buscando tabela de preço'}
              {...this.props}
            />
            :
            <View style={{ flex: 2, paddingRight: 65, paddingTop: 19 }}>
              <SimpleButton
                tchbStyle={{ width: 250 }}
                msg="IR PARA O CATÁLOGO"
                action={() => {
                  const params = {
                    isShowCase: this.props.checkboxes[1]
                  };
                  const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'catalog', params })]
                  });
                  navigation.dispatch(resetAction);
                  acUpdateContext('Vendedor');
                }}
              />
            </View>
        }
      </View>
    );
  }
}

export default DefineTable;

const styles = StyleSheet.create({
  container: {
    flex: 5,
  },
  text: {
    color: 'black',
    fontSize: 20,
    fontFamily: Font.BThin,
  },
  label: {
    fontFamily: Font.AMedium,
    fontSize: 12,
    marginBottom: 4
  },
  ddContainer: {
    width: 625,
  },
  txtItem: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: Font.ALight,
    color: '#666'
  }
});