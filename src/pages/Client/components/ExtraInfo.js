import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../../components';
import { Font } from '../../../assets/fonts/font_names';
import global from '../../../assets/styles/global';

class ExtraInfo extends React.Component {
  render() {
    const {
      title,
      acNextInfo,
      acPreviousInfo,
      currentTable
    } = this.props;

    return (
      <View style={{ flex: 3, backgroundColor: 'rgba(255, 255, 255, 0.30)' }} >
        {
          Platform.OS === 'web'
            ? <View
              colors={['rgba(0,133,178, 0.12)', 'rgba(0,133,178, 0.06)', 'rgba(0,133,178, 0)']}
              style={{ height: 35 }}
              data-id="lineargradient-extrainfo-pre"
            />
            : <LinearGradient colors={['rgba(0,133,178, 0.12)', 'rgba(0,133,178, 0.06)', 'rgba(0,133,178, 0)']} style={{ height: 35 }} />
        }
        <View style={{ flex: 1, zIndex: 2, paddingLeft: 55 }}>
          <View style={styles.vwTitle}>
            <Text style={styles.title}>{title}</Text>
            {
              title === 'ENDEREÇOS' ?
                <Text style={{ fontFamily: Font.ASemiBold, position: 'absolute', left: 939 }}>Permite endereço de entrega diferente: [nulo]</Text>
              :
              null
            }
          </View>
          {this._renderContent()}
        </View>
        {
          Platform.OS === 'web'
            ? <View
              colors={['rgba(0,133,178, 0.0)', 'rgba(0,133,178, 0.06)', 'rgba(0,133,178, 0.12)']}
              style={{ height: 35 }}
              data-id="lineargradient-extrainfo-pos"
            />
            : <LinearGradient colors={['rgba(0,133,178, 0.0)', 'rgba(0,133,178, 0.06)', 'rgba(0,133,178, 0.12)']} style={{ height: 35 }} />
        }
      </View>
    );
  }

  _updateInfo() {
    const {
      infos,
      labels,
      postalCodes,
      isCurrency,
      locationInfo,
    } = this.props;

    let addedItems = 0;
    let data = [];
    this.rows = [];
    const itemsPerRow = 3;
    let position = 0;
    labels.forEach((label, index) => {
      addedItems += 1;
      // Será adicionado 3 items por linha
      if (addedItems < itemsPerRow + 1) {
        let info = {
          label,
          info: infos[index],
          isCurrency: isCurrency[index],
        };

        if (locationInfo !== undefined) {
          info = { ...info, ...locationInfo[index] };
        }
        data.push(info);
      }

      // Após adicionar 3 items, zeramos a contagem de items adicionados para zerar o vetor data na linha 46
      if (addedItems === itemsPerRow) {
        this.rows.push(
          <View style={styles.container100Percent} key={index.toString()} >
            <ExtraInfoRow
              infoElement={this.props.infoElement}
              data={data}
              title={this.props.title}
            />
          </View>
        );
        data = [];
        addedItems = 0;
      }

      position = index;
    });

    // Para efeitos de formatação, colocavamos views vazias para mantermos as colunas alinhadas com 3 Views
    if (data.length > 0) {
      while (data.length < 3) {
        data.push({
          label: '',
          info: '',
          postalCode: '',
        });
      }
      this.rows.push(
        <View style={styles.container100Percent} key={position.toString()} >
          <ExtraInfoRow
            infoElement={this.props.infoElement}
            data={data}
            title={this.props.title}
          />
        </View>
      );

      // e no mínimo duas linhas para elas ficarem com uma altura boa
      if (this.rows.length < 2) {
        this.rows.push(
          <View style={styles.container100Percent} key="1" >
            <ExtraInfoRow
              infoElement={this.props.infoElement}
              data={
                [
                  {
                    label: '',
                    info: '',
                    postalCode: ''
                  },
                  {
                    label: '',
                    info: '',
                    postalCode: ''
                  },
                  {
                    label: '',
                    info: '',
                    postalCode: ''
                  }
                ]
              }
              title={this.props.title}
            />
          </View>
        );
      }
    }
  }

  _renderContent() {
    const { customContent, title, contentElement } = this.props;
    if (customContent === undefined) {
      this._updateInfo();
      return (
        <View>
          {this.rows}
        </View>
      );
    }

    return (
      <View style={{ flex: 3.5 }}>
        {contentElement(this.props)}
      </View>
    );
  }
}

export default ExtraInfo;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1
  },
  vwTitle: {
    width: '100%',
    paddingVertical: 6,
    paddingBottom: 19,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: Font.BSemiBold,
    fontSize: 18,
    color: 'black',
  },
  vwLeftArrow: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 50,
    backgroundColor: '#FFF',
    borderBottomRightRadius: 30,
    borderTopRightRadius: 30,
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowRadius: 4
  },
  icLeftArrow: {
    fontFamily: Font.C,
    fontSize: 28,
    marginRight: 4,
    color: 'black',
    transform: [{ rotate: '180deg' }]
  },
  vwRightArrow: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 30,
    borderTopLeftRadius: 30
  },
  container100Percent: {
    flexDirection: 'row',
    width: '100%',
  }
});

ExtraInfo.defaultProps = {
  isCurrency: []
};
const ExtraInfoRow = (props) => {
  const { data, infoElement, title } = props;
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 19
      }}
      >
        {
          data.map((curr, index) => (
            <View style={{ flex: 1, flexWrap: 'wrap' }} key={curr.label}>
              {infoElement(curr, allNull = title === 'INFORMAÇÕES FINANCEIRAS' || title === 'OUTRAS INFORMAÇÕES', props)}
            </View>
          ))
        }
      </View>
    </View>
);
 };