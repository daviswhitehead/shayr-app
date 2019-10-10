import {
  Batcher,
  documentId,
  documentIds
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { Toaster } from '../../components/Toaster';
import { logEvent } from '../../lib/FirebaseAnalytics';
import { ts } from '../../lib/FirebaseHelpers';
import {
  getQuery,
  queryTypes,
  references,
  referenceTypes
} from '../../lib/FirebaseQueries';
import { overwriteUserCounts, updateCounts } from '../../lib/FirebaseWrites';
import { subscribeToAllDocuments } from '../../redux/FirebaseRedux';
import { actionTypeActiveToasts } from '../../styles/Copy';
import { createComment } from '../comments/actions';
import { subscribeToDocument } from '../FirebaseRedux';
import { toggleItem } from '../lists/actions';
import { createMention } from '../mentions/actions';
import { refreshUsersPostsDocuments } from '../usersPosts/actions';

export const STATE_KEY = 'shares';

export enum types {
  START_SHARE_START = 'START_SHARE_START',
  START_SHARE_SUCCESS = 'START_SHARE_SUCCESS',
  START_SHARE_FAIL = 'START_SHARE_FAIL',
  CONFIRM_SHARE_START = 'CONFIRM_SHARE_START',
  CONFIRM_SHARE_SUCCESS = 'CONFIRM_SHARE_SUCCESS',
  CONFIRM_SHARE_FAIL = 'CONFIRM_SHARE_FAIL',
  CANCEL_SHARE_START = 'CANCEL_SHARE_START',
  CANCEL_SHARE_SUCCESS = 'CANCEL_SHARE_SUCCESS',
  CANCEL_SHARE_FAIL = 'CANCEL_SHARE_FAIL',
  SUBSCRIBE_NEW_SHARE_START = 'SUBSCRIBE_NEW_SHARE_START',
  SUBSCRIBE_NEW_SHARE_SUCCESS = 'SUBSCRIBE_NEW_SHARE_SUCCESS',
  SUBSCRIBE_NEW_SHARE_FAIL = 'SUBSCRIBE_NEW_SHARE_FAIL',
  UPDATE_USER_SHARES_START = 'UPDATE_USER_SHARES_START',
  UPDATE_USER_SHARES_SUCCESS = 'UPDATE_USER_SHARES_SUCCESS',
  UPDATE_USER_SHARES_FAIL = 'UPDATE_USER_SHARES_FAIL'
}

export const startShare = (
  payload: string,
  userId: documentId,
  postId: documentId = '',
  url: string = ''
) => async (dispatch: Dispatch) => {
  dispatch({
    type: types.START_SHARE_START
  });

  try {
    // shares/{shareId}
    return await firebase
      .firestore()
      .collection('shares')
      .add({
        status: 'started',
        createdAt: ts,
        payload,
        postId,
        url,
        updatedAt: ts,
        userId
      })
      .then((ref) => {
        dispatch({
          type: types.START_SHARE_SUCCESS
        });

        return ref.id;
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.START_SHARE_FAIL,
      error
    });
  }
};

export const confirmShare = (
  userId: documentId,
  postId: documentId,
  shareId: documentId,
  comment: string,
  mentions: documentIds,
  ownerUserId?: documentId,
  visibleToUserIds?: documentIds,
  friends: documentIds = []
) => async (dispatch: Dispatch) => {
  dispatch({
    type: types.CONFIRM_SHARE_START
  });

  try {
    const batcher = new Batcher(firebase.firestore());

    // create new comment
    const commentId = _.isEmpty(comment)
      ? ''
      : await dispatch(
          createComment(
            postId,
            comment,
            userId,
            ownerUserId,
            shareId,
            visibleToUserIds,
            batcher
          )
        );

    // create new mention
    const mentionId = _.isEmpty(mentions)
      ? ''
      : await dispatch(
          createMention(
            postId,
            userId,
            mentions,
            commentId,
            ownerUserId,
            shareId,
            batcher
          )
        );

    // update share
    await firebase
      .firestore()
      .collection('shares')
      .doc(shareId)
      .set(
        {
          active: true,
          status: 'confirmed',
          commentId: commentId || '',
          mentionId: mentionId || '',
          updatedAt: ts
        },
        { merge: true }
      )
      .catch((error) => {
        console.error(error);
      });

    updateCounts(
      batcher,
      true,
      'shares',
      postId,
      ownerUserId,
      userId,
      [],
      friends
    );

    await batcher.write();

    dispatch(refreshUsersPostsDocuments(postId, 'server'));
    // dispatch(refreshUsersPostsDocuments(postId, 'cache'));
    dispatch(
      toggleItem(
        'usersPostsLists',
        `${userId}_${queryTypes.USERS_POSTS_SHARES}`,
        `${userId}_${postId}`,
        true
      )
    );

    Toaster(actionTypeActiveToasts.shares);

    dispatch({
      type: types.CONFIRM_SHARE_SUCCESS
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.CONFIRM_SHARE_FAIL,
      error
    });
  }
};

export const subscribeToShare = (shareId: documentId) => {
  return (dispatch: Dispatch) => {
    return subscribeToDocument(
      dispatch,
      STATE_KEY,
      references.get(referenceTypes.GET_DOCUMENT)(`shares/${shareId}`)
    );
  };
};

export const subscribeToShares = (userId: string) => {
  return (dispatch: Dispatch) => {
    return subscribeToAllDocuments(
      dispatch,
      STATE_KEY,
      getQuery(queryTypes.USER_SHARES)(userId),
      userId,
      queryTypes.USER_SHARES
    );
  };
};

export const updateUserShares = (userId: string, value: number) => async (
  dispatch: Dispatch
) => {
  dispatch({ type: types.UPDATE_USER_SHARES_START });

  const batcher = new Batcher(firebase.firestore());

  overwriteUserCounts(batcher, 'shares', userId, value);

  await batcher.write();

  dispatch({ type: types.UPDATE_USER_SHARES_SUCCESS });
};
