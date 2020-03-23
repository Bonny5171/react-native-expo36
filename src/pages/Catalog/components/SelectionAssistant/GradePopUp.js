import React from 'react';
import { View, Text, FlatList, ActivityIndicator, } from 'react-native';
import global from '../../../../assets/styles/global';
import { RowPopUpGrade } from '.';
import { Font } from '../../../../assets/fonts/font_names';
import SrvOrder from '../../../../services/Order/';
import SrvProduct from '../../../../services/Product';
import {
  asyncForEach, AtivaGrades, extractSizes, agrupaCoresEGrades,
  getEmbalamentoPadrao, atualizarCarrinhos,
 } from '../../../../utils/CommonFns';
 import { CheckBox, InfoMsg, } from '../../../../components';

 const getEmbalamentoAtual = (dropdown) => {
  if (dropdown.current.products.length > 0) {
    return dropdown.current.products[0].ref4;
  }
  return null;
};

const getPrazo = (dropdown) => {
  if (dropdown.current.products.length > 0) {
    return dropdown.current.products[0].prazo;
  }
  return null;
};

const getDesconto = (dropdown) => {
  if (dropdown.current.products.length > 0) {
    return dropdown.current.products[0].desconto;
  }
  return null;
};

const getPrice = (dropdown, code) => {
  const product = dropdown.current.products.find((p) => p.code === code);
  if (product && product.sf_unit_price) return product.sf_unit_price;
  return null;
};


const checkPanelDetalheCarrinho = async (props, item) => {
  const {
    grades, acSelectedGrade, dropdown, carts, acSetDropdownCartsV2,
    currentProduct, currentCor, acSetProduct,
  } = props;

  // Declare variaveis
  const id = dropdown.current.key;
  const cartDefault = carts.find(car => car.key === dropdown.current.key);
  const productCode = currentProduct.code;
  const colorCode = currentProduct.currenteColor.key;
  const gradeCode = item.key;
  const sf_photo_file_name__c = `${productCode}${colorCode}00`;
  let novaListaProdutos = [];

  // Define embalamento
  let embalamento = getEmbalamentoAtual(dropdown);
  if (!embalamento) {
    embalamento = await getEmbalamentoPadrao(dropdown.current.sf_account_id);
  }

  // Define prazo
  const prazo = getPrazo(dropdown);

  // Define desconto
  const desconto =  getDesconto(dropdown);

  // Define preço;
  let sf_unit_price = getPrice(dropdown, currentProduct.code);
  if (!sf_unit_price) {
    const prices = await SrvProduct.getPriceProduct(cartDefault.sf_pricebook2id, productCode, colorCode);
    if (embalamento) {
      const price = prices.find(p => p.ref4 === embalamento);
      if (!price) {
        embalamento = prices[0].name4;
      }
      sf_unit_price = price ? price.sf_unit_price : prices[0].sf_unit_price;
    } else if (prices.length > 0) {
      embalamento = prices[0].ref4;
      sf_unit_price = prices[0].sf_unit_price;
    }
  }

  const qtdParesPorGrades = await SrvProduct.getQtdParesPorGrades(productCode, gradeCode);
  if (item.isChosen) {
    await SrvOrder.removerProdutosByCorGrade(productCode, colorCode, gradeCode, dropdown.current.key);
    const gradesAtivas = grades.filter(g => g.isChosen);
    const isLastGradeAtiva = gradesAtivas.length === 1;
    if (isLastGradeAtiva) {
      await SrvOrder.addProduto({
        quote_sfa_guid__c: id,
        ref1: productCode,
        ref2: colorCode,
        ref4: embalamento,
        sf_unit_price,
        sf_description: currentProduct.name,
        sf_photo_file_name__c,
        sf_prazo__c: prazo,
        sf_desconto_item__c: desconto,
      });
    }

    // Atualiza objeto do carrinho.
    const indexProduct = dropdown.current.products.findIndex(p => p.ref3 === item.key);
    dropdown.current.products.splice(indexProduct, 1);

    // Atualiza objeto do detalhdo do carrinho no miolo.
    const cor = currentProduct.colors.find(c => c.key === currentCor);
    const indexGrade = cor.grades.findIndex(c => c.ref3 === item.key);
    cor.grades.splice(indexGrade, 1);
  } else {
    await SrvOrder.removerProdutosComGradesNulas(id, productCode, colorCode);
    const novoProduto = await SrvOrder.addProduto({
      quote_sfa_guid__c: id,
      ref1: productCode,
      ref2: colorCode,
      ref3: gradeCode,
      ref4: embalamento,
      sf_unit_price,
      sf_description: currentProduct.name,
      sf_photo_file_name__c,
      sf_sum_of_pairs__c: qtdParesPorGrades.sfa_sum_of_pairs,
      sf_prazo__c: prazo,
      sf_desconto_item__c: desconto,
    });

    // Atualiza objeto do carrinho.
    novaListaProdutos = [...dropdown.current.products, novoProduto];

    // Atualiza objeto do detalhdo do carrinho no miolo.
    const cor = currentProduct.colors.find(c => c.key === currentCor);

    // cor.grades.push(novoProduto);
    cor.grades = [...cor.grades, novoProduto];
  }

  // Atualiza grade no painel
  const grade = currentProduct.grades.find(g => g.key === item.key);
  grade.isChosen = !item.isChosen;

  await acSetDropdownCartsV2({ ...dropdown, products: novaListaProdutos });
  await acSetProduct(currentProduct);
  acSelectedGrade(item.name);
};

