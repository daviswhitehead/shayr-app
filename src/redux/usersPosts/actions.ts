import { DocumentSnapshot, Query } from 'react-native-firebase/firestore';
import { Dispatch } from 'redux';
import { composeQuery, getQuery, queryTypes } from '../../lib/FirebaseQueries';
import { getDocuments, getFeedOfDocuments } from '../FirebaseRedux';

export const STATE_KEY = 'usersPosts';

const requestLimiter = 10;

export const loadUsersPosts = (
  ownerUserId: string,
  query: Query,
  listName: string,
  shouldRefresh?: boolean,
  isLoading?: boolean,
  lastItem?: DocumentSnapshot | 'DONE'
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
      ownerUserId,
      listName,
      composedQuery,
      shouldRefresh,
      isLoading,
      lastItem
    );
  };
};

export const refreshUsersPostsDocuments = (
  postId: string,
  source: 'default' | 'cache' | 'server'
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
