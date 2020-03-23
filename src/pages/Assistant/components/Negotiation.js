import React, { Component } from 'react';
import { Text, View, Animated, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Forward from './Forward';
import { Fade, IconActionless, DropDown, TextLimit, Button, SimpleDropDown } from '../../../components';
import { Font } from '../../../assets/fonts/font_names';
import * as assitantActions from '../../../redux/actions/pages/assistant';
import global from '../../../assets/styles/global';

class Negotiation extends Component {
  constructor(props) {
    super(props);
    this.type = 32;
    this.resetState = this.resetState.bind(this);
  }

  render() {
    const { filterBranches, client, stores, acResetFilterBranches, acUnchooseAllStores, acUnchoooseStore } = this.props;
    return (
      <View style={styles.container}>
        <View>
          <Fade
            visible={client.name !== undefined}
          >
            <Forward
              containerStyle={{ marginBottom: 16, alignSelf: 'center', }}
              screen={1}
              {...this.props}
            />

          </Fade>
          <View style={{ opacity: this.props.filterBranches[0] ? 0.4 : 1, alignSelf: 'center', marginTop: client.name === undefined ? 3 : 6 }}>
            <Text style={[global.h7SemiBold, {
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: 12,
                  // marginTop: -4,
                  margin: 1,
                  marginBottom: 1.5,
                  alignSelf: 'flex-start'
                  // marginLeft: 5
                }]}
            >
                  TIPO
            </Text>
            <DropDown
              disabled={this.props.filterBranches[0] || this.props.client.name !== undefined || this.props.typeOptions === null}
              container={{ width: 160, marginTop: 0, marginBottom: 1 }}
              current={{ name: this.props.dropType.current }}
              acOpenCloseDropDown={this.props.acToggleDropType}
              maxLength={6}
            />
          </View>
        </View>
        <Fade
          visible={filterBranches[0] && client.name !== undefined}
          style={styles.body}
        >
          <View
            style={styles.ctStoresSelected}
          >
            <Text style={styles.lblStores}>LOJAS EM NEGOCIAÇÃO</Text>
            <Button
              txtMsg="w"
              txtStyle={[styles.deleteIcon, { color: 'rgba(0, 0, 0, 0.5)' }]}
              tchbStyle={{ marginRight: 10 }}
              actions={[
                {
                  func: acUnchooseAllStores,
                  params: []
                },
                {
                  func: this.props.setInput,
                  params: ['', '', true]
                },
                {
                  func: acResetFilterBranches,
                  params: []
                },
              ]}
            />
          </View>
          <View style={[global.defaultBox, styles.vwStoresSelected]}>
            {/* Montando um item */}
            <FlatList
              data={stores}
              style={{ flex: 1 }}
              renderItem={({ item }) => <Store info={item} acUnchoooseStore={acUnchoooseStore} resetState={this.resetState} />}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </Fade>

      </View>
    );
  }

  resetState(isHq) {
    const { setInput, acResetFilterBranches, stores, filterBranches } = this.props;
    // Quando retirar todas as lojas em negociacao, desde que nao seja uma matriz, volta ao estado inicial
    if (stores.length === 1 && filterBranches[0] && !isHq) {
      setInput('', '', true);
      acResetFilterBranches();
    }
  }
}

const mapStateToProps = state => ({
  filterBranches: state.assistant.filterBranches,
          stores: state.assistant.stores,
        dropType: state.assistant.dropType,
     typeOptions: state.assistant.typeOptions,
          client: state.assistant.client,
});

export default connect(mapStateToProps, { ...assitantActions })(Negotiation);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingLeft: 4,
    paddingBottom: 25,
    width: 200
  },
  h1: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 12
  },
  vwMode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 9,
  },
  iconStore: {
    fontSize: 27,
    color: 'rgba(0, 0, 0, 0.3)',
  },
  deleteIcon: {
    fontFamily: Font.C,
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  vwSwitch: {
    width: 45,
    height: 25,
    marginLeft: 2,
    marginRight: 2,
  },
  body: {
    flex: 1,
    width: '100%',
    paddingTop: 9
  },
  ctStoresSelected: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 27,
    paddingBottom: 3,
    marginBottom: 6,
    maxWidth: 160,
  },
  lblStores: {
    fontSize: 12,
    fontFamily: Font.BSemiBold,
    color: 'rgba(0, 0, 0, 0.7)',
    alignSelf: 'flex-end'
  },
  vwStoresSelected: {
    flex: 1,
    width: 160,
    opacity: 0.7,
    paddingLeft: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    height: 38,
  },
  txtItem: {
    fontFamily: Font.ABold,
    fontSize: 12,
  },
});

const Store = ({ info, acUnchoooseStore, resetState }) => {
  const hqStyle = info.isHq ? { borderBottomWidth: 0.75, borderColor: '#999', marginRight: 10 } : null;
  return (
    <View
      style={[styles.item, hqStyle]}
    >
      {
        info.isHq ?
          <IconActionless style={{ fontSize: 14, marginRight: 6, color: 'black' }} msg="º" />
        :
          null
      }
      <TextLimit
        style={[styles.txtItem, { marginLeft: info.isHq ? 0 : 24 }]}
        msg={info.name.toUpperCase()}
        maxLength={5}
      />
      <Button
        txtMsg="w"
        actions={[
          {
            func: acUnchoooseStore,
            params: [info.name],
          },
          {
            func: resetState,
            params: [info.isHq]
          }
        ]}
        txtStyle={styles.deleteIcon}
        tchbStyle={{ position: 'absolute', right: info.isHq ? 0 : 10 }}
      />
    </View>
  );
};