import React from 'react';
import { Platform } from 'react-native';
import codePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import createStore from '../../redux/CreateStore';
import AppWithListeners from '../AppWithListeners';

const store = createStore();

class App extends React.Component<{}> {
  componentDidMount = () => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  };

  render() {
    return (
      <Provider store={store}>
        <AppWithListeners />
      </Provider>
    );
  }
}

export default codePush(App);
