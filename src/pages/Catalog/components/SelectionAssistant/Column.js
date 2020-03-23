import React from 'react';
import { View, Text, Platform } from 'react-native';
import global from '../../../../assets/styles/global';
import { Font } from '../../../../assets/fonts/font_names';

class Column extends React.Component {
  render() {
    const { header, value } = this.props;
    return (
      <View style={{ height: Platform.OS === 'web' ? 55 : null, padding: 4, paddingLeft: 15, paddingRight: 15 }}>
        <View style={global.containerCenter}>
          <Text style={[global.columnHeader, { fontFamily: Font.ASemiBold, fontSize: 12 }]}>{header}</Text>
        </View>
        <View style={global.containerCenter}>
          <Text style={[global.columnValue, { fontSize: 13 }]}>{value === '' ? '-' : value}</Text>
        </View>
      </View>
    );
  }
}
export default Column;