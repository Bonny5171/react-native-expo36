import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconActionless as IA } from '../../components';
import { Font } from '../../assets/fonts/font_names';
import global from '../../assets/styles/global';

const BreadCrumb = ({ toggleIsQuering, hamburguer, hambuguerFilter, chosenHFID, acClearOneFilterHamb, eventRemoveAll, filterByMenu, isVisible }) => {
  if (hamburguer === undefined || !isVisible || !hambuguerFilter) return <View style={styles.container} />;
  const isFirstLevelChosen = hambuguerFilter.coll1 === chosenHFID;
  const breadcrumb = [];
  Object.keys(hamburguer).forEach((key, index) => {
    if (hamburguer[key] !== null) {
      const lv = index + 1;
      let next = hamburguer[`lv${lv + 1}`] !== undefined && hamburguer[`lv${lv + 1}`] !== null ?
      hamburguer[`lv${lv + 1}`] : { label: 'TODOS' };
      const label = hamburguer[key].label;
      let lvSelected = index === 0 ? isFirstLevelChosen : hambuguerFilter[`s${lv}`] && isFirstLevelChosen;
      if (label !== 'TODOS' && (lvSelected)) {
        breadcrumb.push(
          <Level
            key={index.toString()}
            lv={lv}
            label={label}
            hasNext={next.label !== 'TODOS' && next !== null && hambuguerFilter[`s${lv + 1}`]}
            acClearOneFilterHamb={acClearOneFilterHamb}
            eventRemoveAll={eventRemoveAll}
            filterByMenu={filterByMenu}
            toggleIsQuering={toggleIsQuering}
            hambuguerFilter={hambuguerFilter}
          />
        );
      }
    }
  });
  if (breadcrumb.length === 0) {
    return (<View
      style={styles.container}
    />);
  }
  return (
    <View
      style={styles.container}
    >
      <TouchableOpacity
        onPress={() => eventRemoveAll()}
      >
        <IA msg="t" style={styles.icClear} />
      </TouchableOpacity>
      {breadcrumb}
    </View>
  );
};

export default BreadCrumb;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 9,
  },
  label: {
    alignItems: 'center',
    fontSize: 12,
    fontFamily: Font.ASemiBold,
    color: '#666',
  },
  arrow: {
    fontSize: 12,
    color: '#222',
    marginHorizontal: 2,
  },
  icClear: {
    fontSize: 17,
    color: '#333',
    transform: [{ translateX: -6 }]
  },
});

const Level = ({ toggleIsQuering, lv, label, hasNext, acClearOneFilterHamb, filterByMenu, hambuguerFilter }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <TouchableOpacity
      disabled={!hasNext}
      onPress={async () => {
        toggleIsQuering();
        await acClearOneFilterHamb(lv);
        toggleIsQuering();
        lv = lv - 1 === 0 ? 1 : lv - 1;
        filterByMenu(lv, hambuguerFilter, true);
      }}
    >
      <Text style={[styles.label, hasNext ? global.link : null, { fontFamily: Font.ASemiBold, fontSize: 12 }]}>{label.toUpperCase()}</Text>
    </TouchableOpacity>
    {
      hasNext ?
        <Arrow />
      :
        null
    }
  </View>
);
const Arrow = () => (<IA style={styles.arrow} msg="v" />);