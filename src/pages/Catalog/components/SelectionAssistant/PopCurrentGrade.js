import React from 'react';
import { View, Text, ScrollView, Platform, StyleSheet } from 'react-native';
import global from '../../../../assets/styles/global';
import { Column } from '.';
import { Font } from '../../../../assets/fonts/font_names';

class PopCurrentGrade extends React.Component {
  render() {
    const { currentGrade, columns, keyboardState, totalPares } = this.props;

    if (!currentGrade.hasOwnProperty('sizes')) {
      return null;
    }
    // const isKeyboardAndMobile = keyboardState && Platform.OS !== 'web';
    // const position = isKeyboardAndMobile ? { left: 10, bottom: 90 } : { bottom: 11, marginLeft: 10 };
    const position = { bottom: 11, marginLeft: 10 };

    return (
      <View style={[{ position: 'absolute' }, position]}>
        <View style={[styles.currentGrade, global.shadow]}>
          <Column header="GRADE" value={currentGrade.name} />
          <View style={{ height: Platform.OS === 'web' ? 55 : null, padding: 4, paddingLeft: 15, paddingRight: 15 }}>
            <View style={global.containerCenter}>
              <Text style={[global.columnHeader, { fontFamily: Font.ASemiBold, fontSize: 12 }]}>PARES</Text>
            </View>
            <View style={global.containerCenter}>
              <Text style={[global.columnValue, { fontSize: 13 }]}>{totalPares === '' ? '-' : totalPares}</Text>
            </View>
          </View>
          <ScrollView
            style={{ marginTop: Platform.OS === 'web' ? 1 : 0 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {columns}
          </ScrollView>
        </View>
      </View>
    );
  }
}
export default PopCurrentGrade;


const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 5
  },
  header: {
    height: 85,
    flexDirection: 'row',
    alignItems: 'center'
  },
  body: {
    flex: 1,
    flexDirection: 'row'
  },
  currentGrade: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#EEE',
    elevation: 1,
    borderRadius: 10,
    marginRight: 15,
    paddingLeft: 10,
    paddingRight: 10
  }
});