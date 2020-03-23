import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { acUpdateForm, acToggleProperty, acTogglePanel, acSetPanel, acCheckFormState, acCheckPendencies,
  setPreDataVisible, setPeriodoDeEntregaVisible, } from '../../../../redux/actions/pages/cart';
import { FORM_FECHAMENTO, upsertFechamentoPE } from '../../../../services/Pages/Cart/Queries';
import { acToggleMask } from '../../../../redux/actions/global';
import { Header } from '.';
import { InputLabel, SwitchButton, InputText, DropDown, DropDownView, IconActionless, TextLimit, DisableComponent } from '../../../../components';
import { Font } from '../../../../assets/fonts/font_names';
import global from '../../../../assets/styles/global';
import 'moment';
import 'moment/locale/pt-br';
import moment from 'moment-timezone';

export class Fechamento extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preData: '',
      startDate: '',
      endDate: '',
    };
  }

  componentDidMount() {
    moment().locale('pt-br');
    this.updatePendencies();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.form !== prevProps.form) {
      this.updatePendencies();
    }
  }

  render() {
    const { form, condPag, acToggleProperty, condPagOptions, type, style } = this.props;
    const reposicao = form.reposicao ? 'SIM' : 'NÃO';
    const styleReadOnly = type === 'Order' ? { marginLeft: 2, marginTop: 4, fontFamily: Font.ARegular, fontSize: 14, color: 'rgba(0,0,0,.8)' } : { };
    const endDate = this.state.endDate ? this.state.endDate : '';

    return (
      <View style={style}>
        {/* <Header msg="Dados para fechamento" /> */}
        <View style={styles.formulary}>
          <View style={[{ height: type === 'Order' ? 130 : 175, flexDirection: 'row' }, styles.row]}>
            {/* Ordem e Pre data */}
            <View styles={styles.column}>
              <InputLabel
                label="ORDEM DE COMPRA"
                inputStyle={[styles.firstWidth, styleReadOnly]}
                keyboardType="numeric"
                value={form.ordemCompra ? 'SIM' : 'NÃO'}
                onChangeText={(value) => { this.updateForm('ordemCompra', value, FORM_FECHAMENTO.ORDEM_COMPRA); }}
                clearAction={() => this.clearField('ordemCompra', FORM_FECHAMENTO.ORDEM_COMPRA)}
                readOnly={type === 'Order'}
                editable={this.props.client.ordemCompra || type === 'Order'}
              />
              {/* <Datapicker
                label="PRÉ-DATA"
                inputStyle={[styles.firstWidth, styleReadOnly]}
                container={styles.spaceVertical}
                value={this.state.preData}
                onChangeText={(value) => { this.updateForm('preData', value, FORM_FECHAMENTO.PRE_DATA_ENTREGA); }}
                clearAction={() => this.clearField('preData', FORM_FECHAMENTO.PRE_DATA_ENTREGA)}
                readOnly={type === 'Order'}
              /> */}
              <InputLabel
                label="PRÉ-DATA"
                inputStyle={[styles.firstWidth, styleReadOnly]}
                container={styles.spaceVertical}
                value={this.state.preData}
                // onChangeText={(value) => { this.updateForm('preData', value, FORM_FECHAMENTO.PRE_DATA_ENTREGA); }}
                onChangeText={() => {}}
                clearAction={() => this.clearField('preData', FORM_FECHAMENTO.PRE_DATA_ENTREGA)}
                readOnly={type === 'Order'}
                onFocus={() => {
                  this.props.setPreDataVisible(true);
                }}
              />
            </View>
            {/* Condições de pagamento e Período de entrega */}
            <View style={[styles.spaceColumns, styles.column]}>
              <CustomLabelInput
                label="CONDIÇÕES DE PAGAMENTO"
                readOnly={type === 'Order'}
                value={form.condPag}
              >
                <PanelButton
                  msg={form.condPag}
                  maxLength={30}
                  action={async () => {
                    this.props.acSetPanel(8);
                    this.props.acTogglePanel();
                    this.props.acToggleMask();
                  }}
                  containerStyle={styles.ddPayment}
                />
              </CustomLabelInput>
              <CustomLabelInput
                label="PERÍODO DE ENTREGA"
                container={styles.spaceVertical}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {
                    this.props.type === 'Order' ?
                      <Text style={styleReadOnly}>{form.de}</Text>
                      :
                      <InputText
                        inputStyle={styles.secondWidth}
                        value={this.state.startDate}
                        clearAction={() => this.clearField('de', FORM_FECHAMENTO.PERIODO_ENTREGA)}
                        onFocus={() => {
                          this.props.setPeriodoDeEntregaVisible(true);
                        }}
                      />
                  }
                  <Text style={[styles.label, { paddingHorizontal: 8, marginTop: Platform.OS === 'web' ? 4 : 0, }]}>a</Text>
                  {
                    this.props.type === 'Order' ?
                      <Text style={styleReadOnly} >{form.a}</Text>
                      :
                      <InputText
                        inputStyle={styles.secondWidth}
                        value={endDate}
                        clearAction={() => this.clearField('a', FORM_FECHAMENTO.PERIODO_ENTREGA)}
                        onFocus={() => {
                          this.props.setPeriodoDeEntregaVisible(true);
                        }}
                        onBlur={() => {
                          this.props.setPeriodoDeEntregaVisible(false);
                        }}
                      />
                  }
                </View>
              </CustomLabelInput>
            </View>
            <View style={[styles.spaceColumns, styles.column]}>
              {/* Prazo, Desconto */}
              <View style={{ flexDirection: 'row' }}>
                <InputLabel
                  label="PRAZO ADICIONAL"
                  inputStyle={[styles.secondWidth, styleReadOnly]}
                  keyboardType="numeric"
                  value={form.prazoAdd}
                  onChangeText={(value) => { this.updateForm('prazoAdd', value, FORM_FECHAMENTO.PRAZO_ADD); }}
                  clearAction={() => this.clearField('prazoAdd', FORM_FECHAMENTO.PRAZO_ADD)}
                  readOnly={type === 'Order'}
                />
                <InputLabel
                  label="DESCONTO ADICIONAL"
                  inputStyle={[{ width: 140 }, styleReadOnly]}
                  keyboardType="numeric"
                  container={styles.spaceColumns}
                  value={form.descontoAdd}
                  onChangeText={(value) => { this.updateForm('descontoAdd', value, FORM_FECHAMENTO.DESCONTO_ADD); }}
                  clearAction={() => this.clearField('descontoAdd', FORM_FECHAMENTO.DESCONTO_ADD)}
                  readOnly={type === 'Order'}
                />
              </View>
              {/* Reposição */}
              <CustomLabelInput
                label="REPOSIÇÃO"
                container={styles.spaceVertical}
              >
                {
                type === 'Order' ?
                  <Text style={styleReadOnly}>{reposicao}</Text>
                  :
                  <SwitchButton
                    container={{ marginTop: 7, marginLeft: null }}
                    active={form.reposicao}
                    action={this.handleSwitch}
                    actions={[{ func: acToggleProperty, params: ['reposicao'] }]}
                  />
              }
              </CustomLabelInput>
            </View>
          </View>
          {/* Observações */}
          <View style={styles.row}>
            <InputLabel
              isTextArea
              label="OBSERVAÇÕES"
              nrLines={15}
              inputStyle={[styles.textArea, styleReadOnly]}
              value={form.observacoes}
              onChangeText={(value) => { this.updateForm('observacoes', value, FORM_FECHAMENTO.OBSERVACOES); }}
              clearAction={() => this.clearField('observacoes', FORM_FECHAMENTO.OBSERVACOES)}
              readOnly={type === 'Order'}
            />
          </View>
        </View>
        {/* <DropDownView
          isVisible={condPag}
          isSimpleString
          fullObject
          listStyle={{ height: 95 }}
          options={condPagOptions}
          acToggleDropdown={this.props.acToggleProperty}
          params={['condPag']}
          updateCurrent={(value) => this.updateForm('condPag', value, FORM_FECHAMENTO.COND_PAGAMENTO)}
          vwStyle={[styles.ddView, styles.ddPayment]}
        /> */}
      </View>
    );
  }


  updateForm = async (field, value, column) => {
    this.props.acUpdateForm(field, value);
    let newValue = value;
    // Se for o periodo de entrega, concatenamos os valores para salvar em uma coluna no BD
    if (field === 'de' || field === 'a') {
      // Inserindo no banco o novo valor no lugar
      newValue = field === 'de' ? `${value}-${this.props.form.a}` : `${this.props.form.de}-${value}`;
    }
    await upsertFechamentoPE(this.props.dropdown.current.key, { [column]: newValue });
  }

  async clearField(field, column) {
    this.props.acUpdateForm(field, null, true);

    if (field === 'de' || field === 'a') {
      this.setState({ startDate: '', endDate: '' });
      this.props.acUpdateForm('de', null, true);
      this.props.acUpdateForm('a', null, true);
    }

    await upsertFechamentoPE(this.props.dropdown.current.key, { [column]: null });
  }

  handleSwitch = async () => {
    this.props.acUpdateForm('reposicao', !this.props.form.reposicao);
    await upsertFechamentoPE(this.props.dropdown.current.key, { [FORM_FECHAMENTO.REPOSICAO]: !this.props.form.reposicao ? 1 : 0 });
  }

  updatePendencies = async () => {
    await this.props.acCheckFormState();
    this.props.acCheckPendencies(this.props.dropdown.current.products, false);

    const preData = this.props.form.preData ? this.props.form.preData : '';
    const startDate = this.props.form.de ? this.props.form.de : '';
    const endDate = this.props.form.a ? this.props.form.a : '';

    this.setState({
      preData,
      startDate,
      endDate,
    });
  }
}

