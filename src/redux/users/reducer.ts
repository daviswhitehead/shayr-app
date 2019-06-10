import { types } from './actions';

const initialState = {};

function usersReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_USER_SUCCESS:
    case types.SUBSCRIBE_USER_SUCCESS: {
      return {
        ...state,
        [action.userId]: action.user
      };
    }
    default: {
      return state;
    }
  }
}

export default usersReducer;
