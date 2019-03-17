import firebase from 'react-native-firebase';
import { getFBToken, logoutFB } from '../../lib/FacebookLogin';
import { getCurrentUser, signOut, getFBAuthCredential } from '../../lib/FirebaseLogin';
import { saveToken, retrieveToken } from '../../lib/AppGroupTokens';
import { ts } from '../../lib/FirebaseHelpers';
import { requestNotificationPermissionsRedux } from '../notifications/actions';

export const types = {
  // AUTHENTICATION LISTENER
  AUTH_LISTENER_START: 'AUTH_LISTENER_START',
  AUTH_STATUS: 'AUTH_STATUS',

  // TOKEN
  ACCESS_TOKEN_STATUS: 'ACCESS_TOKEN_STATUS',
  ACCESS_TOKEN_SAVED: 'ACCESS_TOKEN_SAVED',

  // LISTENERS READY
  ARE_LISTENERS_READY: 'ARE_LISTENERS_READY',

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

  // SIGN OUT
  SIGN_OUT_START: 'SIGN_OUT_START',
  FACEBOOK_SIGN_OUT_START: 'FACEBOOK_SIGN_OUT_START',
  FACEBOOK_SIGN_OUT_SUCCESS: 'FACEBOOK_SIGN_OUT_SUCCESS',
  APP_SIGN_OUT_START: 'APP_SIGN_OUT_START',
  APP_SIGN_OUT_SUCCESS: 'APP_SIGN_OUT_SUCCESS',
  SIGN_OUT_SUCCESS: 'SIGN_OUT_SUCCESS',
  SIGN_OUT_FAIL: 'SIGN_OUT_FAIL',
};

// AUTHENTICATION LISTENERS
export function authSubscription() {
  return function _authSubscription(dispatch) {
    dispatch({ type: types.AUTH_LISTENER_START });
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: types.AUTH_STATUS,
          user,
          isAuthenticated: true,
          isSigningOut: false,
        });
      } else {
        dispatch({
          type: types.AUTH_STATUS,
          isAuthenticated: false,
          user: null,
        });
      }
    });
  };
}

// TOKEN
export function hasAccessToken() {
  return async function _hasAccessToken(dispatch) {
    const token = await retrieveToken('accessToken');
    dispatch({
      type: types.ACCESS_TOKEN_STATUS,
      hasAccessToken: !!token,
    });
  };
}

// LISTENERS READY
export const areListenersReady = areReady => ({
  type: types.ARE_LISTENERS_READY,
  listenersReady: areReady,
});

// FACEBOOK LOGIN
const saveUser = async (user, data) => {
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

// FACEBOOK LOGIN
export function facebookAuthTap() {
  return {
    type: types.FACEBOOK_AUTH_TAP,
  };
}

// FACEBOOK LOGIN
export function facebookAuth(error, result) {
  return async function _facebookAuth(dispatch) {
    try {
      dispatch({ type: types.FACEBOOK_AUTH_START });
      const tokenData = await getFBToken(error, result);
      dispatch({ type: types.FACEBOOK_AUTH_SUCCESS });

      saveToken('accessToken', tokenData.accessToken);
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

      await requestNotificationPermissionsRedux(currentUser.user.uid, dispatch);
    } catch (e) {
      console.error(e);
      dispatch({
        type: types.AUTH_FAIL,
        error: e,
      });
    }
  };
}

// SIGN OUT
export function startSignOut() {
  return { type: types.SIGN_OUT_START, isSigningOut: true };
}

// SIGN OUT
export function signOutUser() {
  return async function _signOutUser(dispatch) {
    try {
      dispatch({ type: types.APP_SIGN_OUT_START });
      await signOut();
      dispatch({ type: types.APP_SIGN_OUT_SUCCESS });

      dispatch({ type: types.FACEBOOK_SIGN_OUT_START });
      await logoutFB();
      dispatch({ type: types.FACEBOOK_SIGN_OUT_SUCCESS });

      dispatch({ type: types.SIGN_OUT_SUCCESS });
    } catch (error) {
      console.error(error);
      dispatch({
        type: types.SIGN_OUT_FAIL,
        error,
      });
    }
  };
}
