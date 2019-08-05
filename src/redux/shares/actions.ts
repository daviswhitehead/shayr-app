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
import { queries } from '../../lib/FirebaseQueries';
import {
  dataActionTypes,
  generateActionTypes,
  subscribeToDocument
} from '../../lib/FirebaseRedux';
import { updateCounts } from '../../lib/FirebaseWrites';
import {
  actionTypeActiveToasts,
  actionTypeInactiveToasts
} from '../../styles/Copy';
import { createComment } from '../comments/actions';
import { createMention } from '../mentions/actions';
import { refreshUsersPostsDocuments } from '../usersPosts/actions';
import { toggleUsersPostsListsItem } from '../usersPostsLists/actions';

export const STATE_KEY = 'shares';

export const types = {
  ...generateActionTypes(STATE_KEY, dataActionTypes),
  START_SHARE_START: 'START_SHARE_START',
  START_SHARE_SUCCESS: 'START_SHARE_SUCCESS',
  START_SHARE_FAIL: 'START_SHARE_FAIL',
  CONFIRM_SHARE_START: 'CONFIRM_SHARE_START',
  CONFIRM_SHARE_SUCCESS: 'CONFIRM_SHARE_SUCCESS',
  CONFIRM_SHARE_FAIL: 'CONFIRM_SHARE_FAIL',
  CANCEL_SHARE_START: 'CANCEL_SHARE_START',
  CANCEL_SHARE_SUCCESS: 'CANCEL_SHARE_SUCCESS',
  CANCEL_SHARE_FAIL: 'CANCEL_SHARE_FAIL',
  SUBSCRIBE_NEW_SHARE_START: 'SUBSCRIBE_NEW_SHARE_START',
  SUBSCRIBE_NEW_SHARE_SUCCESS: 'SUBSCRIBE_NEW_SHARE_SUCCESS',
  SUBSCRIBE_NEW_SHARE_FAIL: 'SUBSCRIBE_NEW_SHARE_FAIL'
};

export const startShare = (
  payload: string,
  userId: documentId,
  postId: documentId = '',
  url: string = ''
) => async (dispatch: Dispatch) => {
  dispatch({
    type: types.START_SHARE_START
  });

  logEvent(types.START_SHARE_START);

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

  logEvent(types.CONFIRM_SHARE_START);

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

    batcher.write();

    dispatch(refreshUsersPostsDocuments(postId, 'cache'));
    dispatch(
      toggleUsersPostsListsItem(
        userId,
        queries.USERS_POSTS_SHARES.type,
        postId,
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

export const subscribeToNewShare = (shareId: documentId) => {
  return (dispatch: Dispatch) => {
    return dispatch(subscribeToDocument(STATE_KEY, 'shares', shareId));
  };
};
