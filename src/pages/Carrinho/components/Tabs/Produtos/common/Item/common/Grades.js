import React, { PureComponent } from 'react';
import { View, } from 'react-native';
import { connect } from 'react-redux';
import { Grade } from '.';
import { acSetDropdownCarts, } from '../../../../../../../../redux/actions/pages/catalog';
import { acToggleMask } from '../../../../../../../../redux/actions/global';
import { acCurrentProduct, acSetPanel, acTogglePanel, } from '../../../../../../../../redux/actions/pages/cart';

export class Grades extends PureComponent {
  render() {
    const { grades } = this.props;
    return (
      <View data-id="colunaGrades" style={{ width: '70%' }}>
        { grades.map(this.renderGrade)}
      </View>
    );
  }

  renderGrade = (item, index) => {
    const gradesMerged = {
      ...item,
      ...this.props.produto
    };
    return (
      <Grade
        grades={this.props.grades}
        grade={gradesMerged}
        idx={index.toString()}
        corIdx={this.props.corIdx}
        key={index.toString()}
        dropdown={this.props.dropdown}
        currentProduct={this.props.currentProduct}
        carts={this.props.carts}
        acSetDropdownCarts={this.props.acSetDropdownCarts}
        acCurrentProduct={this.props.acCurrentProduct}
        type={this.props.type}
        acSetPanel={this.props.acSetPanel}
        acToggleMask={this.props.acToggleMask}
        acTogglePanel={this.props.acTogglePanel}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  currentProduct: state.cart.currentProduct,
        dropdown: state.catalog.dropdown,
           carts: state.catalog.carts,
});

const mapDispatchToProps = {
  acSetDropdownCarts,
  acCurrentProduct,
  acSetPanel,
  acTogglePanel,
  acToggleMask,
};

export default connect(mapStateToProps, mapDispatchToProps)(Grades);
