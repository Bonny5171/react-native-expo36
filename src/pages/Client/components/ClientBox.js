import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { string, object } from 'prop-types';
import { Font } from '../../../assets/fonts/font_names';
import global from '../../../assets/styles/global';
import { semImg } from '../../../assets/images';
import { ImageLoad } from '../../../components';

class ClientBox extends React.Component {
  constructor(props) {
    super(props);
    this.maxNameLength = 27;
  }
  render() {
    return (
      <View style={styles.vwClientBox}>
        <View style={styles.clientBox}>
          <View style={{ flex:1, flexGrow:1}} >
            <ImageLoad
              documentId={this.props.img}
              containerStyle={styles.clientImg}
              resizeMode = "cover"
            />
          </View>
          <View style={{ flexShrink:1,}} >
            <Text style={styles.clientName}>
              {this.props.name !== undefined ? this.props.name.toUpperCase().substr(0, this.maxNameLength) : '[nulo]'}
              {this.props.name.length > this.maxNameLength ? '...' : ''}
            </Text>
            <Text style={[styles.clientName, { fontSize: 14 }]}>
              {this.props.code}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

ClientBox.propTypes = {
  // Nome do cliente
  name: string,
};

export default ClientBox;

const styles = StyleSheet.create({
  vwClientBox: {
    flex: 1,
    marginLeft: 7,
    paddingTop: 8,
    maxWidth: 550,
  },
  clientBox: {
    backgroundColor: '#ffffff',
    height: 350,
    flex:1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowColor: 'rgba(0,0, 0, 0.3)',
    elevation: 3,
    marginBottom: 14,
    marginLeft: 30,
    padding:20,
  },
  clientImg: {
    flex:1,
    flexGrow:1,
    height: '100%',
    width: '100%',
  },
  clientName: {
    fontFamily: Font.BLight,
    fontSize: 27,
    color: 'black',
  }
});