import React from 'react';
import { TouchableOpacity, FlatList, Text, StyleSheet, Animated, View } from 'react-native';
import PropTypes from 'prop-types';
import { Font } from '../../assets/fonts/font_names';

class DropDownView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: new Animated.Value(0),
      visible: false,
    };
  }
  componentWillMount() {
    this._mounted = true;
    this.state.height.addListener((value) => { this._value = value; });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible && !this.state.visible && this._mounted) {
      this.setState({ visible: true });
    }

    Animated.timing(this.state.height,
      {
        toValue: nextProps.isVisible ? this.props.maxHeight : 0,
        duration: 300,
      }
    ).start(() => {
      if (this._mounted) this.setState({ visible: nextProps.isVisible });
      // console.log('nextProps.isVisible', nextProps.isVisible);
    });
  }

  componentWillUnmount() {
    this._mounted = false;
    this.state.height.removeAllListeners();
  }

  render() {
    const {
      options,
      isVisible,
      isSimpleString,
      fullObject,
      params,
      acToggleDropdown,
      updateCurrent,
      element,
      vwStyle,
      listStyle,
      txtItemStyle,
      objProp,
      shouldUpperCase,
    } = this.props;
    const { visible, height } = this.state;
    // console.log('height', height);
    const container = [styles.vwStyle, vwStyle];

    // Sempre passar um height no listStyle
    if (!visible) return null;

    return (
      <Animated.View data-id="dropDownView" style={[container, { paddingLeft: 0 }, { maxHeight: height }]}>
        <FlatList
          style={[styles.list, listStyle]}
          data={options}
          renderItem={({ item, index }) => {
            let msg = isSimpleString ? item : item[objProp];
            if (shouldUpperCase) msg = msg.toUpperCase();
            return (
              <TouchableOpacity
                style={[styles.item, options.length > 1 && index !== options.length - 1 ? styles.separator : null]}
                onPress={() => {
                    if (isVisible) {
                      if (params) { acToggleDropdown(...params); } else { acToggleDropdown(); }
                      updateCurrent(fullObject ? item : item[objProp], index);
                    }
                  }
                }
              >
                {
                  element !== undefined ?
                    element(item)
                  :
                    <Text style={[styles.txtItem, txtItemStyle]}>{msg}</Text>
                }
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </Animated.View>
    );
    // console.log('NULL');
  }
}

export default DropDownView;

DropDownView.defaultProps = {
  objProp: 'name',
  isSimpleString: false,
};

DropDownView.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  acToggleDropdown: PropTypes.func.isRequired,
  updateCurrent: PropTypes.func.isRequired,
  // Caso não vá exibir um objeto com a propriedade name, passar true
  isSimpleString: PropTypes.bool,
  // Passa o objeto inteiro para a função de atualizar a opção selecionada, ao invés de somente a prop .[objProp]
  fullObject: PropTypes.bool,
  // Componente Linha customizada para ser renderizada
  element: PropTypes.func,
  // Nome da propriedade usado para objeto manipulado ao invés
  objProp: PropTypes.string,
  // Styles
  // vwStyle: ViewPropTypes.style, // containerStyle
  // Passar altura ou altura máximo para ser utilizada pelo componente
  // listStyle: ViewPropTypes.style.isRequired,


};

const styles = StyleSheet.create({
  vwStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#999',
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
  },
  list: {
    borderBottomColor: '#999',
  },
  item: {
    padding: 3,
  },
  separator: {
    borderBottomWidth: 0.6,
    borderBottomColor: '#DDD'
  },
  txtItem: {
    fontSize: 16,
    fontFamily: Font.ALight,
    color: '#666',
    marginLeft: 11,
  }
});