import React from 'react';
import { View, StyleSheet, Text, FlatList, Animated } from 'react-native';
import { connect } from 'react-redux';
import { Row, Button, IconActionless, Panel } from '../../../../../components';
import { Font } from '../../../../../assets/fonts/font_names';
import global from '../../../../../assets/styles/global';
import { Item } from './common';

class SummaryHamburguer extends React.PureComponent {
  render() {
    const { dropdown, hamburguerMenu, acToggleMask, acOpenCloseDropDown, acClosePopUp } = this.props;
    if (hamburguerMenu === null) return null;

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Row style={{ alignItems: 'center', paddingVertical: 15, paddingLeft: 24 }}>
            <IconActionless msg="I" style={[global.icChosen, { fontSize: 30, transform: [{ translateX: -11 }] }]} />
            <Text
              style={{
                fontFamily: Font.AThin,
                fontSize: 21,
                color: 'rgba(0, 0, 0, 0.7)'
              }}
            >
              MENU
            </Text>
          </Row>

          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button
              tchbStyle={{ alignSelf: 'flex-end', marginTop: 0, transform: [{ translateX: 7 }] }}
              txtStyle={global.iconClose}
              txtMsg="t"
              actions={[
                { func: acClosePopUp, params: [] },
                {
                  // SÃ³ fecha o dropdown caso ele esteja visÃ­vel
                  func: dropdown.isVisible ? acOpenCloseDropDown : () => null,
                  params: []
                },
                { func: acToggleMask, params: [] }
              ]}
            />
          </View>

          {/* BODY */}
        </View>
        <View style={{ flex: 1, paddingTop: 10, paddingBottom: 4 }}>
          <FlatList
            data={this.props.hamburguerMenu.level1}
            style={{ flex: 1 }}
            renderItem={({ item, index }) => {
              // console.log('ITEM ISCHOSEN', item.isChosen, item.label1);
              const hamburguer = this.props.hambuguerFilter;
              const { coll1, coll2, coll3, coll4, expanded1, expanded2, expanded3 } = hamburguer;
              const isChosen = coll1 === index;
              const selected = item.isChosen && this.props.chosenHFID === index;
              return (
                <View>
                  <Item
                    item={item.label1}
                    isActive={selected}
                    isFirstLevel
                    isChosen={selected && (item.hasChildrenSelected || !item.hasChildren)}
                    hasChildren={item.hasChildren}
                    index={index}
                    isExpanded={expanded1 && isChosen}
                    filterByMenu={this.props.filterByMenu}
                  />
                  <SecondLevel
                    firstLevel={isChosen}
                    sndLevel={coll2}
                    thrdLevel={coll3}
                    frthLevel={coll4}
                    is2ndExpanded={expanded1}
                    is3rdExpanded={expanded2}
                    is4thExpanded={expanded3}
                    sndLevelData={item.level2}
                    hambuguerFilter={hamburguer}
                    filterByMenu={this.props.filterByMenu}
                  />
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  hambuguerFilter: state.catalog.hambuguerFilter,
  selectedHF: state.catalog.selectedHF,
  chosenHFID: state.catalog.chosenHFID,
  hamburguerMenu: state.catalog.hamburguerMenu,
  userInfo: state.global.userInfo
});

export default connect(
  mapStateToProps,
  null
)(SummaryHamburguer);

const styles = StyleSheet.create({
  container: {
    // elevation: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    paddingTop: 12,
    paddingRight: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  icMail: {
    fontFamily: Font.C,
    color: 'rgba(0, 0, 0, 0.3)',
    fontSize: 30
  },
  goToCartPage: {
    fontFamily: Font.ALight,
    fontSize: 18,
    textDecorationLine: 'underline',
    color: '#359EC2'
  },
  buttons: {
    backgroundColor: '#0085B2',
    height: 40,
    borderRadius: 45,
    justifyContent: 'center'
  },
  txtButtons: {
    fontSize: 20,
    color: 'white',
    fontFamily: Font.ALight,
    textAlign: 'center'
  },
  triangleLeft: {
    transform: [{ rotate: '-90deg' }]
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#0085B2'
  },
  trianglePosition: {
    position: 'absolute',
    right: 0,
    flex: 1,
    height: 20
  },
  activeColor: {
    color: '#0085B2'
  }
});

const SecondLevel = ({
  firstLevel,
  is2ndExpanded,
  sndLevel,
  filterByMenu,
  thrdLevel,
  frthLevel,
  is3rdExpanded,
  is4thExpanded,
  sndLevelData,
  hambuguerFilter
}) => {
  if (!firstLevel || !is2ndExpanded) return null;
  return (
    <FlatList
      // style={{ paddingLeft: 10 }}
      data={sndLevelData}
      extraData={hambuguerFilter}
      renderItem={({ item, index }) => {
        const isChosen = sndLevel === index;
        return (
          <View>
            <Item
              isSecondLevel
              isChild
              isChosen={item.isChosen}
              item={item.label}
              index={index}
              hasChildren={item.hasChildren}
              isExpanded={is3rdExpanded && isChosen}
              filterByMenu={filterByMenu}
            />
            <ThirdLevel
              firstLevel={firstLevel}
              isExpanded={is3rdExpanded && item.label !== 'TODOS'}
              is4thExpanded={is4thExpanded}
              secondLevel={isChosen}
              frthLevel={frthLevel}
              thrdLevel={thrdLevel}
              thrdLevelData={item.level3}
              hasChildren={item.hasChildren}
              hambuguerFilter={hambuguerFilter}
              filterByMenu={filterByMenu}
            />
          </View>
        );
      }}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const ThirdLevel = ({
  filterByMenu,
  firstLevel,
  secondLevel,
  thrdLevel,
  frthLevel,
  thrdLevelData,
  is4thExpanded,
  isExpanded,
  hambuguerFilter
}) => {
  if (!firstLevel || !secondLevel || !isExpanded) return null;

  return (
    <FlatList
      // style={{ paddingLeft: 10 }}
      data={thrdLevelData}
      extraData={hambuguerFilter}
      renderItem={({ item, index }) => {
        const isChosen = thrdLevel === index;
        const isExpanded = is4thExpanded && isChosen;
        return (
          <View>
            <Item
              isThirdLevel
              isChild
              isChosen={item.isChosen}
              item={item.label}
              index={index}
              hasChildren={item.hasChildren}
              isExpanded={isExpanded && isChosen}
              filterByMenu={filterByMenu}
            />
            <FourthLevel
              firstLevel={firstLevel}
              isExpanded={isExpanded && item.label !== 'TODOS'}
              secondLevel={secondLevel}
              frthLevel={frthLevel}
              thrdLevel={thrdLevel}
              frthLevelData={item.level4}
              hambuguerFilter={hambuguerFilter}
              filterByMenu={filterByMenu}
            />
          </View>
        );
      }}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const FourthLevel = ({
  filterByMenu,
  firstLevel,
  secondLevel,
  thirdLevel,
  frthLevel,
  frthLevelData,
  hambuguerFilter,
  isExpanded
}) => {
  if (!firstLevel || !secondLevel || thirdLevel || !isExpanded) return null;
  return (
    <FlatList
      // style={{ paddingLeft: 10 }}
      data={frthLevelData}
      extraData={hambuguerFilter}
      renderItem={({ item, index }) => (
        <Item
          isFourthLevel
          isChild
          isChosen={item.isChosen}
          hasChildren={item.hasChildren}
          isExpanded={false}
          item={item.label}
          index={index}
          filterByMenu={filterByMenu}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};
