import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Gradient, NavArrow, HorizontalGallery } from '..';

class ExtraInfo extends React.PureComponent {
  render() {
    const {
      hasGallery,
      children,
      gradient,
      fnNextInfo,
      fnPreviousInfo,
      rightArrow,
      leftArrow,
      horizontalPointer,
      horizontalGallery,
      container,
      contentStyle,
      galleryStyle,
      shouldGalleryAnimate,
      acCurrentBox,
    } = this.props;
    // Se não tiver galeria, as setas, e a galeria horizontal não são renderizadas
    if (!hasGallery) {
      return (
        <View style={container} >
          {gradient && <Gradient style={styles.gradient} />}
          <View style={[styles.content, contentStyle]}>
            {children}
          </View>
          {gradient && <Gradient style={styles.gradient} />}
        </View>
      );
    }

    return (
      <View style={container} >
        {gradient && <Gradient style={styles.gradient} />}
        <View style={[{ zIndex: 2 }, container]}>
          <View style={[styles.content, contentStyle]}>
            <NavArrow
              tchbStyle={{ zIndex: 2 }}
              disabled={leftArrow}
              acNavigate={fnPreviousInfo}
            />
            {children}
            <NavArrow
              right
              disabled={rightArrow || horizontalGallery.length <= 1}
              acNavigate={fnNextInfo}
            />
          </View>

          <HorizontalGallery
            style={galleryStyle}
            horizontalPointer={horizontalPointer}
            gallery={horizontalGallery}
            acCurrentBox={acCurrentBox}
            shouldAnimated={shouldGalleryAnimate}
            hasImageLoad={this.props.hasImageLoad}
          />
        </View>
        {gradient && <Gradient style={styles.gradient}  />}
      </View>
    );
  }
}

export default ExtraInfo;


ExtraInfo.defaultProps = {
  horizontalGallery: []
};
const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    height: 335,
    width: '100%',
    zIndex: 2,
  },
  gradient: {
    height: 50,
  },
});