import React from 'react';
import { Dimensions, Animated, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Video } from 'expo';
import { connect } from 'react-redux';
import { acToggleVideo } from '../../redux/actions/global';
import { IconActionless, Fade } from '..';
const isWeb = Platform.OS === 'web';
let VideoPlayer = null;
let Player = null;

if (isWeb) {
  Player = require('video-react').Player;
} else {
  VideoPlayer = require('@expo/videoplayer').default;
}
const hiddenHeight = Dimensions.get('window').height;
const cropWidth = Dimensions.get('window').width;
class ModalVideo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      yPosition: new Animated.Value(hiddenHeight),
    };
  }

  componentWillMount() {
    this.state.yPosition.addListener(value => { this._value = value; });
  }

  componentWillUpdate() {
    // Reinicia a posição do conteúdo do modal para de baixo da tela
    if (!this.props.isVisible && this.state.yPosition._value < hiddenHeight) this.setState({ yPosition: new Animated.Value(hiddenHeight) });
  }

  componentWillUnmount() {
    this.state.yPosition.removeAllListeners();
  }
  render() {
    const { isVisible } = this.props;
    const container = {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    };
    const video = this._renderVideo();
    const animatedStyles = { transform: [{ translateY: this.state.yPosition }] };
    const closeLabel = this._renderCloseLabel();

    if (isVisible) Animated.timing(this.state.yPosition, { toValue: 0, duration: 650 }).start();

    return (
      <Fade
        style={[StyleSheet.absoluteFill, styles.container]}
        visible={isVisible}
      >
        <Animated.View style={[container, animatedStyles]}>
          {video}
          {closeLabel}
        </Animated.View>
      </Fade>
    );
  }

  _renderVideo() {
    if (isWeb) return this._renderVideoWeb();
    if (!this.props.video) return null;
    return (
      <VideoPlayer
        videoProps={{
          shouldPlay: true,
          resizeMode: Video.RESIZE_MODE_CONTAIN,
          source: this.props.video
        }}
        playFromPositionMillis={0}
        showFullscreenButton={false}
      />
    );
  }

  _renderCloseLabel() {
    return (
      <View style={styles.closeView}>
        <CloseButton closeModal={this.props.acToggleVideo} />
      </View>
    );
  }

  _renderVideoWeb() {
    return (
      <Player
        fluid={false}
        playsInline
        src={this.props.video}
        height="100%"
        width="100%"
        autoPlay
      />
    );
  }
}

export default connect(null, { acToggleVideo })(ModalVideo);

const styles = {
  container: {
    zIndex: 7,
    elevation: 8,
    backgroundColor: 'black',
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  closeView: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    right: 15,
    top: 20,
  },
  gradient: {
    position: 'absolute',
    height: 40,
    width: '100%',
  },
  topGradient: {
    top: 0,
    zIndex: 3,
  },
  bottomGradient: {
    bottom: 0,
    zIndex: 3
  },
  txtLabel: {
    fontSize: 28,
    color: 'rgb(244, 244, 244)',
    marginRight: 10,
    marginTop: 8,
  }
};

const CloseButton = props => (
  <TouchableOpacity
    style={styles.closeIcon}
    onPress={() => props.closeModal()}
  >
    <IconActionless
      style={{ fontSize: 34, color: '#B4B7B9' }}
      msg="t"
    />
  </TouchableOpacity>
);