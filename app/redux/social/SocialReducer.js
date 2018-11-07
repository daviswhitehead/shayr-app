import { types } from "./SocialActions";

const initialState = {
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
    case types.LOAD_FRIENDS_SUCCESS: {
      return {
        ...state,
        friends: action.payload
      };
    }
  }

  return state;
}

export default socialReducer;
