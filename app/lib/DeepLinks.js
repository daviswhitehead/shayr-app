import Config from 'react-native-config';
import firebase from 'react-native-firebase';

export const protocols = ['shayr', 'https'];

export const dynamicLinkListener = linkHandler => firebase.links().onLink((url) => {
  if (url) {
    linkHandler(url);
  }
});

export const getTestLink = async () => {
  // https://rnfirebase.io/docs/v5.x.x/links/reference/DynamicLink
  // https://rnfirebase.io/docs/v5.x.x/links/reference/AndroidParameters
  // https://rnfirebase.io/docs/v5.x.x/links/reference/IOSParameters
  const link = new firebase.links.DynamicLink(
    'https://com.daviswhitehead.shayr.ios.dev/hw',
    'shayrdev.page.link',
  ).android
    .setPackageName(`${Config.APP_ID_ANDROID}${Config.APP_ID_SUFFIX_ANDROID}`)
    // .ios.setAppStoreId(Config.APP_BUNDLE_ID_IOS)
    .ios.setBundleId(Config.APP_BUNDLE_ID_IOS);
  // .ios.setCustomScheme(Config.DYNAMIC_LINK_SCHEME);
  // console.log(link);

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