const mapStateToProps = (state) => ({
  form: state.cart.form,
  reposicao: state.cart.reposicao,
  condPag: state.cart.condPag,
  condPagOptions: state.cart.condPagOptions,
  dropdown: state.catalog.dropdown
});

const mapDispatchToProps = {
  acTogglePanel,
  acSetPanel,
  acUpdateForm,
  acToggleProperty,
  acToggleMask,
  acCheckFormState,
  acCheckPendencies,
  setPreDataVisible,
  setPeriodoDeEntregaVisible
};


export default connect(mapStateToProps, mapDispatchToProps)(Fechamento);

const styles = StyleSheet.create({
  formulary: {
    flex: 1,
    paddingHorizontal: 20,
  },
  column: {
    height: 155
  },
  row: {
    paddingTop: 20
  },
  spaceColumns: {
    marginLeft: 20
  },
  spaceVertical: {
    marginTop: 25,
  },
  firstWidth: {
    width: 180
  },
  secondWidth: {
    width: 145,
    marginTop: 4
  },
  ddPayment: {
    width: 315,
    marginTop: 4
  },
  ddTxt: {
    fontFamily: Font.ALight,
    fontSize: 18,
    color: 'rgba(0, 0, 0, 0.7)'
  },
  label: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.7)',
    marginLeft: 2,
  },
  textArea: {
    height: 200,
    width: 840,
  },
  ddView: {
    position: 'absolute',
    left: 220,
    top: 110,
  }
});

