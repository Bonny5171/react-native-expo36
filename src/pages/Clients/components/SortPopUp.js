import React from 'react';
import { SortBy, PopUp } from '../../../components';
import { Font } from '../../../assets/fonts/font_names';
import SrvClient from '../../../services/Account';

export default ({ acUpdateComponent, acSetClients, sort, isVisible, containerStyle }) => (
  <PopUp
    isVisible={isVisible}
    containerStyle={[styles.sortPopUp, containerStyle]}
  >
    <SortBy
      hasArrows
      type="CÓDIGO"
      isUp={sort[1].order}
      isActive={sort[1].isChosen}
      toggle={async () => {
        await acUpdateComponent('sort', 'sortCode');
        await SrvClient.get(acSetClients, ['sf_codigo_totvs__c'], !sort[1].order);
      }}
    />
    <SortBy
      hasArrows
      type="NOME"
      isUp={sort[2].order}
      isActive={sort[2].isChosen}
      toggle={async () => {
        await acUpdateComponent('sort', 'sortName');
        await SrvClient.get(acSetClients, ['sf_name'], !sort[2].order);
      }}
      containerStyle={{ marginLeft: 9 }}
    />
  </PopUp>
);

let styles = {
  sortPopUp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: 76,
    right: 88,
  },
  txtButton: {
    fontSize: 12,
    fontFamily: Font.AMedium,
    marginLeft: 15,
  }
};