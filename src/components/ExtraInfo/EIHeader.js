import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Row, Button } from '..';
import { Font } from '../../assets/fonts/font_names';

class EIHeader extends React.PureComponent {
  render() {
    const { current, containerStyle, titleStyle } = this.props;
    const btnElements = this._renderTab();

    return (
      <Row style={[styles.container, containerStyle]}>
        <Text style={[styles.moreInfo, titleStyle,{paddingRight:10,}]}>SAIBA MAIS...</Text>
        {btnElements}
        <Text style={styles.current}>{current}</Text>
      </Row>
    );
  }

  _renderTab() {
    const {
      buttons,
      actions,
      changeTabParams,
      acChangeTab,
    } = this.props;
    return (
      <Row>
        {
          buttons.map((button, index) => {
            const changeTab = {
              func: acChangeTab,
              params: changeTabParams !== undefined ? [index, ...changeTabParams] : [index]
            };
            const actionsVerified = actions !== undefined ? [changeTab, ...actions] : [changeTab];
            return (
              <Button
                key={index.toString()}
                tchbStyle={button.style}
                txtStyle={styles.infoIcons}
                txtMsg={button.icon}
                isChosen={button.isChosen}
                shadow
                changeColor
                chosenColor="#0085B2"
                nChosenColor="#999"
                actions={actionsVerified}
              />
            );
          })
        }
      </Row>
    );
  }
}

export default EIHeader;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center'
  },
  infoIcons: {
    fontFamily: Font.C,
    fontSize: 32,
    color: '#999',
  },
  moreInfo: {
    fontFamily: Font.BLight,
    fontSize: 24,
    color: 'black',
    marginLeft: 30
  },
  current: {
    position: 'absolute',
    fontFamily: Font.BSemiBold,
    fontSize: 24,
    color: '#2F98B4',
    right: 30,
  }
});