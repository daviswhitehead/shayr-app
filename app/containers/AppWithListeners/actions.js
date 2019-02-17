import firebase from 'react-native-firebase';
import { retrieveToken } from '../../lib/AppGroupTokens';
import { ts } from '../../lib/FirebaseHelpers';

export const types = {
  // SUBSCRIPTIONS
  // // SELF
  SUBSCRIBE_SELF_START: 'SUBSCRIBE_SELF_START',
  SUBSCRIBE_SELF_SUCCESS: 'SUBSCRIBE_SELF_SUCCESS',
  SUBSCRIBE_SELF_FAIL: 'SUBSCRIBE_SELF_FAIL',
  // // FRIENDSHIPS
  SUBSCRIBE_FRIENDSHIPS_START: 'SUBSCRIBE_FRIENDSHIPS_START',
  SUBSCRIBE_FRIENDSHIPS_SUCCESS: 'SUBSCRIBE_FRIENDSHIPS_SUCCESS',
  SUBSCRIBE_FRIENDSHIPS_FAIL: 'SUBSCRIBE_FRIENDSHIPS_FAIL',
  // // FRIENDS
  SUBSCRIBE_FRIENDS_START: 'SUBSCRIBE_FRIENDS_START',
  SUBSCRIBE_FRIENDS_SUCCESS: 'SUBSCRIBE_FRIENDS_SUCCESS',
  SUBSCRIBE_FRIENDS_FAIL: 'SUBSCRIBE_FRIENDS_FAIL',
  // // NOTIFICATION_TOKEN
  SUBSCRIBE_NOTIFICATION_TOKEN_START: 'SUBSCRIBE_NOTIFICATION_TOKEN_START',
  SUBSCRIBE_NOTIFICATION_TOKEN_SUCCESS: 'SUBSCRIBE_NOTIFICATION_TOKEN_SUCCESS',
  SUBSCRIBE_NOTIFICATION_TOKEN_FAIL: 'SUBSCRIBE_NOTIFICATION_TOKEN_FAIL',

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
  // need to listen to changes to notification token here

  // LISTENERS READY
  ARE_LISTENERS_READY: 'ARE_LISTENERS_READY',
};

// SUBSCRIPTIONS
let selfSubscription = () => {};
const subscribeToSelf = (dispatch, userId) => {
  dispatch({ type: types.SUBSCRIBE_SELF_START });
  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .onSnapshot(
      async (documentSnapshot) => {
        const self = {};
        self[userId] = await documentSnapshot.data();
        await dispatch({
          type: types.SUBSCRIBE_SELF_SUCCESS,
          self,
        });
      },
      (error) => {
        console.error(error);
        dispatch({
          type: types.SUBSCRIBE_SELF_FAIL,
          error,
        });
      },
    );
};

let friendshipsSubscription = () => {};
const subscribeToFriendships = (dispatch, userId) => {
  dispatch({ type: types.SUBSCRIBE_FRIENDSHIPS_START });
  return firebase
    .firestore()
    .collection('friends')
    .where('userIds', 'array-contains', userId)
    .where('status', '==', 'accepted')
    .onSnapshot(
      async (querySnapshot) => {
        // data on a users friendships status
        const friendships = {};
        // array of friend promises to get
        const friendsToGet = [];

        // fill in friendships and friendsToGet
        querySnapshot.forEach((doc) => {
          const friendshipData = doc.data();
          friendships[doc.id] = friendshipData;
          const friendId = userId === friendshipData.initiatingUserId
            ? friendshipData.receivingUserId
            : friendshipData.initiatingUserId;
          friendsToGet.push(
            firebase
              .firestore()
              .collection('users')
              .doc(friendId)
              .get(),
          );
        });

        // get friends
        dispatch({ type: types.SUBSCRIBE_FRIENDS_START });
        const friends = await Promise.all(friendsToGet)
          .then((friendsList) => {
            const friendsData = {};
            Object.values(friendsList).forEach((friend) => {
              friendsData[friend.id] = friend.data();
            });

            return friendsData;
          })
          .catch((error) => {
            dispatch({
              type: types.SUBSCRIBE_FRIENDS_FAIL,
              error,
            });
            return false;
          });
        dispatch({
          type: types.SUBSCRIBE_FRIENDSHIPS_SUCCESS,
          friendships,
        });
        dispatch({
          type: types.SUBSCRIBE_FRIENDS_SUCCESS,
          friends,
        });
      },
      (error) => {
        console.error(error);
        dispatch({
          type: types.SUBSCRIBE_FRIENDSHIPS_FAIL,
          error,
        });
      },
    );
};

let notificationTokenSubscription = () => {};
const subscribeNotificationTokenRefresh = (dispatch, userId) => {
  dispatch({ type: types.SUBSCRIBE_NOTIFICATION_TOKEN_START });

  return firebase.messaging().onTokenRefresh(notificationToken => firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .update({ pushToken: notificationToken, updatedAt: ts })
    .then(() => {
      dispatch({ type: types.SUBSCRIBE_NOTIFICATION_TOKEN_SUCCESS });
      return true;
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: types.SUBSCRIBE_NOTIFICATION_TOKEN_FAIL, error });
      return false;
    }));
};

// AUTHENTICATION
export function authSubscription() {
  return function _authSubscription(dispatch) {
    dispatch({ type: types.AUTH_LISTENER_START });
    return firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        selfSubscription = await subscribeToSelf(dispatch, user.uid);
        friendshipsSubscription = await subscribeToFriendships(dispatch, user.uid);
        notificationTokenSubscription = await subscribeNotificationTokenRefresh(dispatch, user.uid);

        dispatch({
          type: types.AUTH_STATUS,
          isAuthenticated: true,
          user,
        });
      } else {
        selfSubscription();
        friendshipsSubscription();
        notificationTokenSubscription();

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

// LISTENERS READY
export const areListenersReady = areReady => ({
  type: types.ARE_LISTENERS_READY,
  listenersReady: areReady,
});
