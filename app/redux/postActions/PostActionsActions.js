import firebase from "react-native-firebase";
import { NavigationActions } from "react-navigation";
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
  POST_ACTION_FAIL: "POST_ACTION_FAIL",
  POST_DETAILS_VIEW: "POST_DETAILS_VIEW",
  POST_DETAILS_BACK: "POST_DETAILS_BACK"
};

export const postAction = (actionType, userId, postId) => {
  return function(dispatch) {
    dispatch({
      type: types.POST_ACTION_START,
      payload: actionType
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
              postId,
              updatedAt: ts,
              userId
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
          payload: actionType
        });
      })
      .catch(e => {
        console.error(e);
        dispatch({
          type: types.POST_ACTION_FAIL,
          payload: actionType,
          error: e
        });
      });
  };
};

export const postDetailsView = post => {
  return function(dispatch) {
    dispatch(NavigationActions.navigate({ routeName: "PostDetails" }));
    dispatch({
      type: types.POST_DETAILS_VIEW,
      payload: post
    });
  };
};

export const postDetailsBack = () => {
  return function(dispatch) {
    dispatch(NavigationActions.back());
    dispatch({
      type: types.POST_DETAILS_BACK
    });
  };
};
