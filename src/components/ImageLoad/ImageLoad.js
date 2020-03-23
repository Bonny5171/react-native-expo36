import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { string, func, bool } from 'prop-types';

import SrvResource from '../../services/Resource';
import { semImg } from '../../assets/images';

class ImageLoad extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      base64ImageUri: null,
      loading: true,
      isFirstMount: true,
    };
    this._mounted = false;
  }

  async componentDidMount() {
    this._mounted = true;
    await this.resolveImage();
    if (this._mounted) this.setState({ isFirstMount: false, loading: false });
  }

  componentDidUpdate(prevProps, prevState) {
    const { filename, documentId } = this.props;
    if (filename !== prevProps.filename || documentId !== prevProps.documentId) {
      this.setState({ loading: true });
      this.resolveImage();
    }
    if (prevState.loading && this._mounted) {
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  async resolveImage() {
    const { filename, ref1, ref2, sizeType, sequence, documentId } = this.props;
    let response = null;

    if (filename && this._mounted) {
      const doc = this.props.noSizeType ? filename : `${filename}_${sizeType}`;
      response = await SrvResource.getByFileName(doc);
    } else if (documentId && this._mounted) {
      response = await SrvResource.getBySfContentDocumentId(documentId);
    } else if (ref1 && ref2 && sizeType && sequence && this._mounted) {
      response = await SrvResource.getByRefs(ref1, ref2, sizeType, sequence);
    }
    if (this._mounted) {
      if (response) {
        this.setState({ base64ImageUri: response.fullContent, loading: false });
      } else {
        this.setState({ loading: false });
      }
    }
  }

  componentWillUnmount = () => {
    this._mounted = false;
  }

  render() {
    if (this.state.loading || this.state.isFirstMount) {
      return (
        <View style={[styles.sizeImage, styles.loadingImage, this.props.containerStyle, this.props.loadContainer]}>
          <ActivityIndicator size="small" color="#333" />
        </View>
      );
    }

    const source = this.state.base64ImageUri ? { uri: this.state.base64ImageUri } : semImg;
    const hasImg = source !== semImg;
    return hasImg && this.props.isClickable ? (
      <TouchableOpacity
        disabled={this.props.isDisabled}
        onPress={this.props.onPress}
        style={[styles.sizeImage, this.props.containerStyle, this.props.tchbStyle]}
      >
        <Image
          source={source}
          resizeMode={this.props.resizeMode || 'contain'}
          style={[styles.sizeImage, this.props.containerStyle]}
        />
      </TouchableOpacity>
    ) :
      (
        <Image
          source={source}
          resizeMode={this.props.resizeMode || 'contain'}
          style={[styles.sizeImage, this.props.containerStyle]}
        />
      );
  }
}

ImageLoad.propTypes = {
  ref1: string,
  ref2: string,
  sizeType: string,
  sequence: string,
  documentId: string,
  isClickable: bool,
  onPress: func,
};

ImageLoad.defaultProps = {
  sizeType: 'l',
  sequence: '00',
};

const styles = StyleSheet.create({
  sizeImage: {
    width: '100%',
    height: '100%'
  },

  loadingImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default ImageLoad;
