import { types } from './actions';

const initialState = {
  self: null,
  friendships: null,
  friends: null,
  error: null,
};

function usersReducer(state = initialState, action) {
  // Failure Handling
  if (action.type.substr(action.type.length - 4) === 'FAIL') {
    return {
      ...state,
      error: action.error,
    };
  }

  // Case Handling
  switch (action.type) {
    case types.SUBSCRIBE_SELF_SUCCESS: {
      return {
        ...state,
        self: action.self,
      };
    }
    case types.SUBSCRIBE_FRIENDSHIPS_SUCCESS: {
      return {
        ...state,
        friendships: action.friendships,
      };
    }
    case types.SUBSCRIBE_FRIENDS_SUCCESS: {
      return {
        ...state,
        friends: action.friends,
      };
    }
    default: {
      return state;
    }
  }
}

export default usersReducer;
