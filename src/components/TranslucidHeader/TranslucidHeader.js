import React from 'react';
import { View, Animated, StyleSheet, Platform } from 'react-native';
import { number, string, oneOfType, object, array } from 'prop-types';
import { Fade, Gradient } from '..';

class TranslucidHeader extends React.PureComponent {
  componentWillMount() {
    const { rgb, startingHeight } = this.props;

    this.startingHeight = startingHeight !== undefined ? startingHeight : 20;
    this.rgb = rgb !== undefined ? rgb : '255, 255, 255';
  }

  componentDidMount() {
    this.props.y.addListener(value => {
      this._value = value;
    });
  }

  componentWillUnmount() {
    this.props.y.removeAllListeners();
  }

  render() {
    const { y, content, children, container, isModalOpen } = this.props;
    const heightPosition = isModalOpen ? new Animated.Value(this.startingHeight) : y;
    // A interpolação só deve ocorrer entre a altura 0 a (20 ou startingHeight) da lista conectada com este header
    // o resultado será interpolado de 0 a (20 ou startingHeight) para um background branco ou cor rgb, alterando SOMENTE a opacidade
    const backgroundInterpolated = Animated.diffClamp(heightPosition, 0, this.startingHeight).interpolate({
      inputRange: [0, this.startingHeight],
      outputRange: [`rgba(${this.rgb}, 0)`, `rgba(${this.rgb}, 0.95)`]
    });
    const animatedBackground = {
      backgroundColor: backgroundInterpolated,
      width: '100%'
    };
    return (
      <View style={[styles.container, container]}>
        <Animated.View style={[content, animatedBackground]}>{children}</Animated.View>
        <Fade duration={350} visible={y._value > this.startingHeight - 5}>
          <Gradient
            style={{ height: 23, width: '100%' }}
            range={['rgba(0, 0, 0, 0.15)', 'rgba(0, 0, 0, 0.10)', 'rgba(0, 0, 0, 0)']}
            webId="lineargradient-translucid-header"
          />
        </Fade>
      </View>
    );
  }
}

TranslucidHeader.protoTypes = {
  // Cor que a view ficará quando 100% ativa
  rgb: string,
  // Altura que a mudança de cor deve estar em 100%
  startingHeight: number,
  // Posição Y atual da lista conectada
  y: number.isRequired,
  // Para obter o feito das linhas da lista passando atraz do header,
  // aplicar uma altura para estar header = ao paddingTop da lista conectada
  // Estilo do conteúdo do header
  content: oneOfType([number, object, array]),
  // Estilo do container do header (View que envolve o conteúdo e o gradiente)
  container: oneOfType([number, object, array])
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%'
  }
});

export default TranslucidHeader;
