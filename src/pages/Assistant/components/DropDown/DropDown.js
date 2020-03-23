import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { bool, array, func } from 'prop-types';
import { Fade } from '../../../../components';
import Item from './Item';
import global from '../../../../assets/styles/global';

class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this);
  }

  render() {
    const {
      data,
      visible,
      container,
    } = this.props;
    return (
      <Fade
        style={[global.dropdownView, styles.container, container]}
        visible={visible && data.length > 0}
        duration={450}
      >
        <FlatList
          style={styles.list}
          data={data}
          keyExtractor={(item, index) => `${item.fantasyName}${index}`}
          renderItem={({ item, index }) => (
            <Item
              item={item}
              onRowClick={this.onRowClick}
              lastItem={index === data.length - 1}
            />
          )}
        />
      </Fade>
    );
  }

  onRowClick(item) {
    const {
      setInput,
      acCurrentClient,
      acLoadStores,
      acToggleDropdown
    } = this.props;

    acCurrentClient(item);
    acLoadStores(item.stores);
    acToggleDropdown();
    setInput(`${item.code}  ${item.fantasyName.toUpperCase().substr(0, 20)}${item.fantasyName.length > 20 ? '...' : ''}       ${item.billing.address.toUpperCase().substr(0, 9)}${item.billing.address.length > 9 ? '...' : ''}`, item.fantasyName.toUpperCase());
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginTop: 52,
    width: 530,
    paddingLeft: 0,
  },
  list: { maxHeight: 190 }
});

export default DropDown;

DropDown.propTypes = {
  data: array,
  acCurrentClient: func,
  acLoadStores: func,
  acToggleDropdown: func
};