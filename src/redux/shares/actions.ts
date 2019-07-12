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
  subscribeDocumentsIds
} from '../../lib/FirebaseRedux';
import { updateCounts } from '../../lib/FirebaseWrites';
import {
  actionTypeActiveToasts,
  actionTypeInactiveToasts
} from '../../styles/Copy';
import { refreshUsersPostsDocuments } from '../usersPosts/actions';

export const STATE_KEY = 'shares';

export const types = {
  ...generateActionTypes(STATE_KEY, dataActionTypes),
  TOGGLE_SHARE_POST_START: 'TOGGLE_SHARE_POST_START',
  TOGGLE_SHARE_POST_SUCCESS: 'TOGGLE_SHARE_POST_SUCCESS',
  TOGGLE_SHARE_POST_FAIL: 'TOGGLE_SHARE_POST_FAIL'
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

export const subscribeToShares = (userId: string) => {
  return (dispatch: Dispatch) => {
    return dispatch(
      subscribeDocumentsIds(
        STATE_KEY,
        queries.USER_SHARES.query({ userId }),
        'postId'
      )
    );
  };
};