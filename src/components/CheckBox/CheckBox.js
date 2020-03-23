import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { array, object, func, string, bool, oneOfType } from 'prop-types';
import global from '../../assets/styles/global';

class CheckBox extends React.PureComponent {
  state = {
    isChosen: this.props.isChosen
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isChosen } = this.props;
    if (prevProps.isChosen !== this.props.isChosen) {
      this.setState({ isChosen });
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    
  }

  render() {
    const {
      action,
      param,
      style,
      radio,
      disabled,
      icStyle
    } = this.props;
    return (
      <TouchableOpacity
        style={style}
        disabled={disabled}
        onPress={() => {
          const isChosen = !this.state.isChosen;
          this.setState({ isChosen });
          // Montado assim para permitir mudar o check para selecionado e acionar uma ação assíncrona
          action(param);
        }}
      >
        {
        this.state.isChosen ?
          <Text style={[global.iconChecked, { paddingTop: 5, paddingBottom: 5 }, icStyle]}>{radio ? ':' : 'h'}</Text>
        :
          <Text style={[global.iconUnChecked, { paddingTop: 5, paddingBottom: 5 }, icStyle]}>i</Text>
      }
      </TouchableOpacity>
    );
  }
};

export default CheckBox;

CheckBox.propTypes = {
  isChosen: bool,
  style: oneOfType([array, object]),
  action: func.isRequired,
  param: oneOfType([array, object, string]),
};