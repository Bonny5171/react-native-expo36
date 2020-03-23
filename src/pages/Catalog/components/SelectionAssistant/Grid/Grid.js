import React from 'react';
import { View, Platform } from 'react-native';
import Input from './Input';

class Grid extends React.Component {
  render() {
    const grid = [];
    this._updateGrid(grid);
    return grid;
  }

  _updateGrid(grid) {
    const {
      carts,
      product,
      stores,
      grades,
      dropdown,
      acCurrentGrade,
      acCurrentColor,
      acKeyboardState,
      acSetDefaultCurrentGrade,
    } = this.props;

    let height = Platform.OS === 'web' ? 26 : 22;

    if (stores.length > 1) {
      height = Platform.OS === 'web' ? 36 : 30;
    }
    // Componentes visuais
    product.colors.forEach((color, indexColor) => {
      if (color.isChosen) {
        // Adiciona X colunas de inputs para cada cor sendo exibida
        grid.push(
          <View key={color.name}>
            <View style={{ height }} />
            {
              // Linhas de acordo com Y grades exibidas
              grades.map((grade, indexGrade) => {
              if (grade.isChosen) {
                return (
                  <Input
                    key={`${indexGrade.toString()}${indexColor.toString()}`}
                    carts={carts}
                    grade={grade}
                    grades={grades}
                    cores={product.colors}
                    indexGrade={indexGrade}
                    indexColor={indexColor}
                    product={product}
                    dropdown={dropdown}
                    acCurrentGrade={acCurrentGrade}
                    acCurrentColor={acCurrentColor}
                    acKeyboardState={acKeyboardState}
                    acSetDefaultCurrentGrade={acSetDefaultCurrentGrade}
                    acSetDropdownCarts={this.props.acSetDropdownCarts}
                  />
                );
              }
                return null;
              })
            }
          </View>
        );
      }
    });
  }
}

export default Grid;