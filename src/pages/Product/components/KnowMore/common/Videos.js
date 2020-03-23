import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, Image, StyleSheet, View, Platform } from 'react-native';
import { acToggleVideo } from '../../../../../redux/actions/global';
import { IconActionless, ImageLoad } from '../../../../../components';
const isWeb = Platform.OS === 'web';
class Videos extends React.Component {
  constructor(props) {
    super(props);
    this.resizeMode = 'cover';
    this.imgStyle = isWeb ? StyleSheet.absoluteFill : { height: '100%' };
  }
  render() {
    return (
      <TouchableOpacity
        style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}
        onPress={() => this.props.acToggleVideo(require('../../../../../assets/videos/VIDEO_BARBIE_TESTE.mp4'))}
      >
        <ImageLoad
          filename={this.props.currentContent.uri}
          noSizeType
          resizeMode={this.resizeMode}
          containerStyle={[this.imgStyle, { height: '100%', width: '100%' }]}
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 80, 95, 0.55)' }]} />
        <IconActionless
          style={{ position: 'absolute', alignSelf: 'center', color: 'white', fontSize: 55 }}
          msg="$"
        />
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  currentContent: state.product.currentContent
});

export default connect(mapStateToProps, { acToggleVideo })(Videos);