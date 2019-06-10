import { Dispatch } from 'redux';

export const types = {
  ADD_TO_FRIENDS_LIST_START: 'ADD_TO_FRIENDS_LIST_START',
  ADD_TO_FRIENDS_LIST_SUCCESS: 'ADD_TO_FRIENDS_LIST_SUCCESS',
  ADD_TO_FRIENDS_LIST_FAIL: 'ADD_TO_FRIENDS_LIST_FAIL'
};

export const addToFriendsList = (userId: string, friendUserId: string) => 
(dispatch: Dispatch) => {
  dispatch({ type: types.ADD_TO_FRIENDS_LIST_START });
  try {
    dispatch({
      type: types.ADD_TO_FRIENDS_LIST_SUCCESS,
      userId,
      friendUserId
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.ADD_TO_FRIENDS_LIST_FAIL,
      error
    });
  }
};
