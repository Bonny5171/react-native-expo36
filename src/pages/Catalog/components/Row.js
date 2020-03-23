import React from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from '../../../assets/styles/global';
import { Product, DetailProduct } from './';
import { obterQuantidaDeCaixas, obterLarguraDasCaixas } from '../../../services/Dimensions';
import { navigate } from '../../../utils/CommonFns';

class Row extends React.PureComponent {
  constructor(props) {
    super(props);
    this._mounted = false;
    this.state = {
      isQuering: false,
      hasGallery: false,
    };
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }


  componentWillMount() {
    this.qtd = obterQuantidaDeCaixas(this.props);
  }

  componentWillUpdate(nextProps) {
    const { keyDestaque, rowLength, acRowLength, ponteiroProduto, rowData } = this.props;
    if (rowLength === null) {
      acRowLength(this.qtd);
    }
    this.qtd = obterQuantidaDeCaixas(this.props);
    const currentPage = navigate(Number(ponteiroProduto[1]), this.qtd);
    const nextPage = navigate(Number(nextProps.ponteiroProduto[1]), this.qtd);
    const isCurrentRow = keyDestaque === ponteiroProduto[0];
    // VerificaÃ§Ã£o para definir se deve mover a lista horizontalmente
    if (currentPage !== nextPage && isCurrentRow) {
      let scrollToIndex = 0;
      // Se a prÃ³xima pÃ¡gina serÃ¡ a primeira(0), nÃ£o precisa subtrair
      if (currentPage !== 0) scrollToIndex = this.qtd * (nextPage - 1);
      // console.log('scrolltoIndex', scrollToIndex, 'INDEX TESTED', nextProps.ponteiroProduto[1]);
      if (scrollToIndex >= 0 && scrollToIndex <= rowData.length) {
        this.flatList.scrollToIndex({ animated: true, index: scrollToIndex });
      }
    }
  }

  renderProduct = ({ item, index }) => {
    const {
      rowData,
      btnCarrinho,
      dropdown,
      productsChecked,
      itensPerRow,
      openDetail,
      selectList,
      acSetProduct,
      acRemoveCartProduct,
      acAddCartProduct,
      acRemoveCheckedProduct,
      acAddCheckedProduct,
      currentTable,
      ponteiroProduto,
      window: { width },
      carts,
    } = this.props;
    let selected = false;
    if (this.props.dropdown.current) {
      if (this.props.dropdown.current.products.find(prod => item.code === prod.ref1)) {
        selected = true;
      }
    }

    let data = rowData;

    if (!this.props.btnCarrinho) {
      selected = this.props.productsChecked.includes(item);
    }

    return (
      <Product
        isFullList={data.length > itensPerRow}
        isOnlyGrid={this.props.isOnlyGrid}
        isHamb={this.props.isHamb}
        isCompleteCat={this.props.isCompleteCat}
        acUpdateSelected={this.props.acUpdateSelected}
        SELECIONADO={selected}
        isDetailOpen={this.props.ponteiroProduto[0] !== '' && this.props.ponteiroProduto[1] !== ''}
        {...item}
        carts={carts}
        product={item}
        next={rowData[index + 1]}
        previousPointer={index - 1}
        index={index}
        rowPointer={this.props.index}
        nextPointer={index + 1}
        productPos={index}
        rowData={rowData}
        currentProduct={this.props.currentProduct}

        dropdown={dropdown}
        openDetail={openDetail}
        selectList={selectList}
        btnCarrinho={btnCarrinho}
        ponteiroProduto={ponteiroProduto}
        currentTable={currentTable}
        keyProduct={item.key}
        keyDestaque={this.props.keyDestaque}
        previous={rowData[index - 1]}
        larguraDasCaixas={obterLarguraDasCaixas(width)}

        toggleRowQuering={this.toggleRowQuering}
        acAssistant={this.props.acAssistant}
        acSetProduct={acSetProduct}
        acAddCartProduct={acAddCartProduct}
        acRemoveCartProduct={acRemoveCartProduct}
        acRemoveCheckedProduct={acRemoveCheckedProduct}
        acAddCheckedProduct={acAddCheckedProduct}
        acCurrentProduct={this.props.acCurrentProduct}
        acSelectProduct={this.props.acSelectProduct}
      />
    );
  };

  render() {
    const { resizeMode, index, exhibition, keyDestaque, ponteiroProduto, products, rowData, isHamb } = this.props;
    const isFirstLine = index === 0;
    let data = rowData;
    // console.log('this.state', this.state);
    if (isHamb) data = rowData[0];
    if (resizeMode === 'GRID' && !isHamb) data = rowData[index];
    return (
      <View
        style={{
          paddingTop: resizeMode === 'HAMBURGUER' && isFirstLine ? 40 : 0
        }}
        data-id="box-de-destaque-ctn"
      >
        {resizeMode === 'DESTAQUES' /* || (resizeMode === 'HAMBURGUER'  && isFirstLine ) */ && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: isFirstLine ? 45 : 15,
              paddingLeft: 35
            }}
          >
            <Text style={styles.grupoDestaque}>{exhibition}</Text>
          </View>
        )}
        <FlatList
          horizontal
          initialNumToRender={4}
          keyExtractor={item => item.key}
          ref={flatList => {
            this.flatList = flatList;
          }}
          data={data}
          showsHorizontalScrollIndicator={false}
          style={{
            marginTop: resizeMode === 'GRID' ? 15 : 0,
            paddingLeft: 30,
          }}
          data-id="box-de-destaque"
          renderItem={this.renderProduct}
        />
        {ponteiroProduto[0] === keyDestaque && (
          <DetailProduct
            {...this.props}
            {...this.state}
            rowData={data}
            isFirstLine={isFirstLine}
            isOnlyGrid={this.onlyGrid}
            isCompleteCat={this.props.isCompleteCat}
            isShowCase={this.props.isShowCase}
            flatListRef={this.props.flatListRef}
            toggleRowQuering={this.toggleRowQuering}
          />
        )}
      </View>
    );
  }

  toggleRowQuering = (toggleBoth, prop = 'isQuering') => {
    let obj = { [prop]: !this.state[prop] };
    // Na primeira query mantémos ambos estados "em requisição" para poder abrir o detalhe do produto instantâneamente
    if (!this._mounted) return;
    if (toggleBoth) {
      this.setState({ ...obj, 'hasGallery': !this.state.hasGallery });
    }
    this.setState(obj);
  }
}

export default Row;
