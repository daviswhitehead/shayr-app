import React from 'react';
import { Platform, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
// import codePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
// import { applyFirebaseSettings } from '../../config/FirebaseConfig';
// import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
// import { bugsnag } from '../../lib/Bugsnag';
// import { logEvent } from '../../lib/FirebaseAnalytics';
import createStore from '../../redux/CreateStore';
import AppLoading from '../AppLoading';

const store = createStore();

class App extends React.Component<{}> {
  async componentDidMount() {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
    // apply firebase settings before any other firebase calls
    // applyFirebaseSettings();
    // logEvent(AnalyticsDefinitions.category.STATE, {
    //   [AnalyticsDefinitions.parameters.LABEL]:
    //     AnalyticsDefinitions.label.APP_LAUNCHED,
    //   [AnalyticsDefinitions.parameters.TARGET]: AnalyticsDefinitions.target.APP,
    //   [AnalyticsDefinitions.parameters.STATUS]:
    //     AnalyticsDefinitions.status.LAUNCHED
    // });
    // console.log('App componentDidMount Promise');
    // console.log('AKSDJLFAKJLSDKJ');
    // const x = await firebase
    //   .firestore()
    //   .doc('posts/SHAYR_HOW_TO')
    //   .get()
    //   .then((value) => {
    //     console.log('then');
    //     console.log(value);
    //   })
    //   .catch((value) => {
    //     console.log('catch');
    //     console.log(value);
    //   });
    // console.log('###PROMISE RESOLVED###', x);
  }

  render() {
    console.log(`App - Render`);
    return (
      <Provider store={store}>
        <AppLoading />
      </Provider>
    );
  }
}

export default App;
// export default codePush()(App);
