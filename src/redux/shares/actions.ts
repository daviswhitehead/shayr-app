import { Batcher, documentId } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { Toaster } from '../../components/Toaster';
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
import { refreshUsersPostsDocuments } from '../usersPosts/actions';
import { toggleUsersPostsListsItem } from '../usersPostsLists/actions';

export const STATE_KEY = 'shares';

export const types = {
  ...generateActionTypes(STATE_KEY, dataActionTypes),
  TOGGLE_SHARE_POST_START: 'TOGGLE_SHARE_POST_START',
  TOGGLE_SHARE_POST_SUCCESS: 'TOGGLE_SHARE_POST_SUCCESS',
  TOGGLE_SHARE_POST_FAIL: 'TOGGLE_SHARE_POST_FAIL',
  START_SHARE_POST_START: 'START_SHARE_POST_START',
  START_SHARE_POST_SUCCESS: 'START_SHARE_POST_SUCCESS',
  START_SHARE_POST_FAIL: 'START_SHARE_POST_FAIL',
  CONFIRM_SHARE_POST_START: 'CONFIRM_SHARE_POST_START',
  CONFIRM_SHARE_POST_SUCCESS: 'CONFIRM_SHARE_POST_SUCCESS',
  CONFIRM_SHARE_POST_FAIL: 'CONFIRM_SHARE_POST_FAIL',
  CANCEL_SHARE_POST_START: 'CANCEL_SHARE_POST_START',
  CANCEL_SHARE_POST_SUCCESS: 'CANCEL_SHARE_POST_SUCCESS',
  CANCEL_SHARE_POST_FAIL: 'CANCEL_SHARE_POST_FAIL',
  SUBSCRIBE_NEW_SHARE_START: 'SUBSCRIBE_NEW_SHARE_START',
  SUBSCRIBE_NEW_SHARE_SUCCESS: 'SUBSCRIBE_NEW_SHARE_SUCCESS',
  SUBSCRIBE_NEW_SHARE_FAIL: 'SUBSCRIBE_NEW_SHARE_FAIL'
};

export const toggleSharePost = (
  isActive: boolean,
  postId: documentId,
  ownerUserId: documentId,
  userId: documentId
) => async (dispatch: Dispatch) => {
  dispatch({
    type: types.TOGGLE_SHARE_POST_START
  });

  firebase
    .analytics()
    .logEvent(`${types.TOGGLE_SHARE_POST_START}`.toUpperCase());

  try {
    // toast
    !isActive
      ? Toaster(actionTypeActiveToasts.shares)
      : Toaster(actionTypeInactiveToasts.shares);

    const batcher = new Batcher(firebase.firestore());

    // shares/{userId}_{postId}
    batcher.set(
      firebase
        .firestore()
        .collection('shares')
        .doc(`${userId}_${postId}`),
      {
        active: !isActive,
        postId,
        updatedAt: ts,
        userId
      },
      {
        merge: true
      }
    );

    updateCounts(batcher, !isActive, 'shares', postId, ownerUserId, userId);

    batcher.write();

    dispatch(refreshUsersPostsDocuments(postId, 'cache'));
    dispatch(
      toggleUsersPostsListsItem(
        userId,
        queries.USERS_POSTS_SHARES.type,
        postId,
        !isActive
      )
    );

    dispatch({
      type: types.TOGGLE_SHARE_POST_SUCCESS
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.TOGGLE_SHARE_POST_FAIL,
      error
    });
  }
};

export const startSharePost = (
  payload: string,
  userId: documentId,
  postId: documentId = '',
  url: string = ''
) => async (dispatch: Dispatch) => {
  dispatch({
    type: types.START_SHARE_POST_START
  });

  firebase
    .analytics()
    .logEvent(`${types.START_SHARE_POST_START}`.toUpperCase());

  try {
    // sharesNew/{shareId}
    return await firebase
      .firestore()
      .collection('sharesNew')
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
          type: types.START_SHARE_POST_SUCCESS
        });

        return ref.id;
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.START_SHARE_POST_FAIL,
      error
    });
  }
};

export const subscribeToNewShare = (shareId: documentId) => {
  return (dispatch: Dispatch) => {
    return dispatch(subscribeToDocument(STATE_KEY, 'sharesNew', shareId));
  };
};
