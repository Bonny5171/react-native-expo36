import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import global from '../../../assets/styles/global';
import { IconActionless } from '../../../components';


const DropDown = props => {
  let marginLeft = { marginLeft: 20 };
  
  if (props.isMultiSelect) {
    marginLeft = { marginLeft: props.qtSelected > 1 ? 6 : 43 };
  }

  return (
    <View>
      <Text style={[styles.txtLabel, props.labelStyle]}>{props.txtLabel}</Text>
      <View style={[[global.vwIT, { width: props.width }], props.vwStyle]}>
        <TouchableOpacity
          style={[{ flex: 1, justifyContent: 'center', height: '100%' }, props.tchbStyle]}
          onPress={() => props.acUpdateComponent('dropdown', props.name)}
        >
          <View style={styles.vwInput}>
            {
              props.isMultiSelect ?
               <TotalSelected qt={props.qtSelected} />
              : null
            }
            <Text
              style={[styles.txtInput, marginLeft]}
            >
              {props.current}
            </Text>
            <Triangle triangle={[styleTriangle.triangleTop, props.icStyle]} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DropDown;


const Triangle = props => {
    return (
      <View style={props.triangle} />
    );
};

const styles = StyleSheet.create({
  txtLabel: {
      fontFamily: Font.ASemiBold,
      color: 'black',
      marginTop: 5,
      fontSize: 12,
      opacity: 0.9
  },
  vwDD: {
      justifyContent: 'center',
      height: 65,
      borderWidth: 1,
      borderRadius: 10,
      marginLeft: 40,
      marginTop: 4,
      borderColor: '#999'
  },
  vwInput: {
      alignItems: 'center',
      flexDirection: 'row',
  },
  txtInput: {
      fontSize: 18,
      fontFamily: Font.ALight,
      color: '#666'
  },
  triangleSituation: {
      position: 'absolute',
      marginLeft: 225,
      transform: [
          { rotate: '180deg' }
      ]
  },
  triangleSector: {
      position: 'absolute',
      marginLeft: 425,
      transform: [
          { rotate: '180deg' }
      ]
  }
});

const styleTriangle = StyleSheet.create({
  triangleUp: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderTopWidth: 0,
      borderRightWidth: 4.5,
      borderBottomWidth: 7,
      borderLeftWidth: 4.5,
      borderTopColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: '#888',
      borderLeftColor: 'transparent',
  },
  triangleDown: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderTopWidth: 0,
      borderRightWidth: 4.5,
      borderBottomWidth: 7,
      borderLeftWidth: 4.5,
      borderTopColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: 'black',
      borderLeftColor: 'transparent',
      marginTop: 1.5,
      transform: [{ rotate: '180deg' }]
  },
  triangleTop: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#0085B2',
    borderLeftColor: 'transparent',
    marginLeft: 920,
}
});

const TotalSelected = ({ qt }) => {
  if (qt > 1) {
    return  (
      <View style={{ marginLeft: 3, flexDirection: 'row', padding: 5, backgroundColor: '#D6E4E7', borderRadius: 8, alignItems: 'center' }}>
        <IconActionless style={{ color: 'rgba(0, 0, 0, 0.8)' }} msg="h" />
        <Text style={{ marginLeft: 1, fontSize: 12, fontFamily: Font.ASemiBold, color: 'rgba(0, 0, 0, 0.3)' }}>{qt}</Text>
      </View>
    );
  }

  return null;
}