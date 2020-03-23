import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { IconActionless as IA } from '../../../../components';
import SrvProduct from '../../../../services/Product';
import global from '../../../../assets/styles/global';

class OtherActions extends PureComponent {
  constructor(props) {
    super(props);
    this.actions = [
      {
        icon: '9',
        name: 'dashboard',
        msg: 'Acompanhar minhas atividades',
        obs: '(agendas, metas, etc)',
        goTo: 'dashboard'
      },
      {
        icon: props.adminIcons[3].txtMsg,
        msg: `Pesquisar ou criar ${props.adminIcons[3].label}`,
        style: { marginTop: 4 },
        ...props.adminIcons[3]
      },
      {
        icon: '4',
        name: 'clients',
        msg: 'Pesquisar clientes ou criar prospecções',
        goTo: 'clients',
      },
      {
        icon: '3',
        name: 'catalog',
        msg: 'Navegar pelo catálogo completo',
        obs: '(minhas cotas)',
        goTo: 'catalog',
      }
    ];
  }

  render() {
    const { navigation, acUpdateButtons, acUpdateContext } = this.props;
    const func = navigation.dispatch;
    return (
      <View style={styles.container}>
        {
          this.actions.map((action) => {
            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: action.goTo })],
            });
            return (
              <ActionElement
                key={action.goTo}
                txtStyle={action.style}
                action={async () => {
                  if (action.goTo === 'catalog') {
                    await this.catalogAction();
                  }
                  func(resetAction);
                  acUpdateButtons('admin', action.name);
                }}
                {...action}
              />
            );
          })
        }
      </View>

    );
  }

  async catalogAction() {
    const lista = await SrvProduct.getPriceList();
    this.props.acToggleCompleteCat();
    this.props.acUpdateContext('Vendedor');
    const availableTables = lista;
    const currentTable = lista.length > 0 ? lista[0] : { code: '0000', name: 'NENHUMA TABELA ENCONTRADA' };
    this.props.acSetPriceList({
      availableTables,
      currentTable,
    });
  }
}

export default OtherActions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingLeft: 75
  },
  tchbAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  }
});

const ActionElement = ({ action, msg, icon, obs, txtStyle }) => (
  <TouchableOpacity
    onPress={() => action()}
    style={styles.tchbAction}
  >
    <IA msg={icon} style={[global.menuIcon, { marginRight: 12 }]} />
    <Text style={[global.p1, txtStyle]}>
      {msg}<Text style={{ fontSize: 14 }}>   {obs || ''}</Text>
    </Text>
  </TouchableOpacity>
);