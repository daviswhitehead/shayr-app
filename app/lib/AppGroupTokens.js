import { RNSKBucket } from 'react-native-swiss-knife';

const appGroup = 'group.com.daviswhitehead.shayr.ios';

export const storeToken = (name = 'accessToken', token) => {
  RNSKBucket.set(name, token, appGroup);
};

export const retrieveToken = (name = 'accessToken') => RNSKBucket.get(name, appGroup);
