import React from 'react';
import { Text, View, AsyncStorage, Platform } from 'react-native';
import { Updates } from 'expo';
import { dropRepo as dropAccountDb } from '../services/Repository/AccountDb';
import { dropRepo as dropProductDb } from '../services/Repository/ProductDb';
import { dropRepo as dropSetupDb } from '../services/Repository/SetupDb';
import { dropRepo as dropResourceDb } from '../services/Repository/ResourceDb';
import { dropRepo as dropOrderDb } from '../services/Repository/OrderDb';

import db from '../services/Repository/core/Db';
class LogOut extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    if (Platform.OS === 'web') {
      await db.closeAll();
      window.localStorage.clear();
      window.webSqlManager.removeAll('userId');
    } else {
      await this.deleteAllDbs();
      await AsyncStorage.clear();
      Updates.reload();
    }
  }

  async deleteAllDbs() {
    await dropAccountDb();
    await dropProductDb();
    await dropSetupDb();
    await dropResourceDb();
    await dropOrderDb();

    return true;
  }

  render() {
    const containerStyle = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    };

    return (
      <View style={containerStyle}>
        <Text>GoodBye</Text>
      </View>
    );
  }
}

export default LogOut;