import React from 'react';
import { SimpleButton } from '../../../components';
import SrvOrder from '../../../services/Order';

const Forward = ({
  client,
  stores,
  screen,
  checkboxes,
  currentTable,
  disabled,
  dropType,
  acNextStep,
  acSetToast,
  acToggleDropType,
  containerStyle,
}) => (
  <SimpleButton
    tchbStyle={disabled ? [containerStyle, { opacity: 0.3 }] : containerStyle}
    disabled={disabled}
    msg="AVANÇAR"
    action={() => {
      if (screen === 0) {
        if (checkboxes[0] || checkboxes[1]) {
          acNextStep();
        }
      } else if (screen === 1) {
        if (client.fantasyName !== undefined) {
          acNextStep();
          if (dropType.isActive) acToggleDropType();
        }
      } else if (screen === 2) {
        if (currentTable.name !== '') {
          SrvOrder.criarCarrinhoPadrao(client, currentTable);
          acNextStep();
        }
      } else {
        if (stores.length > 0) {
          acNextStep();
        } else if (stores.length === 0) {
          // LEMBRETE: quando implementado não testado com dados reais.
          acSetToast({ text: 'Escolha algumas lojas para negociação' });
        }
      }
    }}
  />
);

export default Forward;