const CustomLabelInput = ({ label, value, children, container, readOnly }) => (
  <View style={container}>
    <Text style={[global.h7SemiBold, styles.label]}>{label}</Text>
    {
      readOnly ?
        <Text style={{ marginLeft: 2, marginTop: 4, fontFamily: Font.ARegular, fontSize: 14, color: 'rgba(0,0,0,.8)' }}>{value}</Text>
        :
        children
    }
  </View>
);

const PanelButton = ({ action, maxLength, msg, containerStyle, txtStyle }) => (
  <TouchableOpacity
    onPress={action}
    style={[panelButton.tchbSelectTable, containerStyle]}
  >
    <TextLimit
      msg={msg}
      style={[panelButton.txtSelectTable, txtStyle]}
      maxLength={maxLength}
    />
    <IconActionless
      msg="..."
      style={panelButton.dots}
      noIcon
    />
  </TouchableOpacity>
);

const panelButton = StyleSheet.create({
  tchbSelectTable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 250, 250, 0.84)',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    height: 41,
    width: 100,
    padding: 3,
    paddingHorizontal: 9,
  },
  txtSelectTable: {
    fontFamily: Font.ALight,
    fontSize: 16,
    textAlign: 'center',
  },
  dots: {
    fontSize: 28,
    color: '#0085B2',
    position: 'absolute',
    right: 8,
    transform: [{ translateY: -8 }],
    paddingLeft: 4,
  },
});