import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import global from '../../../assets/styles/global';
import { Row, DisableComponent, TextLimit, CurrentBtn, Button } from '../../../components';
import { agrupaProdutosNoCarrinho } from '../../../utils/CommonFns';
import { resetNavigate } from '../../../utils/routing/Functions';
import { Font } from '../../../assets/fonts/font_names';

class Head extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCompleteCat: props.navigation.getParam('isCompleteCat'),
      isShowCase: props.navigation.getParam('isShowCase'),
    };
  }

  render() {
    const { client } = this.props;
    let prodLength = 0;
    let name = '';
    if (this.props.dropdown.current) {
      prodLength = (agrupaProdutosNoCarrinho(this.props.dropdown.current.products)).length;
      if (this.props.dropdown.current.name) {
        name = this.props.dropdown.current.name.length > 30 ? `${this.props.dropdown.current.name.substr(0, 30)}...` : this.props.dropdown.current.name;
      }
    }
    return (
      <View style={[global.flexOne, { width: '100%' }]}>
        <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 30, alignItems: 'center' }}>
          <Row style={{ flex: 2 }}>
            <Row>
              <Button
                txtStyle={{
                  fontFamily: Font.C,
                  fontSize: 30,
                  transform: [{ rotate: '180deg' }],
                  marginTop: 32,
                  color: 'rgba(102, 102, 102, 0.5)'
                }}
                action={() => {
                  resetNavigate('catalog', this.props.navigation);
                }}
                txtMsg="v"
              />
              <Text style={[global.titlePagina, { marginLeft: 0 }]}>CATÁLOGO </Text>
            </Row>
            <View style={{ flex: 1, paddingLeft: 10, top: -5 }}>
              <DisableComponent
                isDisabled={this.props.isCompleteCat}
              >
                <View
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <TextLimit
                    style={global.titleNomeCliente}
                    msg={client.fantasyName !== undefined ? client.fantasyName.toUpperCase() : ''}
                    maxLength={21}
                  />
                  {client.code ? (<Text style={global.codigoCliente}>{` ${client.code !== ''  ? `(${client.code})` : ''}`}</Text>) : null}
                </View>
                <Text style={global.setorCliente}>
                  {this.props.client.sector}
                </Text>
              </DisableComponent>
            </View>
          </Row>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 20 }}>
            {/* Botões */}
          </View>
        </View>
        <View style={{ width: '100%', height: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 35 }}>
          <DisableComponent
            isDisabled={this.props.checkboxes[1] || this.props.isCompleteCat}
          >
            <CurrentBtn
              notVisible={this.state.isCompleteCat}
              hasLink
              icon={'"'}
              current={`${name} (${prodLength})`}
              onIconClick={this.handleIconCart}
              onLinkClick={this.handleLinkCart}
              containerStyle={{ marginRight: 13 }}
            />
          </DisableComponent>
        </View>
      </View>
    );
  }

  handleIconCart = () => {
    this.props.toggleSetPanel(0);
  }

  handleLinkCart = () => {
    resetNavigate('carrinho', this.props.navigation, { wasInProduct: true });
  }
}

export default Head;
