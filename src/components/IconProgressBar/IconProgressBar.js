import React from 'react';
import { View, Text, TouchableHighlight, } from 'react-native';
import { Font } from '../../assets/fonts/font_names';
import { Button, ProgressBar } from '../../components';
import { onSync } from '../../services/SyncDb';

class IconProgressBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      txt,
      nextStep,
      icon,
      percent,
      indeterminate,
      db,
      retry,
      // changePorcent,
      // changeIndeterminate,
      // changeRetry,
      service,
    } = this.props;

    let color = '#999';
    const styleButton = [
      {
        fontFamily: Font.C,
        fontSize: 50,
        paddingVertical: 8,
        color
      }
    ];

    // Sombreamento se concluido.
    if (percent === 1) {
      color = '#007ab0';
      styleButton.push({
        textShadowColor: 'rgba(0, 122, 176, 0.85)',
        textShadowOffset: { height: 2 },
        textShadowRadius: 4,
        color
      });
    }
    const porcentagem = parseInt(percent) || 0;

    return (
      <View style={{
          flexDirection: 'column',
          alignItems: 'center',
          marginHorizontal: 40,
          width: 120,
        }}
      >
        <Text style={[
              { fontSize: 18, fontFamily: Font.ASemiBold },
              { color }
            ]
          }
        >
          {txt}
        </Text>
        <Button
          disabled
          shadow
          action={nextStep}
          txtStyle={styleButton}
          txtMsg={icon}
        />

        {
          retry[service] ?
            <TouchableHighlight
              style={{
                alignItems: 'center',
                backgroundColor: '#DDDDDD',
                padding: 10
              }}
              onPress={() => {
                // onSync({ service, changePorcent, changeIndeterminate, changeRetry });
                // const retry = {};
                // retry[service] = false;
                // changeRetry(retry);
              }}
            >
              <Text>Retry</Text>
            </TouchableHighlight> :
            <ProgressBar
              db={db}
              percent={percent}
              indeterminate={indeterminate}
              color={color}
            />
        }

        {
          !indeterminate ? <Text style={{ fontFamily: Font.ARegular, color: '#999' }}>{porcentagem}% </Text> : <Text />
        }
      </View>
    );
  }
}

export default IconProgressBar;