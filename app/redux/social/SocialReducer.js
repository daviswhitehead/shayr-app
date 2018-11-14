import { types } from "./SocialActions";

const initialState = {
  friendships: null,
  friends: null,
  error: null
};

function socialReducer(state = initialState, action) {
  // Failure Handling
  if (action.type.substr(action.type.length - 4) === "FAIL") {
    return {
      ...state,
      error: action.error
    };
  }

  // Case Handling
  switch (action.type) {
    case types.LOAD_FRIENDSHIPS_SUCCESS: {
      return {
        ...state,
        friendships: action.payload
      };
    }
    case types.LOAD_FRIEND_SUCCESS: {
      return {
        ...state,
        friends: action.payload
      };
    }
    case types.LOAD_SELF_SUCCESS: {
      return {
        ...state,
        self: action.payload
      };
    }
  }

  return state;
}

export default socialReducer;
