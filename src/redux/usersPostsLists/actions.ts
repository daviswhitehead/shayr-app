import { DocumentSnapshot } from 'react-native-firebase/firestore';
import { Dispatch } from 'redux';

export const types = {
  ADD_TO_USERS_POSTS_LIST: 'ADD_TO_USERS_POSTS_LIST',
  REFRESH_USERS_POSTS_LIST: 'REFRESH_USERS_POSTS_LIST',
  USERS_POSTS_LIST_LOADED: 'USERS_POSTS_LIST_LOADED'
};

export const addToUsersPostsList = (
  ownerUserId: string,
  list: string,
  usersPostsIds: Array<string>
) => (dispatch: Dispatch) => {
  dispatch({
    type: types.ADD_TO_USERS_POSTS_LIST,
    listKey: `${ownerUserId}_${list}`,
    usersPostsIds
  });
};

export const refreshUsersPostsList = (ownerUserId: string, list: string) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: types.REFRESH_USERS_POSTS_LIST,
    listKey: `${ownerUserId}_${list}`
  });
};

export const usersPostsListLoaded = (
  ownerUserId: string,
  list: string,
  lastItem: DocumentSnapshot | string
) => (dispatch: Dispatch) => {
  dispatch({
    type: types.USERS_POSTS_LIST_LOADED,
    listKey: `${ownerUserId}_${list}`,
    lastItem
  });
};
