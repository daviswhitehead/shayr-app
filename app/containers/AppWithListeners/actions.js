import firebase from 'react-native-firebase';
import { retrieveToken } from '../../lib/AppGroupTokens';

export const types = {
  // AUTHENTICATION
  AUTH_LISTENER_START: 'AUTH_LISTENER_START',
  AUTH_STATUS: 'AUTH_STATUS',

  // TOKEN
  ACCESS_TOKEN_STATUS: 'ACCESS_TOKEN_STATUS',

  // NOTIFICATIONS
  NOTIFICATION_TAPPED: 'NOTIFICATION_TAPPED',
  NOTIFICATION_NAVIGATION_PROCESSED: 'NOTIFICATION_NAVIGATION_PROCESSED',
  NOTIFICATION_SUCCESS: 'NOTIFICATION_SUCCESS',
  NOTIFICATION_FAIL: 'NOTIFICATION_FAIL',
};

// AUTHENTICATION
export function authSubscription() {
  return function _authSubscription(dispatch) {
    dispatch({ type: types.AUTH_LISTENER_START });
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: types.AUTH_STATUS,
          isAuthenticated: true,
          user,
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
  const token = retrieveToken('accessToken');

  return {
    type: types.ACCESS_TOKEN_STATUS,
    hasAccessToken: !!token,
  };
}

// NOTIFICATIONS
export const saveNotificationNavigation = async (dispatch, notification) => {
  dispatch({ type: types.NOTIFICATION_TAPPED });

  try {
    if (notification.data.navigation === 'TRUE') {
      dispatch({
        type: types.NOTIFICATION_NAVIGATION_PROCESSED,
        payload: notification.data.postId,
      });
    }

    dispatch({ type: types.NOTIFICATION_SUCCESS });
  } catch (error) {
    dispatch({
      type: types.NOTIFICATION_FAIL,
      error,
    });
  }
};
