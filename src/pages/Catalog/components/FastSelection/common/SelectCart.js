import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { InputText, Fade, TextLimit } from '../../../../../components';
import { Font } from '../../../../../assets/fonts/font_names';
import { Cart } from '.';
import * as catalogActions from '../../../../../redux/actions/pages/catalog';
import SrvOrder from '../../../../../services/Order/';
import { atualizaCarrinhoAtual } from '../../../../../utils/CommonFns';
import { acSetCartsList } from '../../../../../redux/actions/pages/carts';

class SelectCart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cartToSave: ''
    };
    this.updateField = this.updateField.bind(this);
    this.clearField = this.clearField.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  render() {
    const { dropdown, isVisible, acSaveCart, carts, acCurrentDropDown, acSelectCart, togglePop, acDeleteCart, containerStyle,
      client, currentTable, } = this.props;
    const currCart = dropdown.current.name;
    const canSave = this.state.cartToSave.length > 0;

    return (
      <Fade
        visible={isVisible}
        style={[styles.container, containerStyle]}
      >
        <View style={styles.headerWB}>
          <Text style={styles.lblCurrCart}>CARRINHO ATUAL : </Text>
          <TextLimit
            style={styles.txtCurrCart}
            msg={currCart}
            maxLength={30}
          />
        </View>

        <FlatList
          style={styles.list}
          data={carts}
          renderItem={({ item, index }) => (
            <Cart
              index={index}
              item={item}
              acCurrentDropDown={acCurrentDropDown}
              acSelectCart={acSelectCart}
              togglePop={togglePop}
              acDeleteCart={acDeleteCart}
              acSetCarts={this.props.acSetCarts}
              client={this.props.client}
              acSetDropdownCarts={this.props.acSetDropdownCarts}
              currentTable={currentTable}
              acResetCopyCart={this.props.acResetCopyCart}
              acResetCopyModel={this.props.acResetCopyModel}
              acSetCartsList={this.props.acSetCartsList}
            />
          )}
          keyExtractor={(item, index) => `${item.name}-${index}`}
        />
        <View style={styles.vwNewCart}>
          <Text style={[styles.lblCurrCart, styles.lblNewCart]}>NOVO CARRINHO</Text>
          <View style={styles.row}>
            <InputText
              inputStyle={{ width: '88%', height: 42, paddingTop: 0, paddingRight: 41 }}
              value={this.state.cartToSave}
              onChangeText={this.updateField}
              clearAction={this.clearField}
            />
            <TouchableOpacity
              disabled={!canSave}
              onPress={async () => {
                const filtro = [
                  { sf_account_id: client.sf_id },
                  { sf_pricebook2id: currentTable.code },
                ];
                await SrvOrder.resetCarrinhoPadrao(filtro);
                await SrvOrder.addCarrinho({
                  sf_name: this.state.cartToSave,
                  sf_carrinho_selecionado__c: 'true',
                  sf_account_id: client.sf_id,
                  sf_conta__c: client.sf_id,
                  sf_nome_cliente__c: client.fantasyName,
                  sf_pricebook2id: currentTable.code,
                  sf_pricebook2_name__c: currentTable.name,
                  sf_previsao_embarque__c: currentTable.mesFatur,
                });
                atualizaCarrinhoAtual({ client, currentTable, acSetCarts: this.props.acSetCarts, acSetDropdownCarts: this.props.acSetDropdownCarts, });
                this.closeModal();
              }}
              style={styles.tchbSave}
            >
              <Text style={[styles.icSave, !canSave && styles.disabledBtn]}>N</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Fade>
    );
  }

  updateField(text) {
    this.setState({ cartToSave: text });
  }

  clearField() {
    this.setState({ cartToSave: '' });
  }

  closeModal = () => {
    if (this.props.isVisible) this.props.togglePop();
    this.clearField();
  }
}
const mapStateToProps = state => ({
  popSelectCart: state.catalog.popSelectCart,
  dropdown: state.catalog.dropdown,
  carts: state.catalog.carts,
});

export default connect(mapStateToProps,
    {
      ...catalogActions,
      acSetCartsList,
    }
  )(SelectCart);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  whiteBox: {
    flex: 1,
    alignItems: 'center',
  },
  headerWB: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderColor: '#CCC',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  lblCurrCart: {
    fontFamily: Font.BLight,
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 12
  },
  lblNewCart: {
    color: 'rgba(0, 0, 0, 0.42)',
    marginTop: 4,
    marginBottom: 2,
    marginLeft: 4
  },
  icClose: {
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: 25,
    fontFamily: Font.C,
  },
  tchbClose: {
    position: 'absolute',
    right: -8,
  },
  txtCurrCart: {
    fontFamily: Font.ASemiBold,
    fontSize: 13,
    marginLeft: 4
  },
  vwNewCart: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#CCC',
  },
  icSave: {
    fontFamily: Font.C,
    fontSize: 24,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  tchbSave: {
    paddingHorizontal: 2,
  },
  disabledBtn: {
    color: 'rgba(0, 0, 0, 0.2)',
  },
  list: {
    maxHeight: '85%',
    width: '100%',
    paddingTop: 10,
  },
});