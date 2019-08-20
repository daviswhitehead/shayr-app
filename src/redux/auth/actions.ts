import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { retrieveToken, saveToken } from '../../lib/AppGroupTokens';
import { getFBProfile, getFBToken, logoutFB } from '../../lib/FacebookRequests';
import { userAnalytics } from '../../lib/FirebaseAnalytics';
import { ts } from '../../lib/FirebaseHelpers';
import {
  getCurrentUser,
  getFBAuthCredential,
  signOut
} from '../../lib/FirebaseLogin';
import { navigate } from '../../lib/ReactNavigationHelpers';
import { requestNotificationPermissionsRedux } from '../notifications/actions';

export const types = {
  // AUTHENTICATION LISTENER
  AUTH_LISTENER_START: 'AUTH_LISTENER_START',
  AUTH_STATUS: 'AUTH_STATUS',

  // TOKEN
  ACCESS_TOKEN_STATUS: 'ACCESS_TOKEN_STATUS',
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

  // SIGN OUT
  SIGN_OUT_START: 'SIGN_OUT_START',
  FACEBOOK_SIGN_OUT_START: 'FACEBOOK_SIGN_OUT_START',
  FACEBOOK_SIGN_OUT_SUCCESS: 'FACEBOOK_SIGN_OUT_SUCCESS',
  APP_SIGN_OUT_START: 'APP_SIGN_OUT_START',
  APP_SIGN_OUT_SUCCESS: 'APP_SIGN_OUT_SUCCESS',
  SIGN_OUT_SUCCESS: 'SIGN_OUT_SUCCESS',
  SIGN_OUT_FAIL: 'SIGN_OUT_FAIL'
};

// AUTHENTICATION LISTENERS
export const authSubscription = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: types.AUTH_LISTENER_START });
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: types.AUTH_STATUS,
          user,
          isSigningOut: false
        });

        // identify user in analytics events
        userAnalytics(user.uid);
      } else {
        dispatch({
          type: types.AUTH_STATUS,
          user: {}
        });
      }
    });
  };
};

// TOKEN
export function hasAccessToken() {
  return async function _hasAccessToken(dispatch) {
    const token = await retrieveToken('accessToken');
    dispatch({
      type: types.ACCESS_TOKEN_STATUS,
      hasAccessToken: !!token
    });
  };
}

// FACEBOOK LOGIN
const saveUser = async (user, data, FBProfile) => {
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
          facebookId: FBProfile.id,
          facebookProfilePhoto: `https://graph.facebook.com/${
            FBProfile.id
          }/picture?type=large`
        });
      } else {
        ref.set(
          {
            updatedAt: ts,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            facebookId: FBProfile.id,
            facebookProfilePhoto: `https://graph.facebook.com/${
              FBProfile.id
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

// FACEBOOK LOGIN
export function facebookAuthTap() {
  return {
    type: types.FACEBOOK_AUTH_TAP
  };
}

// FACEBOOK LOGIN
export function facebookAuth(error, result) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: types.FACEBOOK_AUTH_START });
      const currentAccessToken = await getFBToken(error, result);
      if (!currentAccessToken) throw new Error('undefined access token');
      dispatch({ type: types.FACEBOOK_AUTH_SUCCESS });

      const FBProfile = await getFBProfile(currentAccessToken.accessToken);

      saveToken('accessToken', currentAccessToken.accessToken);
      dispatch({ type: types.ACCESS_TOKEN_SAVED, hasAccessToken: true });

      dispatch({ type: types.FACEBOOK_CREDENTIAL_START });
      const credential = getFBAuthCredential(currentAccessToken.accessToken);
      dispatch({ type: types.FACEBOOK_CREDENTIAL_SUCCESS });

      dispatch({ type: types.CURRENT_USER_START });
      const currentUser = await getCurrentUser(credential);
      dispatch({ type: types.CURRENT_USER_SUCCESS });

      dispatch({ type: types.SAVE_USER_START });
      await saveUser(
        currentUser.user,
        currentUser.additionalUserInfo.profile,
        FBProfile
      );
      dispatch({ type: types.SAVE_USER_SUCCESS });

      await requestNotificationPermissionsRedux(currentUser.user.uid, dispatch);
    } catch (e) {
      console.error(e);
      dispatch({
        type: types.AUTH_FAIL,
        error: e
      });
    }
  };
}

// SIGN OUT
export const startSignOut = () => (dispatch: Dispatch) => {
  dispatch({ type: types.SIGN_OUT_START, isSigningOut: true });
  navigate('Login', {});
};

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
        error
      });
    }
  };
}
