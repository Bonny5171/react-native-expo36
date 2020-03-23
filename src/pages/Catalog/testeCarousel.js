import React, { Component } from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { semImg } from '../../assets/images';

const data = [
  { color: 'Branco', url: semImg, idx: 0 },
  { color: 'Preto', url: 'https://s3.amazonaws.com/images.lojagrendene.com.br/450/11314-24640.jpg', idx: 1 },
  { color: 'Verde', url: 'https://s3.amazonaws.com/images.lojagrendene.com.br/450/11314-24557.jpg', idx: 2 },
];

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexDirection: 'row',
  },
  scrollViewVertical: {
    flexDirection: 'column',
  },
  item: {
    flex: 1,
    width: window.width,
  },
  verticalItem: {
    flex: 1,
    height: window.height,
    width: window.width,
  },
});

export default class App extends Component {
  state = {
    currentItem: data[0]
  }

  _renderItem({ item, index }) {
    return (
      <View style={styles.slide}>
          <Text style={styles.title}>{ item.color }</Text>
          <Image style={{ width: 200, height: 200 }} source={{ uri: item.url }} resizeMode="contain" />
        </View>
    );
  }

  renderThumb() {
    return data.map((item, index) => {
      let styleImg = { width: 40, height: 40, marginRight: 10 };
      if (this.state.currentItem == item)
        {styleImg = {width: 40, height: 40, marginRight: 10, borderWidth: 2, borderColor: '#000000'};}
      return (
        <View>
          <TouchableOpacity onPress={() => this._carousel.snapToItem(item.idx)}>
            <Image style={styleImg} source={{ uri: item.url }} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      );
    });
  }


  render() {
    return (
      <View style={{ marginLeft: 20, marginTop: 20 }}>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={data}
          renderItem={this._renderItem}
          sliderWidth={300}
          itemWidth={300}
          onSnapToItem={(index) => this.setState({ currentItem: data[index] })}
        />
        <ScrollView horizontal>{this.renderThumb()}</ScrollView>
      </View>
    );
  }
}