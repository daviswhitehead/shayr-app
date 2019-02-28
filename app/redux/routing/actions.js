import { protocols, parseAppLink } from '../../lib/DeepLinks';
import NavigationService from '../../lib/NavigationService';

export const types = {
  DEEP_LINK_LAUNCHED: 'DEEP_LINK_LAUNCHED',
  ROUTE_ADDED: 'ROUTE_ADDED',
  ROUTE_REMOVED: 'ROUTE_REMOVED',
};

export const addRoute = payload => ({
  type: types.ROUTE_ADDED,
  url: payload.url,
  screen: payload.screen,
  params: payload.params,
});

export function navigateToRoute(payload) {
  NavigationService.navigate(payload.screen, payload.params);
  return { type: types.ROUTE_REMOVED };
}

export function handleDeepLink(payload, eventType = 'inapp') {
  return function _handleDeepLink(dispatch) {
    dispatch({ type: types.DEEP_LINK_LAUNCHED, eventType });

    let url;
    if (payload) {
      url = payload.url ? payload.url : payload;
    }

    const appLink = parseAppLink(url);

    if (protocols.includes(appLink.protocol)) {
      dispatch(
        addRoute({
          ...appLink,
        }),
      );
    }
  };
}
