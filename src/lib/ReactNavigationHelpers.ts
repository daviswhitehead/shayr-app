import { NavigationActions } from 'react-navigation';

let _navigator;

export const setTopLevelNavigator = (navigatorRef) => {
  _navigator = navigatorRef;
};

export const navigate = (routeName: string, params: any, key?: string) => {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
      key
    })
  );
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
