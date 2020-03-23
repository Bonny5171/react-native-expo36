import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { bool, array, number, func } from 'prop-types';
import ImageLoad from '../../components/ImageLoad';

const Gallery = ({ isVisible, data, pointerGallery, updateGallery, setPointerGallery, containerStyle }) => {
  let gallery = null;
  // Este componente não é flatlist propositalmente por considerar receber a galeria até no máx 6 fotos(varia dependendo da tela)
  if (isVisible && data !== undefined) {
    if (data.length > 1) {
      gallery = data.map((item, index) => {
        const isChosen = index === pointerGallery;
        return (
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            key={item.key}
            disabled={isChosen}
            onPress={() => {
              setPointerGallery(index);
              updateGallery(item);
            }}
          >
            {/* <Image
              resizeMode="contain"
              source={{ uri: item.url }}
              style={[styles.img, { borderColor: isChosen ? '#CCC' : 'transparent' }]}
            /> */}
            <ImageLoad
              sizeType="m"
              resizeMode="contain"
              filename={item.url || item.uri}
              containerStyle={[styles.img, { borderColor: isChosen ? '#CCC' : 'transparent' }]}
            />
          </TouchableOpacity>
        );
      });
    }
  }

  return <View style={containerStyle}>{gallery}</View>;
};

export default Gallery;

Gallery.propTypes = {
  isVisible: bool,
  data: array,
  pointerGallery: number,
  updateGallery: func.isRequired,
  setPointerGallery: func.isRequired,
};

Gallery.defaultProps = {
  data: []
};

const styles = StyleSheet.create({
  img: {
    // backgroundColor: 'rgb(250, 250, 250)',
    height: 50,
    width: 50,
    padding: 2,
    borderWidth: 1,
  }
});