const checkPanelAssistenteDeSelecao = async (props, item) => {
  // Desconstrução da prop
  const {
    grades, acSelectedGrade, dropdown, carts,
    currentProduct, colors, product,
  } = props;

  // Action para adicionar/remover grade
  acSelectedGrade(item.name);

  // Declare variaveis
  const id = dropdown.current.key;
  const cartDefault = carts.find(car => car.key === id);
  const productCode = currentProduct.code;
  const gradeCode = item.key;

  // Define embalamento
  let embalamento = getEmbalamentoAtual(dropdown);
  if (!embalamento) {
    const currentTable = { code: cartDefault.sf_pricebook2id, };
    embalamento = await getEmbalamentoPadrao(currentTable, currentProduct);
  }

  // Define prazo
  const prazo = getPrazo(dropdown);

  // Define desconto
  const desconto =  getDesconto(dropdown);

  const qtdParesPorGrades = await SrvProduct.getQtdParesPorGrades(productCode, gradeCode);
  if (item.isChosen) {
    await SrvOrder.removerProdutosByGrade(productCode, gradeCode, dropdown.current.key);

    // Reincere as linhas das cores ativas.
    if (grades.filter(g => g.isChosen).length === 1) {
      await asyncForEach(colors.filter(c => c.isChosen), async (cor) => {
        let sf_unit_price = getPrice(dropdown, currentProduct.code);
        if (!sf_unit_price) {
          const prices = await SrvProduct.getPriceProduct(cartDefault.sf_pricebook2id, currentProduct.code, cor.code);
          if (embalamento) {
              const price = prices.find(p => p.ref4 === embalamento);
              if (!price) {
                embalamento = prices[0].name4;
              }
              sf_unit_price = price ? price.sf_unit_price : prices[0].sf_unit_price;
            } else if (prices.length > 0) {
              embalamento = prices[0].ref4;
              sf_unit_price = prices[0].sf_unit_price;
            }
        }

        await SrvOrder.addProduto({
          quote_sfa_guid__c: id,
          ref1: product.code,
          ref2: cor.code,
          ref4: embalamento,
          sf_unit_price,
          sf_description: product.name,
          sf_photo_file_name__c: `${productCode}${cor.code}00`,
          sf_prazo__c: prazo,
          sf_desconto_item__c: desconto,
        });
      });
    }
  } else {
    await SrvOrder.removerProdutosComGradesNulas(id, productCode);
    await asyncForEach(currentProduct.colors.filter(c => c.isChosen), async element => {
      const prices = await SrvProduct.getPriceProduct(cartDefault.sf_pricebook2id, productCode, element.code);
      const price = prices.find(p => p.ref4 === embalamento);
      if (!price) {
        embalamento = prices[0].name4;
      }
      const sf_unit_price = price ? price.sf_unit_price : prices[0].sf_unit_price;

      await SrvOrder.addProduto({
        quote_sfa_guid__c: id,
        ref1: productCode,
        ref2: element.code,
        ref3: gradeCode,
        ref4: embalamento,
        sf_unit_price,
        sf_description: currentProduct.name,
        sf_photo_file_name__c: `${productCode}${element.code}00`,
        sf_sum_of_pairs__c: qtdParesPorGrades.sfa_sum_of_pairs,
        sf_prazo__c: prazo,
        sf_desconto_item__c: desconto,
      });
    });
  }

  // Atualizar carrinho "dropdown.current.products"
  atualizarCarrinhos({ carts, acSetDropdownCarts: props.acSetDropdownCarts, });
};

const checkGrade = async (props, item) => {
  if (props.typeComponent === 'DetalheCarrinho') {
    checkPanelDetalheCarrinho(props, item);
  }

  if (props.typeComponent === 'AssistenteDeSelecao') {
    checkPanelAssistenteDeSelecao(props, item);
  }
};

