import { Batcher, documentId } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { Toaster } from '../../components/Toaster';
import { eventNames } from '../../lib/AnalyticsDefinitions';
import { logEvent } from '../../lib/FirebaseAnalytics';
import { ts } from '../../lib/FirebaseHelpers';
import { getQuery, queryTypes } from '../../lib/FirebaseQueries';
import { overwriteUserCounts, updateCounts } from '../../lib/FirebaseWrites';
import { subscribeToAllDocuments } from '../../redux/FirebaseRedux';
import {
  actionTypeActiveToasts,
  actionTypeInactiveToasts
} from '../../styles/Copy';
import { toggleItem } from '../lists/actions';
import { refreshUsersPostsDocuments } from '../usersPosts/actions';

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
  isOtherActive: boolean,
  visibleToUserIds: Array<string> = []
) => async (dispatch: Dispatch) => {
  dispatch({
    type: types.TOGGLE_ADD_DONE_POST_START
  });

  logEvent(
    !isOtherActive && isActive ? eventNames.REMOVE_ADD : eventNames.ADD_TO_LIST
  );

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

    updateCounts(
      batcher,
      !isActive,
      'adds',
      postId,
      ownerUserId,
      userId,
      undefined,
      visibleToUserIds
    );

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
        userId,
        undefined,
        visibleToUserIds
      );
    }

    await batcher.write();

    dispatch(refreshUsersPostsDocuments(postId, 'server'));
    // dispatch(refreshUsersPostsDocuments(postId, 'cache'));
    dispatch(
      toggleItem(
        'usersPostsLists',
        `${userId}_${queryTypes.USERS_POSTS_ADDS}`,
        `${userId}_${postId}`,
        !isActive
      )
    );
    if (!isActive && isOtherActive) {
      dispatch(
        toggleItem(
          'usersPostsLists',
          `${userId}_${queryTypes.USERS_POSTS_DONES}`,
          `${userId}_${postId}`,
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
    return subscribeToAllDocuments(
      dispatch,
      STATE_KEY,
      getQuery(queryTypes.USER_ADDS)(userId),
      userId,
      queryTypes.USER_ADDS
    );
  };
};

export const updateUserAdds = (userId: string, value: number) => async (
  dispatch: Dispatch
) => {
  dispatch({ type: types.UPDATE_USER_ADDS_START });

  const batcher = new Batcher(firebase.firestore());

  overwriteUserCounts(batcher, 'adds', userId, value);

  await batcher.write();

  dispatch({ type: types.UPDATE_USER_ADDS_SUCCESS });
};
