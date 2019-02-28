import Config from 'react-native-config';
import firebase from 'react-native-firebase';
import { Platform } from 'react-native';

export const dynamicLinkListener = linkHandler => firebase.links().onLink((url) => {
  if (url) {
    linkHandler(url);
  }
});

export const getTestLink = async (screen = 'Feed', params = {}) => {
  // https://rnfirebase.io/docs/v5.x.x/links/reference/DynamicLink
  // https://rnfirebase.io/docs/v5.x.x/links/reference/AndroidParameters
  // https://rnfirebase.io/docs/v5.x.x/links/reference/IOSParameters

  const appLink = Platform.OS === 'ios'
    ? `https://${Config.APP_BUNDLE_ID_IOS}/${screen}?${params}`
    : `https://${Config.APP_ID_ANDROID}${Config.APP_ID_SUFFIX_ANDROID}/${screen}?${params}`;

  const link = new firebase.links.DynamicLink(appLink, 'shayrdev.page.link').android
    .setPackageName(`${Config.APP_ID_ANDROID}${Config.APP_ID_SUFFIX_ANDROID}`)
    // .ios.setAppStoreId(Config.APP_BUNDLE_ID_IOS)
    // .ios.setCustomScheme(Config.DYNAMIC_LINK_SCHEME);
    .ios.setBundleId(Config.APP_BUNDLE_ID_IOS);

  const dynamicLink = await firebase
    .links()
    .createDynamicLink(link)
    // .createShortDynamicLink(link, 'UNGUESSABLE')
    .then(url => url)
    .catch((error) => {
      console.log(error);
    });
  // console.log(dynamicLink);

  return dynamicLink;
};
