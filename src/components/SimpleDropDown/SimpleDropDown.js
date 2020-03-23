import React from 'react';
import { TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import { Fade } from '..';
import global from '../../assets/styles/global';
import SrvProduct from '../../services/Product/';

class SimpleDropDown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.data = props.options;
  }

  render() {
    const { options, isVisible, vwStyle, modalMask, actions, catalog } = this.props;

    return (
      <Fade style={[global.dropdownView, vwStyle]} visible={isVisible}>
        <FlatList
          style={{ flex: 1, width: '100%' }}
          data={options}
          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={{ width: '100%', marginTop: index === 0 ? 3 : 0 }}
                onPress={async () => {
                  this.props.acUpdateCurrent(this.props.passObject ? item : item.name);
                  this.props.acToggleDropdown();
                  if (modalMask) this.props.acToggleMask();
                  if (actions) actions.forEach(({ func, params }) => func(item, ...params));
                  if (catalog) this.props.acSetDataV2(await SrvProduct.getCatalogo(item.code, this.props.clientId));
                }}
              >
                <Text
                  style={[
                    global.text,
                    styleDDV.item,
                    { paddingBottom: index === this.props.options.length - 1 ? 5 : 0 }
                  ]}
                >
                  {item.name || item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </Fade>
    );
  }
}

const styleDDV = StyleSheet.create({
  list: {
    borderBottomColor: '#999'
  },
  item: {
    padding: 5,
    paddingBottom: 0,
    paddingLeft: 5,
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)'
  }
});

export default SimpleDropDown;
