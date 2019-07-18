import { getDocument } from '@daviswhitehead/shayr-resources';
import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { formatDocumentSnapshot } from '../../lib/FirebaseHelpers';

export const types = {
  SUBSCRIBE_USER_START: 'SUBSCRIBE_USER_START',
  SUBSCRIBE_USER_SUCCESS: 'SUBSCRIBE_USER_SUCCESS',
  SUBSCRIBE_USER_FAIL: 'SUBSCRIBE_USER_FAIL',
  GET_USER_START: 'GET_USER_START',
  GET_USER_SUCCESS: 'GET_USER_SUCCESS',
  GET_USER_FAIL: 'GET_USER_FAIL'
};

export const subscribeToUser = (userId: string) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: types.SUBSCRIBE_USER_START });
    return firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(
        documentSnapshot => {
          dispatch({
            type: types.SUBSCRIBE_USER_SUCCESS,
            userId,
            user: formatDocumentSnapshot(documentSnapshot)
          });
        },
        error => {
          console.error(error);
          dispatch({
            type: types.SUBSCRIBE_USER_FAIL,
            error
          });
        }
      );
  };
};

export const getUser = (userId: string) => async (dispatch: Dispatch) => {
  dispatch({ type: types.GET_USER_START });
  const user = await getDocument(firebase.firestore(), `users/${userId}`);
  if (user) {
    dispatch({
      type: types.GET_USER_SUCCESS,
      userId,
      user
    });
  } else {
    dispatch({
      type: types.GET_USER_FAIL,
      userId,
      user
    });
  }
};
