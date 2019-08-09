import firebase from 'react-native-firebase';
import { DocumentSnapshot, Query } from 'react-native-firebase/firestore';

export enum queryTypes {
  USERS_POSTS_SINGLE = 'USERS_POSTS_SINGLE',
  USERS_POSTS_BY_POST = 'USERS_POSTS_BY_POST',
  USERS_POSTS_ALL = 'USERS_POSTS_ALL',
  USERS_POSTS_SHARES = 'USERS_POSTS_SHARES',
  USERS_POSTS_ADDS = 'USERS_POSTS_ADDS',
  USERS_POSTS_DONES = 'USERS_POSTS_DONES',
  USERS_POSTS_LIKES = 'USERS_POSTS_LIKES',
  USER_ADDS = 'USER_ADDS',
  USER_DONES = 'USER_DONES',
  USER_LIKES = 'USER_LIKES',
  USER_SHARES = 'USER_SHARES',
  FRIENDSHIPS_ALL = 'FRIENDSHIPS_ALL',
  FRIENDS_ALL = 'FRIENDS_ALL',
  USERS_POSTS_COMMENTS = 'USERS_POSTS_COMMENTS',
  USERS_ALL = 'USERS_ALL'
}

export const queries: Map<queryTypes, (...args: string[]) => void> = new Map([
  [
    queryTypes.USERS_POSTS_SINGLE,
    (userId: string, postId: string) => {
      return firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('postId', '==', postId);
    }
  ],
  [
    queryTypes.USERS_POSTS_BY_POST,
    (postId: string) => {
      return firebase
        .firestore()
        .collection('users_posts')
        .where('postId', '==', postId);
    }
  ],
  [
    queryTypes.USERS_POSTS_ALL,
    (userId: string) => {
      return firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc');
    }
  ],
  [
    queryTypes.USERS_POSTS_ADDS,
    (userId: string) => {
      return firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('adds', 'array-contains', userId)
        .orderBy('updatedAt', 'desc');
    }
  ],
  [
    queryTypes.USERS_POSTS_DONES,
    (userId: string) => {
      return firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('dones', 'array-contains', userId)
        .orderBy('updatedAt', 'desc');
    }
  ],
  [
    queryTypes.USERS_POSTS_LIKES,
    (userId: string) => {
      return firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('likes', 'array-contains', userId)
        .orderBy('updatedAt', 'desc');
    }
  ],
  [
    queryTypes.USERS_POSTS_SHARES,
    (userId: string) => {
      return firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('shares', 'array-contains', userId)
        .orderBy('updatedAt', 'desc');
    }
  ],
  [
    queryTypes.USER_ADDS,
    (userId: string) => {
      return firebase
        .firestore()
        .collection('adds')
        .where('userId', '==', userId)
        .where('active', '==', true)
        .orderBy('updatedAt', 'desc');
    }
  ],
  [
    queryTypes.USER_DONES,
    (userId: string) => {
      return firebase
        .firestore()
        .collection('dones')
        .where('userId', '==', userId)
        .where('active', '==', true)
        .orderBy('updatedAt', 'desc');
    }
  ],
  [
    queryTypes.USER_LIKES,
    (userId: string) => {
      return firebase
        .firestore()
        .collection('likes')
        .where('userId', '==', userId)
        .where('active', '==', true)
        .orderBy('updatedAt', 'desc');
    }
  ],
  [
    queryTypes.USER_SHARES,
    (userId: string) => {
      return firebase
        .firestore()
        .collection('shares')
        .where('userId', '==', userId)
        .where('active', '==', true)
        .orderBy('updatedAt', 'desc');
    }
  ],
  [
    queryTypes.USERS_POSTS_COMMENTS,
    (userId: string, postId: string) => {
      return firebase
        .firestore()
        .collection('comments')
        .where('postId', '==', `${postId}`)
        .where('visibleToUserIds', 'array-contains', `${userId}`)
        .orderBy('createdAt', 'desc');
    }
  ]
]);

export const getQuery = (queryType: queryTypes) => {
  return queries.get(queryType);
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
