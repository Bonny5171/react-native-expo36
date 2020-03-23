import React, { Component } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { Font } from '../../../../assets/fonts/font_names';
import { TextLimit, ImageLoad } from '../../../../components';
import global from '../../../../assets/styles/global';
import { assistant } from '../../../../services/Pages/Assistant';

class Card extends Component {
  constructor(props) {
    super(props);
    this._mounted = false;
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const { store, acSetClients } = this.props;
    if (store.comercial.address === undefined) return null;
    return (
      // { height: Platform.OS === 'web' ? 106 : 116 }
      <TouchableOpacity
        onPress={this.handleClick}
        style={[styles.container, global.shadow]}
      >
        <View style={{ width: '20%', paddingVertical: 8, paddingHorizontal: 10 }}>
          <ImageLoad
            documentId={store.sf_photo1__c}
            containerStyle={{ width: '100%', height: 100,  }}
            resizeMode="cover"
          />
        </View>
        <View style={[{ width: '80%', flexDirection: 'row' }, styles.padding]}>
          <View style={{ flex: 3, }}>
            <TextLimit
              msg={store.fantasyName.toUpperCase()}
              maxLength={55}
              style={[global.txtLabel, styles.h1, { marginTop: 0 }]}
            />
            <View style={{ flexDirection: 'row' }}>
              <Text style={[global.text, styles.txt]}>{store.name !== '' ? `(${store.name.toUpperCase()})` : ''}</Text>
              <Text style={[global.text, styles.txt, { color: 'rgba(0, 0, 0, 0.6)' }]}>   {store.situation !== '[nulo]' ? store.situation.toUpperCase() : ''}</Text>
            </View>
            <Text style={[global.text, styles.txt, { paddingVertical: 11 }]}>{store.cnpj}</Text>
            <TextLimit
              msg={store.comercial.address.toUpperCase()}
              maxLength={55}
              style={[global.text, styles.txt]}
            />
            <Text style={[global.text, styles.txt]}>{store.comercial.postalCode}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={[global.h7SemiBold, styles.h1]}>{store.code}</Text>
            <CardType
              store={store}
              acSetClients={acSetClients}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  async handleClick() {
    const {
      filterBranches, client, store, setInput, acNextStep,
      acCurrentClient, acSetClients, acChooseStore2,
    } = this.props;

    if (store.type !== 'Loja') {
      // console.log('ENTREI', store);
      const result = await assistant.getBranches(store.sf_id);

      if (!filterBranches[0] && store.totalBranches > 0) {
        acSetClients(result);
        this.props.acFilterBranches(0);
      }
      // Se a loja não tiver filiais, pula para o próximo passo
      // TODO:
      // essa verificacao de undefined eh TEMPORARIA
      if (store.totalBranches === 0 || store.totalBranches === undefined) {
        await acNextStep();
      }
      if (this.props.dropType.isActive) this.props.acToggleDropType();
    }

    acChooseStore2(store.fantasyName, store.type);
    if (((client.name === undefined || client.name === '') || !filterBranches[0])) {
      acCurrentClient(store);
      if (this._mounted) setInput(store.fantasyName.toUpperCase(), store);
    }
    if (store.type === 'Loja' && !filterBranches[0]) acNextStep();
    if (((client.name === undefined || client.name === '') || !filterBranches[0])) {
      acCurrentClient(store);
      if (this._mounted) setInput(store.fantasyName.toUpperCase(), store);
    }
  }
}

export default Card;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgb(250, 250, 250)',
    elevation: 1,
    marginBottom: 10
  },
  vwImg: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
  },
  padding: {
    paddingVertical: 8,
    paddingHorizontal: 10
  },
  h1: {
    color: 'black',
    fontSize: 14,
  },
  txt: {
    color: 'black',
    fontSize: 12,
  },
});

const CardType = ({ store }) => {
  return (
    <View style={{ marginTop: 68, justifyContent: 'flex-end', flexDirection: 'row' }}>
      {
        store.type === 'Matriz' && store.totalBranches > 0 ?
          <TextLimit
            msg={`${store.totalBranches} LOJA(S)  `}
            maxLength={11}
            style={[global.text, styles.txt, global.link, { fontSize: 12, fontFamily: Font.BBold, color: 'black', textDecorationLine: null }]}
          />
        :
          null
      }
      {
        store.type !== 'Loja' ?
          <Text
            style={[global.text, styles.txt, global.link, { fontSize: 12, fontFamily: Font.BBold, opacity: 0.35, color: 'black', textDecorationLine: null }]}
          >
            {store.type !== undefined ? `${store.type.toUpperCase()}` : '[nulo]'}
          </Text>
        :
        null
      }
    </View>
  );
};