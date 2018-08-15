import firebase from 'react-native-firebase';
import {
  ts,
  getUserId,
  getDocShares,
  getRefData
} from '../../lib/FirebaseHelpers';
import { addPost } from '../../lib/FirebaseHelpers';
import _ from 'lodash';

// Action Types
export const types = {
  SHAYR_START: 'SHAYR_START',
  SHAYR_SUCCESS: 'SHAYR_SUCCESS',
  SHAYR_FAIL: 'SHAYR_FAIL',
  ADD_START: 'ADD_START',
  ADD_SUCCESS: 'ADD_SUCCESS',
  ADD_FAIL: 'ADD_FAIL',
  DONE_START: 'DONE_START',
  DONE_SUCCESS: 'DONE_SUCCESS',
  DONE_FAIL: 'DONE_FAIL',
  LIKE_START: 'LIKE_START',
  LIKE_SUCCESS: 'LIKE_SUCCESS',
  LIKE_FAIL: 'LIKE_FAIL',

};

addPost(this.props.auth.user, payload['key']);

export const addPost = (user, postId) => {
  return function(dispatch) {
    dispatch({ type: types.ADD_START });
    const ref = firebase.firestore().collection('users').doc(getUserId(user))
    .collection('postsMeta').doc(postId)
    return ref
    .get()
    .then((doc) => {
      if (!doc.exists) {
        ref.set({
          addCreatedAt: ts,
          addUpdatedAt: ts,
          addVisible: true
        })
      } else {
        ref.set({
          addUpdatedAt: ts,
          addVisible: true
        }, {
          merge: true
        })
      }
      console.log('addPost success');
    })
    .catch((error) => {
      console.error(error);
    });
  }
}
