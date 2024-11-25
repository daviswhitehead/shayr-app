import {
  Batcher,
  documentId,
  documentIds
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Query } from 'react-native-firebase/firestore';
import { Dispatch } from 'redux';
import { Toaster } from '../../components/Toaster';
import { arrayUnion, ts } from '../../lib/FirebaseHelpers';
import {
  composeQuery,
  queryTypes,
  references,
  referenceTypes
} from '../../lib/FirebaseQueries';
import { updateCounts } from '../../lib/FirebaseWrites';
import { actionTypeActiveToasts } from '../../styles/Copy';
import { getFeedOfDocuments, LastItem } from '../FirebaseRedux';
import { getDocument } from '../FirebaseRedux';
import { toggleItem } from '../lists/actions';
import { generateListKey } from '../lists/helpers';
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

  try {
    const batcher = existingBatcher || new Batcher(firebase.firestore());

    // toast
    Toaster(actionTypeActiveToasts.comments);

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

    if (!commentId) throw new Error('creating a new comment failed');

    updateCounts(
      batcher,
      true,
      'comments',
      postId,
      ownerUserId,
      userId,
      undefined,
      visibleToUserIds
    );

    if (!existingBatcher) {
      await batcher.write();
    }

    dispatch(refreshUsersPostsDocuments(postId, 'server'));
    // dispatch(refreshUsersPostsDocuments(postId, 'cache'));
    getDocument(
      dispatch,
      STATE_KEY,
      references.get(referenceTypes.GET_DOCUMENT)(`comments/${commentId}`)
    );
    dispatch(
      toggleItem(
        'commentsLists',
        generateListKey(
          ownerUserId,
          postId,
          queryTypes.COMMENTS_FOR_USERS_POSTS
        ),
        commentId,
        true
      )
    );

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
