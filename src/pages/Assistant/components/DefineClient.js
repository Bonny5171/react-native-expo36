import React from 'react';
import { Text, View, StyleSheet, Platform, Animated } from 'react-native';
import { connect } from 'react-redux';
import { acToggleDropType, acCurrType, acUnchoooseStore, acResetFilterBranches, acUnchooseAllStores, acToggleHq, acCurrentClient } from '../../../redux/actions/pages/assistant';
import { InputLabel, SimpleDropDown, IconActionless, Fade, Button, CheckBox, } from '../../../components';
import { Negotiation, Stores } from '.';
import global from '../../../assets/styles/global';
import AccountDB from '../../../services/Account';
import { repository, queryBuilder as query } from '../../../services/Repository/AccountDb';
import { Font } from '../../../assets/fonts/font_names';
import { assistant } from '../../../services/Pages/Assistant';
class DefineClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      summaryCard: new Animated.Value(props.client.name !== undefined ? 42 : 0),
    };
    this._mounted = false;
    this.setInput = this.setInput.bind(this);
    this.filterType = this.filterType.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.filter = this.filter.bind(this);
  }

  async componentDidMount() {
    const { client, typeOptions } = this.props;
    this._mounted = true;
    if (typeOptions === null) {
      const select = query.select()
      .distinct()
      .field('sf_developer_name')
      .from('vw_account')
      .where('sf_developer_name in ("Matriz", "Loja")')
      .order('1');
      const repo = await repository();
      const result = await repo.query(select);
      this.props.acSetTypeOptions(result._array);
    }
    this.state.summaryCard.addListener(({ value }) => { this._value = value; });
  }

  componentWillUpdate(nextProps) {
    if (this.props.client.name !== undefined) {
      Animated.timing(this.state.summaryCard, {
        duration: 400,
        toValue: 42,
      }).start();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    this.state.summaryCard.removeAllListeners();
  }

  render() {
    const {
      data,
      client,
      isHqSelected,
      filterBranches,
    } = this.props;
    const dropPosition = { top: 57, left: 702 };
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={styles.container}>
          <View style={{ width: '100%' }}>
            <SummaryCard
              client={client}
              hasCheck={filterBranches[0]}
              isHqSelected={isHqSelected}
              height={this.state.summaryCard}
              setInput={this.setInput}
              acCurrentClient={this.props.acCurrentClient}
              acToggleHq={this.props.acToggleHq}
            />
            <View style={{ flexDirection: 'row', height: Platform.OS === 'web' ? 64 : 65, width: '100%', paddingVertical: 5, paddingTop: 3 }}>
              <InputLabel
                label={filterBranches[0] ? 'BUSQUE POR FILIAIS PARA NEGOCIAÇÃO COMPARTILHADA' : 'BUSCA'}
                hasSearch
                value={this.state.value}
                container={{ flex: 1, marginTop: -4 }}
                inputStyle={styles.input}
                ref={(ref) => { this.myTextInput = ref; }}
                onFocus={() => this.props.toggleInput()}
                onBlur={() => this.props.toggleInput()}
                onChangeText={this.onChangeText}
                setInput={this.setInput}
              />
            </View>
          </View>
          <Stores
            setInput={this.setInput}
            data={data}
            filiais={filterBranches[0]}
          />
        </View>
        <Negotiation setInput={this.setInput} />
        <SimpleDropDown
          passObject
          isVisible={this.props.dropType.isActive}
          vwStyle={{ position: 'absolute', width: 160, ...dropPosition }}
          options={this.props.typeOptions}
          acToggleDropdown={this.props.acToggleDropType}
          acUpdateCurrent={this.props.acCurrType}
          actions={[
            {
              func: this.filterType,
              params: []
            }
          ]}
          clientId={this.props.client.sf_id}
        />
      </View>
    );
  }

  async setInput(value, currentClient, shouldReset) {
    const { acSetClients, filterBranches, dropType } = this.props;

    if ((value === '' && !filterBranches[0]) || shouldReset) {
      const select = await assistant.queryClients(this.props.appDevName);
        if (dropType.current !== 'TODOS') select.where('sf_developer_name = ? COLLATE NOCASE', dropType.current);
      const result = await AccountDB.customQuery(select);
      acSetClients(result);
    }

    this.resetSearch(value, shouldReset);
    if (this.props.stores.length === 0 && this.props.filterBranches[0]) this.props.acFilterBranches(0);
    if (this._mounted) this.setState({ value: '' });
  }

  async filterType(item) {
    let select = await assistant.queryClients(this.props.appDevName);
    // select.where('sf_developer_name in ("Matriz", "Loja")');

    if (this.props.client.name !== undefined) {
      select.where('sf_parent_id = ?', this.props.client.sf_id);
    }
    if (this.state.value !== '') {
      select.where(`sf_name LIKE '%${this.state.value}%'`);
    }
    if (item !== 'TODOS') {
      select = select.where('sf_developer_name = ? COLLATE NOCASE', item);
      // console.log('select.toString()', select.toString());
    }
    const result = await AccountDB.customQuery(select);
    this.props.acSetClients(result);
  }

  onChangeText(value) {
    clearTimeout(this.timer);
    // console.log('CLEAR TIMEOUT');
    this.timer = setTimeout(() => this.filter(value), 450);
    if (this._mounted) this.setState({ value });
  }

  resetSearch(value, shouldReset) {
    if (shouldReset && value === '') {
      this.props.acCurrentClient({});
      this.props.acUnchooseAllStores();
      Animated.timing(this.state.summaryCard, {
        toValue: 0,
        duration: 200
      }).start();
    }
  }

  filter(value) {
    const {
      client,
      dropdown,
      dropType,
      srvClients,
      filterBranches,
      acFilterList,
      acToggleDropdown,
    } = this.props;
      // console.log('QUERIED');
      const filters = [];
      if (filterBranches[0]) {
        filters.push(
          {
            condition: 'a.sf_parent_id = ?',
            value: client.sf_id
          },
        );
      }
      if (dropType.current !== 'TODOS') {
        filters.push({
          condition: 'sf_developer_name = ? COLLATE NOCASE',
          value: dropType.current
        });
      }
      srvClients.filter(
        {
          name: value,
          positivacao: {
            a: '',
            de: ''
          }
        },
        acFilterList,
        true,
        filters
      );
      if (!dropdown) {
        acToggleDropdown();
      }
  }
}

