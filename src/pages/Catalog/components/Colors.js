import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Fade, List, IconActionless, ArrowNavigator, TextLimit, ImageLoad } from '../../../components';
import SrvResource from '../../../services/Resource';
import SrvProduct from '../../../services/Product';
import global from '../../../assets/styles/global';
import { arrayIntoGroups } from '../../../redux/reducers/pages/common/functions';
import { acColorsPopUp, acChangePrice, acChangeGallery, acChangeColor } from '../../../redux/actions/pages/catalog';
import { asyncForEach } from '../../../utils/CommonFns';

class Colors extends React.PureComponent {
  /*
  constructor(props) {
    super(props);
    this.nrPerPage = 11;
    this.state = {
      pages: arrayIntoGroups(props.currentProduct.colors, this.nrPerPage),
      currentPage: 0,
    };
  }
  */

  /*
  componentDidUpdate(prevProps) {
    if (this.props.currentProduct.colors !== prevProps.currentProduct.colors) {
      const colors = [...this.props.currentProduct.colors];
      if (colors.length === 0) colors[0] = { key: '00', name: '404', selected: true, url: 'https://www.lognetinfo.com.br/imagens/350x350/sem_imagem.jpg' };
      this.setState({ pages: arrayIntoGroups(colors, this.nrPerPage), currentPage: 0 });
    }
  } */

  render() {
    const {
      container,
    } = this.props;
    // const { currentPage, pages } = this.state;
    return (
      <Fade
        visible
        style={[global.flexOne, container]}
      >
        <View style={{ borderBottomWidth: 1, borderColor: '#CCC',  }} />
        <FlatList
          data={this.props.currentProduct.colors}
          style={global.flexOne}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.code}
        />
        {/* <ArrowNavigator
          hide={pages.length === 1}
          hasNext={currentPage + 1 < pages.length}
          hasPrevious={currentPage - 1 >= 0}
          navigateToNext={() => this.setState({ currentPage: currentPage + 1 })}
          navigateToPrevious={() => this.setState({ currentPage: currentPage - 1 })}
          containerStyle={{ position: 'absolute', height: 28, right: 10, bottom: 10 }}
          iconStyle={{ fontSize: 15 }}
        /> */}
      </Fade>
    );
  }

  renderItem = ({ item, index }) => (
    <Color
      key={index.toString()}
      {...item}
      currentTable={this.props.currentTable}
      currentProduct={this.props.currentProduct}
      page={this.props.page}
      acChangePrice={this.props.acChangePrice}
      acChangeColor={this.props.acChangeColor}
      acColorsPopUp={this.props.acColorsPopUp}
      acChangeGallery={this.props.acChangeGallery}
    />
  )
}
const mapStateToProps = state => ({
  // currentProduct: state.catalog.currenProduct,
  currentTable: state.catalog.currenTable,
});

const mapDispatchToProps = {
  acColorsPopUp,
  acChangeColor,
  acChangeGallery,
  acChangePrice,
};
export default connect(mapStateToProps, mapDispatchToProps)(Colors);

const Color = ({
  isShowing,
  name,
  code,
  newColor,
  uri,
  page,
  acChangeColor,
  acChangeGallery,
  productCode,
  currentTable,
  acChangePrice
}) => {
  return (
    <TouchableOpacity
      style={styles.vwColor}
      disabled={isShowing}
      onPress={async () => {
        acChangeColor(code);
        const galleryArr = await SrvResource.getGallery(productCode, code, 's');
        const gallery = [];
        const buscarGaleria = async () => {
          await asyncForEach(galleryArr._array, async (element) => {
            const fileName = `${element.product_code}${element.color_code}${element.sequence}`;
            gallery.push({
              key: element.sequence,
              url: fileName,
              selected: true,
              name: element.original_file_name,
            });
          });
        };
        await buscarGaleria();
        acChangeGallery(name, gallery);
        // acColorsPopUp();

        // Busca os preços do produto e da cor sorteada na thumb.
        if (currentTable && productCode && code) {
          const prices = await SrvProduct.getPriceProduct(currentTable.code, productCode, code);
          acChangePrice(prices);
        }
      }}
    >
      <View
        style={[[{ padding: 4 }, isShowing ? styles.activeColor : [styles.activeColor, { borderColor: 'transparent' }]]]}
      >
        {/* <ImageBackground
          source={{ uri }}
          style={styles.img}
          resizeMode="cover"
        /> */}
        <ImageLoad
          sizeType="s"
          resizeMode="cover"
          filename={uri}
          containerStyle={styles.img}
        />
      </View>
      {
        newColor ?
          <View style={{ justifyContent: 'center', alignItems: 'center', width: 75, height: '100%', }}>
            <Text style={[global.tag, {  borderRadius: 10, paddingVertical: 2, paddingHorizontal: 6, backgroundColor: '#090' }]}>NOVA COR</Text>
          </View>
        :
          <View style={{ width: 70, height: '100%' }} />
      }
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', height: '100%' }}>
        <Text style={[global.h6Bold, { fontSize: 13, color: '#333333' }]}>{code}</Text>
        <Text style={[global.h5, { color: '#999', fontSize: 12, maxWidth: 272 }]}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 4,
  },
  vwColor: {
    // height: 80,
    // flexGrow: 1,
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#CCC',
  },
  activeColor: {
    borderWidth: 2,
    borderColor: '#CCC',
    height: 60,
    width: 60,
  },
  img: {
    width: '100%',
    height: '100%',
  }
});