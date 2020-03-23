import React from 'react';
import { ImageBackground, Animated, View, Text, Dimensions, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { TranslucidHeader, FadeTabs } from '../../components';
import { Head } from './components';
import { backgroundVendor, backgroundAdmin } from '../../assets/images';
import { Font } from '../../assets/fonts/font_names';

import { CheckOption } from '../Assistant/components';


//state.multilojas define qual componente vai usar pra montar a listagem

const HEADER_HEIGHT = 120;

class Listagem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: new Animated.Value(0),
      multiLojas:true,
      expandido:false,
      modelos:[
        {
          id:1020301,
          nome: 'GRENDHA ARUBA CHIN AD',
          filtros:{
            grupo:1,
          },
          cores:[
            {id:1,codigo:90280, imagem:'', nome:'PRETA', valor:'24,90', grades:[{id:1,codigo:2003},{id:2,codigo:2074},{id:3,codigo:2581}]},
            {id:2,codigo:90253, imagem:'', nome:'ROSA', valor:'24,90', grades:[{id:1,codigo:2003},{id:2,codigo:2074},{id:3,codigo:2581}]},
            {id:3,codigo:902130, imagem:'', nome:'CINZA', valor:'24,90', grades:[{id:1,codigo:2003},{id:2,codigo:2074},{id:3,codigo:2581}]},
          ],
          filtros:{
            grupo:1,
          },
        },
        {
          id:1020402,
          nome: 'GRENDHA ARUBA GÁSPEA',
          cores:[
            {id:1,codigo:90280, imagem:'', nome:'PRETA', valor:'24,90', grades:[{id:1,codigo:2003},{id:2,codigo:2074},{id:3,codigo:2581}]},
            {id:2,codigo:90253, imagem:'', nome:'ROSA', valor:'24,90', grades:[{id:1,codigo:2003},{id:2,codigo:2074},{id:3,codigo:2581}]},
            {id:3,codigo:902130, imagem:'', nome:'CINZA', valor:'24,90', grades:[{id:1,codigo:2003},{id:2,codigo:2074},{id:3,codigo:2581}]},
          ],
          filtros:{
            grupo:1,
          },
        },
        {
          id:1020503,
          nome: 'MORMAII BABUCH AD',
          cores:[
            {id:1,codigo:90280, imagem:'', nome:'PRETA', valor:'24,90', grades:[{id:1,codigo:2003},{id:2,codigo:2074},{id:3,codigo:2581}]},
            {id:2,codigo:90253, imagem:'', nome:'ROSA', valor:'24,90', grades:[{id:1,codigo:2003},{id:2,codigo:2074},{id:3,codigo:2581}]},
            {id:3,codigo:902130, imagem:'', nome:'CINZA', valor:'24,90', grades:[{id:1,codigo:2003},{id:2,codigo:2074},{id:3,codigo:2581}]},
          ],
          filtros:{
            grupo:1,
          },
        }
      ],
      lojas: [
        {id:0, nome: 'XPTO 001'},
        {id:1, nome: 'XPTO CALÇADOS 02'},
        {id:2, nome: 'XPTO CALÇADOS 03'},
        {id:3, nome: 'XPTO CALÇADOS 04'},
        {id:4, nome: 'XPTO CALÇADOS 05'},
        {id:5, nome: 'XPTO CALÇADOS 06'},
        {id:6, nome: 'XPTO CALÇADOS 07'},
        {id:7, nome: 'XPTO CALÇADOS 08'},
        {id:8, nome: 'XPTO CALÇADOS 09'},
        {id:9, nome: 'XPTO CALÇADOS 10'},
      ],
    };
    this._toggleLarguraLojas = this._toggleLarguraLojas.bind(this);
  }

  setListHeight(y) {
    this.setState({ listHeight: new Animated.Value(y) });
  }

  _toggleLarguraLojas(e){
    this.setState({expandido:!this.state.expandido});
  }

  _renderListHeader(){
     return (
      <View data-id="listHeader" style={{paddingHorizontal:20, marginTop: HEADER_HEIGHT, flexDirection:'row', height:40, alignItems:'center', backgroundColor:'rgba(0,0,0,.05)'}}>
        <View style={{flexDirection:'row', alignItems:'center', width:300,}}>
          <Text style={{fontFamily:Font.BBold, fontSize:12,marginRight:6}}>PRODUTOS</Text>
          <View>
            <View style={{ width:10, height:10, 
              borderBottomColor:'#999', borderBottomWidth:5, 
              borderLeftColor:'transparent', borderLeftWidth:5, 
              borderRightColor:'transparent', borderRightWidth:5,
              marginBottom:1,
            }}/>
            <View style={{ width:10, height:10, 
              borderTopColor:'black', borderTopWidth:5, 
              borderLeftColor:'transparent', borderLeftWidth:5, 
              borderRightColor:'transparent', borderRightWidth:5,
            }}/>
          </View>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Text style={{fontFamily:Font.C, fontSize:14, opacity:.6}}>Z</Text>
          <Text style={{fontFamily:Font.BBold, fontSize:12, marginLeft:6, opacity:.5}}>GRUPO</Text>
        </View>
        <View style={{flexGrow:1}}/>
        {this.state.multiLojas && 
          <View style={{marginRight:11}}>
            <TouchableOpacity onPress={this._toggleLarguraLojas} style={{flexDirection:'row', alignItems:'center', }}>
              {!this.state.expandido && 
               <React.Fragment>
                <Text style={{fontFamily:Font.C, fontSize:20, opacity:.6, transform:[{rotateZ:'180deg'},{translateX:-4}]}}>*</Text>
                <Text style={{fontFamily:Font.C, fontSize:20, opacity:.6, transform:[{translateX:-4}]}}>*</Text>
               </React.Fragment>
              }
              {this.state.expandido && 
               <React.Fragment>
                <Text style={{fontFamily:Font.C, fontSize:20, opacity:.6, transform:[{translateX:5}]}}>Y</Text>
                <Text style={{fontFamily:Font.C, fontSize:20, opacity:.6, transform:[{rotateZ:'180deg'},{translateX:5}]}}>Y</Text>
               </React.Fragment> 
              }
            </TouchableOpacity>
          </View>
        }
        <View style={{justifyContent:'center', marginRight:4}}> 
          <Text style={{fontFamily:Font.C, fontSize:18, opacity:.6, transform:[{rotateZ:'-90deg'}, {translateX:-4}]}}>v</Text>
          <Text style={{fontFamily:Font.C, fontSize:18, opacity:.6, transform:[{rotateZ:'90deg'}, {translateX:-4}]}}>v</Text>
        </View>
      </View>
    )
  }

  render() {
    const background = this.props.context === 'Vendedor' ? backgroundVendor : backgroundAdmin;
    return (
      <ImageBackground data-id="containerCarrinho" source={background} style={{ flex: 1}} resizeMode="cover">
        <TranslucidHeader
          startingHeight={80}
          container={{
            zIndex: 2
          }}
          content={[{
              height: HEADER_HEIGHT,
              alignItems: 'center',
            }, { width: '100%' }]}
          y={this.state.listHeight}
        >
          <Head client={{fantasyName:'Nome fantasia', code:'12345678'}} listHeight={this.state.listHeight} navigation={this.props.navigation} />
        </TranslucidHeader>

        {this._renderListHeader()}
        
        <ScrollView data-id="containerDeProdutos"
          style={{height:1, flexGrow:1, }}
          onScroll={(event) => {
            this.setListHeight(event.nativeEvent.contentOffset.y);
          }}
        >
          {/* loop de itens */}
          <ItemDoCarrinho 
            multiLojas={this.state.multiLojas} 
            expandido={this.state.expandido} 
            lojas={this.state.lojas} 
            modelo={this.state.modelos[0]}
          />
        </ScrollView>
        {/* <PopPendencias/> */}
      </ImageBackground>
    );
  }
}

