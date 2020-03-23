import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import global from '../assets/styles/global';

class Button extends React.PureComponent {
  btnClicked() {
    const { rdType, rdName, rdAction, action, params, actions, pop, navigation } = this.props;

    if (pop) {
      return navigation.pop();
    }

    if (rdAction !== undefined) {
      rdAction(rdType, rdName);
    }

    if (action !== undefined) {
      action(...params);
    }

    // Este if serÃ¡ o Ãºnico apÃ³s refatoraÃ§Ã£o
    // O botÃ£o aceita quantas functions e parametros quiser via array
    // Params como array
    if (actions) {
      actions.forEach(({ func, params = [] }) => {
        func(...params);
      });
    }
  }

  decideTxtStyle() {
    const { nChosenColor, txtStyle, chosenColor, changeColor, isChosen, shadow } = this.props;

    if (changeColor) {
      let style = isChosen
        ? [
          txtStyle,
          {
            color: chosenColor
          }
        ]
        : [txtStyle, { color: nChosenColor }];
      if (shadow) {
        style = isChosen ? [style, global.activeBtnShadow] : style;
      }

      return style;
    }
    return txtStyle;
  }

  render() {
    const { tchbStyle, txtMsg, turnOffOpacity, isChosen, disabled } = this.props;
    let { txtStyle } = this.props;

    txtStyle = this.decideTxtStyle();
    return (
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={turnOffOpacity && isChosen ? 1 : 0.7}
        onPress={() => this.btnClicked()}
        onLongPress={this.props.onLongPress}
        style={[tchbStyle, disabled && { opacity: 0.7 }]}
      >
        <Text style={txtStyle}>{txtMsg}</Text>
      </TouchableOpacity>
    );
  }
}

export default Button;

Button.defaultProps = {
  params: [],
  onLongPress: () => { }
};
