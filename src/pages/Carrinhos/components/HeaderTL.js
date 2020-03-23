import React from 'react';
import { View } from 'react-native';
import global from '../../../assets/styles/global';
import { SortCode } from '.';
import { Button } from '../../../components';

const HeaderTL = ({ sort, acUpdateComponent }) => {
  return (
    <View style={[global.containerCenter, { flexDirection: 'row' }]}>
      <View style={{ flex: 0.5 }} />
      <SortCode
        sort={sort}
        style={global.txtColumn}
        acUpdateComponent={acUpdateComponent}
      />
      <Button
        tchbStyle={global.columnTL}
        txtStyle={global.txtColumn}
        txtMsg="CLIENTE"
        changeColor
        isChosen={sort[2].isChosen}
        chosenColor="black"
        nChosenColor="#999"
        rdAction={acUpdateComponent}
        rdName="sortCliente"
        rdType="sort"
      />
      <Button
        tchbStyle={global.columnTL}
        txtStyle={global.txtColumn}
        txtMsg="SETOR"
        changeColor
        isChosen={sort[3].isChosen}
        chosenColor="black"
        nChosenColor="#999"
        rdAction={acUpdateComponent}
        rdName="sortSetor"
        rdType="sort"
      />
      <Button
        tchbStyle={global.columnTL}
        txtStyle={global.txtColumn}
        txtMsg="STATUS"
        changeColor
        isChosen={sort[4].isChosen}
        chosenColor="black"
        nChosenColor="#999"
        rdAction={acUpdateComponent}
        rdName="sortStatus"
        rdType="sort"
      />
      <Button
        tchbStyle={global.columnTL}
        txtStyle={global.txtColumn}
        txtMsg="PONTUAL."
        changeColor
        isChosen={sort[5].isChosen}
        chosenColor="black"
        nChosenColor="#999"
        rdAction={acUpdateComponent}
        rdName="sortPontual"
        rdType="sort"
      />
      <Button
        tchbStyle={global.columnTL}
        txtStyle={global.txtColumn}
        txtMsg="ENCARTE"
        changeColor
        isChosen={sort[6].isChosen}
        chosenColor="black"
        nChosenColor="#999"
        rdAction={acUpdateComponent}
        rdName="sortEncarte"
        rdType="sort"
      />
    </View>
  );
}

export default HeaderTL;