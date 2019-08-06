import firebase from 'react-native-firebase';
import { DocumentSnapshot, Query } from 'react-native-firebase/firestore';

export type usersPostsLists =
  | 'USERS_POSTS_SINGLE'
  | 'USERS_POSTS_ALL'
  | 'USERS_POSTS_SHARES'
  | 'USERS_POSTS_ADDS'
  | 'USERS_POSTS_DONES'
  | 'USERS_POSTS_LIKES';

export type queryType =
  | usersPostsLists
  | 'USER_ADDS'
  | 'USER_DONES'
  | 'USER_LIKES'
  | 'USER_SHARES'
  | 'FRIENDSHIPS_ALL'
  | 'FRIENDS_ALL'
  | 'USERS_POSTS_COMMENTS'
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
  USERS_POSTS_BY_POST: {
    type: 'USERS_POSTS_BY_POST',
    query: ({ postId }: { postId: string }) =>
      firebase
        .firestore()
        .collection('users_posts')
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
  USER_ADDS: {
    type: 'USER_ADDS',
    query: ({ userId }: { userId: string }) =>
      firebase
        .firestore()
        .collection('adds')
        .where('userId', '==', userId)
        .where('active', '==', true)
        .orderBy('updatedAt', 'desc')
  },
  USER_DONES: {
    type: 'USER_DONES',
    query: ({ userId }: { userId: string }) =>
      firebase
        .firestore()
        .collection('dones')
        .where('userId', '==', userId)
        .where('active', '==', true)
        .orderBy('updatedAt', 'desc')
  },
  USER_LIKES: {
    type: 'USER_LIKES',
    query: ({ userId }: { userId: string }) =>
      firebase
        .firestore()
        .collection('likes')
        .where('userId', '==', userId)
        .where('active', '==', true)
        .orderBy('updatedAt', 'desc')
  },
  USER_SHARES: {
    type: 'USER_SHARES',
    query: ({ userId }: { userId: string }) =>
      firebase
        .firestore()
        .collection('shares')
        .where('userId', '==', userId)
        .where('active', '==', true)
        .orderBy('updatedAt', 'desc')
  },
  USERS_POSTS_COMMENTS: {
    type: 'USERS_POSTS_COMMENTS',
    query: ({ userId, postId }: { userId: string; postId: string }) =>
      firebase
        .firestore()
        .collection('comments')
        .where('postId', '==', `${postId}`)
        .where('visibleToUserIds', 'array-contains', `${userId}`)
        .orderBy('createdAt', 'desc')
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
