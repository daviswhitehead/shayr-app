import { Batcher, documentId } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { Toaster } from '../../components/Toaster';
import { ts } from '../../lib/FirebaseHelpers';
import { queries } from '../../lib/FirebaseQueries';
import { overwriteUserCounts, updateCounts } from '../../lib/FirebaseWrites';
import { subscribeToAllDocuments } from '../../redux/FirebaseRedux';
import {
  actionTypeActiveToasts,
  actionTypeInactiveToasts
} from '../../styles/Copy';
import { refreshUsersPostsDocuments } from '../usersPosts/actions';
import { toggleUsersPostsListsItem } from '../usersPostsLists/actions';

export const STATE_KEY = 'adds';

export const types = {
  TOGGLE_ADD_DONE_POST_START: 'TOGGLE_ADD_DONE_POST_START',
  TOGGLE_ADD_DONE_POST_SUCCESS: 'TOGGLE_ADD_DONE_POST_SUCCESS',
  TOGGLE_ADD_DONE_POST_FAIL: 'TOGGLE_ADD_DONE_POST_FAIL',
  UPDATE_USER_ADDS_START: 'UPDATE_USER_ADDS_START',
  UPDATE_USER_ADDS_SUCCESS: 'UPDATE_USER_ADDS_SUCCESS',
  UPDATE_USER_ADDS_FAIL: 'UPDATE_USER_ADDS_FAIL'
};

export const toggleAddDonePost = (
  type: 'adds' | 'dones',
  isActive: boolean,
  postId: documentId,
  ownerUserId: documentId,
  userId: documentId,
  isOtherActive: boolean
) => async (dispatch: Dispatch) => {
  dispatch({
    type: types.TOGGLE_ADD_DONE_POST_START
  });

  firebase
    .analytics()
    .logEvent(`${types.TOGGLE_ADD_DONE_POST_START}`.toUpperCase());

  try {
    // toast
    !isActive
      ? Toaster(actionTypeActiveToasts[type])
      : Toaster(actionTypeInactiveToasts[type]);

    const batcher = new Batcher(firebase.firestore());

    // {collection}/{userId}_{postId}
    batcher.set(
      firebase
        .firestore()
        .collection('adds')
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

    updateCounts(batcher, !isActive, 'adds', postId, ownerUserId, userId);

    if (!isActive && isOtherActive) {
      // {otherCollection}/{userId}_{postId}
      batcher.set(
        firebase
          .firestore()
          .collection('dones')
          .doc(`${userId}_${postId}`),
        {
          active: !isOtherActive,
          postId,
          updatedAt: ts,
          userId
        },
        {
          merge: true
        }
      );
      updateCounts(
        batcher,
        !isOtherActive,
        'dones',
        postId,
        ownerUserId,
        userId
      );
    }

    batcher.write();

    dispatch(refreshUsersPostsDocuments(postId, 'cache'));
    dispatch(
      toggleUsersPostsListsItem(
        userId,
        queries.USERS_POSTS_ADDS.type,
        postId,
        !isActive
      )
    );
    if (!isActive && isOtherActive) {
      dispatch(
        toggleUsersPostsListsItem(
          userId,
          queries.USERS_POSTS_DONES.type,
          postId,
          !isOtherActive
        )
      );
    }

    dispatch({
      type: types.TOGGLE_ADD_DONE_POST_SUCCESS
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.TOGGLE_ADD_DONE_POST_FAIL,
      error
    });
  }
};

export const subscribeToAdds = (userId: string) => {
  return (dispatch: Dispatch) => {
    return dispatch(
      subscribeToAllDocuments(
        STATE_KEY,
        queries.USER_ADDS.query({ userId }),
        userId,
        queries.USER_ADDS.type
      )
    );
  };
};

export const updateUserAdds = (userId: string, value: number) => (
  dispatch: Dispatch
) => {
  dispatch({ type: types.UPDATE_USER_ADDS_START });

  const batcher = new Batcher(firebase.firestore());

  overwriteUserCounts(batcher, 'adds', userId, value);

  batcher.write();

  dispatch({ type: types.UPDATE_USER_ADDS_SUCCESS });
};
