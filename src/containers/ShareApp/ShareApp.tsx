// import { Client } from 'bugsnag-react-native';
import React from 'react';
import codePush from 'react-native-code-push';
// import Config from 'react-native-config';
import { Provider } from 'react-redux';
import createStore from '../../redux/CreateStore';
import Share from '../Share';

// const bugsnag = new Client(Config.BUGSNAG_KEY);
// const bugsnag = new Client('c79ac0db77950995f8baa6855a38073e');
// bugsnag.notify(new Error('Share Extension Test Error'));

const store = createStore();

class ShareApp extends React.Component<{}> {
  render() {
    return (
      <Provider store={store}>
        <Share />
      </Provider>
    );
  }
}
export default codePush()(ShareApp);
