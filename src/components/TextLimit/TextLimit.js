import React from 'react';
import { Text } from 'react-native';
import { string, number } from 'prop-types';

class TextLimit extends React.PureComponent {
  render() {
    if (this.props.msg === undefined) return null;
    if (!this.props.maxLength) {
      return (
        <Text style={this.props.style}>{this.props.msg}</Text>
      );
    }
    this.prepareText(this.props.msg);
    return <Text style={this.props.style}>{this.text}</Text>;
  }

  prepareText(text) {
    const { maxLength } = this.props;
    this.text = text;
    if (text.length > maxLength && maxLength !== undefined) this.text = text.substr(0, maxLength) + '...';
  }
}

export default TextLimit;

TextLimit.propTypes = {
  msg: string,
  maxLength: number
};
