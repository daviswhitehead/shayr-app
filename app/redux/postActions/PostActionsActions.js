import firebase from "react-native-firebase";
import Toaster from "../../components/Toaster";
import {
  actionTypeActiveToasts,
  actionTypeInactiveToasts
} from "../../styles/Copy";
import { ts } from "../../lib/FirebaseHelpers";

// Action Types
export const types = {
  POST_ACTION_START: "POST_ACTION_START",
  POST_ACTION_SUCCESS: "POST_ACTION_SUCCESS",
  POST_ACTION_FAIL: "POST_ACTION_FAIL"
};

export const postAction = (actionType, userId, postId) => {
  return function(dispatch) {
    dispatch({
      type: types.POST_ACTION_START,
      actionType: actionType
    });
    const actionRef = firebase
      .firestore()
      .collection(actionType + "s")
      .doc(`${userId}_${postId}`);

    let actionActive = null;

    return firebase
      .firestore()
      .runTransaction(t => {
        return t.get(actionRef).then(documentSnapshot => {
          if (!documentSnapshot.exists) {
            actionActive = true;
            t.set(actionRef, {
              active: true,
              createdAt: ts,
              postId: postId,
              updatedAt: ts,
              userId: userId
            });
          } else {
            actionActive = !documentSnapshot.data().active;
            t.set(
              actionRef,
              {
                active: actionActive,
                updatedAt: ts
              },
              {
                merge: true
              }
            );
          }
        });
      })
      .then(value => {
        let toast = actionActive
          ? Toaster(actionTypeActiveToasts[actionType])
          : Toaster(actionTypeInactiveToasts[actionType]);
        dispatch({
          type: types.POST_ACTION_SUCCESS,
          actionType: actionType
        });
      })
      .catch(e => {
        console.error(e);
        dispatch({
          type: types.POST_ACTION_FAIL,
          actionType: actionType,
          error: e
        });
      });
  };
};
