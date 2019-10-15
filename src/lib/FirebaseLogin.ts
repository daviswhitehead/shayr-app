import _ from 'lodash';
import { AccessToken } from 'react-native-fbsdk';
import firebase, { AuthCredential } from 'react-native-firebase';
import { getFacebookEmail, loginFacebook } from './FacebookRequests';

export const fetchSignInMethodsForEmail = async (email: string) => {
  try {
    const signInMethods = await firebase
      .auth()
      .fetchSignInMethodsForEmail(email);
    if (signInMethods[0] === 'password') {
      return {
        method: 'password',
        message: 'Please sign in with email!'
      };
    }
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signInWithCredential = async (
  credential: AuthCredential,
  email?: string
) => {
  try {
    const user = await firebase.auth().signInWithCredential(credential);
    return {
      isSuccessful: true,
      user
    };
  } catch (error) {
    if (
      error.code === 'auth/account-exists-with-different-credential' &&
      email
    ) {
      const signInMethodNeeded = await fetchSignInMethodsForEmail(email);
      if (signInMethodNeeded) {
        return {
          isSuccessful: false,
          needsLink: true,
          credential,
          message: signInMethodNeeded.message,
          method: signInMethodNeeded.method
        };
      }
    }
    console.error(error);
    throw error;
  }
};

export const getFacebookAuthCredential = (accessToken: AccessToken) =>
  firebase.auth.FacebookAuthProvider.credential(accessToken.accessToken);

export const signOut = () => {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }
};

interface LoginResult {
  isSuccessful: boolean;
  user?: any;
  needsLink?: boolean;
  credential?: AuthCredential;
  message?: string;
  method?: string;
}
// type LoginResult = LoginResultSuccess | LoginResultLinkNeeded | LoginResultFail;

export const loginWithFacebook = async (): Promise<LoginResult> => {
  try {
    const accessToken = await loginFacebook();
    console.log('accessToken');
    console.log(accessToken);

    const email = accessToken && (await getFacebookEmail(accessToken));
    console.log('email');
    console.log(email);

    const credential = accessToken && getFacebookAuthCredential(accessToken);
    console.log('credential');
    console.log(credential);

    const result =
      credential && (await signInWithCredential(credential, email));
    console.log('result');
    console.log(result);
    return result
      ? result
      : {
          isSuccessful: false,
          needsLink: false
        };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
