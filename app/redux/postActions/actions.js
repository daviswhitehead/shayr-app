import firebase from 'react-native-firebase';
import Toaster from '../../components/Toaster';
import { actionTypeActiveToasts, actionTypeInactiveToasts } from '../../styles/Copy';
import { ts } from '../../lib/FirebaseHelpers';

export const types = {
  POST_ACTION_START: 'POST_ACTION_START',
  POST_ACTION_SUCCESS: 'POST_ACTION_SUCCESS',
  POST_ACTION_FAIL: 'POST_ACTION_FAIL',
};

export const postAction = (actionType, userId, postId) => function _postAction(dispatch) {
  dispatch({
    type: types.POST_ACTION_START,
    payload: actionType,
  });
  const actionRef = firebase
    .firestore()
    .collection(`${actionType}s`)
    .doc(`${userId}_${postId}`);

  let actionActive = null;

  return firebase
    .firestore()
    .runTransaction(t => t.get(actionRef).then((documentSnapshot) => {
      if (!documentSnapshot.exists) {
        actionActive = true;
        t.set(actionRef, {
          active: true,
          createdAt: ts,
          postId,
          updatedAt: ts,
          userId,
        });
      } else {
        actionActive = !documentSnapshot.data().active;
        t.set(
          actionRef,
          {
            active: actionActive,
            updatedAt: ts,
          },
          {
            merge: true,
          },
        );
      }
    }))
    .then((value) => {
      const toast = actionActive
        ? Toaster(actionTypeActiveToasts[actionType])
        : Toaster(actionTypeInactiveToasts[actionType]);
      dispatch({
        type: types.POST_ACTION_SUCCESS,
        payload: actionType,
      });
    })
    .catch((e) => {
      console.error(e);
      dispatch({
        type: types.POST_ACTION_FAIL,
        payload: actionType,
        error: e,
      });
    });
};
