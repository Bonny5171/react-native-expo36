import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import { ClientBox, ClientInfo } from '.';


class ClientDetails extends React.Component {
  render() {
    const { clientU, } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.backgroundDetails} />
        <ClientBox
          name={clientU.fantasyName !== undefined ? clientU.fantasyName : ''}
          code={clientU.code}
          img={clientU.sf_photo_url}
          dropdown={this.props.dropdown}
          boxStyle={{maxWidth:400}}
        />
        <ClientInfo
          dropdown={this.props.dropdown}
        />
      </View>
    );
  }
}

export default ClientDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1.9,
    flexDirection: 'row',
    paddingTop: 120,
  },
  backgroundDetails: {
    position: 'absolute',
    height: 300,
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