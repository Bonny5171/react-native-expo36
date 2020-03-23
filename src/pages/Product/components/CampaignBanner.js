import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { semImg } from '../../../assets/images';

class CampaignBanner extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerImg}>
          <Image source={semImg} style={styles.image} resizeMode="contain" />
        </View>
      </View>
    );
  }
}

export default CampaignBanner;

const styles = StyleSheet.create({
  container: {
    height: 250,
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: 1200,
  },
  containerImg: {
    flex: 1,
    marginTop: 60,
    marginHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 190,
    marginBottom: 16,
    maxWidth: 1200,
  }
});