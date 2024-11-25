import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { retrieveToken } from '../../lib/AppGroupTokens';
import { setUser } from '../../lib/Bugsnag';
import { logoutFacebook } from '../../lib/FacebookRequests';
import { userAnalytics } from '../../lib/FirebaseAnalytics';
import { signOut } from '../../lib/FirebaseLogin';
import { navigate } from '../../lib/ReactNavigationHelpers';

export const types = {
  // AUTHENTICATION LISTENER
  AUTH_LISTENER_START: 'AUTH_LISTENER_START',
  AUTH_STATUS: 'AUTH_STATUS',
  AUTH_FAIL: 'AUTH_FAIL',

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
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: types.AUTH_STATUS,
          user,
          isSigningOut: false
        });

        // identify user in analytics and bug tracking
        userAnalytics(user.uid);
        setUser(user.uid);
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
  return async function _hasAccessToken(dispatch: Dispatch) {
    const token = await retrieveToken('accessToken');
    dispatch({
      type: types.ACCESS_TOKEN_STATUS,
      hasAccessToken: !!token
    });
  };
}

// SIGN OUT
export const startSignOut = () => (dispatch: Dispatch) => {
  dispatch({ type: types.SIGN_OUT_START, isSigningOut: true });
  navigate('Login', {});
};

// SIGN OUT
export function signOutUser() {
  return async function _signOutUser(dispatch: Dispatch) {
    try {
      dispatch({ type: types.APP_SIGN_OUT_START });
      await signOut();
      dispatch({ type: types.APP_SIGN_OUT_SUCCESS });

      dispatch({ type: types.FACEBOOK_SIGN_OUT_START });
      await logoutFacebook();
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
