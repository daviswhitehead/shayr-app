import { ts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import { AccessToken } from 'react-native-fbsdk';
import firebase, { AuthCredential } from 'react-native-firebase';
import { UserCredential } from 'react-native-firebase/auth';
import { saveToken } from './AppGroupTokens';
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

export const getFacebookAuthCredential = (accessToken: string) =>
  firebase.auth.FacebookAuthProvider.credential(accessToken);

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

export const loginWithFacebook = async (): Promise<LoginResult> => {
  try {
    const accessToken = await loginFacebook();

    const email = accessToken && (await getFacebookEmail(accessToken));

    accessToken && saveToken('accessToken', accessToken);

    const credential = accessToken && getFacebookAuthCredential(accessToken);

    const result =
      credential && (await signInWithCredential(credential, email));

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

export const saveUser = async (userCredential: UserCredential) => {
  const profile = userCredential.additionalUserInfo.profile;

  const ref = firebase
    .firestore()
    .collection('users')
    .doc(userCredential.user.uid);
  return ref
    .get()
    .then((doc) => {
      if (!doc.exists) {
        ref.set({
          createdAt: ts(firebase.firestore),
          updatedAt: ts(firebase.firestore),
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          facebookId: profile.id,
          facebookProfilePhoto: `https://graph.facebook.com/${
            profile.id
          }/picture?type=large`
        });
      } else {
        ref.set(
          {
            updatedAt: ts(firebase.firestore),
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: profile.email,
            facebookId: profile.id,
            facebookProfilePhoto: `https://graph.facebook.com/${
              profile.id
            }/picture?type=large`
          },
          {
            merge: true
          }
        );
      }
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};
