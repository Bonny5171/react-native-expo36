import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Font } from '../../../assets/fonts/font_names';
import { ClientBox, ClientInfo } from '.';
import { Row, Button } from '../../../components';


class ClientDetails extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { clientU, extraInfo } = this.props;
    if (clientU.name !== nextProps.clientU.name) {
      return true;
    }

    for (let i = 0; i < extraInfo.length; i += 1) {
      if (extraInfo[i].isChosen !== nextProps.extraInfo[i].isChosen) {
        return true;
      }
    }

    if (this.props.clientU.fantasyName !== nextProps.clientU.fantasyName) {
      return true;
    }

    return false;
  }
  render() {
    const {
      clientU, extraInfo,
      acCartButton
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.backgroundDetails} />
        <ClientBox
          name={clientU.fantasyName !== undefined ? clientU.fantasyName : ''}
          code={clientU.code}
          img={clientU.sf_photo1__c}
        />
        <ClientInfo
          client={clientU}
        />
      </View>
    );
  }
}

export default ClientDetails;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: 'row',
    marginTop: 15,
  },
  backgroundDetails: {
    position: 'absolute',
    height: 345,
    width: '100%',
    backgroundColor: 'rgba(244,244,244, 0.5)',
    marginTop: -21
  },
  text: {
    fontSize: 15,
    fontFamily: Font.AMedium
  },
  txtSubTitle: {
    flex: 3.9,
    fontFamily: Font.ALight,
    marginLeft: 30,
  },
  icCart: {
    fontSize: 35,
    color: '#999',
    marginRight: 40,
    marginTop: 20
  },
  vwNextClient: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 35,
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    borderRadius: 20
  },
  txtNextClient: {
    fontSize: 20,
  },
  tchbNextClient: {
    flexDirection: 'row',
    width: 160,
    alignItems: 'center',
    paddingLeft: 13
  },
  moreInfo: {
    fontFamily: Font.BLight,
    fontSize: 24,
    color: 'black',
    marginLeft: 30
  },
  infoIcons: {
    fontFamily: Font.C,
    fontSize: 32,
    color: '#999',
    marginLeft: 5
  }
});