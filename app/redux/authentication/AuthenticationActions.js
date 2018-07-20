import firebase from 'react-native-firebase';
import { AccessToken } from 'react-native-fbsdk';
import { RNSKBucket } from 'react-native-swiss-knife';
import {
  ts,
  getUserId,
} from '../../lib/FirebaseHelpers';

// Action Types
export const types = {
  SIGNED_IN: 'SIGNED_IN',
  SIGN_OUT_USER: 'SIGN_OUT_USER',
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAIL: 'AUTH_FAIL',
  ACCESS_TOKEN_STATUS: 'ACCESS_TOKEN_STATUS',
  ACCESS_TOKEN_SAVED: 'ACCESS_TOKEN_SAVED',
  FACEBOOK_AUTH_TAP: 'FACEBOOK_AUTH_TAP',
  FACEBOOK_AUTH_START: 'FACEBOOK_AUTH_START',
  FACEBOOK_AUTH_SUCCESS: 'FACEBOOK_AUTH_SUCCESS',
  AUTH_TOKEN_START: 'AUTH_TOKEN_START',
  AUTH_TOKEN_SUCCESS: 'AUTH_TOKEN_SUCCESS',
  CURRENT_USER_START: 'CURRENT_USER_START',
  CURRENT_USER_SUCCESS: 'CURRENT_USER_SUCCESS',
  UPDATE_USER_START: 'UPDATE_USER_START',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
}

// Helper Functions
const appGroup = 'group.shayr';

const storeAccessToken = (token) => {
  RNSKBucket.set('accessToken', token, appGroup);
}

export const retrieveAccessToken = () => {
  return RNSKBucket.get('accessToken', appGroup);
}

export const getFBToken = (error, result) => {
  if (error) {
    console.error("login has error: " + result.error);
  } else if (result.isCancelled) {
    console.log("login is cancelled.");
  } else {
    const tokenData = AccessToken.getCurrentAccessToken()
    if (!tokenData) {
      throw new Error('Something went wrong obtaining the users access token');
    }
    return tokenData;
  }
}

const getAuthCredential = (token) => {
  return firebase.auth.FacebookAuthProvider.credential(token);
}

const getCurrentUser = (credential) => {
  return firebase.auth().signInAndRetrieveDataWithCredential(credential);
}

export const saveUserInfo = (user, data) => {
  const ref = firebase.firestore().collection('users').doc(getUserId(user));
  return ref
    .get()
    .then((doc) => {
      if (!doc.exists) {
        ref.set({
          createdAt: ts,
          updatedAt: ts,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email
        })
      } else {
        ref.set({
          updatedAt: ts,
        }, {
          merge: true
        })
      }
      console.log('saveUserInfo success');
    })
    .catch((error) => {
      console.error(error);
    });
}

// Action Creators
export function signedIn() {
  return {
    type: types.SIGNED_IN
  }
}

export function authUser(user) {
  return {
    type: types.AUTH_SUCCESS,
    payload: user
  }
}

export function facebookAuthTap() {
  return {
    type: types.FACEBOOK_AUTH_TAP
  }
}

export function facebookAuth(error, result) {
  return async function(dispatch) {
    try {
      dispatch({ type: types.FACEBOOK_AUTH_START });
      const tokenData = await getFBToken(error, result);
      dispatch({ type: types.FACEBOOK_AUTH_SUCCESS });

      storeAccessToken(tokenData.accessToken);
      dispatch({ type: types.ACCESS_TOKEN_SAVED });

      dispatch({ type: types.AUTH_TOKEN_START });
      const credential = getAuthCredential(tokenData.accessToken);
      dispatch({ type: types.AUTH_TOKEN_SUCCESS });

      dispatch({ type: types.CURRENT_USER_START });
      const currentUser = await getCurrentUser(credential);
      dispatch({ type: types.CURRENT_USER_SUCCESS });

      dispatch({ type: types.UPDATE_USER_START });
      await saveUserInfo(currentUser.user, currentUser.additionalUserInfo.profile);
      dispatch({ type: types.UPDATE_USER_SUCCESS });
    } catch (e) {
      console.error(e);
      dispatch({
        type: types.AUTH_FAIL,
        payload: e
      });
    }
  }
}

export function locateAccessToken() {
  const token = retrieveAccessToken();

  return {
    type: types.ACCESS_TOKEN_STATUS,
    payload: token ? true : false
  }
}

export function signOutUser() {
  return function(dispatch) {
    firebase.auth().signOut()
      .then(() =>{
        dispatch({ type: types.SIGN_OUT_USER });
      })
      .catch((e) => {
        console.error(e);
        return e
      });
  }
}

export function authSubscription() {
  return function(dispatch) {
    dispatch({ type: types.AUTH_START });
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(authUser(user))
      // } else {
      //   dispatch(signOutUser())
      }
    });
  }
}
