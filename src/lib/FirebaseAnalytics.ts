import _ from 'lodash';
import firebase from 'react-native-firebase'; // https://rnfirebase.io/docs/v5.x.x/analytics/reference/analytics#setAnalyticsCollectionEnabled
import { NavigationState } from 'react-navigation';
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

export const logEvent = (eventName: string, params = {}) => {
  firebase.analytics().logEvent(`${eventName}`.toUpperCase(), params);
};
