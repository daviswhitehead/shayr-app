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

export const STATE_KEY = 'dones';

export const types = {
  TOGGLE_ADD_DONE_POST_START: 'TOGGLE_ADD_DONE_POST_START',
  TOGGLE_ADD_DONE_POST_SUCCESS: 'TOGGLE_ADD_DONE_POST_SUCCESS',
  TOGGLE_ADD_DONE_POST_FAIL: 'TOGGLE_ADD_DONE_POST_FAIL',
  UPDATE_USER_DONES_START: 'UPDATE_USER_DONES_START',
  UPDATE_USER_DONES_SUCCESS: 'UPDATE_USER_DONES_SUCCESS',
  UPDATE_USER_DONES_FAIL: 'UPDATE_USER_DONES_FAIL'
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
    const collection = type === 'adds' ? 'adds' : 'dones';
    const otherCollection = type === 'adds' ? 'dones' : 'adds';

    // {collection}/{ownerUserId}_{postId}
    batcher.set(
      firebase
        .firestore()
        .collection(collection)
        .doc(`${ownerUserId}_${postId}`),
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

    updateCounts(batcher, !isActive, collection, postId, ownerUserId, userId);

    if (!isActive && isOtherActive) {
      // {otherCollection}/{ownerUserId}_{postId}
      batcher.set(
        firebase
          .firestore()
          .collection(otherCollection)
          .doc(`${ownerUserId}_${postId}`),
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
        otherCollection,
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
        queries.USERS_POSTS_DONES.type,
        postId,
        !isActive
      )
    );
    if (!isActive && isOtherActive) {
      dispatch(
        toggleUsersPostsListsItem(
          userId,
          queries.USERS_POSTS_ADDS.type,
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

export const subscribeToDones = (userId: string) => {
  return (dispatch: Dispatch) => {
    return dispatch(
      subscribeToAllDocuments(
        STATE_KEY,
        queries.USER_DONES.query({ userId }),
        userId,
        queries.USER_DONES.type
      )
    );
  };
};

export const updateUserDones = (userId: string, value: number) => (
  dispatch: Dispatch
) => {
  dispatch({ type: types.UPDATE_USER_DONES_START });

  const batcher = new Batcher(firebase.firestore());

  overwriteUserCounts(batcher, 'dones', userId, value);

  batcher.write();

  dispatch({ type: types.UPDATE_USER_DONES_SUCCESS });
};
