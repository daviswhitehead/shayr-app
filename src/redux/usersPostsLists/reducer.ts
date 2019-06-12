import _ from 'lodash';
import { types } from './actions';

const initialState = {};

function usersListsReducer(state = initialState, action) {
  switch (action.type) {
    case types.ADD_TO_USERS_POSTS_LIST: {
      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          items: [
            ..._.get(state, [action.listKey, 'items'], []),
            action.usersPostsId
          ]
        }
      };
    }
    case types.USERS_POSTS_LIST_LOADED: {
      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          isLoaded: true,
          lastItem: action.lastItem
        }
      };
    }
    default: {
      return state;
    }
  }
}

export default usersListsReducer;
