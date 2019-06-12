import { Dispatch } from 'redux';

export const types = {
  ADD_TO_USERS_LIST: 'ADD_TO_USERS_LIST',
  USERS_LIST_LOADED: 'USERS_LIST_LOADED'
};

export const addToUsersList = (
  owningUserId: string,
  userId: string,
  list: string
) => (dispatch: Dispatch) => {
  dispatch({
    type: types.ADD_TO_USERS_LIST,
    listKey: `${owningUserId}_${list}`,
    userId
  });
};

export const usersListLoaded = (owningUserId: string, list: string) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: types.USERS_LIST_LOADED,
    listKey: `${owningUserId}_${list}`
  });
};
