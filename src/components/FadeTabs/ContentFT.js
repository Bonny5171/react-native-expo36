import React from 'react';
import { Animated } from 'react-native';
import global from '../../assets/styles/global';

class ContentFT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      currentTab: props.activeTab,
    };
    this.transitionTime = 300;
  }

  componentWillMount() {
    this.state.opacity.addListener(value => { this._value = value; });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.activeTab !== nextProps.activeTab) {
      // Animação Fade-In Fade-Out
      Animated.timing(this.state.opacity, {
        toValue: this.state.opacity._value === 2 ? 0 : 2,
        duration: this.transitionTime,
        useNativeDriver: true
      }).start();
      // Muda a tab atual durante o efeito de Fade
      setTimeout(() => { this.setState({ currentTab: nextProps.activeTab }); }, this.transitionTime - 200);
    }
  }

  componentWillUnmount() {
    this.state.opacity.removeAllListeners();
  }

  render() {
    const { children, contentStyle } = this.props;
    const { currentTab } = this.state;
    const opacity = this.state.opacity.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [1, 0, 1]
    });
    const animatedStyle = [global.flexOne, { opacity }];
    return (
      <Animated.View
        style={[animatedStyle, contentStyle]}
      >
        {children[currentTab]}
      </Animated.View>
    );
  }
}

export default ContentFT;
