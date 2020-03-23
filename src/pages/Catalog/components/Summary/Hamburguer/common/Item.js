import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { acFilterHamburguer, acUpdateCurrent, acSetResultFinder, acClosePopUp, acHasChildrenSelected } from '../../../../../../redux/actions/pages/catalog';
import { acToggleMask } from '../../../../../../redux/actions/global';
import { Font } from '../../../../../../assets/fonts/font_names';
import global from '../../../../../../assets/styles/global';
import { IconActionless } from '../../../../../../components';

export class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClick =  this.handleClick.bind(this);
  }

  render() {
    const { hasChildren, isChild, isChosen, isFirstLevel, isFourthLevel, isThirdLevel, item, isExpanded } = this.props;
    let marginLeft = 0;
    if (isThirdLevel) { marginLeft = 14; } else if (isFourthLevel) { marginLeft = 29; }
    return (
      <View>
        <View  style={[styles.leftStripeIndicator, (isChosen && isFirstLevel) && { borderLeftColor: '#0085B2' }]} />
        <TouchableOpacity
          style={styles.tchb}
          onPress={this.handleClick}
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8,  }}
          >
            {
              isChild ?
                <ChildIndicator isThirdLevel={isThirdLevel} isChosen={isChosen} isFourthLevel={isFourthLevel} />
              :
                null
            }
            <Text style={[styles.txt, isChosen && global.activeColor, { marginLeft }]}>{item.toUpperCase()}</Text>
            <ChildrenIndicator isVisible={hasChildren} isExpanded={isExpanded}  isChosen={isChosen} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  async handleClick() {
    const { index } = this.props;
    const { coll1, coll2, coll3, coll4 } = this.props.hambuguerFilter;
    if      (this.props.isFirstLevel)  await this.props.acFilterHamburguer({ coll1: index, coll2, coll3, coll4 }, 'First');
    else if (this.props.isSecondLevel) await this.props.acFilterHamburguer({ coll1, coll2: index, coll3, coll4 }, 'Second');
    else if (this.props.isThirdLevel)  await this.props.acFilterHamburguer({ coll1, coll2, coll3: index, coll4 }, 'Third');
    else if (this.props.isFourthLevel) await this.props.acFilterHamburguer({ coll1, coll2, coll3, coll4: index }, 'Fourth');

    if (this.props.isFourthLevel || !this.props.hasChildren) {
      const coll = this.props.isFirstLevel ? index : coll1;
      await this.props.filterByMenu(coll);
      this.props.acHasChildrenSelected(coll);
      this.props.acClosePopUp();
      this.props.acToggleMask();
      this.props.acUpdateCurrent('categoria', this.props.item);
    }
  }
}

const mapStateToProps = (state) => ({
  hambuguerFilter: state.catalog.hambuguerFilter,
});

const mapDispatchToProps = {
  acFilterHamburguer,
  acUpdateCurrent,
  acSetResultFinder,
  acClosePopUp,
  acToggleMask,
  acHasChildrenSelected
};

export default connect(mapStateToProps, mapDispatchToProps)(Item);

const ChildIndicator = ({ isChosen, isThirdLevel, isFourthLevel }) => {
  let marginLeft = 0;
  if (isThirdLevel) { marginLeft = 15; } else if (isFourthLevel) { marginLeft = 30; }
  if (isChosen) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 15 }} />
        <IconActionless msg="J" style={[global.activeColor, { position: 'absolute', transform: [{ rotate: '180deg' }, { translateX: 5 }], marginLeft }]} />
      </View>
    );
  }
  return <View style={{ width: 15 }} />;
};

const ChildrenIndicator = ({ isChosen, isVisible, isExpanded }) => {
  if (!isVisible) return null;
  return (
    <IconActionless
      msg="^"
      style={[
          isChosen ? global.activeColor : global.defaultBlack,
          { position: 'absolute', fontSize: 24, transform: [{ rotate: isExpanded ? '180deg' : '0deg' }, { translateX: 2 }], right: 0 }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  leftStripeIndicator: {
    position: 'absolute',
    height: '100%',
    borderLeftWidth: 5,
    borderLeftColor: 'transparent',
  },
  txt: {
    fontFamily: Font.ASemiBold,
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  tchb: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
    marginLeft: 20,
  }
});