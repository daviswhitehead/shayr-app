import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { user } from '../../../../shayr-backend/functions/src/model/users';
import { Toaster } from '../../components/Toaster';
import {
  arrayRemove,
  arrayUnion,
  increment,
  ts
} from '../../lib/FirebaseHelpers';
import {
  actionTypeActiveToasts,
  actionTypeInactiveToasts
} from '../../styles/Copy';

type ActionType = 'shares' | 'adds' | 'dones' | 'likes';

export const types = {
  POST_ACTION_START: 'POST_ACTION_START',
  POST_ACTION_USERS_POSTS_UPDATE_SUCCESS:
    'POST_ACTION_USERS_POSTS_UPDATE_SUCCESS',
  POST_ACTION_ACTION_UPDATE_SUCCESS: 'POST_ACTION_ACTION_UPDATE_SUCCESS',
  POST_ACTION_SUCCESS: 'POST_ACTION_SUCCESS',
  POST_ACTION_FAIL: 'POST_ACTION_FAIL'
};

export const postAction = (
  userId: string,
  post: any,
  actionType: ActionType,
  isNowActive: boolean
) => async (dispatch: Dispatch) => {
  const actionString = actionType.slice(0, -1);

  dispatch({
    type: types.POST_ACTION_START,
    payload: actionType
  });

  firebase
    .analytics()
    .logEvent(`${types.POST_ACTION_START}__${actionString}`.toUpperCase());

  try {
    // toast
    isNowActive
      ? Toaster(actionTypeActiveToasts[actionType])
      : Toaster(actionTypeInactiveToasts[actionType]);

    await firebase
      .firestore()
      .doc(post._reference)
      .set(
        {
          [actionType]: isNowActive ? arrayUnion(userId) : arrayRemove(userId),
          [`${actionString}Count`]: increment(isNowActive ? +1 : -1),
          updatedAt: ts
        },
        { merge: true }
      );

    dispatch({
      type: types.POST_ACTION_USERS_POSTS_UPDATE_SUCCESS,
      payload: actionType
    });

    // update [actionType] object
    const actionRef = firebase
      .firestore()
      .collection(actionType)
      .doc(`${userId}_${post._id}`);

    await firebase.firestore().runTransaction(t =>
      t.get(actionRef).then(documentSnapshot => {
        if (!documentSnapshot.exists) {
          t.set(actionRef, {
            active: true,
            createdAt: ts,
            postId: post._id,
            updatedAt: ts,
            userId
          });
        } else {
          t.set(
            actionRef,
            {
              active: isNowActive,
              updatedAt: ts
            },
            {
              merge: true
            }
          );
        }
      })
    );
    dispatch({
      type: types.POST_ACTION_ACTION_UPDATE_SUCCESS,
      payload: actionType
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.POST_ACTION_FAIL,
      payload: actionType,
      error
    });
  }
};
