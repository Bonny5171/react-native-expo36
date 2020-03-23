import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { first } from '../functions';
import { upsertQuantidade, atualizaCarrinhoAtual, agrupaProdutosNoCarrinho, } from '../../../../../utils/CommonFns';
import { acKeyboardState, acSetDropdownCarts, acSetCarts } from '../../../../../redux/actions/pages/catalog';
import SrvOrder from '../../../../../services/Order';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.onChanged = this.onChanged.bind(this);
    this.state = this.updateTextKey();
    this.savedQt = '';
    this.qtChanged = false;
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (this.props.dropdown !== prevProps.dropdown) {
      const state = this.updateTextKey();
      if (state.key !== '' && this.state.key === ''){
        this.setState(state);
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {

  }
  getDesconto(dropdown) {
    if (dropdown.current.products.length > 0) {
      return dropdown.current.products[0].desconto;
    }
    return null;
  }

  render() {
    const {
      cores, indexColor, grades, indexGrade, grade,
      acKeyboardState, dropdown, carts,
      product, acCurrentGrade, client, currentTable,
    } = this.props;
    const codeProduct = product.code;
    const codeColor = cores[indexColor].code;
    const codeGrade = grades[indexGrade].key;
    const codeEmbalamento = product.embalamento;
    const desconto = this.getDesconto(dropdown);

    const cartDefault = carts.find(car => car.key === dropdown.current.key);
    return (
      <View key={grade.name} style={[styles.vwIT, { marginTop: first(grades) === grade ? 0 : 5, marginRight: 11 }]}>
        <TextInput
          style={{ textAlign: 'center' }}
          underlineColorAndroid="transparent"
          maxLength={3}
          keyboardType="numeric"
          value={this.state.text}
          onChangeText={(text) => {
            if (text !== this.state.text) {
              this.qtChanged = true;
            } else {
              this.qtChanged = false;
            }
            this.setState({ text });
          }}
          onFocus={() => {
            acCurrentGrade(indexGrade);
          }}
          onBlur={async () => {
            if (this.qtChanged && this.savedQt !== this.state.text) {
              this.savedQt = this.state.text;
              await upsertQuantidade({
                dropdown,
                carts,
                acSetDropdownCarts: this.props.acSetDropdownCarts,
                grade: {
                  ref1: codeProduct,
                  ref2: codeColor,
                  ref3: codeGrade,
                  ref4: codeEmbalamento,
                  desconto,
                },
              }, {
                  id: this.state.key,
                  quantity: this.state.text,
                });

              await atualizaCarrinhoAtual({
                client,
                currentTable,
                acSetCarts: this.props.acSetCarts,
                acSetDropdownCarts: this.props.acSetDropdownCarts,
              });
            }
            this.qtChanged = false;
          }}
        />
      </View>
    );
  }

  onChanged(text) {
    let newText = '';
    const numbers = '0123456789';

    for (let i = 0; i < text.length; i += 1) {
      if (numbers.indexOf(text[i]) > -1) {
        newText += text[i];
      }
    }

    this.props.acTextGrade(this.props.color.name, this.props.indexGrade, this.props.indexColor, newText);
  }

  updateTextKey() {
    const { cores, indexColor, grades, indexGrade, dropdown } = this.props;
    const codeColor = cores[indexColor].code;
    const codeGrade = grades[indexGrade].key;
    // Tenho produto dentro do carrinho com esta cor e esta grade?
    // Se tenho exibo a quantidade.
    const product = dropdown.current.products
      .find(p => p.ref2 === codeColor && p.ref3 === codeGrade);

    if (product) {
      const text = product.quantity ? product.quantity.toString() : '';
      this.savedQt = text;
      return {
        text,
        key: product.key,
      };
    }

    return {
      text: '',
      key: '',
    };
  }
}

const mapStateToProps = (state) => ({
  client: state.assistant.client,
  currentTable: state.assistant.currentTable,
});

const mapDispatchToProps = {
  acKeyboardState,
  acSetDropdownCarts,
  acSetCarts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Input);

const styles = StyleSheet.create({
  vwIT: {
    justifyContent: 'center',
    height: 45,
    width: 70,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#999',
  },
});