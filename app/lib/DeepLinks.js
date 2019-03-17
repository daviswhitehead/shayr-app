// https://github.com/medialize/URI.js
const URI = require('urijs');
const _ = require('lodash');
// import URI from 'urijs';
// import _ from 'lodash';

// run the below to test deeplinking
// // iOS: xcrun simctl openurl booted shayr://com.daviswhitehead.shayr.ios.dev/Feed?param=meow
// // Android: adb shell am start -W -a android.intent.action.VIEW -d "shayr://shayr/HelloWorld?param=meow" com.daviswhitehead.shayr.android.dev
// online resources
// // https://medium.com/react-native-training/deep-linking-your-react-native-app-d87c39a1ad5e
// // https://reactnavigation.org/docs/en/deep-linking.html#set-up-with-react-native-init-projects
// // https://facebook.github.io/react-native/docs/linking

// valid deeplink protocols
const protocols = ['shayr', 'https'];

// takes an object and turns it into a URL query
const objectToURLQuery = params => Object.keys(params)
  .map(key => `${key}=${encodeURIComponent(params[key])}`)
  .join('&');

// takes an app link URL and parses into protocol, hostname, screen, params
const parseAppLink = (url) => {
  // expects to find urls in the following format [protocol][hostname][path][query]
  // format should map to [protocol][bundle_id][screen][screen params]
  // // e.g. shayr://com.daviswhitehead.shayr.ios.dev/Feed?param=meow
  // // protocol: shayr, hostname: com.daviswhitehead.shayr.ios.dev,
  // // path: /Feed, query: param=meow

  const uri = new URI(url);
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
const buildAppLink = (protocol, hostname, screen, params) => `${protocol}://${hostname}/${screen}?${objectToURLQuery(params)}`;

exports.protocols = protocols;
exports.objectToURLQuery = objectToURLQuery;
exports.parseAppLink = parseAppLink;
exports.buildAppLink = buildAppLink;
