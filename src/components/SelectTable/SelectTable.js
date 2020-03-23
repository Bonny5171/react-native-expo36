import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Font } from '../../assets/fonts/font_names';
import { TextLimit, IconActionless } from '..';
import global from '../../assets/styles/global';


export const SelectTable = (props) => (
  <View style={global.flexOne}>
    <View style={styles.vwCurrentTable}>
      <Text style={styles.txtSubTitle}>LISTA SELECIONADA</Text>
      <TextLimit
        maxLength={34}
        msg={props.currentTable.name.toUpperCase()}
        style={styles.txtSelectedTable}
      />
    </View>
    <FlatList
      style={{ flex: 1, width: '100%' }}
      data={props.options}
      numColumns={1}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        const isChosen = props.currentTable.code === item.code;
        return (
          <TouchableOpacity
            disabled={isChosen}
            style={styles.tchbItem}
            onPress={async () => {
              await props.acCurrentTable(item);
              props.beforeUpdate();
              await props.togglePanel();
              setTimeout(() => props.selectTable(item), 350);
            }}
          >
            {isChosen ?
              <IconActionless msg="u" style={{ color: 'rgba(0, 0, 0, 0.3)' }} />
              :
              <View style={{ width: 17 }} />
            }
            <Text style={[global.text, styles.item, { color: isChosen ? 'rgba(0, 0, 0, 0.3)' : 'black', paddingBottom: index === props.options.length - 1 ? 5 : 0 }]}>{item.name.toUpperCase() || item.toUpperCase()}</Text>
          </TouchableOpacity>
        );
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  vwCurrentTable: {
    borderBottomWidth: 1,
    borderColor: '#CCC',
    paddingBottom: 20,
    marginBottom: 14
  },
  txtSubTitle: {
    fontFamily: Font.AMedium,
    fontSize: 10,
    marginBottom: 3
  },
  txtSelectedTable: {
    fontFamily: Font.ASemiBold,
    fontSize: 12,
  },
  list: {
    borderBottomColor: '#999'
  },
  tchbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 6
  },
  item: {
    paddingLeft: 5,
    fontSize: 14,
    color: 'black',
  },
});

export default SelectTable;
