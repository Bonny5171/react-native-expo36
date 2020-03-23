import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import { SubMenu, InfoMsg } from '../../components';
import { acToggleExpanded, acResetPointer } from '../../redux/actions/pages/catalog';
import { acUpdateButtons, acSubMenuCatalog, acSubMenuIcon } from '../../redux/actions/pages/menu';
import global from '../../assets/styles/global';
import { acToggleMask } from '../../redux/actions/global';

class ListCatalog extends React.PureComponent {
  render() {
    const {
      subMenuCatalog,
      isCatalogActive,
      catalogMenuItems,
      acUpdateButtons,
      navigation,
      acSubMenuIcon,
      acSubMenuCatalog,
      acToggleExpanded,
      acToggleMask
    } = this.props;
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;

    return (
      <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
        <Text style={global.titlePagina}>LISTAGEM</Text>
        {subMenuCatalog ? (
          <SubMenu
            button={isCatalogActive}
            visible
            items={catalogMenuItems}
            updateButton={acUpdateButtons}
            navigation={navigation}
            acSubMenuIcon={acSubMenuIcon}
            acSubMenuCatalog={acSubMenuCatalog}
            params={['vendor', 'catalog']}
            acToggleExpanded={acToggleExpanded}
            acToggleMask={acToggleMask}
            acResetPointer={acResetPointer}
          />
        ) : null}
        <InfoMsg
          icon="8"
          firstMsg="Estamos desenvolvendo esta página."
          sndMsg="Fique de olho nas próximas atualizações do aplicativo!"
        />
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  catalogMenuItems: state.menu.catalogMenuItems,
  subMenuCatalog: state.menu.subMenuCatalog,
  context: state.global.context
});

export default connect(
  mapStateToProps,
  {
    acUpdateButtons,
    acSubMenuIcon,
    acSubMenuCatalog,
    acToggleExpanded,
    acToggleMask,
    acResetPointer
  }
)(ListCatalog);
