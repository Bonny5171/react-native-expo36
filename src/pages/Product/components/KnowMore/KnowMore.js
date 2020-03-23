import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text } from 'react-native';
import { acResetArrows } from '../../../../redux/actions/pages/product';
import { FadeTabs, ExtraInfo } from '../../../../components';
import { EIHeader } from '../../../../components/ExtraInfo';
import {
  Accessories,
  ColorsPerc,
  Specs,
  Videos,
  MPVs,
} from './common';
import global from '../../../../assets/styles/global';

class KnowMore extends React.Component {
  constructor(props) {
    super(props);
    this._renderCustomHeader = this._renderCustomHeader.bind(this);
    this.shouldGalleryAnimate = true;
  }

  componentWillUpdate(nextProps) {
    const currHasGallery = this.props.buttons[this.props.infoPointer].hasGallery;
    const nextHasGallery = this.props.buttons[nextProps.infoPointer].hasGallery;
    if (currHasGallery === nextHasGallery) {
      this.shouldGalleryAnimate = false;
    } else {
      this.shouldGalleryAnimate = true;
    }
  }

  render() {
    const tabs = this._renderTabs();
    // console.log('3 - render > KnowMore', this.props.product.currentGallery);
    return (
      <View style={{ paddingVertical: 4, marginBottom: 16, marginTop: 30 }}>
        <FadeTabs
          container={{ flex: null }}
          contentStyle={{ flex: null, paddingVertical: 2, width: '100%' }}
          noGradient
          contentGradient
          customHeader={this._renderCustomHeader}
          activeTab={this.props.infoPointer}
        >
          {tabs}
        </FadeTabs>
      </View>
    );
  }

  _renderCustomHeader() {
    return (
      <EIHeader
        current={this.props.currentInfo}
        buttons={this.props.buttons}
        acChangeTab={(index) => {
          this.props.acChangeInfo(index);
          this.props.scrollTo();
          this.props.acResetArrows();
        }}
      />
    );
  }

  _renderTabs() {
    const { horizontalPointer, horizontalGallery, acCurrentBox, buttons, rightArrow, leftArrow, infoPointer } = this.props;
    const contents = [
      <Videos />,
      <ColorsPerc
        setScrollView={this.props.setScrollView}
        enableScrollView={this.props.enableScrollView}
        scrollView={this.props.scrollView}
      />,
      <Accessories />,
      <MPVs />,
      <Specs product={this.props.currentProduct} />
    ];

    const tabs = buttons.map((button, index) => (
      <ExtraInfo
        key={index.toString()}
        container={styles.container}
        contentStyle={[styles.content, global.boxShadow]}
        horizontalPointer={horizontalPointer}
        horizontalGallery={horizontalGallery}
        infoPointer={infoPointer}
        hasGallery={button.hasGallery}
        fnNextInfo={() => {
          acCurrentBox(index, true);
        }}
        fnPreviousInfo={() => {
          acCurrentBox(index, false);
        }}
        acCurrentBox={acCurrentBox}
        rightArrow={rightArrow}
        leftArrow={leftArrow}
        shouldGalleryAnimate={this.shouldGalleryAnimate}
        hasImageLoad={button.hasImageLoad}
      >
        {contents[index]}
      </ExtraInfo>
    ));

    return tabs;
  }
}

const mapStateToProps = (state) => ({
  horizontalPointer: state.product.horizontalPointer,
  horizontalGallery: state.product.horizontalGallery,
  currentInfo: state.product.currentInfo,
  infoPointer: state.product.infoPointer,
  rightArrow: state.product.rightArrow,
  leftArrow: state.product.leftArrow,
  currentContent: state.product.currentContent,
});

export default connect(mapStateToProps, { acResetArrows })(KnowMore);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 3
  },
});