import React, { PureComponent, cloneElement } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Font } from '../../assets/fonts/font_names';
import IconActionless from '../IconActionless';
import global from '../../assets/styles/global';

export class Panel extends PureComponent {
  constructor(props) {
    super(props);
    this.panelWidth = this.props.panelWidth || 300;
    this.state = {
      slide: new Animated.Value(this.panelWidth),
      visible: props.isVisible,
      panelHeight: 0,
    };
    this._mounted = false;
  }

  getDerivedPropsFromState() {
    this.slide = new Animated.Value(this.props.isVisible ? 0 : this.panelWidth);
  }

  async getSnapshotBeforeUpdate(prevProps, prevState) {
    this.panelWidth = this.props.panelWidth || 300;
    if (this.props.isVisible && this._mounted) this.setState({ visible: true });

    Animated.spring(this.state.slide, {
      toValue: this.props.isVisible ? 0 : this.panelWidth,
      duration: 250,
      tension: 8,
      useNativeDriver: true
    }).start(({ finished }) => {
      if (!this.props.isVisible && finished && this._mounted) this.setState({ visible: false });
    });
    return null;
  }

  componentDidUpdate = (prevProps, prevState) => {

  }


  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  onLayout = (e) => {
    const height = e.nativeEvent.layout.height;
    this.setState({
      panelHeight: height - this.props.headerHeight,
    });
  }

  render() {
    // console.log('this.props.visible', this.state.visible);
    const { children, defaultStyle, containerStyle, pointerActiveContent, hasSeparator } = this.props;
    if (!this.state.visible) return null;
    this.panelWidth = this.props.panelWidth || 300;
    // console.log('childrenTST', children);
    const animatedStyles = { transform: [{ translateX: this.state.slide }], width: this.panelWidth };
    const container = defaultStyle === false ? null : styles.defaultContainer;
    const currentPanel = Array.isArray(children) ? children[pointerActiveContent] : children;
    return (
      <Animated.View style={[styles.animatedContainer, animatedStyles]}>
        <View onLayout={this.onLayout} style={[styles.containerView, container, containerStyle, global.shadow]}>
          <Header
            noHeader={this.props.noHeader}
            title={this.props.title}
            icon={this.props.icon}
            togglePop={this.props.togglePop}
          />
          { // passando prop pointer para caso seja necessário para o componente
            this.state.visible ?
              cloneElement(currentPanel, { pointer: pointerActiveContent, panelHeight: this.state.panelHeight })
              :
              null
          }
        </View>
        <Separator isVisible={hasSeparator} />
      </Animated.View>
    );
  }
}

export default Panel;

Panel.defaultProps = {
  pointerActiveContent: 0,
  headerHeight: 97
};

const styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute',
    height: '100%',
    right: 0,
    zIndex: 4,
    paddingLeft: 4,
  },
  containerView: {
    height: '100%',
    backgroundColor: 'rgb(250, 250, 250)',
  },
  defaultContainer: {
    flex: 1,
    // height: '100%',
    padding: 20,
  }
});

const Header = (props) => {
  if (props.noHeader) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
      {props.icon !== '' &&
        <IconActionless msg={props.icon} style={[global.link, { textDecorationLine: null, fontSize: 22, marginRight: 5 }, global.txtActiveShadow]} />
      }
      <Text style={{ fontFamily: Font.ASemiBold, fontSize: 13, marginTop: 3 }}>{props.title}</Text>
      <TouchableOpacity
        style={{ position: 'absolute', right: 0 }}
        onPress={props.togglePop}
      >
        <Text style={{ fontFamily: Font.C, fontSize: 28, opacity: 0.5, transform: [{ translateX: 6 }] }}>t</Text>
      </TouchableOpacity>
    </View>
  );
};

const Separator = ({ isVisible }) => {
  if (!isVisible) return null;
  return (
    <View style={{ position: 'absolute', width: '100%', height: 1, backgroundColor: '#CCC', top: 65 }} />
  );
};