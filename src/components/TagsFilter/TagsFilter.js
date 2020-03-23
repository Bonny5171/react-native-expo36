import React, { Fragment } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Font } from '../../assets/fonts/font_names';


class TagsFilter extends React.Component {
  render() {
    const {
      popUpFilter,
      eventRemoveAll,
      eventRemoveItem,
    } = this.props;
    const hasFiltros = popUpFilter.filter(filtro => filtro.current !== '').length > 0;

    if (hasFiltros) {
      return (
        <View style={{
          flex: 2,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
        }}
        >
          <Text style={{ fontSize: 13, fontFamily: Font.AMedium, color: '#333', }}></Text>
          {
            popUpFilter.map(filtro => {
              if (filtro.current) {
                return (
                  <TouchableOpacity
                    key={filtro.name}
                    onPress={() => {
                      eventRemoveItem(filtro.name);
                    }}
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      marginHorizontal: 4,
                      marginBottom: 8,
                      alignItems: 'center',
                      borderRadius: 10,
                      backgroundColor: 'rgba(205,205,205, 0.5)',
                      height: 17,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ color: '#333', fontSize: 13 }}>
                        {filtro.desc}
                      </Text>
                      <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 13 }}>
                        {` ${filtro.current}`}
                      </Text>
                      <View>
                        <Text style={{
                        fontSize: 14,
                        fontFamily: Font.C,
                        paddingLeft: 5,
                      }}
                        >
                        t
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }
            })
          }
          <TouchableOpacity onPress={eventRemoveAll} >
            <Text style={{
              fontSize: 17,
              fontFamily: Font.C,
              paddingHorizontal: 5,
            }}
            >w
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }
}

export default TagsFilter;