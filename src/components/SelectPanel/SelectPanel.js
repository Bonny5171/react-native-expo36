
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { string, array, func } from 'prop-types';
import { TextLimit, IconActionless } from '..';
import global from '../../assets/styles/global';
import { Font } from '../../assets/fonts/font_names';


const SelectPanel = (props) => (
  <View style={{ flex: 1 }}>
    <View style={{ borderBottomWidth: 1, borderColor: '#CCC', paddingBottom: 20, marginBottom: 14 }}>
      <Text style={{ fontFamily: Font.AMedium, fontSize: 10, marginBottom: 3 }}>{props.selectedTitle}</Text>
      <TextLimit
        maxLength={34}
        msg={props.current}
        style={{ fontFamily: Font.ASemiBold, fontSize: 12 }}
      />
    </View>
    <FlatList
      style={{ flex: 1, width: '100%' }}
      data={props.options}
      numColumns={1}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        const value = props.isObj ? item[props.currProp] : item;
        const isChosen = props.current === value;
        return (
          <TouchableOpacity
            disabled={isChosen}
            style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 6 }}
            onPress={() => props.action(item, index)}
          >
            {isChosen ?
              <IconActionless msg="u" style={{ color: 'rgba(0, 0, 0, 0.3)' }} />
              :
              <View style={{ width: 17 }} />
            }
            <Text style={[global.text, styles.item, { color: isChosen ? 'rgba(0, 0, 0, 0.3)' : 'black', paddingBottom: index === props.options.length - 1 ? 5 : 0 }]}>
              {props.isSimpleString ? item.toUpperCase() : item.name.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  </View>
);

export default SelectPanel;

SelectPanel.propTypes = {
  options: array.isRequired,
  selectedTitle: string.isRequired,
  current: string,
  action: func.isRequired,

};

const styles = StyleSheet.create({
  list: {
    borderBottomColor: '#999'
  },
  item: {
    paddingLeft: 5,
    fontSize: 14,
    color: 'black',
  }
});