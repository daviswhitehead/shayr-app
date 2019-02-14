import firebase from 'react-native-firebase';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { RNSKBucket } from 'react-native-swiss-knife';
import { ts, getUserId } from '../../lib/FirebaseHelpers';

export const types = {
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
  FACEBOOK_SIGN_OUT_START: 'FACEBOOK_SIGN_OUT_START',
  FACEBOOK_SIGN_OUT_SUCCESS: 'FACEBOOK_SIGN_OUT_SUCCESS',
  APP_SIGN_OUT_START: 'APP_SIGN_OUT_START',
  APP_SIGN_OUT_SUCCESS: 'APP_SIGN_OUT_SUCCESS',
  NOTIFICATION_PERMISSIONS_START: 'NOTIFICATION_PERMISSIONS_START',
  NOTIFICATION_PERMISSIONS_SUCCESS: 'NOTIFICATION_PERMISSIONS_SUCCESS',
  NOTIFICATION_PERMISSIONS_FAIL: 'NOTIFICATION_PERMISSIONS_FAIL',
};

const appGroup = 'group.com.daviswhitehead.shayr.ios';

const storeAccessToken = (token) => {
  RNSKBucket.set('accessToken', token, appGroup);
};

// Auth
export const retrieveAccessToken = () => RNSKBucket.get('accessToken', appGroup);

// Login
export const getFBToken = (error, result) => {
  if (error) {
    console.error(`login has error: ${result.error}`);
  } else if (result.isCancelled) {
    console.log('login is cancelled.');
  } else {
    const tokenData = AccessToken.getCurrentAccessToken();
    if (!tokenData) {
      throw new Error('Something went wrong obtaining the users access token');
    }
    return tokenData;
  }
};

// Login
export const getAuthCredential = token => firebase.auth.FacebookAuthProvider.credential(token);

// Login
export const getCurrentUser = credential => firebase.auth().signInAndRetrieveDataWithCredential(credential);

// Login
export const savePushToken = async (dispatch, user) => {
  dispatch({ type: types.NOTIFICATION_PERMISSIONS_START });
  if (!(await firebase.messaging().hasPermission())) {
    try {
      // requests push notification permissions from the user
      await firebase.messaging().requestPermission();
    } catch (e) {
      console.error(e);
      dispatch({
        type: types.NOTIFICATION_PERMISSIONS_FAIL,
        error: e,
      });
    }
  }

  // gets the device's push token
  const token = await firebase.messaging().getToken();

  // stores the token in the user's document
  return firebase
    .firestore()
    .collection('users')
    .doc(user.uid)
    .update({ pushToken: token, updatedAt: ts })
    .then((ref) => {
      console.log('savePushToken success');
      dispatch({ type: types.NOTIFICATION_PERMISSIONS_SUCCESS });
    })
    .catch((error) => {
      console.error(error);
    });
};

// Login
export const saveUserInfo = (user, data) => {
  const ref = firebase
    .firestore()
    .collection('users')
    .doc(getUserId(user));
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
      console.log('saveUserInfo success');
    })
    .catch((error) => {
      console.error(error);
    });
};

// Login
export function facebookAuthTap() {
  return {
    type: types.FACEBOOK_AUTH_TAP,
  };
}

// Login
export function facebookAuth(error, result) {
  return async function facebookAuthy(dispatch) {
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
        error: e,
      });
    }
  };
}

export function signOutUser() {
  return async function test(dispatch) {
    try {
      dispatch({ type: types.APP_SIGN_OUT_START });
      await firebase.auth().signOut();
      dispatch({ type: types.APP_SIGN_OUT_SUCCESS });

      dispatch({ type: types.FACEBOOK_SIGN_OUT_START });
      await LoginManager.logOut();
      dispatch({ type: types.FACEBOOK_SIGN_OUT_SUCCESS });
      dispatch({ type: types.SIGN_OUT_USER });
    } catch (e) {
      console.error(e);
      dispatch({
        type: types.AUTH_FAIL,
        error: e,
      });
    }
  };
}

// Auth
export function locateAccessToken() {
  const token = retrieveAccessToken();

  return {
    type: types.ACCESS_TOKEN_STATUS,
    payload: !!token,
  };
}

// Auth
export function authSubscription() {
  return function (dispatch) {
    dispatch({ type: types.AUTH_START });
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: types.AUTH_SUCCESS,
          payload: user,
        });
        savePushToken(dispatch, user);
        // } else {
        //   dispatch(signOutUser())
      }
    });
  };
}
