import firebase from 'react-native-firebase';
import {
  ts,
  getUserId,
  getDocShares,
  getRefData
} from '../../lib/FirebaseHelpers';
import _ from 'lodash';

// Action Types
export const types = {
  NEW_ACTION_START: 'NEW_ACTION_START',
  NEW_ACTION_SUCCESS: 'NEW_ACTION_SUCCESS',
  NEW_ACTION_FAIL: 'NEW_ACTION_FAIL',
  TOGGLE_ACTION_START: 'TOGGLE_ACTION_START',
  TOGGLE_ACTION_SUCCESS: 'TOGGLE_ACTION_SUCCESS',
  TOGGLE_ACTION_FAIL: 'TOGGLE_ACTION_FAIL',
};

const newActionExists = (documentSnapshot) => {
  documentSnapshot.ref.set({
    updatedAt: ts,
    visible: true
  }, {
    merge: true
  })
}

const toggleActionExists = (documentSnapshot) => {
  documentSnapshot.ref.set({
    updatedAt: ts,
    visible: !documentSnapshot.data().visible
  }, {
    merge: true
  })
}

const actionWrite = (actionType, userId, postId, writeType) => {
  const ref = firebase.firestore()
    .collection('users')
    .doc(userId)
    .collection(actionType + 's');

  return ref
    .where('post', '==', firebase.firestore().collection('posts').doc(postId))
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        ref.add({
          createdAt: ts,
          post: firebase.firestore().collection('posts').doc(postId),
          updatedAt: ts,
          user: firebase.firestore().collection('users').doc(userId),
          visible: true
        })
      }
      else if (querySnapshot.size == 1) {
        querySnapshot.forEach((documentSnapshot) => {
          if (writeType == 'new') {
            newActionExists(documentSnapshot)
          } else if (writeType == 'toggle') {
            toggleActionExists(documentSnapshot)
          }
        })
      }
    })
}

export const newAction = (actionType, userId, postId) => {
  return function(dispatch) {
    dispatch({
      type: types.NEW_ACTION_START,
      actionType: actionType
    });
    return actionWrite(actionType, userId, postId, 'new')
      .then((value) => {
        dispatch({
          type: types.NEW_ACTION_SUCCESS,
          actionType: actionType
        });
      })
      .catch((e) => {
        console.error(e);
        dispatch({
          type: types.NEW_ACTION_FAIL,
          actionType: actionType,
          payload: e
        });
      });
  }
}

export const toggleAction = (actionType, userId, postId) => {
  return function(dispatch) {
    dispatch({
      type: types.TOGGLE_ACTION_START,
      actionType: actionType
    });
    return actionWrite(actionType, userId, postId, 'toggle')
      .then((value) => {
        dispatch({
          type: types.TOGGLE_ACTION_SUCCESS,
          actionType: actionType
        });
      })
      .catch((e) => {
        console.error(e);
        dispatch({
          type: types.TOGGLE_ACTION_FAIL,
          actionType: actionType,
          payload: e
        });
      });
  }
}
