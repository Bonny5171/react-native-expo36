import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Fade } from '..';

const ModalMask = ({ action, visible, toggleModal, immersive, container }) => {
  if (!visible) return null;
  return (
    <View
      style={[[StyleSheet.absoluteFill, { backgroundColor: immersive ? 'black' : null, opacity: 0.18 }, container]]}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          if (action) {
            action();
          }
          if (toggleModal) {
            toggleModal.forEach(({ func, params = [] }) => {
              func(...params);
            });
          }
        }}
      />
    </View>
  );
};

export default ModalMask;

ModalMask.propTypes = {
  immersive: PropTypes.bool, // Quando a máscara está em modo imersivo, ela inclui um background Escuro na animação
};