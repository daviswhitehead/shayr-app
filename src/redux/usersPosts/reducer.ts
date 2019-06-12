import { types } from './actions';

const initialState = {};

function usersReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_USERS_POSTS_SUCCESS: {
      return {
        ...state,
        ...action.usersPosts
      };
    }
    default: {
      return state;
    }
  }
}

export default usersReducer;
