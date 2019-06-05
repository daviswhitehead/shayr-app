import firebase from 'react-native-firebase'; // https://rnfirebase.io/docs/v5.x.x/analytics/reference/analytics#setAnalyticsCollectionEnabled
import { getActiveRouteName } from './ReactNavigationHelpers';

export const userAnalytics = (userId) => {
  firebase.analytics().setUserId(userId);
  // firebase.analytics().setUserProperties(fieldMapping);
};

export const currentScreenAnalytics = (prevState, currentState) => {
  const currentScreen = getActiveRouteName(currentState);
  const prevScreen = getActiveRouteName(prevState);

  if (prevScreen !== currentScreen) {
    firebase.analytics().setCurrentScreen(currentScreen);
  }
};
