import React from 'react';
import { Platform } from 'react-native';
import codePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
import { bugsnag } from '../../lib/Bugsnag';
import { logEvent } from '../../lib/FirebaseAnalytics';
import createStore from '../../redux/CreateStore';
import AppLoading from '../AppLoading';

const store = createStore();

class App extends React.Component<{}> {
  componentDidMount() {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
    logEvent(AnalyticsDefinitions.category.STATE, {
      [AnalyticsDefinitions.parameters.LABEL]:
        AnalyticsDefinitions.label.APP_LAUNCHED,
      [AnalyticsDefinitions.parameters.TARGET]: AnalyticsDefinitions.target.APP,
      [AnalyticsDefinitions.parameters.STATUS]:
        AnalyticsDefinitions.status.LAUNCHED
    });
  }

  render() {
    return (
      <Provider store={store}>
        <AppLoading />
      </Provider>
    );
  }
}

export default codePush()(App);
