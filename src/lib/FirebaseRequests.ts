import firebase from 'react-native-firebase';
import { DocumentSnapshot } from 'react-native-firebase/firestore';

export type RequestType =
  | 'USERS_POSTS_SINGLE'
  | 'USERS_POSTS_ALL'
  | 'USERS_POSTS_SHARES'
  | 'USERS_POSTS_ADDS'
  | 'USERS_POSTS_DONES'
  | 'USERS_POSTS_LIKES'
  | 'FRIENDSHIPS_ALL'
  | 'FRIENDS_ALL'
  | 'USERS_ALL';

export const requestTypes = {
  USERS_POSTS_SINGLE: {
    type: 'USERS_POSTS_SINGLE',
    request: (userId: string, postId: string) =>
      firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('postId', '==', postId)
  },
  USERS_POSTS_ALL: {
    type: 'USERS_POSTS_ALL',
    request: (userId: string) =>
      firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
  },
  USERS_POSTS_SHARES: {
    type: 'USERS_POSTS_SHARES',
    request: (userId: string) =>
      firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('shares', 'array-contains', userId)
        .orderBy('updatedAt', 'desc')
  },
  USERS_POSTS_ADDS: {
    type: 'USERS_POSTS_ADDS',
    request: (userId: string) =>
      firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('adds', 'array-contains', userId)
        .orderBy('updatedAt', 'desc')
  },
  USERS_POSTS_DONES: {
    type: 'USERS_POSTS_DONES',
    request: (userId: string) =>
      firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('dones', 'array-contains', userId)
        .orderBy('updatedAt', 'desc')
  },
  USERS_POSTS_LIKES: {
    type: 'USERS_POSTS_LIKES',
    request: (userId: string) =>
      firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('likes', 'array-contains', userId)
        .orderBy('updatedAt', 'desc')
  },
  FRIENDSHIPS_ALL: {
    type: 'FRIENDSHIPS_ALL',
    request: firebase.firestore().collection('')
  },
  FRIENDS_ALL: {
    type: 'FRIENDS_ALL',
    request: firebase.firestore().collection('')
  },
  USERS_ALL: {
    type: 'USERS_ALL',
    request: firebase.firestore().collection('')
  }
};

export const composeRequest = (
  request: any,
  limit?: number,
  lastItem?: DocumentSnapshot
) => {
  let newRequest = request;

  if (limit) {
    newRequest = newRequest.limit(limit);
  }
  if (lastItem) {
    newRequest = newRequest.startAfter(lastItem);
  }

  return newRequest;
};