class GradePopUp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      totalPages: 0,
      perpage: 30,
      loading: false,
    };
    this.paginacao = 1;
  }

  componentDidMount = async () => {
    const data = await SrvProduct.getGrades(this.props.product.code);
    const totalPages = Math.ceil(data.length / this.state.perpage);
    this.setState({ data, totalPages });
  }

  paginate = (arr, perpage, page) => {
    return arr.slice(perpage * (page - 1), perpage * page);
  };

  dispatchFetchPage = async () => {
    if (this.state.totalPages >= this.paginacao) {
      if (this.state.loading) return;
      this.setState({ loading: true });
      this.paginacao += 1;
      const teste = await SrvProduct.getGrades(this.props.product.code);
      const newItems = this.paginate(teste, this.state.perpage, this.paginacao);
      this.props.acSetGrades([...this.props.grades, ...newItems]);
      this.setState({ loading: false });
    }
  };

  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  };

  render() {
    const { grades, acSelectedGrade, sizes, embalamento } = this.props;

  // Quando o modelo esta com o embalamento tipo: "Cartucho".
  // a lista de grades é filtrada restringindo a exibição de desta opção.
  // const strEmbalamento = typeof embalamento === 'string' ? embalamento : embalamento.embalamento;
  // const isEmbalamentoCartucho = strEmbalamento
    // && strEmbalamento.length > 3
    // && strEmbalamento.toLowerCase() === 'cartucho';
  // if (isEmbalamentoCartucho) {
    // const totalDeParesDiferenteDeSeis = g => g.totalPairs !== 6;
    // gradesFiltrada = grades.filter(totalDeParesDiferenteDeSeis);
  // }

  if (sizes !== undefined) {
    const columns = [...sizes];
    const collsOrdenada = columns.sort((a, b) => {
      const aa = a.indexOf('/') ? a.split('/')[0] : a;
      const bb = b.indexOf('/') ? b.split('/')[0] : b;
      return  aa - bb;
    });
    collsOrdenada.unshift('PARES');
    const columnHeaders = collsOrdenada
      .map(value => {
        const largura = (value.length > 2) ? { width: 45, maxWidth: 45 } : { width: 35, maxWidth: 35 };
        return (
          <View key={value} style={[global.containerCenter, largura, { height: 30, justifyContent: 'center' }]}>
            <Text style={{ fontFamily: Font.ASemiBold, fontSize: 12, color: 'rgba(0, 0, 0, 0.6)', textAlign: 'center' }}>{value}</Text>
          </View>
        );
      });
    collsOrdenada.shift();

    if (grades.length === 0) {
      return (
        <View style={global.containerCenter}>
          <InfoMsg
            icon="z"
            firstMsg="Não há grades disponíveis para este produto"
          />
        </View>
      );
    }
    /*
    if (gradesFiltrada.length === 0) {
      return (
        <View style={global.containerCenter}>
          <InfoMsg
            icon="z"
            firstMsg="Não há grades disponíveis"
            sndMsg="Tente escolher outro embalamento pelo carrinho"
          />
        </View>
      );
    }
    */

    return (
      <View data-id="GradePopUp">
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '100%' }}>
            {
              grades.length > 0
              && <View style={{ flexDirection: 'row', width: '100%', borderBottomWidth: 1, borderBottomColor: '#CCC' }}>
                <View style={[global.containerCenter, {  flex: null, width: 84, height: 30, marginRight: 14 }]}>
                  <Text style={{ fontFamily: Font.ASemiBold, fontSize: 12, color: 'rgba(0, 0, 0, 0.6)', textAlign: 'center', marginLeft: 37 }}>GRADES</Text>
                </View>
                  {columnHeaders}
              </View>
            }
            <FlatList
              style={{ maxHeight: this.props.panelHeight }}
              data={grades}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <View
                    key={item.name}
                    style={{
                    flexDirection: 'row',
                    borderBottomWidth: 0.5,
                    borderBottomColor: 'rgba(120, 120, 120, 0.2)',
                    width: 100
                  }}
                  >
                    <CheckBox
                      action={() => {
                        checkGrade(this.props, item)
                      }}
                      param={item.name}
                      isChosen={item.isChosen}
                    />                   
                    <View style={global.containerCenter}>
                      <Text style={{ fontFamily: Font.ALight, color: 'rgba(0, 0, 0, 0.6)' }}>{item.name}</Text>
                    </View>
                  </View>
                  <RowPopUpGrade
                    grade={item}
                    isChosen={item.isChosen}
                    acSelectedGrade={acSelectedGrade}
                    sizes={collsOrdenada}
                  />
                </View>
              )}
              keyExtractor={item => item.name}
              initialNumToRender={this.state.perpage}
              onEndReachedThreshold={0.1}
              onEndReached={this.dispatchFetchPage}
              ListFooterComponent={this.renderFooter}
            />
          </View>
        </View>
      </View>
    );
  }

  return null;
  }
}

export default GradePopUp;