import firebase from 'react-native-firebase';
import { requestNotificationPermissions } from '../../lib/Notifications';
import { ts } from '../../lib/FirebaseHelpers';

export const types = {
  // PERMISSIONS
  NOTIFICATION_PERMISSIONS_REQUEST_START: 'NOTIFICATION_PERMISSIONS_REQUEST_START',
  NOTIFICATION_PERMISSIONS_REQUEST_SUCCESS: 'NOTIFICATION_PERMISSIONS_REQUEST_SUCCESS',
  NOTIFICATION_PERMISSIONS_REQUEST_FAIL: 'NOTIFICATION_PERMISSIONS_REQUEST_FAIL',

  // HANDLING
  NOTIFICATION_TAPPED: 'NOTIFICATION_TAPPED',
  NOTIFICATION_NAVIGATION_PROCESSED: 'NOTIFICATION_NAVIGATION_PROCESSED',
  NOTIFICATION_SUCCESS: 'NOTIFICATION_SUCCESS',
  NOTIFICATION_FAIL: 'NOTIFICATION_FAIL',

  // NOTIFICATION TOKEN REFRESH
  SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_START: 'SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_START',
  SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_SUCCESS: 'SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_SUCCESS',
  SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_FAIL: 'SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_FAIL',
};

// PERMISSIONS
export const requestNotificationPermissionsRedux = async (dispatch) => {
  dispatch({ type: types.NOTIFICATION_PERMISSIONS_REQUEST_START });
  const token = await requestNotificationPermissions();

  if (token) {
    dispatch({ type: types.NOTIFICATION_PERMISSIONS_REQUEST_SUCCESS });
  } else {
    dispatch({ type: types.NOTIFICATION_PERMISSIONS_REQUEST_FAIL });
  }
};

// HANDLING
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

// NOTIFICATION TOKEN REFRESH
export const subscribeNotificationTokenRefresh = userId => function _subscribeNotificationTokenRefresh(dispatch) {
  dispatch({ type: types.SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_START });

  return firebase.messaging().onTokenRefresh(notificationToken => firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .update({ pushToken: notificationToken, updatedAt: ts })
    .then(() => {
      dispatch({ type: types.SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_SUCCESS });
      return true;
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: types.SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_FAIL, error });
      return false;
    }));
};
