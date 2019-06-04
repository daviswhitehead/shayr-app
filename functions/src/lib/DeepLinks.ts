// https://github.com/medialize/URI.js
// import * as URI from 'urijs';
import * as _ from 'lodash';

import URI = require('urijs');

// run the below to test deeplinking
// // iOS: xcrun simctl openurl booted shayr://com.daviswhitehead.shayr.ios.dev/Feed?param=meow
// // Android: adb shell am start -W -a android.intent.action.VIEW -d "shayr://shayr/HelloWorld?param=meow" com.daviswhitehead.shayr.android.dev
// online resources
// // https://medium.com/react-native-training/deep-linking-your-react-native-app-d87c39a1ad5e
// // https://reactnavigation.org/docs/en/deep-linking.html#set-up-with-react-native-init-projects
// // https://facebook.github.io/react-native/docs/linking

// valid deeplink protocols
export const protocols = ['shayr', 'https'];

// takes an object and turns it into a URL query
export const objectToURLQuery = (params: any) => Object.keys(params)
  .map(key => `${key}=${encodeURIComponent(params[key])}`)
  .join('&');

// takes an app link URL and parses into protocol, hostname, screen, params
export const parseAppLink = (url: string) => {
  // expects to find urls in the following format [protocol][hostname][path][query]
  // format should map to [protocol][bundle_id][screen][screen params]
  // // e.g. shayr://com.daviswhitehead.shayr.ios.dev/Feed?param=meow
  // // protocol: shayr, hostname: com.daviswhitehead.shayr.ios.dev,
  // // path: /Feed, query: param=meow

  const uri: any = new URI(url);

  const params = uri._parts.query
    ? _.fromPairs(Array.from(new URLSearchParams(uri._parts.query).entries()))
    : {};
  return {
    url,
    protocol: uri._parts.protocol,
    hostname: uri._parts.hostname,
    screen: uri._parts.path.replace('/', ''),
    params,
  };
};

// takes a desired screen and its paramaters and builds a link the app can handle
export const buildAppLink = (protocol: any, hostname: string, screen: string, params: string) => `${protocol}://${hostname}/${screen}?${objectToURLQuery(params)}`;
