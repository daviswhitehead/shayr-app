import {
  Batcher,
  documentId,
  documentIds
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Query } from 'react-native-firebase/firestore';
import { Dispatch } from 'redux';
import { logEvent } from '../../lib/FirebaseAnalytics';
import { arrayUnion, ts } from '../../lib/FirebaseHelpers';
import { composeQuery } from '../../lib/FirebaseQueries';
import { updateCounts } from '../../lib/FirebaseWrites';
import { getFeedOfDocuments, LastItem } from '../FirebaseRedux';
import { refreshUsersPostsDocuments } from '../usersPosts/actions';

export const STATE_KEY = 'comments';

export const types = {
  CREATE_COMMENT_START: 'CREATE_COMMENT_START',
  CREATE_COMMENT_SUCCESS: 'CREATE_COMMENT_SUCCESS',
  CREATE_COMMENT_FAIL: 'CREATE_COMMENT_FAIL'
};

export const createComment = (
  postId: documentId,
  text: string,
  userId: documentId,
  ownerUserId: documentId = userId,
  shareId: documentId = '',
  visibleToUserIds: documentIds = [],
  existingBatcher?: any
) => async (dispatch: Dispatch) => {
  dispatch({
    type: types.CREATE_COMMENT_START
  });

  logEvent(types.CREATE_COMMENT_START);

  try {
    const batcher = existingBatcher || new Batcher(firebase.firestore());

    // create new comment
    const commentId = await firebase
      .firestore()
      .collection('comments')
      .add({
        active: true,
        createdAt: ts,
        postId,
        shareId,
        text,
        updatedAt: ts,
        userId,
        visibleToUserIds: arrayUnion([userId, ...visibleToUserIds])
      })
      .then((ref) => {
        return ref.id;
      })
      .catch((error) => {
        console.error(error);
      });

    updateCounts(batcher, true, 'comments', postId, ownerUserId, userId);

    if (!existingBatcher) {
      batcher.write();
    }

    dispatch(refreshUsersPostsDocuments(postId, 'cache'));

    dispatch({
      type: types.CREATE_COMMENT_SUCCESS
    });

    return commentId;
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.CREATE_COMMENT_FAIL,
      error
    });
    return undefined;
  }
};

const requestLimiter = 10;
export const loadCommentsForUsersPosts = (
  listKey: string,
  query: Query,
  shouldRefresh?: boolean,
  isLoading?: boolean,
  lastItem?: LastItem
) => (dispatch: Dispatch) => {
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
