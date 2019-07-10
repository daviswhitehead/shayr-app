import firebase from 'react-native-firebase';
import { DocumentSnapshot, Query } from 'react-native-firebase/firestore';
import { arrayRemove, arrayUnion, increment, ts } from './FirebaseHelpers';

export type writeType =
  // Queue
  | 'ADD_POST'
  | 'DONE_POST'
  | 'REMOVE_POST'
  | 'LIKE_POST'
  // Sharing
  | 'START_SHARE_POST'
  | 'CONFIRM_SHARE_POST'
  | 'CANCEL_SHARE_POST'
  // Commenting
  | 'COMMENT_POST'
  | 'REPLY_COMMENT'
  // Friending
  | 'SEND_FRIEND_REQUEST'
  | 'ACCEPT_FRIEND_REQUEST'
  | 'REJECT_FRIEND_REQUEST'
  | 'DELETE_FRIEND';

export const wrapAnalytics = (label: string, func: () => void) => {
  firebase.analytics().logEvent(`${label}`.toUpperCase());
  func();
};

export const writes = {
  ADD_POST: {
    type: 'ADD_POST',
    write: wrapAnalytics(
      'ADD_POST',
      () => async ({
        userId,
        postId,
        isAddBecomingActive,
        isDoneActive
      }: {
        userId: string;
        postId: string;
        isAddBecomingActive: boolean;
        isDoneActive: boolean;
      }) => {
        const batch = firebase.firestore().batch();
        // update users_posts
        batch.set(
          firebase
            .firestore()
            .collection('users_posts')
            .doc(`${userId}_${postId}`),
          {
            addCount: increment(isAddBecomingActive ? 1 : -1),
            adds: isAddBecomingActive
              ? arrayUnion(userId)
              : arrayRemove(userId),
            doneCount: increment(isAddBecomingActive && isDoneActive ? -1 : 0),
            dones: isAddBecomingActive
              ? arrayRemove(userId)
              : arrayUnion(userId),
            updatedAt: ts
          },
          { merge: true }
        );
        // update users object
        batch.set(
          firebase
            .firestore()
            .collection('users')
            .doc(`${userId}`),
          {
            addCount: increment(isAddBecomingActive ? 1 : -1),
            doneCount: increment(isAddBecomingActive && isDoneActive ? -1 : 0),
            updatedAt: ts
          },
          { merge: true }
        );
        // create/update adds object
        batch.set(
          firebase
            .firestore()
            .collection('adds')
            .doc(`${userId}`),
          {
            addCount: increment(isAddBecomingActive ? 1 : -1),
            doneCount: increment(isAddBecomingActive && isDoneActive ? -1 : 0),
            updatedAt: ts
          },
          { merge: true }
        );
        // update dones object

        await firebase
          .firestore()
          .collection('users_posts')
          .where('userId', '==', userId)
          .where('postId', '==', postId);
      }
    )
  }
};
