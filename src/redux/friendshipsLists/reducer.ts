import _ from 'lodash';
import { types } from './actions';

const initialState = {};

function usersListsReducer(state = initialState, action) {
  switch (action.type) {
    case types.ADD_TO_FRIENDSHIPS_LIST: {
      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          items: [
            ..._.get(state, [action.listKey, 'items'], []),
            action.friendshipId
          ]
        }
      };
    }
    case types.FRIENDSHIP_LIST_LOADED: {
      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          isLoaded: true
        }
      };
    }
    default: {
      return state;
    }
  }
}

export default usersListsReducer;
