import firebase from 'react-native-firebase';
// https://rnfirebase.io/docs/v5.x.x/analytics/reference/analytics#setAnalyticsCollectionEnabled

export const userAnalytics = (userId) => {
  firebase.analytics().setUserId(userId);
  // firebase.analytics().setUserProperties(fieldMapping);
};

export const getActiveRouteName = (navigationState) => {
  // gets the current screen from navigation state
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
};

export const currentScreenAnalytics = (prevState, currentState) => {
  const currentScreen = getActiveRouteName(currentState);
  const prevScreen = getActiveRouteName(prevState);

  if (prevScreen !== currentScreen) {
    firebase.analytics().setCurrentScreen(currentScreen);
  }
};
