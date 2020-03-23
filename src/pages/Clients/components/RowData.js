import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { Row, TextLimit, ImageLoad } from '../../../components';
import global from '../../../assets/styles/global';
import { semImg } from '../../../assets/images';

class RowData extends React.Component {
  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.index !== nextProps.index) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.handleRowClick}
      >
        <Row style={global.rowTL}>
          <View style={{ width: 70, justifyContent: 'center', alignItems: 'flex-end' }}>
            <ImageLoad
              documentId={this.props.sf_photo1__c}
              containerStyle={{ height: 40, width: 40 }}
            />
          </View>
          <View style={global.containerCenter}>
            <Text style={global.txtColumn}>{this.props.code}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TextLimit
              msg={this.props.fantasyName.toUpperCase()}
              style={[global.txtColumn, { color: '#535456', fontFamily: Font.ASemiBold }]}
              maxLength={14}
            />
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TextLimit
              msg={this.props.sector.toUpperCase()}
              style={global.txtColumn}
              maxLength={27}
            />
          </View>
          <ColumnData
            view={global.containerCenter}
            txtStyle={global.txtColumn}
            txt={this.props.status}
          />
          <ColumnData
            view={global.containerCenter}
            txtStyle={[global.txtColumn,
              // {
              //   fontFamily: Font.C,
              //   fontSize: 37,
              //   color: '#3397BD'
              // }
            ]}
            // txt={decideIcon(this.props.punctual)} TEMPORÁRIO ENQUANTO NÃO RECEBEMOS DADOS
            txt="[nulo]"
          />
          <ColumnData
            view={global.containerCenter}
            txtStyle={[global.txtColumn,
              // {
              //   fontFamily: Font.C,
              //   fontSize: 37,
              //   color: '#3397BD'
              // }
            ]}
            // txt={decideIcon(this.props.encarte)}
            txt="[nulo]"
          />
        </Row>
      </TouchableOpacity>
    );
  }

  handleRowClick() {
    const { index, previous, next, data } = this.props;
    this.props.acCurrentClient(previous, data[index], next, { previous: index, next: index });
    this.props.navigation.navigate('client');
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