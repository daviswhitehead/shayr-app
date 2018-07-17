import firebase from 'react-native-firebase';
import { retrieveAccessToken } from '../../lib/Authentication'

export const types = {
  AUTH_USER: 'AUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  SIGN_OUT_USER: 'SIGN_OUT_USER',
  ACCESS_TOKEN_STORED: 'ACCESS_TOKEN_STORED',
  FACEBOOK_TOKEN_REQUEST: 'FACEBOOK_TOKEN_REQUEST',
  FACEBOOK_TOKEN_SUCCESS: 'FACEBOOK_TOKEN_SUCCESS',
  FACEBOOK_TOKEN_FAIL: 'FACEBOOK_TOKEN_FAIL',
  AUTH_TOKEN_REQUEST: 'AUTH_TOKEN_REQUEST',
  AUTH_TOKEN_SUCCESS: 'AUTH_TOKEN_SUCCESS',
  AUTH_TOKEN_FAIL: 'AUTH_TOKEN_FAIL',
  CURRENT_USER_TOKEN_REQUEST: 'CURRENT_USER_TOKEN_REQUEST',
  CURRENT_USER_TOKEN_SUCCESS: 'CURRENT_USER_TOKEN_SUCCESS',
  CURRENT_USER_TOKEN_FAIL: 'CURRENT_USER_TOKEN_FAIL',
}

export function authUser() {
  return {
    type: types.AUTH_USER
  }
}

export function facebookTokenRequest() {
  return {
    type: types.FACEBOOK_TOKEN_REQUEST
  }
}

export function facebookTokenSuccess() {
  return {
    type: types.FACEBOOK_TOKEN_SUCCESS
  }
}

export function locateAccessToken() {
  const token = retrieveAccessToken();

  return {
    type: types.ACCESS_TOKEN_STORED,
    payload: token ? true : false
  }
}

export function authError(error) {
  return {
    type: types.AUTH_ERROR,
    payload: error
  }
}

export function signOutUser() {
  return function(dispatch) {
    firebase.auth().signOut()
      .then(() =>{
        dispatch({
          type: types.SIGN_OUT_USER
        })
      });
  }
}

export function authSubscription() {
  return function(dispatch) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(authUser())
      } else {
        dispatch(signOutUser())
      }
    });
  }
}
