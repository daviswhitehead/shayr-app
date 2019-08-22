import { Batcher, ts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Query } from 'react-native-firebase/firestore';
import { Dispatch } from 'redux';
import { logEvent } from '../../lib/FirebaseAnalytics';
import {
  composeQuery,
  references,
  referenceTypes
} from '../../lib/FirebaseQueries';
import { requestNotificationPermissions } from '../../lib/Notifications';
import {
  getDocument,
  LastItem,
  subscribeToFeedOfDocuments
} from '../FirebaseRedux';

export const STATE_KEY = 'notifications';

export const types = {
  // PERMISSIONS
  NOTIFICATION_PERMISSIONS_REQUEST_START:
    'NOTIFICATION_PERMISSIONS_REQUEST_START',
  NOTIFICATION_PERMISSIONS_REQUEST_SUCCESS:
    'NOTIFICATION_PERMISSIONS_REQUEST_SUCCESS',
  NOTIFICATION_PERMISSIONS_REQUEST_FAIL:
    'NOTIFICATION_PERMISSIONS_REQUEST_FAIL',

  // NOTIFICATION TOKEN REFRESH
  SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_START:
    'SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_START',
  SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_SUCCESS:
    'SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_SUCCESS',
  SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_FAIL:
    'SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_FAIL',

  // MARK NOTIFICATIONS
  MARK_NOTIFICATION_AS_PRESSED_START: 'MARK_NOTIFICATION_AS_PRESSED_START',
  MARK_NOTIFICATION_AS_PRESSED_SUCCESS: 'MARK_NOTIFICATION_AS_PRESSED_SUCCESS',
  MARK_NOTIFICATION_AS_PRESSED_FAIL: 'MARK_NOTIFICATION_AS_PRESSED_FAIL',
  MARK_NOTIFICATION_AS_READ_START: 'MARK_NOTIFICATION_AS_READ_START',
  MARK_NOTIFICATION_AS_READ_SUCCESS: 'MARK_NOTIFICATION_AS_READ_SUCCESS',
  MARK_NOTIFICATION_AS_READ_FAIL: 'MARK_NOTIFICATION_AS_READ_FAIL'
};

const saveNotificationToken = async (userId: string, token: string) => {
  const didTokenUpdate = await firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .update({ pushToken: token, updatedAt: ts })
    .then(() => true)
    .catch((error) => {
      console.error(error);
      return false;
    });
  return didTokenUpdate;
};

// PERMISSIONS
export const requestNotificationPermissionsRedux = async (
  userId: string,
  dispatch: Dispatch
) => {
  dispatch({ type: types.NOTIFICATION_PERMISSIONS_REQUEST_START });
  const token = await requestNotificationPermissions();

  if (token) {
    dispatch({ type: types.NOTIFICATION_PERMISSIONS_REQUEST_SUCCESS });
    saveNotificationToken(userId, token);
  } else {
    dispatch({ type: types.NOTIFICATION_PERMISSIONS_REQUEST_FAIL });
  }
};

// NOTIFICATION TOKEN REFRESH
export const subscribeNotificationTokenRefresh = (userId: string) =>
  function _subscribeNotificationTokenRefresh(dispatch: Dispatch) {
    dispatch({ type: types.SUBSCRIBE_NOTIFICATION_TOKEN_REFRESH_START });
    requestNotificationPermissionsRedux(userId, dispatch);

    return firebase
      .messaging()
      .onTokenRefresh((notificationToken) =>
        saveNotificationToken(userId, notificationToken)
      );
  };

// LOAD NOTIFICATIONS
const requestLimiter = 10;
export const loadNotifications = (
  listKey: string,
  query: Query,
  shouldRefresh?: boolean,
  isLoading?: boolean,
  lastItem?: LastItem
) => (dispatch: Dispatch) => {
  const composedQuery: Query = composeQuery(
    query,
    requestLimiter,
    shouldRefresh ? undefined : lastItem
  );
  return subscribeToFeedOfDocuments(
    dispatch,
    STATE_KEY,
    listKey,
    composedQuery,
    shouldRefresh,
    isLoading,
    lastItem
  );
};

// MARK NOTIFICATIONS
export const markNotificationAsPressed = (notificationId: string) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: types.MARK_NOTIFICATION_AS_PRESSED_START
  });

  logEvent(types.MARK_NOTIFICATION_AS_PRESSED_START);

  try {
    const batcher = new Batcher(firebase.firestore());

    const time = ts(firebase.firestore);
    batcher.set(
      firebase
        .firestore()
        .collection('notifications')
        .doc(notificationId),
      {
        isPressed: true,
        pressedAt: time,
        isRead: true,
        readAt: time,
        updatedAt: time
      },
      {
        merge: true
      }
    );

    batcher.write();

    // getDocument(
    //   dispatch,
    //   STATE_KEY,
    //   references.get(referenceTypes.GET_DOCUMENT)(
    //     `notifications/${notificationId}`
    //   )
    // );

    dispatch({
      type: types.MARK_NOTIFICATION_AS_PRESSED_SUCCESS
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.MARK_NOTIFICATION_AS_PRESSED_FAIL,
      error
    });
  }
};

export const markNotificationsAsRead = (notificationIds: Array<string>) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: types.MARK_NOTIFICATION_AS_READ_START
  });

  logEvent(types.MARK_NOTIFICATION_AS_READ_START);

  try {
    const batcher = new Batcher(firebase.firestore());

    const time = ts(firebase.firestore);
    _.forEach(notificationIds, (notificationId: string) => {
      batcher.set(
        firebase
          .firestore()
          .collection('notifications')
          .doc(notificationId),
        {
          isRead: true,
          readAt: time,
          updatedAt: time
        },
        {
          merge: true
        }
      );
    });

    batcher.write();

    // getDocument(
    //   dispatch,
    //   STATE_KEY,
    //   references.get(referenceTypes.GET_DOCUMENT)(
    //     `notifications/${notificationId}`
    //   )
    // );

    dispatch({
      type: types.MARK_NOTIFICATION_AS_READ_SUCCESS
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.MARK_NOTIFICATION_AS_READ_FAIL,
      error
    });
  }
};
