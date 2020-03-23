import React from 'react';
import { View, FlatList, StyleSheet, Platform, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { func, array, bool, number } from 'prop-types';
import { Font } from '../../assets/fonts/font_names';
import global from '../../assets/styles/global';
import SrvClients from '../../services/Account';
import TagsFilter from '../TagsFilter';


class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.initialLoad = 15;
    this.loadPerPage = 30;
    this.state = {
      rows: [],
      page: 1,
      lastOneInserted: false
    };
    this.onEndReached = this.onEndReached.bind(this);
    this._renderItem = this._renderItem.bind(this);
  }

  componentWillMount() {
    const { rows, page } = this.state;
    if (rows.length === 0) {
      this.paginate(this.props.data, this.initialLoad, page);
    }
  }

  render() {
    const { maxHeight, headerHeight, noBackground, noSeparator, isResultFinder, popUpFilter, } = this.props;
    const hasFilterTags = popUpFilter !== undefined ? popUpFilter.filter(filtro => filtro.current !== '').length > 0 : false;
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        {
          isResultFinder &&
          <View
            style={[{
              flexDirection: 'row',
              marginLeft: 35,
              marginRight: 35,
              marginTop: 40,
            }, { marginTop: 60, justifyContent: 'flex-end', }]}
          >
            {
              (isResultFinder && hasFilterTags) &&
              <View>
                <Text style={{ fontFamily: Font.BSemiBold, fontSize: 13, }}>  {this.props.data.length} resultado(s) encontrado(s)</Text>
              </View>
            }
            { (isResultFinder && hasFilterTags) && <TagsFilter
              {...this.props}
              eventRemoveAll={() => {
                this.props.acUpdateCurrentRemoveAll();
                this.props.acSetResultFinder(false);
                SrvClients.get(this.props.acSetClients);
              }}
              eventRemoveItem={(name) => {
                this.props.acUpdateCurrentRemoveItem(name);
                SrvClients.get(this.props.acSetClients);
              }}
            /> }
          </View>
        }

        <View style={[styles.header, this.props.headerStyle, { height: headerHeight || 55 }]}>
        {
          Platform.OS === 'web' ?
            <View
              style={[global.flexOne, { height: headerHeight || 55, backgroundColor: noBackground ? null : 'rgba(211, 216, 222, 0.7)' }, this.props.headerStyle]}
              data-id={noBackground ? '' : 'lineargradient-tablelist'}
            >
              {this.props.header(this.props)}
            </View>
          :
            <LinearGradient
              colors={noBackground ? ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)'] : ['rgb(211, 216, 222)', 'rgba(211, 216, 222, 0.7)', 'rgba(211, 216, 222, 0.7)']}
              style={global.flexOne}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            >
              {this.props.header(this.props)}
            </LinearGradient>
        }
        </View>
        <View style={{ flex: 5 }}>
          {/* Rows */}
          <View
            style={[{ flex: 1, backgroundColor: noBackground ? null : '#F0F4F7' }, this.props.bodyStyle]}
            opacity={0.85}
          >
            <FlatList
              style={{ maxHeight }}
              scrollEnabled
              onEndReachedThreshold={0.8}
              onEndReached={this.onEndReached}
              data={this.props.data} // Após correção do método paginate, mudar para this.state.rows
              keyExtractor={(curr, index) => index.toString()}
              ItemSeparatorComponent={noSeparator ? null : _renderItemSeparator}
              renderItem={this._renderItem}
            />
            {
              this.props.hasFooter ?
                <View
                  style={[styles.footer, { height: this.props.headerHeigh }]}
                >
                  {this.props.footer(this.props)}
                </View>
              :
                null
            }
          </View>
        </View>
      </View>
    );
  }

  paginate(array, pageSize, stateNumber) {
    const { data } = this.props;
    if (array.length < data.length || this.state.rows.length === 0) {
      const pageNumber = stateNumber - 1;
      let newArray = [];
      if (this.state.rows.length === 0) {
        newArray = [...data.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)];
        this.setState({ rows: newArray, page: pageNumber });
      }
      if (stateNumber * pageSize > this.props.data.length && !this.state.lastOneInserted) {
        newArray = [...this.state.rows, this.props.data[this.props.data.length - 1]];
        this.setState({ rows: newArray, page: stateNumber + 1 });
      } else {
        newArray = [...this.state.rows, ...data.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)];
        this.setState({ rows: newArray, page: stateNumber + 1, lastOneInserted: true });
      }
    }
  }

  onEndReached() {
    if (this.props.loadMore !== undefined) {
      this.props.loadMore();
    } else {
      const { rows, page } = this.state;
      this.paginate(rows, this.loadPerPage, page);
    }
  }

  _renderItem({ item, index }) {
    return this.props.row(item, index, this.props);
  }
}

const _renderItemSeparator = () => (<View style={styles.separator} />);

export default TableList;

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
  },
  footer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    backgroundColor: '#FDFAFA',
    width: '100%',
    bottom: 0,
  },
  txt: {
    fontSize: 14,
    fontFamily: Font.AMedium,
  },
  column: {
    flex: 1,
    alignItems: 'center'
  },
  separator: {
    flex: 1,
    backgroundColor: 'rgba(211, 216, 222, 0.8)',
    height: 2,
  }
});

TableList.propTypes = {
  // Para usar o TableList, passe elementos Header, Row e Footer por Props.
  // As props recebidas são repassadas para os elementos filhos
  // Array de dados que preencherá a lista
  data: array.isRequired,
  // Função de paginação que será recebida do componente pai,
  // caso exista outra lógica para a páginação que não seja via Array local
  loadMore: func,
  // Altura do header definida para se reutilizada no footer
  headerHeight: number,
  // Styles
  headerStyle: Text.propTypes.style,
  // Componentes
  // Para o alinhamento das colunas com as linhas, utilizar a mesma proporção de Width,
  // seja flex: 'x', width: 'number' ou width: 'x%'
  header: func.isRequired,
  // row: func.isRequired,
  footer: func,
  // Flags
  hasFooter: bool,
};