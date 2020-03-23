import React from 'react';
import { connect } from 'react-redux';
import { Text, StyleSheet, View, Image } from 'react-native';
import { ImageLoad } from '../../../../../components';
import global from '../../../../../assets/styles/global';

class Accessories extends React.Component {
  render() {
    return (
      <View style={{ height: '100%', width: '100%' }}>
        <ImageLoad
          filename={this.props.currentContent.uri}
          noSizeType
          containerStyle={{ height: '100%', width: '100%' }}
        />
        <View style={styles.container}>
          <Text style={[global.text, styles.text]}>{this.props.currentContent.msg.toUpperCase()}</Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  currentContent: state.product.currentContent
});

export default connect(mapStateToProps, null)(Accessories);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    paddingLeft: 12,
    bottom: 0,
    height: 60,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, .4)',
  },
  text: {
    color: 'white',
    fontSize: 20
  }
});