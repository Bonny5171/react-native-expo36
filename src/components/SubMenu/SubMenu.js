import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Font } from '../../assets/fonts/font_names';
import { Row, Fade } from '..';
import global from '../../assets/styles/global';

const SubMenu = (
  {
    navigation,
    visible,
    items,
    view,
    globalMask,
    acSubMenuCatalog,
    acSubMenuIcon,
    acToggleExpanded,
    acToggleMask,
    acResetPointer,
    acToggleGlobalMask,
  }
) => {
  const itemsWithAction = items.map(item => {
    const expandedActions = [{ func: acSubMenuCatalog, params: [] }, { func: acToggleExpanded, params: [] }, { func: acResetPointer, params: [] }];
    if (item.icon === 'X') {
      item.actions = expandedActions;
    } else if (item.icon === '3') {
      let catalogActions = [
        { func: acToggleExpanded, params: [true] },
        { func: acSubMenuCatalog, params: [item.params] },
        { func: acResetPointer, params: [] },
        { func: toggleMask, params: [acToggleGlobalMask, acToggleMask, globalMask] },
      ];
      // Quando estiver navegando da página de listagem para a de catálogo devemos passar a função de  navegação
      // Porque quando trocar entre catalogo expandido e normal ele não deve navegar.
      if (navigation.state.routeName === 'listCatalog') {
        const resetNav = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'catalog' })],
        });
        catalogActions = [...catalogActions, { func: navigation.dispatch, params: [resetNav] }];
      }
      item.actions = catalogActions;
    } else {
      const resetNav = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'listCatalog' })],
      });
      item.actions = [
        { func: navigation.dispatch, params: [resetNav] },
        { func: acSubMenuCatalog, params: [] },
        { func: toggleMask, params: [acToggleGlobalMask, globalMask] },
      ];
    }
    return item;
  });

  return (
    <Fade
      visible={visible}
      style={{ position: 'absolute', top: 90, }}
    >
      <View style={[styles.vwSubMenu, global.shadow, view]} >
        {
          itemsWithAction.map(((curr) => {
            return (
              <SubMenuItem
                key={curr.key}
                icon={curr.icon}
                txt={curr.txt}
                iconUpdate={acSubMenuIcon}
                actions={curr.actions}
                acToggleMask={acToggleMask}
              />
            );
          }))
        }
      </View>
    </Fade>
  );
};

export default SubMenu;

const SubMenuItem = (
  {
    iconUpdate,
    txt,
    icon,
    actions,
    params,
    acToggleMask
  }
) => (
  <TouchableOpacity
    style={{ flex: 1 }}
    onPress={() => {
        actions.forEach(({ func, params }) => { if (params) func(...params); else func(); });
        iconUpdate(icon);
        acToggleMask();
      }}
  >
    <Row style={styles.row}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.txt}>{txt}</Text>
    </Row>
  </TouchableOpacity>
  );


const styles = StyleSheet.create({
  vwSubMenu: {
    height: 125,
    width: 240,
    marginLeft: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingTop: 15,
    paddingBottom: 15
  },
  row: {
    flex: 1,
    alignItems: 'center'
  },
  icon: {
    fontFamily: Font.C,
    color: 'black',
    opacity: 0.3,
    fontSize: 23,
    marginLeft: 15
  },
  txt: {
    fontFamily: Font.ALight,
    color: 'black',
    marginLeft: 15
  }
});

const toggleMask = (acToggleGlobalMask, acToggleMask, globalMask) => {
  acToggleMask();
  if (globalMask) {
    acToggleGlobalMask();
  }
};