// ItemDoCarrinho monta o nome do modelo, botão de seleção de cores e outros dados
// faz loop das cores usando o componente CorDoItem
class ItemDoCarrinho extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      estaAberto : true,
      modelo:this.props.modelo,
      lojas:this.props.lojas,
    }
    this._toggleItem = this._toggleItem.bind(this);
  }

  _toggleItem(){
    this.setState({estaAberto : !this.state.estaAberto})
  }

  _renderHeaderDoItem(){
    return(
      <View data-id="headerDoItem" style={{flexDirection:'row', alignItems:'center', marginVertical:6}}>
        <TouchableOpacity>
          <Text style={{fontFamily:Font.C, fontSize:24, opacity:.5}}>-</Text>
        </TouchableOpacity>
        <View style={{flexDirection:'row', marginLeft:10, alignItems:'center', width:265,}}>
          <Text style={{fontFamily:Font.BRegular, fontSize:12, marginRight:6}}>{this.state.modelo.id}</Text>
          <Text style={{fontFamily:Font.BSemiBold, fontSize:12}}>{this.state.modelo.nome}</Text>
        </View>
        <View>
          <Text style={{fontFamily:Font.BRegular, fontSize:12, marginLeft:20}}>{this.state.modelo.filtros.grupo}</Text>
        </View>
        {/* gap */}
        <View style={{flexGrow:1}}/>
        {/* total de pares */}
        <View style={{marginLeft:20, alignItems:'center', width:70}}>
          <Text style={{fontFamily:Font.BSemiBold, fontSize:11,}}>TOT. PARES</Text>
          <Text style={{fontFamily:Font.BRegular, fontSize:12}}>480</Text>
        </View>
        {/* total do item */}
        <View style={{alignItems:'center', width:90, marginRight:20,}}>
          <Text style={{fontFamily:Font.BSemiBold, fontSize:11,}}>R$ TOTAL</Text>
          <Text style={{fontFamily:Font.BRegular, fontSize:12}}>9.999.999,99</Text>
        </View>
        <TouchableOpacity style={{width:30}} onPress={this._toggleItem}>
          <Text style={[{fontFamily:Font.C, fontSize:22, opacity:.5}, (!this.state.estaAberto)?  {transform:[{rotateZ:'90deg'}]} :  {transform:[{rotateZ:'-90deg'}]}]}>v</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderItensDaCor(){
    if(this.props.multiLojas){
      var cores = [], lojasDaCor = [], lojasDasCores = [], totaisDasCores = [];

      cores = this.state.modelo.cores.map((itemCor,indexCor)=>{
        lojasDaCor = this.state.lojas.map((itemLoja,indexLoja) =>
          <LojaDaCor key={'c_'+indexLoja.toString()} idx={indexCor} grades={itemCor.grades} nome={itemLoja.nome}/>
        )
        lojasDasCores.push(<LinhaLojas key={'l_'+indexCor.toString()} lojas={lojasDaCor}/>);
        totaisDasCores.push(<LinhaTotais key={'t_'+indexCor.toString()} corIdx={indexCor} grades={itemCor.grades}/>);
        return (
          <CorDoItem key={indexCor.toString()} idx={indexCor} cor={itemCor} multiLojas expandido={this.props.expandido}/>
        )
      })    

      return(
        <View data-id="colunasDoItem" style={{flexDirection:'row', width:'100%'}}>
          <View data-id="colunaCorGrades">
            {cores}
          </View>
          <ScrollView data-id="colunaLojas" horizontal showsHorizontalScrollIndicator style={{flexGrow:1, backgroundColor:'rgba(0,0,0,.05)',}}>
            <View>{lojasDasCores}</View>
          </ScrollView>
          <View data-id="colunaTotais" style={{marginRight:50}}>
            {totaisDasCores}
          </View>
        </View>
      )
    }else{
      //loop dos itens para negociação com loja única
      const cores = this.state.modelo.cores.map((item, index) => <CorDoItem key={index.toString()} idx={index} cor={item} expandido={this.props.expandido}/>)
      return cores;
    }
  }

  _renderLojas(itemCor,indexCor){
    const lojasDaCor = this.state.lojas.map((itemLoja,indexLoja) =>
      <LojaDaCor key={indexLoja.toString()} idx={indexCor} grades={itemCor.grades}/>
    )
    return lojasDaCor;
  }

  render(){
    return(
      <View data-id="containerDeItem" style={{marginHorizontal:20, borderBottomColor:'rgba(0,0,0,.1)', borderBottomWidth:1}}>
        {this._renderHeaderDoItem()}
        {this.state.estaAberto && this._renderItensDaCor()}  
      </View>
    )
  }
}

class CorDoItem extends React.Component{
  constructor(props){
    super(props)
    this._renderGrades = this._renderGrades.bind(this);
    this._renderGradesMultiLojas = this._renderGradesMultiLojas.bind(this);
    this.state={
      cor : this.props.cor,
    }
  }

  _renderLabelsDaCor(){
    if(this.props.idx != 0) return;
    return(
      <View data-id="labelsCor" style={{flexDirection:'row'}}>
        <View style={{width:40, backgroundColor:'rgba(0,0,0,.05)', paddingVertical:2}}/>
        <View style={{width:55, alignItems:'center', backgroundColor:'rgba(0,0,0,.05)', paddingVertical:2}}>
          <Text style={{fontFamily:Font.BSemiBold, fontSize:11,}}>CORES</Text>
        </View>
        {!this.props.expandido && 
          <React.Fragment>
            <View style={{width:135, backgroundColor:'rgba(0,0,0,.05)', paddingVertical:2}}/>
            <View style={{width:60,alignItems:'center', backgroundColor:'rgba(0,0,0,.05)', paddingVertical:2}}>
              <Text style={{fontFamily:Font.BSemiBold, fontSize:11,}}>R$ LISTA</Text>
            </View>
          </React.Fragment>
        }
      </View>
    )
  }

  // cor.grades:[{id:1,codigo:2003},{id:2,codigo:2074},{id:3,codigo:2581}]}
  _renderGrades(){
    const listaGrades = this.state.cor.grades.map((item, index) => (
      <View style={{flexDirection:'row'}} key={index.toString()}>
        <GradeDaCor grade={item} idx={index.toString()} corIdx={this.props.idx}/>
        <QuantidadeDaCor idx={index.toString()} corIdx={this.props.idx}/>
        <TotaisDaCor idx={index.toString()} corIdx={this.props.idx}/>
      </View>)
    );
    return listaGrades;
  }

  _renderGradesMultiLojas(){
    const listaGrades = this.state.cor.grades.map((item, index) => 
      <GradeDaCor grade={item} idx={index.toString()} key={index.toString()} corIdx={this.props.idx} multiLojas/>
    );
    return listaGrades;
  }

  render(){
    renderGrade = (this.props.multiLojas)? this._renderGradesMultiLojas : this._renderGrades;
    return(
      <View data-id="itemCor" style={{flexDirection:'row', marginBottom:8,}}>
        <View data-id="dadosCor" style={{flexDirection:'row'}}>
          <View data-id="colunaCor">
            {/* BTGRADE CODCOR IMGCOR LABELCOR R$ */}
            {this._renderLabelsDaCor()}
            <View data-id="cor" style={{flexDirection:'row', alignItems:'center', height:35}}>
              <View style={{width:40, flexShrink:1}}>
                <TouchableOpacity>
                  <Text style={{fontFamily:Font.C, fontSize:27, opacity:.5}}>§</Text>
                </TouchableOpacity>
              </View>
              <View style={{width:55, alignItems:'center'}}>
                <Text style={{fontFamily:Font.BRegular, fontSize:12}}>{this.state.cor.codigo}</Text>
              </View>
              {!this.props.expandido && 
                <React.Fragment>
                  <View style={{width:135, flexDirection:'row', alignItems:'center',}}>
                    <TouchableOpacity style={{marginHorizontal:5}}>
                      <ImageBackground source="" resizeMode="contain" style={{ width:40, height:35}}/>
                    </TouchableOpacity>
                    <Text style={{fontFamily:Font.BSemiBold, fontSize:12}}>{this.state.cor.nome}</Text>
                  </View>
                  <View style={{width:60, alignItems:'center'}}>
                    <Text style={{fontFamily:Font.BRegular, fontSize:12}}>{this.state.cor.valor}</Text>
                  </View>
                </React.Fragment>
              }
            </View>
          </View>
          <View data-id="colunaGrades">
            {renderGrade()}
          </View>
        </View>
      </View>
    )
  }
}

class GradeDaCor extends React.PureComponent{
  _renderLabel(){
    // console.log(this.props.corIdx,this.props.idx)
    //só imprime as labels na primeira grade da primeira cor
    if(this.props.corIdx == '0' && this.props.idx == '0') {
      return(
        <View style={{alignItems:'center', backgroundColor:'rgba(0,0,0,.05)', paddingVertical:2}}>
          <Text style={{fontFamily:Font.BSemiBold, fontSize:11}}>GRADES</Text>
        </View>
      )
    };
    return;
  }

  render(){
    return(
      <View data-id="grade" style={{width:60}}>
        {this._renderLabel()}
        <View style={{alignItems:'center', height:35, justifyContent:'center'}}>
          <TouchableOpacity>
            <Text style={{fontFamily:Font.BRegular, fontSize:13, color:'#0085B2', textDecorationColor:'#0085B2', textDecorationLine:'underline', textDecorationStyle:'solid'}}>{this.props.grade.codigo}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

class QuantidadeDaCor extends React.PureComponent{
  _renderLabel(){
    // console.log(this.props.corIdx,this.props.idx)
    //só imprime as labels na primeira grade da primeira cor
    if(this.props.corIdx == '0' && this.props.idx == '0') {
      return(
        <View style={{alignItems:'center', backgroundColor:'rgba(0,0,0,.05)', paddingVertical:2}}>
          <Text style={{fontFamily:Font.BSemiBold, fontSize:11}}>QTD.</Text>
        </View>
      )
    };
    return;
  }

  render(){
    return(
      <View data-id="quantidade" style={{width:45}}>
        {this._renderLabel()}
        <View style={{alignItems:'center', height:35, justifyContent:'center'}}>
          <TextInput style={{fontFamily:Font.BRegular, fontSize:13, backgroundColor:'white', borderColor:'#aaa', borderWidth:1, textAlign:'center', height:30, width:40, borderRadius:8,}}/>
        </View>
      </View>
    )
  }
}

class QuantidadeDaCorLoja extends React.PureComponent{

  _renderLabel(){
    // console.log(this.props.corIdx,this.props.idx)
    //só imprime as labels na primeira grade da primeira cor
    if(this.props.corIdx == '0' && this.props.idx == '0') {
      nome = (this.props.loja.length > 8)? this.props.loja.substr(0,8).trim()+'...' : this.props.loja;
      return(
        <View style={{alignItems:'center', backgroundColor:'rgba(0,0,0,.05)', paddingVertical:2}}>
          <Text style={{fontFamily:Font.BSemiBold, fontSize:11}}>{nome}</Text>
        </View>
      )
    };
    return;
  }

  render(){
    return(
      <View data-id="quantidade" style={{width:60}}>
        {this._renderLabel()}
        <View style={{alignItems:'center', height:35, justifyContent:'center'}}>
          <TextInput style={{fontFamily:Font.BRegular, fontSize:13, backgroundColor:'white', borderColor:'#aaa', borderWidth:1, textAlign:'center', height:30, width:40, borderRadius:8,}}/>
        </View>
      </View>
    )
  }
}

class TotaisDaCor extends React.Component{
  constructor(props){
    super(props)
  }

  _renderLabel(){
    //só imprime as labels na primeira grade da primeira cor
    if(this.props.corIdx == '0' && this.props.idx == '0') {
      return(
        <View style={{flexDirection:'row'}}>
          <View style={{width:70, alignItems:'center', backgroundColor:'rgba(0,0,0,.05)', paddingVertical:2}}>
            <Text style={{fontFamily:Font.BSemiBold, fontSize:11}}>PARES</Text>
          </View>
          <View style={{width:90, alignItems:'center', backgroundColor:'rgba(0,0,0,.05)', paddingVertical:2,}}>
            <Text style={{fontFamily:Font.BSemiBold, fontSize:11}}>R$</Text>
          </View>
        </View>
      )
    };
    return;
  }

  render(){
    return(
      <View data-id="totais">
        {this._renderLabel()}
        <View style={{flexDirection:'row', height:35, alignItems:'center',}}>
          <View style={{width:70, alignItems:'center'}}>
            <Text style={{fontFamily:Font.BRegular, fontSize:13}}>168</Text>
          </View>
          <View style={{width:90, alignItems:'center',}}>
            <Text style={{fontFamily:Font.BRegular, fontSize:13}}>9.999.999,99</Text>
          </View>
        </View>
      </View>
    )
  }
}

class LojaDaCor extends React.PureComponent{
  _renderInputs(){
    const inputs = this.props.grades.map((item, index) => 
      <QuantidadeDaCorLoja key={'q_'+index.toString()} idx={index.toString()} corIdx={this.props.idx} loja={this.props.nome}/>
    )
    return inputs;
  }

  render(){
    return(
      <View data-id="inputLoja" style={{width:60}}>
        {this._renderInputs()}
      </View>
    )
  }
}

class LinhaLojas extends React.PureComponent{
  render(){
    return(
      <View data-id="linhaLojas" style={{flexDirection:'row', marginBottom:8}}>
        {this.props.lojas}
      </View>
    )
  }
}

class LinhaTotais extends React.PureComponent{
  _renderTotais(){
    const totais = this.props.grades.map((item,index) => 
      <TotaisDaCor key={index.toString()} idx={index.toString()} corIdx={this.props.corIdx}/>
    )
    return totais;
  }

  render(){
    return(
      <View data-id="linhaTotais" style={{marginBottom:8}}>
        {this._renderTotais()}
      </View>
    )
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, null)(Listagem);