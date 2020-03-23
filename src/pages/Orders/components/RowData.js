import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { Row } from '../../../components';
import global from '../../../assets/styles/global';

class RowData extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.index !== nextProps.index) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <View>
        <Row style={global.rowTL}>
          <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'flex-end' }}>
            <View style={{ height: 40, width: 40, backgroundColor: 'grey' }} />
          </View> 
          <View style={global.containerCenter}>
            <Text style={global.txtColumn}>{this.props.code}</Text>
          </View>
          <ColumnData
            view={{ flex: 1 }}
            txtStyle={[global.txtColumn, { color: '#535456', fontFamily: Font.ASemiBold }]}
            txt={this.props.fantasyName.toUpperCase()}
          />
          <ColumnData
            view={{ flex: 1 }}
            txtStyle={global.txtColumn}
            txt={this.props.sector}
          />
          <ColumnData
            view={{ flex: 1 }}
            txtStyle={global.txtColumn}
            txt={this.props.status}
          />
          <ColumnData
            view={{ flex: 1 }}
            txtStyle={[global.txtColumn, { fontFamily: Font.C, fontSize: 35, color: '#3397BD' }]}
            txt={decideIcon(this.props.punctual)}
          />
          <ColumnData
            view={{ flex: 1 }}
            txtStyle={[global.txtColumn, { fontFamily: Font.C, fontSize: 35, color: '#3397BD' }]}
            txt={decideIcon(this.props.encarte)}
          />
        </Row>
      </View>
    );
  }
}

export default RowData;

const ColumnData = props => {
  return (
    <View style={[props.view, { alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={props.txtStyle}>{props.txt}</Text>
    </View>
  );
};

const decideIcon = (grade) => {
  // O retorno dos caracteres são os respectivos icones
  // para um icone de rosto feliz, regular e triste.
  switch (grade) {
    case 'RUIM': {
      return 'F';
    }
    case 'BOM': {
      return 'D';
    }
    default:
      // Regular
      return 'E';
  }
};

let styles = StyleSheet.create({
  txt: {
    fontSize: 14,
    fontFamily: Font.AMedium,
    textAlign: 'center'
  },
  separator: {
    backgroundColor: 'rgba(211, 216, 222, 0.8)',
    height: 2,
  },
});

if (Platform.OS === 'web') {
  styles = {
    ...styles,
    separator: {
      ...styles.separator,
      width: 1800
    },
    row: {
      ...styles.row,
      minWidth: 1800
    }
  };
}