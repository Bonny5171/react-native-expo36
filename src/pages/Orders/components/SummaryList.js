import React from 'react';
import {
    View, FlatList, Text,
} from 'react-native';

import { Button, Fade, Title, Row, TranslucidHeader, TableList, TagsFilter, InfoMsg } from '../../../components';
import { SortPopUp, FilterPopUp, RowData, HeaderTL, Row as RowClients, } from './';
import SrvClients from '../../../services/Account/';
import { obterQuantidaDeCaixas } from '../../../services/Dimensions';
import styles from '../../../assets/styles/global';
import { Font } from '../../../assets/fonts/font_names';
import global from '../../../assets/styles/global';
import { asyncForEach } from '../../../utils/CommonFns';
import SrvOrder from '../../../services/Order/';

class SummaryList extends React.Component {
  getTotalItens(data) {
    let total = 0;

    data.forEach((item) => {
      total += item.length;
    });

    return total;
  }

  render() {
    // console.log('2 - render SummaryList');

    const dim = this.props.window;
    const maxHeight = dim.height;
    const { isResultFinder } = this.props;

    const groupSize = obterQuantidaDeCaixas(this.props);
    const someArray = this.props.data;
    const groups = someArray
      .map((item, index) => index % groupSize === 0 ? someArray.slice(index, index + groupSize) : null)
      .filter((item) => item);

    const hasFilterTags = this.props.popUpFilter.filter(filtro => filtro.current !== '').length > 0;

    if (groups.length === 0) {
      return (
        <View style={global.flexOne}>
          <View style={[styles.filterTags, { marginTop: 114, justifyContent: 'flex-end', }]}>
            {
              (isResultFinder && hasFilterTags) &&
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: Font.BSemiBold }}>  {this.getTotalItens(this.props.data)} cliente(s) encontrado(s)</Text>
              </View>
            }
            { (isResultFinder && hasFilterTags) && <TagsFilter
              {...this.props}
              eventRemoveAll={this.eventRemoveAll}
              eventRemoveItem={this.removeItem}
            /> }

          </View>
          <InfoMsg
            icon="F"
            firstMsg="Ops! Não encontramos clientes para a sua pesquisa."
            sndMsg="Consegue mudar os dados de pesquisa?"
          />
        </View>
      );
    }

    // console.log('data >', groups);
    return (
      <FlatList
        style={{ maxHeight: '100%', marginTop: 55, paddingBottom: 20 }}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        onEndReached={() => this.props.loadMore()}
        onScroll={(event) => {
          this.props.setListHeight(event.nativeEvent.contentOffset.y);
        }}
        data={groups}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          if (index === 0) {
            return (
              <View key={index.toString()}>
                <View style={[styles.filterTags, { marginTop: 60, justifyContent: 'flex-end', }]}>
                  {
                    (isResultFinder && hasFilterTags) &&
                    <View>
                      <Text style={{ fontFamily: Font.BSemiBold, fontSize: 13 }}>  {this.getTotalItens(groups)} resultado(s) encontrado(s)</Text>
                    </View>
                  }
                  { (isResultFinder && hasFilterTags) && <TagsFilter
                    {...this.props}
                    eventRemoveAll={this.eventRemoveAll}
                    eventRemoveItem={this.removeItem}
                  /> }
                </View>
                <RowClients
                  index={index}
                  name={item.fantasyName}
                  code={item.code}
                  item={item}
                  {...this.props}
                  groupSize={groupSize}
                  dataClientes={item}
                />
              </View>
            );
          }

          return (
            <RowClients
              key={index.toString()}
              index={index}
              groupSize={groupSize}
              name={item.fantasyName}
              code={item.code}
              item={item}
              {...this.props}
              dataClientes={item}
            />
            );
          }
        }
      />
    );
  }

  removeItem = async (name) => {
    await this.props.acUpdateCurrentRemoveItem(name);

    const { panelFilter, context, } = this.props;

    let orders = [];
    if (context === 'Admin') {
      orders = await SrvOrder.getPedidos();
    } else if (context === 'Vendedor') {
      const filtro = [{ sf_account_id: this.props.client.sf_id },];
      orders = await SrvOrder.getPedidos(filtro);
    }

    await asyncForEach(orders, async (car) => {
      car.products = await SrvOrder
        .getProdutos(
          [{ quote_sfa_guid__c: car.key }],
          { fields: ['sf_segmento_negocio__c'] }
        );
    });

    // TRANSFERIR ESTE FILTRO PARA QUERIES.
    // Retira pedidos sem produtos.
    orders = orders.filter(c => c.products.length > 0);

    // Filtro de nome ou codigo.
    if (panelFilter[2] && panelFilter[2].current) {
      orders = orders.filter(c => {
        const testeLogicoA = c.client.toLowerCase().indexOf(panelFilter[2].current.toLowerCase());
        const testeLogicoB = c.key.toLowerCase().indexOf(panelFilter[2].current.toLowerCase());
        const resultadoA = testeLogicoA > -1;
        const resultadoB = testeLogicoB > -1;
        return resultadoA || resultadoB;
      });
    }

    if (panelFilter[6].current) {
      orders = orders.filter(c => c.client === panelFilter[6].current);
    }

    this.props.acSetCarts(orders);

    const cartDefault = orders.find(car => car.isDefault);
    this.props.acSetDropdownCarts({
      current: cartDefault,
      isVisible: false
    });
  }

  eventRemoveAll = async () => {
    await this.props.acUpdateCurrentRemoveAll();
    await this.props.acSetResultFinder(false);

    const { context, } = this.props;

    let orders = [];
    if (context === 'Admin') {
      orders = await SrvOrder.getPedidos();
    } else if (context === 'Vendedor') {
      const filtro = [{ sf_account_id: this.props.client.sf_id },];
      orders = await SrvOrder.getPedidos(filtro);
    }

    await asyncForEach(orders, async (car) => {
      car.products = await SrvOrder
        .getProdutos(
          [{ quote_sfa_guid__c: car.key }],
          { fields: ['sf_segmento_negocio__c'] }
        );
    });

    // Retira pedidos sem produtos.
    orders = orders.filter(c => c.products.length > 0);

    this.props.acSetCarts(orders);

    const cartDefault = orders.find(car => car.isDefault);
    this.props.acSetDropdownCarts({
      current: cartDefault,
      isVisible: false
    });
  }
}

export default SummaryList;