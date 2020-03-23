import React from 'react';
import { Animated } from 'react-native';

class Fade extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible
    };
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillMount() {
    this._visibility = new Animated.Value(this.props.visible ? 1 : 0);
  }

  componentWillReceiveProps(nextProps) {
    const { duration } = this.props;
    if (nextProps.visible && this._mounted) {
      this.setState({ visible: true });
    }
    Animated.timing(this._visibility, {
      toValue: nextProps.visible ? 1 : 0,
      duration: duration !== undefined ? duration : 300,
      useNativeDriver: true
    }).start(({ finished }) => {
      if (this._mounted && finished) this.setState({ visible: nextProps.visible });
    });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const { visible, style, children, ...rest } = this.props;

    const containerStyle = {
      opacity: this._visibility
    };

    const combinedStyle = [containerStyle, style];
    return (
      <Animated.View style={this.state.visible ? combinedStyle : containerStyle} {...rest}>
        {this.state.visible ? children : null}
      </Animated.View>
    );
  }
}

export default Fade;
