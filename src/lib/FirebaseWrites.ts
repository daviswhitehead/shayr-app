import { documentId } from '@daviswhitehead/shayr-resources';
import firebase from 'react-native-firebase';
import { arrayRemove, arrayUnion, increment, ts } from './FirebaseHelpers';

export type writeType =
  // Post Actions
  | 'TOGGLE_ADD_DONE_POST'
  | 'TOGGLE_SHARE_POST'
  | 'TOGGLE_LIKE_POST'
  // Sharing
  | 'START_SHARE_POST'
  | 'CONFIRM_SHARE_POST'
  | 'CANCEL_SHARE_POST'
  // Commenting
  | 'CREATE_COMMENT_POST'
  | 'DELETE_COMMENT_POST'
  | 'CREATE_REPLY_COMMENT_POST'
  // Friending
  | 'SEND_FRIEND_REQUEST'
  | 'ACCEPT_FRIEND_REQUEST'
  | 'REJECT_FRIEND_REQUEST'
  | 'DELETE_FRIEND';

export const wrapAnalytics = (label: string, func: (...args: any[]) => any) => {
  firebase.analytics().logEvent(`${label}`.toUpperCase());
  func();
};

export type countActions =
  | 'adds'
  | 'comments'
  | 'dones'
  | 'likes'
  | 'mentions'
  | 'replies'
  | 'shares';

export const updateCounts = (
  batcher: any,
  isIncremental: boolean,
  action: countActions,
  postId: documentId,
  ownerUserId: documentId,
  userId: documentId
) => {
  // posts/{postId} { {action}Count: +1 }
  batcher.set(
    firebase
      .firestore()
      .collection('posts')
      .doc(postId),
    {
      [`${action}Count`]: increment(isIncremental ? 1 : -1),
      updatedAt: ts
    },
    {
      merge: true
    }
  );
  // users_posts/{ownerUserId}_{postId} { {action}Count: +1, {action}: +{userId} }
  batcher.set(
    firebase
      .firestore()
      .collection('users_posts')
      .doc(`${ownerUserId}_${postId}`),
    {
      [`${action}Count`]: increment(isIncremental ? 1 : -1),
      [`${action}`]: isIncremental ? arrayUnion(userId) : arrayRemove(userId),
      updatedAt: ts
    },
    {
      merge: true
    }
  );
  if (ownerUserId !== userId) {
    // users_posts/{userId}_{postId} { {action}Count: +1, {action}: +{userId} }
    batcher.set(
      firebase
        .firestore()
        .collection('users_posts')
        .doc(`${userId}_${postId}`),
      {
        [`${action}Count`]: increment(isIncremental ? 1 : -1),
        [`${action}`]: isIncremental ? arrayUnion(userId) : arrayRemove(userId),
        updatedAt: ts
      },
      {
        merge: true
      }
    );
  }
  // users/{userId} { {action}Count: +1 }
  batcher.set(
    firebase
      .firestore()
      .collection('users')
      .doc(userId),
    {
      [`${action}Count`]: increment(isIncremental ? 1 : -1),
      updatedAt: ts
    },
    {
      merge: true
    }
  );
};

export const overwriteUserCounts = (
  batcher: any,
  action: countActions,
  userId: documentId,
  value: number
) => {
  // users/{userId} { {action}Count: {value} }
  batcher.set(
    firebase
      .firestore()
      .collection('users')
      .doc(userId),
    {
      [`${action}Count`]: value,
      updatedAt: ts
    },
    {
      merge: true
    }
  );
};
