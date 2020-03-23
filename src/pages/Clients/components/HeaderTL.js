import React from 'react';
import { View } from 'react-native';
import global from '../../../assets/styles/global';
import { SortCode } from '.';
import { Button, SortBy } from '../../../components';
import AccountDB from '../../../services/Account';

const HeaderTL = ({ sort, acUpdateComponent, acSetClients, appDevName }) => {
  return (
    <View style={[global.containerCenter, { flexDirection: 'row' }]}>
      <View style={{ width: 70, height: 40 }} />
      <SortBy
        hasArrows
        type="CÓDIGO"
        isUp={sort[1].order}
        isActive={sort[1].isChosen}
        toggle={async () => {
          await acUpdateComponent('sort', 'sortCode');
          await AccountDB.get(acSetClients, ['sf_codigo_totvs__c'], !sort[1].order);
        }}
        containerStyle={global.columnTL}
        txtStyle={global.txtColumn}
      />
      <SortBy
        hasArrows
        type="NOME"
        isUp={sort[2].order}
        isActive={sort[2].isChosen}
        toggle={async () => {
          await acUpdateComponent('sort', 'sortName');
          await AccountDB.get(acSetClients, ['sf_name'], !sort[2].order);
        }}
        containerStyle={global.columnTL}
        txtStyle={global.txtColumn}
      />
      <SortBy
        hasArrows
        type="SETOR"
        isUp={sort[3].order}
        isActive={sort[3].isChosen}
        toggle={async () => {
          await acUpdateComponent('sort', 'sortSetor');
          await AccountDB.get(acSetClients, [`sf_setor_atividade_${appDevName.toLowerCase()}__c`], !sort[3].order);
        }}
        containerStyle={global.columnTL}
        txtStyle={global.txtColumn}
      />
      <SortBy
        hasArrows
        type="STATUS"
        isUp={sort[4].order}
        isActive={sort[4].isChosen}
        toggle={async () => {
          await acUpdateComponent('sort', 'sortStatus');
          await AccountDB.get(acSetClients, ['sf_situacao__c'], !sort[4].order);
        }}
        containerStyle={global.columnTL}
        txtStyle={global.txtColumn}
      />
      <SortBy
        hasArrows
        type="PONTUAL."
        isUp={sort[5].order}
        isActive={sort[5].isChosen}
        toggle={async () => {
          await acUpdateComponent('sort', 'sortPontual');
          await AccountDB.get(acSetClients, ['sf_pontual__c'], !sort[5].order);
        }}
        containerStyle={global.columnTL}
        txtStyle={global.txtColumn}
      />
      <SortBy
        hasArrows
        type="ENCARTE"
        isUp={sort[6].order}
        isActive={sort[6].isChosen}
        toggle={async () => {
          await acUpdateComponent('sort', 'sortEncarte');
          // await AccountDB.get(acSetClients, ['sf_pontual__c'], !sort[6].order);
        }}
        containerStyle={global.columnTL}
        txtStyle={global.txtColumn}
      />
    </View>
  );
};

export default HeaderTL;