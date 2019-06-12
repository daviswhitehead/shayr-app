import { Dispatch } from 'redux';

export const types = {
  ADD_TO_USERS_POSTS_LIST: 'ADD_TO_USERS_POSTS_LIST',
  REFRESH_USERS_POSTS_LIST: 'REFRESH_USERS_POSTS_LIST',
  USERS_POSTS_LIST_LOADED: 'USERS_POSTS_LIST_LOADED'
};

export const addToUsersPostsList = (
  owningUserId: string,
  list: string,
  usersPostsIds: Array<string>
) => (dispatch: Dispatch) => {
  dispatch({
    type: types.ADD_TO_USERS_POSTS_LIST,
    listKey: `${owningUserId}_${list}`,
    usersPostsIds
  });
};

export const refreshUsersPostsList = (owningUserId: string, list: string) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: types.REFRESH_USERS_POSTS_LIST,
    listKey: `${owningUserId}_${list}`
  });
};

export const usersPostsListLoaded = (
  owningUserId: string,
  list: string,
  lastItem: string
) => (dispatch: Dispatch) => {
  dispatch({
    type: types.USERS_POSTS_LIST_LOADED,
    listKey: `${owningUserId}_${list}`,
    lastItem
  });
};
