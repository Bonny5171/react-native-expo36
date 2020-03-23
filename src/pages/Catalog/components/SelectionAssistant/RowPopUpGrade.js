import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Font } from '../../../../assets/fonts/font_names';

class RowPopUpGrade extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.grade.isChosen !== nextProps.grade.isChosen) {
      return true;
    }
    return false;
  }

  render() {
    const { grade, sizes } = this.props;
    if (!grade.sizes) return null;
    const columns = sizes.map((size, index) => {
      const hasSize = grade.sizes.find(g => g.value === size);
      const largura = (size.length > 2) ? { width: 45 } : { width: 35 };
      if (hasSize) {
        return (<ColumnValues key={index.toString()} quantity={hasSize.quantity} largura={largura} />);
      }
      return (<ColumnValues key={index.toString()} quantity="" largura={largura} />);
    });

    return (
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <View style={styles.txtGrade}>
          <View style={styles.column}>
            <Text style={[styles.fontStyle, { fontFamily: Font.ASemiBold }]}>{grade.totalPairs}</Text>
          </View>
          {columns}
        </View>
      </View>
    );
  }
}

export default RowPopUpGrade;

const styles = StyleSheet.create({
  txtGrade: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(120, 120, 120, 0.2)',
    height: 35,
  },
  column: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 45
  },
  fontStyle: {
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center'
  }
});

const ColumnValues = ({ quantity, largura }) => (
  <View style={[styles.column, largura]}>
    <Text style={[styles.fontStyle, { fontFamily: Font.ALight }]}>{quantity}</Text>
  </View>
);