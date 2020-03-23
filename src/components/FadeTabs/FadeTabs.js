import React from 'react';
import { View } from 'react-native';
import { TabsFT, ContentFT } from '.';
import global from '../../assets/styles/global';
import LoadIndicator from '../LoadIndicator';

class FadeTabs extends React.Component {
  render() {
    const {
      children,
      container,
      contentStyle,
      pTabWidth,
      // [{ name, active }, ...]
      tabs,
      // Index da tab atual, é utilizada para escolher a tab ativa
      activeTab,
      // Action para mudar de aba
      acChangeTab,
      customHeader,
      noGradient,
      txtTab,
    } = this.props;

    return (
      <View style={[global.flexOne, container]}>
        <TabsFT
          customHeader={customHeader}
          tabs={tabs}
          acChangeTab={acChangeTab}
          textStyle={txtTab}
          noGradient={noGradient}
          pTabWidth={pTabWidth}
        />
        <LoadIndicator
          isLoading={this.props.isLoading}
          containerStyle={global.containerCenter}
        >
          <ContentFT
            contentStyle={contentStyle}
            activeTab={activeTab}
          >
            {children}
          </ContentFT>
        </LoadIndicator>
      </View>
    );
  }
}

export default FadeTabs;