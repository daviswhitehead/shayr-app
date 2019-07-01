import _ from 'lodash';
import { types } from './actions';

const initialState = {};

function usersListsReducer(state = initialState, action) {
  switch (action.type) {
    case types.ADD_TO_USERS_POSTS_LIST: {
      const items = _.get(state, [action.listKey, 'isRefreshing'], false)
        ? [...action.usersPostsIds]
        : _.uniq([
            ..._.get(state, [action.listKey, 'items'], []),
            ...action.usersPostsIds
          ]);

      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          items
        }
      };
    }
    case types.REFRESH_USERS_POSTS_LIST: {
      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          isRefreshing: true
        }
      };
    }
    case types.USERS_POSTS_LIST_LOADING: {
      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          isLoading: true
        }
      };
    }
    case types.USERS_POSTS_LIST_LOADED: {
      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          isLoaded: true,
          isLoading: false,
          isRefreshing: false,
          isLoadedAll: action.lastItem === 'DONE' ? true : false,
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
