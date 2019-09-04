import React from 'react';
import codePush from 'react-native-code-push';
import { Provider } from 'react-redux';
import { bugsnag } from '../../lib/Bugsnag';
import createStore from '../../redux/CreateStore';
import Share from '../Share';

bugsnag.notify(new Error('Share Extension Test Error'));

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
