import { documentId } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { arrayRemove, arrayUnion, increment, ts } from './FirebaseHelpers';

export type countActions =
  | 'adds'
  | 'comments'
  | 'dones'
  | 'likes'
  | 'mentions'
  | 'replies'
  | 'shares';

const updatePostCounts = (
  batcher: any,
  isIncremental: boolean,
  action: countActions,
  postId: documentId
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
};

const updateUserCounts = (
  batcher: any,
  isIncremental: boolean,
  action: countActions,
  userId: documentId
) => {
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

const updateUsersPostsCounts = (
  batcher: any,
  isIncremental: boolean,
  action: countActions,
  postId: documentId,
  ownerUserId: documentId,
  userId: documentId,
  users: Array<documentId> = []
) => {
  // users_posts/{ownerUserId}_{postId} { {action}Count: +1, {action}: +{userId} }
  batcher.set(
    firebase
      .firestore()
      .collection('users_posts')
      .doc(`${ownerUserId}_${postId}`),
    {
      [`${action}Count`]: increment(isIncremental ? 1 : -1),
      [`${action}`]: isIncremental
        ? arrayUnion(_.isEmpty(users) ? userId : users)
        : arrayRemove(_.isEmpty(users) ? userId : users),
      postId,
      updatedAt: ts,
      userId: ownerUserId
    },
    {
      merge: true
    }
  );
};

export const updateCounts = (
  batcher: any,
  isIncremental: boolean,
  action: countActions,
  postId: documentId,
  ownerUserId: documentId,
  userId: documentId,
  users: Array<documentId> = [],
  friends: Array<documentId> = []
) => {
  // update user
  // update users posts
  // update post

  updatePostCounts(batcher, isIncremental, action, postId);

  updateUsersPostsCounts(
    batcher,
    isIncremental,
    action,
    postId,
    ownerUserId,
    userId,
    users
  );
  if (ownerUserId !== userId) {
    updateUsersPostsCounts(
      batcher,
      isIncremental,
      action,
      postId,
      userId,
      userId,
      users
    );
  }

  if (_.isEmpty(users)) {
    updateUserCounts(batcher, isIncremental, action, userId);
  } else {
    _.forEach(users, (userId) => {
      updateUserCounts(batcher, isIncremental, action, userId);
    });
  }

  if (!_.isEmpty(friends)) {
    _.forEach(friends, (friendUserId) => {
      updateUsersPostsCounts(
        batcher,
        isIncremental,
        action,
        postId,
        friendUserId,
        userId,
        users
      );
    });
  }
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
      [`${action}Count`]: value >= 0 ? value : 0,
      updatedAt: ts
    },
    {
      merge: true
    }
  );
};
