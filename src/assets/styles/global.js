import { StyleSheet, Platform } from 'react-native';
import { Font } from '../../assets/fonts/font_names';

const color = 'rgba(102, 102, 102, 0.5)';
const dark = 'rgba(0, 0, 0, 0.7)';
const underline = Platform.OS === 'web' ? { textDecoration: 'underline' } : { textDecorationLine: 'underline' };

export default StyleSheet.create({
  defaultChosen: {
    color: '#0085B2',
  },
  activeColor: {
    color: '#0085B2',
    textShadowColor: 'rgba(0, 122, 176, 0.85)',
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: 3,
  },
  defaultBlack: {
    color: 'rgba(0, 0, 0, 0.7)'
  },
  /* estilo da pag de Setup e comuns */
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  flexOne: {
    flex: 1,
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sub_title_1: {
    fontFamily: Font.ALight,
    fontSize: 24,
    color: 'black',
    marginLeft: 30,
  },
  bold: {
    fontWeight: 'bold',
  },
  containerTablet: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 4,
  },
  subtitle: {
    fontFamily: Font.ALight,
    margin: 5,
    marginTop: 35,
    marginLeft: 30,
    fontSize: 30,
    color: 'black'
  },
  txtStep1: {
    fontFamily: Font.ALight,
    marginTop: 5,
    marginLeft: 30,
    fontSize: 30,
  },
  txtStep: {
    fontFamily: Font.ALight,
    marginTop: 5,
    marginLeft: 100,
    fontSize: 30,
  },
  vwWhiteBox: {
    backgroundColor: '#ffffff',
    height: 160,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowRadius: 2,
    paddingTop: 20,
    paddingBottom: 13,
    marginHorizontal: 10,
  },

  /* Pagina de catalog */
  /* Topo */
  titlePagina: {
    fontFamily: Font.AThin,
    fontSize: 42,
    color,
    marginLeft: 30,
    marginTop: 20,
  },
  titleNomeCliente: {
    fontFamily: Font.BRegular,
    fontSize: 18,
    marginTop: 32,
    color: dark,
  },
  codigoCliente: {
    fontFamily: Font.ARegular,
    fontSize: 13,
    marginTop: 32,
    color: dark,
  },
  setorCliente: {
    fontFamily: Font.ARegular,
    fontSize: 13,
    color,
  },

  /* Topo */
  grupoDestaque: {
    fontFamily: Font.BRegular,
    fontSize: 16,
    // marginLeft: 10,
    marginBottom: 15,
    color: dark,
  },

  /* Box de produto */
  nomeProduto: {
    fontFamily: Font.BSemiBold,
    fontSize: 12,
    color: dark,
  },
  codigoProduto: {
    fontFamily: Font.ARegular,
    fontSize: 12,
    color: 'black',
  },
  imgBtn: {
    fontFamily: Font.C,
    fontSize: 28,
    color: '#A0A5A7',
  },

  /* Resumo Geral de Formatos de Texto */
  subHeader: {
    fontFamily: Font.ALight,
    fontSize: 32,
    color: dark,
    marginLeft: 30
  },
  h1: {
    fontFamily: Font.AThin,
    fontSize: 42,
    color,
  },
  h2: {
    fontFamily: Font.AThin,
    fontSize: 24,
    color: dark,
  },
  h3: {
    fontFamily: Font.ALight,
    fontSize: 24,
    color,
  },
  h4: {
    fontFamily: Font.ARegular,
    fontSize: 18,
    lineHeight: 28,
    color: dark,
  },
  h5: {
    fontFamily: Font.BRegular,
    fontSize: 18,
    color,
  },
  h6: {
    fontFamily: Font.ARegular,
    fontSize: 16,
    color,
  },
  h6Bold: {
    fontFamily: Font.ABold,
    fontSize: 16,
    color,
  },
  h7SemiBold: {
    fontFamily: Font.BSemiBold,
    fontSize: 16,
    color,
  },
  p1: {
    fontFamily: Font.ALight,
    color: dark,
    fontSize: 16
  },
  p1C: {
    fontFamily: Font.BLight,
    color: dark,
    fontSize: 16
  },
  text: {
    fontFamily: Font.ALight,
    color: dark,
  },
  tag: {
    fontSize: 10,
    fontFamily: Font.ASemiBold,
    color: 'white',
  },
  tagNovo: {
    backgroundColor: '#ffc69c',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tag1Giro: {
    color: 'white',
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tag2Giro: {
    backgroundColor: '#678fd4',
    color: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tag3Giro: {
    backgroundColor: 'yellow',
    color: 'white',
    paddingLeft: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  /* PAGINA - Catalogo */
  lbNCores: {
    paddingTop: 3,
    color: 'black'
  },

  /* Icons */
  iconClose: {
    fontFamily: Font.C,
    fontSize: 32,
    color
  },
  iconPlus: {
    fontFamily: Font.C,
    color: 'rgba(102, 102, 102, 0.5)',
    fontSize: 40
  },
  iconUnChecked: {
    fontFamily: Font.C,
    color: 'rgba(102, 102, 102, 0.5)',
    fontSize: 22
  },
  iconChecked: {
    fontFamily: Font.C,
    color: 'rgba(0, 122, 176, 0.85)',
    fontSize: 22,
    textShadowOffset: { width: 1, height: 2 },
    textShadowColor: '#0085B2',
    textShadowRadius: 4
  },
  iconGota: {
    fontFamily: Font.C,
    color: 'rgba(0, 122, 176, 0.85)',
    fontSize: 24,
  },
  icon: {
    fontFamily: Font.C,
    color: 'rgba(0, 0, 0, 0.3)',
    fontSize: 32
  },
  icChosen: {
    color: '#0085B2',
    textShadowOffset: { width: 0, height: 0 },
    textShadowColor: '#0085B2',
    textShadowRadius: 4
  },
  icArrow: {
    position: 'absolute',
    fontSize: 22,
    color: '#0085B2',
  },

  // Tópico
  topicLabel: {
    fontFamily: Font.AMedium,
    fontSize: 22,
    color: 'black',
    paddingVertical: 4,
    marginLeft: 30,
  },
  /* Catalogo - label de dados do produto */
  columnHeader: {
    fontFamily: Font.BSemiBold,
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.6)'
  },
  columnName: {
    fontFamily: Font.ASemiBold,
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  columnValue: {
    fontFamily: Font.ARegular,
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.8)'
  },

  popUp: {
    position: 'absolute',
    elevation: 6,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 6
  },

  triangleUp: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: '#0085B2',
  },
  triangleDown: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [
      {
        rotate: '180deg'
      }
    ],
    borderBottomColor: '#0085B2',
  },
  vwPopUp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(250, 250, 250)',
    borderRadius: 10,
    opacity: 0.96,
    padding: 12
  },

  boxShadow: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowColor: 'black',
    shadowOpacity: 0.3
  },

  shadow: {
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  /* Input Text */
  vwIT: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 41,
    width: 100,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#999',
    // marginTop: 4,
    // paddingTop: 2,
    backgroundColor: 'rgb(250, 250, 250)'
  },
  separatorBorder: {
    borderBottomWidth: 1,
    borderColor: '#CCC',
  },
  txtLabel: {
    fontFamily: Font.ASemiBold,
    color: 'black',
    marginTop: 5,
    fontSize: 12,
    opacity: 0.9
  },
  inputLbl: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 12,
    fontFamily: Font.BSemiBold,
  },
  txtInput: {
    fontSize: 18,
    fontFamily: Font.ALight,
    width: '100%',
    paddingLeft: 20,
  },
  menuIcon: {
    fontSize: 32,
    color: 'rgba(0, 0, 0, 0.3)',
    fontFamily: Font.C,
  },
  defaultBox: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#999',
    backgroundColor: 'rgb(250, 250, 250)',
  },
  // Sombra default para botÃµes ativos
  activeBtnShadow: {
    color: '#0085B2',
    textShadowOffset: { width: 0, height: 2 },
    textShadowColor: 'rgba(0, 133, 178, 0.6)',
    textShadowRadius: 3
  },
  txtWarning: {
    fontSize: 16,
    fontFamily: Font.ARegular,
  },
  txtBtn: {
    fontSize: 20,
    fontFamily: Font.ASemiBold,
    color: 'white',
    textAlign: 'center',
  },
  simpleBtnShadow: {
    shadowOffset: { height: 1, width: 2 },
    shadowRadius: 8,
    shadowColor: 'rgba(0, 0, 0, 0.3)'
  },
  // Tabs
  vwActive: {
    // width: 170,
    alignItems: 'center',
    borderTopColor: '#2D7A8D',
    borderTopWidth: 3,
    padding: 10,
  },
  vwNotActive: {
    // width: 170,
    alignItems: 'center',
    padding: 10
  },
  txtActive: {
    fontFamily: Font.ASemiBold,
    fontSize: 20,
    color: '#2D7A8D',
    textAlign: 'center',
    marginTop: 4,
  },
  txtNotActive: {
    fontFamily: Font.AMedium,
    fontSize: 19,
    color: '#4F9CAF',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  step1: {
    fontFamily: Font.ALight,
    marginLeft: 30,
    fontSize: 18,
  },
  step: {
    fontFamily: Font.ALight,
    marginLeft: 25,
    fontSize: 18,
  },

  dropdownBox: {
    justifyContent: 'center',
    height: 45,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#999',
    marginLeft: 0
  },

  dropdownView: {
    paddingLeft: 10,
    backgroundColor: 'rgb(250, 250, 250)',
    borderWidth: 1,
    borderBottomEndRadius: 6,
    borderBottomLeftRadius: 6,
    borderColor: '#999',
    borderTopWidth: 0,
  },
  // Styles para usar o componente TableList
  rowTL: {
    alignItems: 'center',
    minHeight: 40,
    width: '100%',
    paddingVertical: 9,
  },
  columnTL: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtColumn: {
    fontSize: 14,
    fontFamily: Font.AMedium,
    textAlign: 'center',
  },
  // Aplicar onde nÃ£o recebemos dado do SF (null, '')
  notInSF: {
    opacity: 0.2,
    color: 'red'
  },

  // Summarys container
  summaryContainer: {
    position: 'absolute',
    elevation: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    shadowOffset: { width: 5, height: 5 },
    shadowColor: 'grey',
    shadowOpacity: 1,
    shadowRadius: 10,
  },

  /* Posiocionamento da migalha de filtros,
  localizada acima das lista onde contem filtro
  */
  filterTags: {
    flexDirection: 'row',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 40,
  },
  link: {
    fontFamily: Font.ALight,
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#359EC2',
  },
  currentHighlight: {
    fontFamily: Font.ASemiBold,
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#4D99AF',
  },
  txtActiveShadow: {
    textShadowColor: 'rgba(0, 122, 176, 0.85)',
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 3,
  },

});
