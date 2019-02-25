import URI from 'urijs';
import _ from 'lodash';
import Config from 'react-native-config';
import { protocols } from '../../lib/DeepLinks';
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

    // expects to find urls in the following format [protocol][hostname][path][query]
    // format should map to [protocol][bundle_id][screen][screen params]
    let url;
    if (payload) {
      url = payload.url ? payload.url : payload;
    }

    const uri = new URI(url);
    const params = uri._parts.query
      ? _.fromPairs(Array.from(new URLSearchParams(uri._parts.query).entries()))
      : {};

    console.log(uri);
    console.log(params);

    if (
      protocols.includes(uri._parts.protocol)
      && [
        Config.APP_BUNDLE_ID_IOS,
        `${Config.APP_ID_ANDROID}${Config.APP_ID_SUFFIX_ANDROID}`,
      ].includes(uri._parts.hostname)
    ) {
      dispatch(
        addRoute({
          url,
          screen: uri._parts.path.replace('/', ''),
          params,
        }),
      );
    }
  };
}

// export const handleDeepLink = (payload) => {
//   // expects to find urls in the following format [prefix][screen][id]
//   let url;
//   if (payload) {
//     url = payload.url ? payload.url : payload;
//   }

//   let route;
//   let validRoute = false;
//   prefixes.forEach((prefix) => {
//     route = url.replace(prefix, '');
//     validRoute = url.indexOf(prefix) === 0 ? true : validRoute;
//   });

//   if (validRoute) {
//     // NavigationService.navigate('HelloWorld');
//     return {
//       type: types.DEEP_LINK_LAUNCHED,
//       url,
//       routePath: route,
//     };
//   }

//   return {
//     type: types.DEEP_LINK_LAUNCHED,
//     url: null,
//     routePath: null,
//   };
// };
