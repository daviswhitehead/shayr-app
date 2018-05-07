import firebase from 'react-native-firebase';
import { AccessToken } from 'react-native-fbsdk';
import { RNSKBucket } from 'react-native-swiss-knife';

const appGroup = 'group.shayr';

export const getFBToken = (error, result) => {
  if (error) {
    console.error("login has error: " + result.error);
  } else if (result.isCancelled) {
    console.log("login is cancelled.");
  } else {
    const tokenData = AccessToken.getCurrentAccessToken();
    if (!tokenData) {
      throw new Error('Something went wrong obtaining the users access token');
    }
    return tokenData;
  }
}

export const getAuthCredential = (token) => {
  return firebase.auth.FacebookAuthProvider.credential(token);
}

export const getCurrentUser = (credential) => {
  return firebase.auth().signInAndRetrieveDataWithCredential(credential);
}

export const storeAccessToken = (token) => {
  RNSKBucket.set('accessToken', token, appGroup);
}

export const retrieveAccessToken = () => {
  return RNSKBucket.get('accessToken', appGroup);
}
