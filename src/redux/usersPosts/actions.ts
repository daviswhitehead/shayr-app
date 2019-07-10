import { DocumentSnapshot, Query } from 'react-native-firebase/firestore';
import { Dispatch } from 'redux';
import { documentId } from '../../../../shayr-resources/src/DataModel/Fields';
import {
  composeQuery,
  getQuery,
  queries,
  queryArguments,
  queryType
} from '../../lib/FirebaseQueries';
import {
  dataActionTypes,
  generateActionTypes,
  getDocuments,
  getFeedOfDocuments
} from '../../lib/FirebaseRedux';
import { STATE_KEY as STATE_KEY_LIST } from '../usersPostsLists/actions';

export const STATE_KEY = 'usersPosts';

export const types = generateActionTypes(STATE_KEY, dataActionTypes);

const requestLimiter = 10;
export const loadUsersPosts = (
  ownerUserId: string,
  queryType: queryType,
  queryArguments: queryArguments,
  shouldRefresh?: boolean,
  isLoading?: boolean,
  lastItem?: DocumentSnapshot | 'DONE'
) => async (dispatch: Dispatch) => {
  const request: Query = composeQuery(
    getQuery(queryType, queryArguments),
    requestLimiter,
    shouldRefresh ? undefined : lastItem
  );
  dispatch(
    getFeedOfDocuments(
      STATE_KEY,
      STATE_KEY_LIST,
      ownerUserId,
      queryType,
      request,
      shouldRefresh,
      isLoading,
      lastItem
    )
  );
};

export const refreshUsersPostsDocument = (
  ownerUserId: documentId,
  postId: documentId,
  source: 'default' | 'cache' | 'server'
) => async (dispatch: Dispatch) => {
  dispatch(
    getDocuments(
      STATE_KEY,
      queries.USERS_POSTS_SINGLE.query({ userId: ownerUserId, postId }),
      source
    )
  );
};
