import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import global from '../../assets/styles/global';
import { Gradient } from '..';

class TabsFT extends React.Component {
  render() {
    const { noGradient, backgroundColor } = this.props;
    const headerContent = this._renderContent();
    return (
      <Gradient
        noGradient={noGradient}
        style={[styles.tabs, { backgroundColor }, this.props.style]}
        webId="lineargradient-tabsft"
        range={['rgba(0,133,178, 0.1)', 'rgba(0,133,178, 0)']}
      >
        {headerContent}
      </Gradient>
    );
  }

  _renderTab(name, isTabActive, index) {
    const { textStyle, acChangeTab, pTabWidth } = this.props;
    // const tabWidth = pTabWidth !== undefined ? pTabWidth : 200;
    const paddValue = pTabWidth !== undefined ? 10 : 30;
    const text = isTabActive ? global.txtActive : global.txtNotActive;
    const tchb = [global.vwNotActive, { padding: 0 }];
    const localTXT = [text, { fontSize: 16, paddingVertical: 10, paddingHorizontal:paddValue }, textStyle];
    const tabUnderlineStyle = {
      position: 'absolute',
      width: '100%',
      height: 2,
      top: 0,
      backgroundColor: '#026A86',
    };

    return (
      <TouchableOpacity
        disabled={isTabActive}
        key={name}
        onPress={() => {
          if (!isTabActive) {
            acChangeTab(index);
          }
        }}
        style={tchb}
      >
        <Text style={localTXT}>{name}</Text>
        {
          isTabActive ?
            <View
              style={tabUnderlineStyle}
            />
          :
            null
        }
      </TouchableOpacity>
    );
  }

  _renderContent() {
    const { customHeader, tabs } = this.props;
    if (customHeader) {
      return customHeader();
    }

    return (
      <ScrollView horizontal>
        {
          tabs.map(({ name, active }, index) => {
            return this._renderTab(name, active, index);
          })
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    width: 100,
    paddingVertical: 10,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
  },
});

export default TabsFT;