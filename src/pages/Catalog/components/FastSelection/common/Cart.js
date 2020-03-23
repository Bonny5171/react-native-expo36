import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { IconActionless, TextLimit } from '../../../../../components';
import global from '../../../../../assets/styles/global';
import { Font } from '../../../../../assets/fonts/font_names';
import SrvOrder from '../../../../../services/Order/';
import { agrupaProdutosNoCarrinho, atualizaCarrinhoAtual, asyncForEach } from '../../../../../utils/CommonFns';
import { acSetCarts, acSetDropdownCarts } from '../../../../../redux/actions/pages/catalog';

class Cart extends React.PureComponent {
  render() {
    const {
      item, index, togglePop, acSelectCart, acDeleteCart,
      client, currentTable,
    } = this.props;

    const produtos = agrupaProdutosNoCarrinho(item.products);

    if (item.isChosen) {
      return (
        <View style={[styles.container, styles.rowVSpacing]}>
          <TouchableOpacity
            disabled
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => {
              togglePop();
              acSelectCart(item, index);
            }}
          >
            <IconActionless msg="p" style={styles.icCurrent} />
            <TextLimit
              style={[global.currentHighlight, { marginLeft: 3, color: 'rgba(0, 0, 0, 0.8)', textDecorationLine: null }]}
              msg={item.name}
              maxLength={18}
            />
          </TouchableOpacity>
          <Action
            isDefault={item.isDefault}
            name={item.name}
            qt={produtos.length}
            acDeleteCart={acDeleteCart}
            acSetCarts={this.props.acSetCarts}
            client={client}
            item={item}
            acSetDropdownCarts={this.props.acSetDropdownCarts}
            currentTable={currentTable}
          />
        </View>
      );
    }

    return (
      <View style={[styles.container, styles.rowVSpacing]}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={async () => {
            if (togglePop) togglePop();
            acSelectCart(item.name, index);
            const filtro = [
              { sf_account_id: item.sf_account_id },
              { sf_pricebook2id: item.sf_pricebook2id },
            ];
            await SrvOrder.resetCarrinhoPadrao(filtro);
            await SrvOrder.updateCarrnho({ id: item.key, sf_carrinho_selecionado__c: 'true', });

            atualizaCarrinhoAtual({
              client: { sf_id: item.sf_account_id },
              currentTable: { code: item.sf_pricebook2id },
              acSetCarts: this.props.acSetCarts,
              acSetDropdownCarts: this.props.acSetDropdownCarts,
            });
            if (this.props.acResetCopyCart && this.props.acResetCopyModel) {
              this.props.acResetCopyCart();
              this.props.acResetCopyModel();
            }
          }}
        >
          <View style={{ height: 20, width: 17 }} />
          <TextLimit
            style={[global.currentHighlight, { marginLeft: 3, fontFamily: Font.AMedium, }]}
            msg={item.name}
            maxLength={18}
          />
        </TouchableOpacity>
        <Action
          isDefault={item.isDefault}
          name={item.name}
          qt={produtos.length}
          client={client}
          item={item}
          acDeleteCart={acDeleteCart}
          acSetCarts={this.props.acSetCarts}
          acSetDropdownCarts={this.props.acSetDropdownCarts}
          currentTable={currentTable}
          acSetCartsList={this.props.acSetCartsList}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  currentTable: state.assistant.currentTable,
});

const mapDispatchToProps = {
  acSetCarts,
  acSetDropdownCarts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  rowVSpacing: {
    paddingVertical: 5.2
  },
  icDelete: {
    fontFamily: Font.C,
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 22,
  },
  tchbDelete: {
    marginTop: -2
  },
  icCurrent: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  txt: {
    fontFamily: Font.AMedium,
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.4)',
    // marginTop: -6,
    marginRight: 2
  },
  actionContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    right: 0,
  }
});

const Action = ({ isDefault, qt, item, acSetCarts, acSetDropdownCarts, acSetCartsList, }) => {
  if (isDefault) {
    return (
      <View style={styles.actionContainer}>
        <Text style={styles.txt}>({qt})</Text>
        <View style={{ height: 22, width: 27.5 }} />
      </View>
    );
  }
  return (
    <View style={styles.actionContainer}>
      <Text style={styles.txt}>({qt})</Text>
      <TouchableOpacity
        onPress={async () => {
          SrvOrder.removeCarrinho(item.key);
          atualizaCarrinhoAtual({
            client: { sf_id: item.sf_account_id },
            currentTable: { code: item.sf_pricebook2id },
            acSetCarts: acSetCarts,
            acSetDropdownCarts: acSetDropdownCarts,
          });

          let carts = await SrvOrder.getCarrinhos([], ['sf_name']);
          await asyncForEach(carts, async (car) => {
            car.products = await SrvOrder
              .getProdutos(
                [{ quote_sfa_guid__c: car.key }],
                { fields: ['sf_segmento_negocio__c'] }
              );
          });
          // carts = carts.filter(c => c.products.length > 0);
          acSetCartsList(carts);

          const cartDefault = carts.find(car => car.isDefault);
          if (cartDefault) {
            acSetDropdownCarts({
              current: cartDefault,
              isVisible: false
            });
          }
        }}
      >
        <Text style={styles.icDelete}>w</Text>
      </TouchableOpacity>
    </View>
  );
};