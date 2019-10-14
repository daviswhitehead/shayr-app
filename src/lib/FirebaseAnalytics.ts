import _ from 'lodash';
import Config from 'react-native-config';
import firebase from 'react-native-firebase'; // https://rnfirebase.io/docs/v5.x.x/analytics/reference/analytics#setAnalyticsCollectionEnabled
import { NavigationState } from 'react-navigation';
import { names } from '../components/Icon';
import {
  category,
  label,
  parameters,
  result,
  status,
  target,
  type
} from './AnalyticsDefinitions';
import { getActiveRouteName } from './ReactNavigationHelpers';

export const setUserProperties = (params = {}) => {
  _.forEach(params, (key, value) => {
    firebase.analytics().setUserProperty(key, `${value}`.toString());
  });
};

export const userAnalytics = (userId: string, params = {}) => {
  firebase.analytics().setUserId(userId);
  setUserProperties(params);
};

export const setCurrentScreen = (screenName: string) =>
  firebase.analytics().setCurrentScreen(screenName);

export const currentScreenAnalytics = (
  prevState: NavigationState,
  currentState: NavigationState
) => {
  const currentScreen = getActiveRouteName(currentState);
  const prevScreen = getActiveRouteName(prevState);

  if (prevScreen !== currentScreen) {
    firebase.analytics().setCurrentScreen(currentScreen);
  }
};

export type eventName = category;
export interface params {
  [key: parameters]: target | label | status | type | result | names;
}
export const logEvent = (
  eventName: eventName,
  params: params = {},
  shouldLog: boolean = true
) => {
  if (Config.ENV_NAME !== 'prod' && shouldLog) {
    console.log(eventName, params);
  }
  firebase.analytics().logEvent(eventName, params);
};
