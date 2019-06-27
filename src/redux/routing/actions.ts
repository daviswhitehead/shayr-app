import {
  buildAppLink,
  parseAppLink,
  protocols
} from '@daviswhitehead/shayr-resources';
import { navigate } from '../../lib/ReactNavigationHelpers';

export const types = {
  ROUTE_ADDED: 'ROUTE_ADDED',
  ROUTE_REMOVED: 'ROUTE_REMOVED'
};

export const postDetailsRoute = (ownerUserId: string, postId: string) => {
  return buildAppLink('shayr', 'shayr', 'PostDetail', {
    ownerUserId,
    postId
  });
};

export function navigateToRoute(payload) {
  navigate(payload.screen, payload.params);
  return { type: types.ROUTE_REMOVED };
}

export function handleURLRoute(payload) {
  return function _handleURLRoute(dispatch) {
    let url;
    if (payload) {
      url = payload.url ? payload.url : payload;
    }

    const appLink = parseAppLink(url);

    if (protocols.includes(appLink.protocol)) {
      dispatch({
        type: types.ROUTE_ADDED,
        url: appLink.url,
        screen: appLink.screen,
        params: appLink.params
      });
    }
  };
}
