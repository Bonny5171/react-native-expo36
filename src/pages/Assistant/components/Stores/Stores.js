import React from 'react';
import { View, Text, FlatList, } from 'react-native';
import { connect } from 'react-redux';
import { Card } from '.';
import { acNextStep, acChooseStore2, acUnchooseAllStores, acFilterBranches, acChooseAllStores, acResetFilterBranches, acCurrentClient, acToggleDropType } from '../../../../redux/actions/pages/assistant';
import { acSetClientStores, acChooseStore, } from '../../../../redux/actions/pages/client';
import { acSetClients } from '../../../../redux/actions/pages/clients';
import { CheckBox, Fade, InfoMsg } from '../../../../components';
import global from '../../../../assets/styles/global';

class Stores extends React.Component {
  constructor(props) {
    super(props);
    this.toggleAll = this.toggleAll.bind(this);
  }

  render() {
    const {
      client, data, setInput, filterBranches, acNextStep, acCurrentClient,
      acSetClientStores, acChooseStore2, acSetClients, acFilterBranches,
      filiais,
    } = this.props;
    if (data.length === 0) {
      return (
        <InfoMsg
          icon="F"
          firstMsg="Ops! Não encontramos clientes para a sua pesquisa."
          sndMsg="Consegue mudar os dados de pesquisa?"
        />
      );
    }
    return (
      <View data-id="stores-ctn" style={{ flex: 1 }}>
        {filiais &&
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: 38 }}>
            <Fade
              style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}
              visible={this.props.filterBranches[0]}
            >
              <Text style={[global.inputLbl, { marginRight: 4 }]}>SELECIONAR TODAS AS LOJAS</Text>
              <CheckBox
                isChosen={this.props.chooseAll}
                action={this.toggleAll}
                params={[]}
              />
            </Fade>
          </View>
        }
        <FlatList
          style={{ width: '100%', marginTop: 8, }}
          data={data}
          renderItem={({ item, index }) => {
            return (
              <Card
                client={client}
                store={item}
                storesSelected={data.length}
                setInput={setInput}
                filterBranches={filterBranches}
                acNextStep={acNextStep}
                acCurrentClient={acCurrentClient}
                acSetClientStores={acSetClientStores}
                acChooseStore2={acChooseStore2}
                acSetClients={acSetClients}
                acFilterBranches={acFilterBranches}
                dropType={this.props.dropType}
                acToggleDropType={this.props.acToggleDropType}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }

  toggleAll() {
    const { setInput, acChooseAllStores, acResetFilterBranches, acCurrentClient, data } = this.props;
    acChooseAllStores(data);

    if (this.props.chooseAll) {
      setInput('', '', true);
      acResetFilterBranches();
      acCurrentClient({});
    }
  }
}

const mapStateToProps = (state) => ({
  filterBranches: state.assistant.filterBranches,
          client: state.assistant.client,
       chooseAll: state.assistant.chooseAll,
       dropType: state.assistant.dropType,
});
const mapDispatchToProps = {
  acToggleDropType,
  acNextStep,
  acCurrentClient,
  acSetClientStores,
  acChooseStore,
  acChooseStore2,
  acSetClients,
  acUnchooseAllStores,
  acChooseAllStores,
  acFilterBranches,
  acResetFilterBranches,
};

export default connect(mapStateToProps, mapDispatchToProps)(Stores);