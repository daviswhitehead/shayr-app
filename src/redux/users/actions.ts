import {
  formatDocumentSnapshot,
  getDocument,
  User
} from '@daviswhitehead/shayr-resources';
import firebase from 'react-native-firebase';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { State } from './reducer';

// Types
export enum types {
  SUBSCRIBE_USER_START = 'SUBSCRIBE_USER_START',
  SUBSCRIBE_USER_SUCCESS = 'SUBSCRIBE_USER_SUCCESS',
  SUBSCRIBE_USER_FAIL = 'SUBSCRIBE_USER_FAIL',
  GET_USER_START = 'GET_USER_START',
  GET_USER_SUCCESS = 'GET_USER_SUCCESS',
  GET_USER_FAIL = 'GET_USER_FAIL'
}

// Actions
interface SubscribeToUserStartAction {
  type: types.SUBSCRIBE_USER_START;
}
interface SubscribeToUserSuccessAction {
  type: types.SUBSCRIBE_USER_SUCCESS;
  userId: string;
  user: User;
}
interface SubscribeToUserFailAction {
  type: types.SUBSCRIBE_USER_FAIL;
}
interface GetUserStartAction {
  type: types.GET_USER_START;
}
interface GetUserSuccessAction {
  type: types.GET_USER_SUCCESS;
  userId: string;
  user: User;
}
interface GetUserFailAction {
  type: types.GET_USER_FAIL;
}
export type Actions =
  | SubscribeToUserStartAction
  | SubscribeToUserSuccessAction
  | SubscribeToUserFailAction
  | GetUserStartAction
  | GetUserSuccessAction
  | GetUserFailAction;

// Action Creators
interface Extra {}
type ThunkResult<R> = ThunkAction<R, State, Extra, Actions>;

export const subscribeToUser = (userId: string): ThunkResult<() => void> => (
  dispatch: ThunkDispatch<State, Extra, Actions>
) => {
  dispatch({ type: types.SUBSCRIBE_USER_START });
  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .onSnapshot(
      (documentSnapshot) => {
        dispatch({
          type: types.SUBSCRIBE_USER_SUCCESS,
          userId,
          user: formatDocumentSnapshot(documentSnapshot)
        });
      },
      (error) => {
        console.error(error);
        dispatch({
          type: types.SUBSCRIBE_USER_FAIL,
          error
        });
      }
    );
};

export const getUser = (userId: string): ThunkResult<void> => async (
  dispatch: ThunkDispatch<State, Extra, Actions>
) => {
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
