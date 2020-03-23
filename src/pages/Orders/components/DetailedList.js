import React from 'react';
import { View, FlatList, StyleSheet, Platform, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Font } from '../../../assets/fonts/font_names';

const DetailedList = (props) => (
  <View style={styles.container}>
    <View style={styles.header}>      
    {
      Platform.OS === 'web' ?
        <View
          style={{ justifyContent: 'center', flex: 1 }}
          data-id="lineargradient-detailer-list"
        >
          {props.header(props)}
        </View>
      :
        <LinearGradient
          colors={['rgb(211, 216, 222)', 'rgba(211, 216, 222, 0.7)', 'rgba(211, 216, 222, 0.7)']}
          style={{ justifyContent: 'center', flex: 1 }}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        >
          {props.header(props)}
        </LinearGradient>
    }
    </View>
    <View style={{ flex: 5 }}>
      {/* Rows */}
      <View
        style={{ backgroundColor: '#F0F4F7', flex: 10 }}
        opacity={0.85}
      >
        <FlatList
          scrollEnabled
          onEndReachedThreshold={0.8}
          onEndReached={() => props.loadMore()}
          data={props.data}
          ItemSeparatorComponent={_renderItemSeparator}
          renderItem={(item, index) => {
              return props.row(item, index);
            }
          }
        />
      </View>
    </View>
  </View>
);

const _renderItemSeparator = () => (<View style={styles.separator} />);

export default DetailedList;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  header: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    fontSize: 14,
    fontFamily: Font.AMedium,
  },
  column: {
    flex: 1,
    alignItems: 'center'
  },
  separator: {
    flex: 1,
    backgroundColor: 'rgba(211, 216, 222, 0.8)',
    height: 2,
  }
});