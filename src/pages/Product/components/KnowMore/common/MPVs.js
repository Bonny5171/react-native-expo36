import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Image, StyleSheet } from 'react-native';
import global from '../../../../../assets/styles/global';
import { TextLimit, ImageLoad } from '../../../../../components';

class MPVs extends React.Component {
  render() {
    const { p, msg, uri } = this.props.currentContent;
    return (
      <View style={styles.container}>
        <View style={styles.leftContent}>
          <ImageLoad
            filename={uri}
            containerStyle={styles.img}
            noSizeType
          />
        </View>
        <View style={styles.rightContent}>
          <Text style={[global.h5, styles.title]}>{msg}</Text>
          <TextLimit
            style={global.p1C}
            msg={p}
            maxLength={250}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  currentContent: state.product.currentContent
});

export default connect(mapStateToProps, null)(MPVs);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100%',
    width: 944,
    paddingHorizontal: 80,
  },
  leftContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rightContent: {
    flex: 1,
    height: '100%',
    paddingLeft: 40,
    paddingTop: 75,
  },
  title: {
    color: 'black',
    paddingVertical: 16,
    fontSize: 23
  },
  img: {
    width: 350,
    height: 275,
  },
});