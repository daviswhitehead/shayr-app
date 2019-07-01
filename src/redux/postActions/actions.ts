import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { Toaster } from '../../components/Toaster';
import { ts } from '../../lib/FirebaseHelpers';
import {
  actionTypeActiveToasts,
  actionTypeInactiveToasts
} from '../../styles/Copy';

type ActionType = 'shares' | 'adds' | 'dones' | 'likes';

export const types = {
  POST_ACTION_START: 'POST_ACTION_START',
  POST_ACTION_CLIENT_UPDATE: 'POST_ACTION_CLIENT_UPDATE',
  POST_ACTION_SERVER_UPDATE: 'POST_ACTION_SERVER_UPDATE',
  POST_ACTION_SUCCESS: 'POST_ACTION_SUCCESS',
  POST_ACTION_FAIL: 'POST_ACTION_FAIL'
};

export const postAction = (
  userId: string,
  postId: string,
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

    // update client store
    dispatch({
      type: types.POST_ACTION_CLIENT_UPDATE,
      userId,
      postId,
      actionType,
      isNowActive
    });

    // update [actionType] object
    const actionRef = firebase
      .firestore()
      .collection(actionType)
      .doc(`${userId}_${postId}`);

    await firebase.firestore().runTransaction(t =>
      t.get(actionRef).then(documentSnapshot => {
        if (!documentSnapshot.exists) {
          t.set(actionRef, {
            active: true,
            createdAt: ts,
            postId,
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
      type: types.POST_ACTION_SERVER_UPDATE,
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
