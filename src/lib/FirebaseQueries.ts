import firebase from 'react-native-firebase';
import {
  DocumentReference,
  DocumentSnapshot,
  Query
} from 'react-native-firebase/firestore';

export enum queryTypes {
  USERS_POSTS_SINGLE = 'USERS_POSTS_SINGLE',
  USERS_POSTS_BY_POST = 'USERS_POSTS_BY_POST',
  USERS_POSTS_ALL = 'USERS_POSTS_ALL',
  USERS_POSTS_SHARES = 'USERS_POSTS_SHARES',
  USERS_POSTS_ADDS = 'USERS_POSTS_ADDS',
  USERS_POSTS_COMMENTS = 'USERS_POSTS_COMMENTS',
  USERS_POSTS_DONES = 'USERS_POSTS_DONES',
  USERS_POSTS_LIKES = 'USERS_POSTS_LIKES',
  USER_ADDS = 'USER_ADDS',
  USER_FRIENDSHIPS = 'USER_FRIENDSHIPS',
  USER_DONES = 'USER_DONES',
  USER_LIKES = 'USER_LIKES',
  USER_SHARES = 'USER_SHARES',
  USER_FRIENDS = 'USER_FRIENDS',
  COMMENTS_FOR_USERS_POSTS = 'COMMENTS_FOR_USERS_POSTS',
  NOTIFICATIONS = 'NOTIFICATIONS'
}

export enum referenceTypes {
  GET_DOCUMENT = 'GET_DOCUMENT'
}

export const references: Map<
  referenceTypes,
  (...args: string[]) => DocumentReference
> = new Map([
  [
    referenceTypes.GET_DOCUMENT,
    (reference: string) => {
      return firebase.firestore().doc(reference);
    }
  ]
]);

export const queries: Map<queryTypes, (...args: string[]) => Query> = new Map([
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
    queryTypes.USERS_POSTS_COMMENTS,
    (userId: string) => {
      return firebase
        .firestore()
        .collection('users_posts')
        .where('userId', '==', userId)
        .where('comments', 'array-contains', userId)
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
    queryTypes.USER_FRIENDSHIPS,
    (userId: string) => {
      return firebase
        .firestore()
        .collection('friendships')
        .where('userIds', 'array-contains', userId)
        .orderBy('createdAt', 'desc');
    }
  ],
  [
    queryTypes.USER_FRIENDS,
    (userId: string) => {
      return firebase
        .firestore()
        .collection('users')
        .where('friends', 'array-contains', userId);
    }
  ],
  [
    queryTypes.COMMENTS_FOR_USERS_POSTS,
    (userId: string, postId: string) => {
      return firebase
        .firestore()
        .collection('comments')
        .where('postId', '==', `${postId}`)
        .where('visibleToUserIds', 'array-contains', `${userId}`)
        .orderBy('createdAt', 'desc');
    }
  ],
  [
    queryTypes.NOTIFICATIONS,
    (userId: string) => {
      return firebase
        .firestore()
        .collection('notifications')
        .where('receivingUserId', '==', `${userId}`)
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
