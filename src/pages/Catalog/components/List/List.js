import React, { Fragment } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { Row } from '..';
import { obterQuantidaDeCaixas, obterLarguraDasCaixas } from '../../../../services/Dimensions';
import { arrayIntoGroups } from '../../../../redux/reducers/pages/common/functions';
import { InformativeLine } from '.';
import { InfoMsg } from '../../../../components';

const LoadIcon = ({ isQuering }) => (
  <Fragment>
    {isQuering === 'none' && (
      <View style={styles.icLoad}>
        <ActivityIndicator size="small" color="#333" />
      </View>
    )}
  </Fragment>
);

class List extends React.PureComponent {
  componentDidMount() {
    const { rowLength, acRowLength } = this.props;
    if (rowLength === null) {
      acRowLength(this.qtd);
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.resizeMode !== nextProps.resizeMode) this.rowData = null;
  }

  _renderItem = ({ item, index }) => {
    const { horizontalList, acHorizontalList, isHamb, currentTable } = this.props;
    // console.log('item', item);
    this.decideRowLength(item.products, index);

    if (horizontalList === null) {
      acHorizontalList(item.length);
    }

    if (index === 0) {
      return (
        <View
          key={index}
        >
          <InformativeLine
            navigation={this.props.navigation}
            hasHamburguer={this.hasHamburguer}
            hasFilterTags={this.hasFilterTags}
            exibeLinhaInformativa={this.exibeLinhaInformativa}
            filterByMenu={this.props.filterByMenu}
            currentTable={currentTable}
            toggleIsQuering={this.props.toggleIsQuering}
            selectTable={this.props.selectTable}
            dropdown={this.props.dropdown}
            client={this.props.client}
            isCompleteCat={this.props.isCompleteCat}
          />
          <Row
            index={index}
            keyDestaque={index}
            scrollToque={index}
            scrollToIndex={this.scrollToIndex}
            indexDestaque={index}
            rowData={this.rowData}
            isHamb={isHamb}
            isOnlyGrid={this.onlyGrid}
            {...item}
            {...this.props}
            isCompleteCat={this.props.isCompleteCat}
            isShowCase={this.props.isShowCase}
            flatListRef={this.flatListRef}
          />
        </View>
      );
    }

    return (
      <Row
        key={index}
        index={index}
        keyDestaque={index}
        scrollToIndex={this.scrollToIndex}
        indexDestaque={index}
        rowData={this.rowData}
        itemsPerRow={this.qtd}
        isHamb={isHamb}
        isOnlyGrid={this.onlyGrid}
        isCompleteCat={this.props.isCompleteCat}
        isShowCase={this.props.isShowCase}
        {...item}
        {...this.props}
      />
    );
  };

  render() {
    const {
      chosenHFID,
      popUpFilter,
      resizeMode,
      isHamb,
      custonStyle,
      data,
      selectedHamburguerFilter,
      currentTable
    } = this.props;

    this.onlyGrid = resizeMode === 'GRID' && !isHamb;

    if (this.onlyGrid) this.decideRowLength(data[0].products, 1);

    this.hasHamburguer = chosenHFID !== null && chosenHFID !== 0 && selectedHamburguerFilter !== null;
    this.hasFilterTags = popUpFilter.filter(filtro => filtro.current !== '').length > 0;
    this.exibeLinhaInformativa = this.hasHamburguer || this.hasFilterTags;
    if (data[0].products.length === 0) {
      return (
        <View>
          <InformativeLine
            navigation={this.props.navigation}
            hasHamburguer={this.hasHamburguer}
            hasFilterTags={this.hasFilterTags}
            exibeLinhaInformativa={this.exibeLinhaInformativa}
            filterByMenu={this.props.filterByMenu}
            dropdown={this.props.dropdown}
            toggleIsQuer
            containerStyle={{ marginTop: 107, justifyContent: 'flex-end' }}
            currentTable={currentTable}
            toggleIsQuering={this.props.toggleIsQuering}
            client={this.props.client}
            isCompleteCat={this.props.isCompleteCat}
          />
          <LoadIcon isQuering={this.props.isQuering} />
          <InfoMsg
            icon="3"
            firstMsg="Não encontramos nenhum produto pra sua pesquisa"
            sndMsg="Que tal uma pesquisa mais abrangente? Talvez encontre o que procura"
            containerStyle={{ marginTop: Platform.OS !== 'web' ? 80 : 0 }}
          />
        </View>
      );
    }
    // console.log('this.props.data', this.props.data);
    // console.log('this.props.isQuering', this.props.isQuering);
    if (this.onlyGrid) {
      return (
        <View data-id="box-list-ctn" style={{ height: this.props.height, width: '100%' }}>
          <FlatList
            initialNumToRender={1}
            keyExtractor={(item, index) => index.toString()}
            data-id="box-list"
            ref={ref => {
              this.flatListRef = ref;
            }}
            getItemLayout={this.getItemLayout}
            style={custonStyle}
            renderItem={this._renderItem}
            {...this.props}
            data={this.rowData}
            contentContainerStyle={styles.paddingList}
          />
        </View>
      );
    }

    return (
      <View data-id="box-list-ctn" style={{ height: this.props.height, width: '100%' }}>
        <FlatList
          initialNumToRender={1}
          keyExtractor={(item, index) => index.toString()}
          data-id="box-list"
          ref={ref => {
            this.flatListRef = ref;
          }}
          getItemLayout={this.getItemLayout}
          style={custonStyle}
          renderItem={this._renderItem}
          {...this.props}
          contentContainerStyle={styles.paddingList}
        />
        <LoadIcon isQuering={this.props.isQuering} />
      </View>
    );
  }

  getItemLayout = (data, index) => ({ length: 280, offset: 245 * index, index });

  scrollToIndex = randomIndex => {
    this.flatListRef.scrollToIndex({ animated: true, index: randomIndex });
  };

  decideRowLength(products, index) {
    const { resizeMode } = this.props;
    if (products !== undefined) {
      if (this.larguraDasCaixas === undefined || this.qtd === undefined) {
        this.larguraDasCaixas = obterLarguraDasCaixas(this.props);
        this.qtd = obterQuantidaDeCaixas(this.props);
      }
      const isFirstLine = index === 0;
      if (resizeMode === 'GRID' || resizeMode === 'HAMBURGUER' /* && !isFirstLine */) {
        // console.log('products', products);
        this.rowData = arrayIntoGroups(products, this.qtd);
        // console.log('GRID', products, this.qtd);
        // console.log('GRID this.rowData', this.rowData);
      } else {
        // console.log('NOT GRID', resizeMode, isFirstLine);
        this.rowData = products;
      }
    }
  }
}

export default List;

const styles = StyleSheet.create({
  icLoad: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 450,
    top: 100
  },
  paddingList: {
    paddingTop: 10
  }
});
