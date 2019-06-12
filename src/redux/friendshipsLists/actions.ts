import { Dispatch } from 'redux';

export const types = {
  ADD_TO_FRIENDSHIPS_LIST: 'ADD_TO_FRIENDSHIPS_LIST',
  FRIENDSHIP_LIST_LOADED: 'FRIENDSHIP_LIST_LOADED'
};

export const addToFriendshipsList = (
  owningUserId: string,
  friendshipId: string
) => (dispatch: Dispatch) => {
  dispatch({
    type: types.ADD_TO_FRIENDSHIPS_LIST,
    listKey: `${owningUserId}`,
    friendshipId
  });
};

export const friendshipsListLoaded = (owningUserId: string) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: types.FRIENDSHIP_LIST_LOADED,
    listKey: `${owningUserId}`
  });
};
