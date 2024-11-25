import React from 'react';
import codePush from 'react-native-code-push';
import { Provider } from 'react-redux';
import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
import { bugsnag } from '../../lib/Bugsnag';
import { logEvent } from '../../lib/FirebaseAnalytics';
import createStore from '../../redux/CreateStore';
import Share from '../Share';

const store = createStore();

class ShareApp extends React.Component<{}> {
  componentDidMount() {
    logEvent(AnalyticsDefinitions.category.STATE, {
      [AnalyticsDefinitions.parameters.LABEL]:
        AnalyticsDefinitions.label.SHARE_EXTENSION_LAUNCHED,
      [AnalyticsDefinitions.parameters.TARGET]:
        AnalyticsDefinitions.target.SHARE_EXTENSION,
      [AnalyticsDefinitions.parameters.STATUS]:
        AnalyticsDefinitions.status.LAUNCHED
    });
  }

  render() {
    return (
      <Provider store={store}>
        <Share />
      </Provider>
    );
  }
}
export default codePush()(ShareApp);
