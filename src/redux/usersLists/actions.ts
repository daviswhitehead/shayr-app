import { Dispatch } from 'redux';

export const types = {
  ADD_TO_USERS_LIST: 'ADD_TO_USERS_LIST',
  USERS_LIST_LOADED: 'USERS_LIST_LOADED'
};

export const addToUsersList = (
  ownerUserId: string,
  userId: string,
  list: string
) => (dispatch: Dispatch) => {
  dispatch({
    type: types.ADD_TO_USERS_LIST,
    listKey: `${ownerUserId}_${list}`,
    userId
  });
};

export const usersListLoaded = (ownerUserId: string, list: string) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: types.USERS_LIST_LOADED,
    listKey: `${ownerUserId}_${list}`
  });
};
