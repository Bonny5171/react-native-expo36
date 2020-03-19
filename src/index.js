import React from 'react';
import { Platform } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Content from './Content';
import reducers from './redux/reducers';
import iconFontStyles from './assets/styles/iconFontStyles';

// Importacao das fontes para Web-Eletron.
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = iconFontStyles;
  } else {
    style.appendChild(document.createTextNode(iconFontStyles));
  }

  // Inject stylesheet
  document.head.appendChild(style);
}

const store = createStore(reducers);
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Content />
      </Provider>
    );
  }
}

export default App;