import { Client } from 'bugsnag-react-native';
import React from 'react';
import { Platform } from 'react-native';
import codePush from 'react-native-code-push';
import Config from 'react-native-config';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import createStore from '../../redux/CreateStore';
import AppLoading from '../AppLoading';

const bugsnag = new Client(Config.BUGSNAG_KEY);
// const bugsnag = new Client('c79ac0db77950995f8baa6855a38073e');
bugsnag.notify(new Error('Main App Test Error error'));

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
        <AppLoading />
      </Provider>
    );
  }
}

export default codePush()(App);
