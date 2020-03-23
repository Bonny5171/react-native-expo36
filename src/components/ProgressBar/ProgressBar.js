import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { render } from 'react-native-web';

export default ({
  percent,
  indeterminate,
  color,
  db
}) => {
  
  const height = 5;
  const width = percent;
  //console.log(db, 'percent', percent);

  return indeterminate
    ? <View style={{ backgroundColor: 'transparent' }}>
          <ActivityIndicator size="large" color="#666" />
      </View>
    : <View
        style={{
          height,
          width: 100,
          marginTop: 12,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: '#007ab0',
          borderRadius: 5,
        }}
        >
        <View
          style={[{
            height,
            width,
            backgroundColor: '#007ab0',
            borderRadius: 3,
          },{height:3, transform:[{translateX:-1}]}]}
        />
      </View>
};
