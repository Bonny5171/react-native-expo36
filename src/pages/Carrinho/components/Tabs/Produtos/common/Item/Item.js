import React from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { CorDoItem, Header } from './common';
import {
  acTogglePanel, acSetEmbalamentos, acTogglePopCartDesconto, acSetPanel, acCurrentProduct,
  acCurrentAcordeon,
} from '../../../../../../../redux/actions/pages/cart';
import { acAssistant, acRemoveCartProduct, acSetDropdownCarts, acFlushGrades, } from '../../../../../../../redux/actions/pages/catalog';
import { acToggleMask, acToggleZoom } from '../../../../../../../redux/actions/global';

class ItemDoCarrinho extends React.PureComponent {
  render() {
    const { type, produto, dropdown, currentProduct, pointerAcordeon, } = this.props;
    const estaAberto = pointerAcordeon === produto.code;

    return (
      <View data-id="containerDeModelo" style={{ marginHorizontal: 20, borderBottomColor: 'rgba(0,0,0,.1)', borderBottomWidth: 1 }}>
        <Header produto={produto} type={type} currentProduct={currentProduct} />
        <View data-id="containerCoresGrades"  style={{ flexDirection: 'row', marginLeft: 10, maxWidth: 850 }}>
          {estaAberto &&
          <View data-id="colunaPrincipal" style={{ width: '68%', flexGrow: 1 }}>
            {currentProduct.colors && (
              <FlatList
                data={currentProduct.colors}
                renderItem={this.renderCor}
                extraData={dropdown}
              />
            )}
          </View>
          }
          {/* gap lateral */}
          <View data-id="gapLateral" style={{ width: '32%' }} />
        </View>
      </View>
    );
  }

  renderCor = ({ item, index }) => (
    <CorDoItem
      idx={index}
      color={item}
      key={index}
      produto={this.props.produto}
      dropdown={this.props.dropdown}
      currentProduct={this.props.currentProduct}
      type={this.props.type}
      acToggleZoom={this.props.acToggleZoom}
      acToggleMask={this.props.acToggleMask}
      acCurrentProduct={this.props.acCurrentProduct}
      acSetPanel={this.props.acSetPanel}
      carts={this.props.carts}
      acSetDropdownCarts={this.props.acSetDropdownCarts}
      acFlushGrades={this.props.acFlushGrades}
    />
  );
}

const mapStateToProps = (state) => ({
    currentProduct: state.cart.currentProduct,
   pointerAcordeon: state.cart.pointerAcordeon,
          dropdown: state.catalog.dropdown,
             carts: state.catalog.carts,
});

const mapDispatchToProps = {
  acTogglePanel,
  acSetPanel,
  acCurrentProduct,
  acSetEmbalamentos,
  acToggleMask,
  acTogglePopCartDesconto,
  acAssistant,
  acRemoveCartProduct,
  acCurrentAcordeon,
  acToggleZoom,
  acSetDropdownCarts,
  acFlushGrades,
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemDoCarrinho);