import React from 'react';
import { SortBy, PopUp } from '../../../components';
import { Font } from '../../../assets/fonts/font_names';

export default (props) => {
  const { acUpdateComponent, sort, isVisible, context } = props;
  return (
    <PopUp
      isVisible={isVisible}
      containerStyle={styles.sortPopUp}
    >
      <SortBy
        hasArrows
        type="NOME"
        isUp={sort[0].order}
        isActive={sort[0].isChosen}
        toggle={async () => {
          await props.acUpdateComponent('sort', sort[0].name);
          props.orderList(['sf_name'], !sort[0].order);
        }}
      />
      <SortBy
        hasArrows
        type="STATUS"
        isUp={sort[3].order}
        isActive={sort[3].isChosen}
        toggle={async () => {
          await props.acUpdateComponent('sort', sort[3].name);
          props.orderList(['sf_status'], !sort[3].order);
        }}
        containerStyle={{ marginLeft: 9 }}
      />
      <SortBy
        hasArrows
        type="DATA"
        isUp={sort[6].order}
        isActive={sort[6].isChosen}
        toggle={async () => {
          await props.acUpdateComponent('sort', sort[6].name);
          props.orderList(['updated_at'], !sort[6].order);
        }}
        containerStyle={{ marginLeft: 9 }}
      />
      <SortBy
        hasArrows
        type="MÊS FATUR"
        isUp={sort[8].order}
        isActive={sort[8].isChosen}
        toggle={async () => {
          await props.acUpdateComponent('sort', sort[8].name);
          props.orderList(['sf_previsao_embarque__c'], !sort[8].order);
        }}
        containerStyle={{ marginLeft: 9 }}
      />
      <SortBy
        hasArrows
        type="VALOR TOTAL"
        isUp={sort[5].order}
        isActive={sort[5].isChosen}
        toggle={async () => {
          await props.acUpdateComponent('sort', sort[5].name);
          props.orderList(['sf_grand_total'], !sort[5].order);
        }}
        containerStyle={{ marginLeft: 9 }}
      />

      {
        context === 'Admin' &&
        <SortBy
          hasArrows
          type="CLIENTE"
          isUp={sort[7].order}
          isActive={sort[7].isChosen}
          toggle={async () => {
            await props.acUpdateComponent('sort', sort[7].name);
            props.orderList(['sf_nome_cliente__c'], !sort[7].order);
          }}
          containerStyle={{ marginLeft: 9 }}
        />
      }
    </PopUp>
  );
};

let styles = {
  sortPopUp: {
    position: 'absolute',
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