const mapStateToProps = state => ({
  typeOptions: state.assistant.typeOptions,
     dropType: state.assistant.dropType,
 isHqSelected: state.assistant.isHqSelected,
       client: state.assistant.client,
   appDevName: state.global.appDevName
});
const mapDispatchToProps = {
  acCurrentClient,
  acToggleDropType,
  acCurrType,
  acUnchoooseStore,
  acUnchooseAllStores,
  acToggleHq
};


export default connect(mapStateToProps, mapDispatchToProps)(DefineClient);

const styles = StyleSheet.create({
  container: {
    flex: 1.1,
    maxWidth: 680,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    width: '100%'
  },
  summaryCard: {
    width: 666,
    height: 50,
  },
  contentCard: {
    height: 42,
    backgroundColor: 'rgb(250, 250, 250)',
    paddingHorizontal: 8,
  },
  txtCode: {
    color: 'black',
    fontSize: 14,
  },
  txt: {
    color: 'black',
    fontSize: 12,
  },
  deleteIcon: {
    fontFamily: Font.C,
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.7)',
  }
});

const SummaryCard = ({ client, height, hasCheck, isHqSelected, setInput, acToggleHq }) => {
  // console.log('RECEIVED HEIGHT', height);
  // console.log('client SUMMARY', client);
  const animatedStyle = { height };
  return (
    <Animated.View style={[styles.summaryCard, animatedStyle, { marginBottom: client.name === undefined ? null : 18, marginTop: 4 }]}>
      {
        client.name !== undefined ?
        (
          <View style={[global.shadow, styles.contentCard]}>
            <View
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
              <View style={{ flex: 5 }}>
                <Text style={[global.h7SemiBold, styles.txt]}>{client.fantasyName.toUpperCase()}</Text>
                <Text style={[global.text, styles.txt, { fontSize: 10 }]}>{`${client.name.toUpperCase()}`}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 43 }}>
                <Text style={[global.h7SemiBold, styles.txt]}>{client.code}</Text>
                <Text style={[global.text, styles.txt, { color: '#555', fontSize: 10 }]}>{`(${client.type !== undefined ? client.type.toUpperCase() : '[nulo]'})`}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {
                  hasCheck ?
                    <CheckBox
                      isChosen={isHqSelected}
                      style={{ marginRight: 8 }}
                      icStyle={{ fontSize: 20 }}
                      action={acToggleHq}
                      param={client}
                    />
                  :
                    <View style={{ width: 30, marginRight: 8 }} />
                }
                <Button
                  txtMsg="w"
                  txtStyle={styles.deleteIcon}
                  actions={[
                  {
                    func: setInput,
                    params: ['', null, true]
                  }
                ]}
                />
              </View>
            </View>
          </View>
        )
      :
          null
      }
    </Animated.View>
  );
};