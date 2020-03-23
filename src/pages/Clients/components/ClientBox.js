import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Font } from '../../../assets/fonts/font_names';
import SrvClients from '../../../services/Account';
import { semImg } from '../../../assets/images';
import { ImageLoad } from '../../../components';
class ClientBox extends React.Component {
  constructor(props) {
    super(props);
    this.maxNameLength = 17;
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.index !== nextProps.index) return true;
    if (this.props.window !== nextProps.window) return true;
    return false;
  }

  render() {
    const {
      item, acCurrentClient, larguraDasCaixas, client, rowPosition, code, next, previous, dataPosition, sf_photo1__c
    } = this.props;

    let nameClient = '';
    if (client) {
      nameClient = client;
    }
    // console.log('sf_photo1__c', sf_photo1__c);
    return (
      <View style={[styleCB.vwClientBox, { width: larguraDasCaixas }]}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={async () => {
            const client = await SrvClients.getById(item[rowPosition].key);
            acCurrentClient(previous, client, next, { previous: dataPosition, next: dataPosition });
            this.props.navigation.navigate('client');
          }}
          activeOpacity={0.8}
          animationVelocity={1}
          underlayColor="transparent"
        >
          <ImageLoad
            documentId={sf_photo1__c}
            containerStyle={styleCB.imgClient}
            resizeMode="cover"
          />
          <View style={{ height: 35, width: '100%', marginTop: 9 }}>
            <Text style={styleCB.txtClient}>
              {nameClient.toUpperCase().substr(0, this.maxNameLength)}
              {nameClient.length > this.maxNameLength ? '...' : ''}
            </Text>
            <Text style={styleCB.cliendId}>{code}</Text>
          </View>

        </TouchableOpacity>
      </View>
    );
  }
}

export default ClientBox;

const styleCB = StyleSheet.create({
  vwClientBox: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    height: 240,
    marginTop: 20,
    marginBottom: 3,
    paddingTop: 20,
    paddingBottom: 13,
    marginLeft: 25,
  },
  imgClient: {
    flex: 2,
    height: 95,
    width: 155,
  },
  txtClient: {
    width: 155,
    height: 17,
    fontFamily: Font.ALight,
    color: 'black',
  },
  cliendId: {
    fontFamily: Font.ALight,
    fontSize: 12,
    color: 'black',
    marginTop: 1,
  },
});
