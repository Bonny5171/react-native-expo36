import React from 'react';
import { View, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { string, bool, func } from 'prop-types';
import global from '../../assets/styles/global';
import { Font } from '../../assets/fonts/font_names';
import { IconActionless } from '..';
import TextLimit from '../TextLimit';
import DisableComponent from '../DisableComponent';

const CurrentBtn = ({ isDisabled, notVisible, current, icon, isUpper, hasLink, maxLength, onLinkClick, onIconClick, containerStyle }) => {
  if (notVisible) return null;
  const msg = isUpper ? current.toUpperCase() : current;
  return (
    <View style={[styles.container, containerStyle]}>
      {
        hasLink ?
          (
            <TouchableOpacity
              onPress={onLinkClick}
              style={styles.vwTxt}
              disabled={isDisabled}
            >
              <TextLimit
                msg={msg}
                maxLength={maxLength}
                style={[global.link, styles.txt, isDisabled && styles.black]}
              />
            </TouchableOpacity>
          )
        :
          (
            <TextLimit
              msg={msg}
              maxLength={maxLength}
              style={[global.link, styles.txt, styles.black, { paddingRight: 3 }]}
            />
          )
      }
      <DisableComponent
        isDisabled={!icon}
      >
        <TouchableOpacity
          onPress={onIconClick}
          disabled={isDisabled}
        >
          <IconActionless msg={icon} style={styles.icon} />
        </TouchableOpacity>
      </DisableComponent>
    </View>
  );
};
export default CurrentBtn;

CurrentBtn.propTypes = {
  current: string.isRequired,
  icon: string,
  isUpper: bool,
  hasLink: bool,
  onLinkClick: func,
  onIconClick: func.isRequired,
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 10,
    paddingVertical: 1,

  },
  vwTxt: {
    marginRight: 3
  },
  txt: {
    fontFamily: Font.ASemiBold,
    fontSize: 12,
    marginTop: Platform.OS === 'web' ? 3.5 : 1,
  },
  icon: {
    fontSize: 18,
    color: 'black',
  },
  black: {
    color: 'rgba(0, 0, 0, 0.6)',
    textDecorationLine: 'none'
  }
});