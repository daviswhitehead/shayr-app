import { Query } from 'react-native-firebase/firestore';
import { Dispatch } from 'redux';
import { composeQuery, getQuery, queryTypes } from '../../lib/FirebaseQueries';
import { getDocuments, getFeedOfDocuments, LastItem } from '../FirebaseRedux';

export const STATE_KEY = 'usersPosts';

// const requestLimiter = 1;
const requestLimiter = 5;

export const loadUsersPosts = (
  listKey: string,
  query: Query,
  shouldRefresh?: boolean,
  isLoading?: boolean,
  lastItem?: LastItem
) => {
  return (dispatch: Dispatch) => {
    const composedQuery: Query = composeQuery(
      query,
      requestLimiter,
      shouldRefresh ? undefined : lastItem
    );
    getFeedOfDocuments(
      dispatch,
      STATE_KEY,
      listKey,
      composedQuery,
      shouldRefresh,
      isLoading,
      lastItem
    );
  };
};

export const refreshUsersPostsDocuments = (
  postId: string,
  source?: 'default' | 'cache' | 'server'
) => {
  return (dispatch: Dispatch) => {
    getDocuments(
      dispatch,
      STATE_KEY,
      getQuery(queryTypes.USERS_POSTS_BY_POST)(postId),
      source
    );
  };
};

export const getUsersPostsDocument = (
  userId: string,
  postId: string,
  source?: 'default' | 'cache' | 'server'
) => {
  return (dispatch: Dispatch) => {
    getDocuments(
      dispatch,
      STATE_KEY,
      getQuery(queryTypes.USERS_POSTS_SINGLE)(userId, postId),
      source
    );
  };
};
