import React from 'react';
import { View, StyleSheet, } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { Forward, CheckOption } from '.';

const DefineExhibition = (props) => {
  const checkBoxes = props.checkboxesLabels.map((msg, index) => (
    <CheckOption
      radio
      txtStyle={styles.checkOption}
      key={index.toString()}
      disabled={props.checkboxes[index]}
      checkbox={props.checkboxes[index]}
      msg={msg}
      action={() => {
        props.checkViewMode(index);
        props.acCheckBox(index);
      }}
    />
  ));

  return (
    <View style={styles.container}>
      <View style={{ flex: 5 }}>
        {checkBoxes}
      </View>
      <Forward
        disabled={props.isQuering}
        containerStyle={{ marginTop: 16, marginRight: 96 }}
        {...props}
      />
    </View>
  );
};

export default DefineExhibition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    fontFamily: Font.AMedium
  },
  checkOption: {
    // marginTop: -4,
    marginLeft: 6
  },
});