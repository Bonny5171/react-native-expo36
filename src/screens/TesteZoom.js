import React from 'react';//

// opcao 1
import { Image, Dimensions, Platform, TouchableOpacity, View } from 'react-native';
import { IconActionless } from '../components';
let Zoom;
let ImageZoom;

if (Platform.OS === 'web') {
    Zoom = require('react-img-zoom');
} else {
    ImageZoom = require('react-native-image-pan-zoom').default;
}

export default class TesteZoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isZoomVisible: true,
        };
    }
    componentWillMount() {
        this.windowHeight = Dimensions.get('window').height;
        this.windowWidth = Dimensions.get('window').width;
    }
    render() {
        if (Platform.OS === 'web') {
            this.vmf = (<Zoom
              img="https://www.lifeofpix.com/wp-content/uploads/2018/06/20180120-P1201659-1600x1089.jpg"
              zoomScale={3}
              width={600}
              height={600}
            />);
        } else {
            this.vmf = (
              <View style={{ flex: 1 }}>
                <ImageZoom
                  enableCenterFocus={false}
                  cropWidth={this.windowWidth - 100}
                  cropHeight={this.windowHeight}
                  imageWidth={1600}
                  imageHeight={1089}
                >
                  <Image
                    style={{ width: 1600, height: 1089 }}
                    source={{ uri: 'http://www.dana-mad.ru/gal/images/Fairy-tales/Kalevala/nicolai%20kochergin_kalevala_04_vainamoinen%20seeks%20the%20beauty%20of%20pohjola_03.jpg' }}
                  />
                </ImageZoom>
                <TouchableOpacity
                  style={{ position: 'absolute', right: 20, top: 10, borderWidth: 3, borderColor: 'white' }}
                  onPress={() => this.setState({ isZoomVisible: false })}
                >
                  <IconActionless
                    style={{ fontSize: 52, color: 'white', }}
                    msg="t"
                  />
                </TouchableOpacity>
              </View>
            );
        }

        return this.state.isZoomVisible ? this.vmf : <View />;
    }
}

// opcao 2
// import { StyleSheet, View, Modal } from 'react-native';
// import ImageViewer from 'react-native-image-zoom-viewer';
// export default class App extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         isModelVisible: true,
//       };
//     }
//     ShowModalFunction(visible) {
//       this.setState({ isModelVisible: false });
//     }
//     render() {
//       const images = [{url: 'http://aboutreact.com/wp-content/uploads/2018/07/sample_img.png',},];
//       return (
//         <View style={styles.MainContainer}>
//           <Modal
//             visible={this.state.isModelVisible}
//             transparent={false}
//             onRequestClose={() => this.ShowModalFunction()}>
//             <ImageViewer imageUrls={images} />
//           </Modal>
//         </View>
//       );
//     }
//   }

//   const styles = StyleSheet.create({
//     MainContainer: {
//       flex: 1,
//       alignItems: 'center',
//     },
//   });


// opcao 3
// import {PinchView} from 'react-pinch-zoom-pan'
// export default class App extends React.Component{
//   render () {
//     return (
//       <PinchView debug backgroundColor='#ddd' maxScale={4} containerRatio={((400 / 600) * 100)}>
//         <img src={'http://lorempixel.com/600/400/nature/'} style={{
//           margin: 'auto',
//           width: '100%',
//           height: 'auto'
//         }} />
//       </PinchView>
//     )
//   }
// }