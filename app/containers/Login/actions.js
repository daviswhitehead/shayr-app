import firebase from 'react-native-firebase';
import { getFBToken, logoutFB } from '../../lib/FacebookLogin';
import { getCurrentUser, signOut, getFBAuthCredential } from '../../lib/FirebaseLogin';
import { storeToken } from '../../lib/AppGroupTokens';
import { ts } from '../../lib/FirebaseHelpers';

export const types = {
  // SIGN OUT
  SIGN_OUT_USER: 'SIGN_OUT_USER',
  FACEBOOK_SIGN_OUT_START: 'FACEBOOK_SIGN_OUT_START',
  FACEBOOK_SIGN_OUT_SUCCESS: 'FACEBOOK_SIGN_OUT_SUCCESS',
  APP_SIGN_OUT_START: 'APP_SIGN_OUT_START',
  APP_SIGN_OUT_SUCCESS: 'APP_SIGN_OUT_SUCCESS',

  // TOKEN
  ACCESS_TOKEN_SAVED: 'ACCESS_TOKEN_SAVED',

  // FACEBOOK LOGIN
  FACEBOOK_AUTH_TAP: 'FACEBOOK_AUTH_TAP',
  FACEBOOK_AUTH_START: 'FACEBOOK_AUTH_START',
  FACEBOOK_AUTH_SUCCESS: 'FACEBOOK_AUTH_SUCCESS',
  FACEBOOK_CREDENTIAL_START: 'FACEBOOK_CREDENTIAL_START',
  FACEBOOK_CREDENTIAL_SUCCESS: 'FACEBOOK_CREDENTIAL_SUCCESS',
  CURRENT_USER_START: 'CURRENT_USER_START',
  CURRENT_USER_SUCCESS: 'CURRENT_USER_SUCCESS',
  SAVE_USER_START: 'SAVE_USER_START',
  SAVE_USER_SUCCESS: 'SAVE_USER_SUCCESS',

  // NOTIFICATIONS
  NOTIFICATION_PERMISSIONS_REQUEST_START: 'NOTIFICATION_PERMISSIONS_REQUEST_START',
  NOTIFICATION_PERMISSIONS_REQUEST_SUCCESS: 'NOTIFICATION_PERMISSIONS_REQUEST_SUCCESS',
  NOTIFICATION_PERMISSIONS_REQUEST_FAIL: 'NOTIFICATION_PERMISSIONS_REQUEST_FAIL',
};

export const requestNotificationPermissions = async () => {
  if (!(await firebase.messaging().hasPermission())) {
    try {
      await firebase.messaging().requestPermission();
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return firebase.messaging().getToken();
};

export const saveUser = async (user, data) => {
  const ref = firebase
    .firestore()
    .collection('users')
    .doc(user.uid);
  return ref
    .get()
    .then((doc) => {
      if (!doc.exists) {
        ref.set({
          createdAt: ts,
          updatedAt: ts,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          facebookProfilePhoto: user._user.photoURL,
        });
      } else {
        ref.set(
          {
            updatedAt: ts,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            facebookProfilePhoto: user._user.photoURL,
          },
          {
            merge: true,
          },
        );
      }
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};

export function facebookAuthTap() {
  return {
    type: types.FACEBOOK_AUTH_TAP,
  };
}

export function facebookAuth(error, result) {
  return async function _facebookAuth(dispatch) {
    try {
      dispatch({ type: types.FACEBOOK_AUTH_START });
      const tokenData = await getFBToken(error, result);
      dispatch({ type: types.FACEBOOK_AUTH_SUCCESS });

      storeToken('accessToken', tokenData.accessToken);
      dispatch({ type: types.ACCESS_TOKEN_SAVED, hasAccessToken: true });

      dispatch({ type: types.FACEBOOK_CREDENTIAL_START });
      const credential = getFBAuthCredential(tokenData.accessToken);
      dispatch({ type: types.FACEBOOK_CREDENTIAL_SUCCESS });

      dispatch({ type: types.CURRENT_USER_START });
      const currentUser = await getCurrentUser(credential);
      dispatch({ type: types.CURRENT_USER_SUCCESS });

      dispatch({ type: types.SAVE_USER_START });
      await saveUser(currentUser.user, currentUser.additionalUserInfo.profile);
      dispatch({ type: types.SAVE_USER_SUCCESS });

      dispatch({ type: types.NOTIFICATION_PERMISSIONS_REQUEST_START });
      const token = await requestNotificationPermissions();

      if (token) {
        dispatch({ type: types.NOTIFICATION_PERMISSIONS_REQUEST_SUCCESS });
      } else {
        dispatch({ type: types.NOTIFICATION_PERMISSIONS_REQUEST_FAIL });
      }
    } catch (e) {
      console.error(e);
      dispatch({
        type: types.AUTH_FAIL,
        error: e,
      });
    }
  };
}

export function signOutUser() {
  return async function _signOutUser(dispatch) {
    try {
      dispatch({ type: types.APP_SIGN_OUT_START });
      await signOut();
      dispatch({ type: types.APP_SIGN_OUT_SUCCESS });

      dispatch({ type: types.FACEBOOK_SIGN_OUT_START });
      await logoutFB();
      dispatch({ type: types.FACEBOOK_SIGN_OUT_SUCCESS });
    } catch (e) {
      console.error(e);
      dispatch({
        type: types.AUTH_FAIL,
        error: e,
      });
    }
  };
}
