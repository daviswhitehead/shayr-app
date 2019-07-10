import firebase from 'react-native-firebase';
import { DocumentSnapshot, Query } from 'react-native-firebase/firestore';

export type queryType =
  | 'USERS_POSTS_SINGLE'
  | 'USERS_POSTS_ALL'
  | 'USERS_POSTS_SHARES'
  | 'USERS_POSTS_ADDS'
  | 'USERS_POSTS_DONES'
  | 'USERS_POSTS_LIKES'
  | 'FRIENDSHIPS_ALL'
  | 'FRIENDS_ALL'
  | 'USERS_ALL';

export interface queryArguments {
  userId: string;
  postId: string;
}

export const queries = {
  USERS_POSTS_SINGLE: {
    type: 'USERS_POSTS_SINGLE',
    query: ({ userId, postId }: { userId: string; postId: string }) =>
      firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('postId', '==', postId)
  },
  USERS_POSTS_ALL: {
    type: 'USERS_POSTS_ALL',
    query: ({ userId }: { userId: string }) =>
      firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
  },
  USERS_POSTS_SHARES: {
    type: 'USERS_POSTS_SHARES',
    query: ({ userId }: { userId: string }) =>
      firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('shares', 'array-contains', userId)
        .orderBy('updatedAt', 'desc')
  },
  USERS_POSTS_ADDS: {
    type: 'USERS_POSTS_ADDS',
    query: ({ userId }: { userId: string }) =>
      firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('adds', 'array-contains', userId)
        .orderBy('updatedAt', 'desc')
  },
  USERS_POSTS_DONES: {
    type: 'USERS_POSTS_DONES',
    query: ({ userId }: { userId: string }) =>
      firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('dones', 'array-contains', userId)
        .orderBy('updatedAt', 'desc')
  },
  USERS_POSTS_LIKES: {
    type: 'USERS_POSTS_LIKES',
    query: ({ userId }: { userId: string }) =>
      firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('likes', 'array-contains', userId)
        .orderBy('updatedAt', 'desc')
  },
  FRIENDSHIPS_ALL: {
    type: 'FRIENDSHIPS_ALL',
    query: firebase.firestore().collection('')
  },
  FRIENDS_ALL: {
    type: 'FRIENDS_ALL',
    query: firebase.firestore().collection('')
  },
  USERS_ALL: {
    type: 'USERS_ALL',
    query: firebase.firestore().collection('')
  }
};

export const getQuery = (
  queryType: queryType,
  queryArguments: queryArguments
) => {
  return queries[queryType].query(queryArguments);
};

export const composeQuery = (
  query: Query,
  limit?: number,
  lastItem?: DocumentSnapshot | 'DONE'
) => {
  let newQuery = query;

  if (limit) {
    newQuery = newQuery.limit(limit);
  }
  if (lastItem && lastItem != 'DONE') {
    newQuery = newQuery.startAfter(lastItem);
  }

  return newQuery;
};
