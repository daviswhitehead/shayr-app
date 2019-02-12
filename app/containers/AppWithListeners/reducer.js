import { types } from "./actions";

const initialState = {
  postId: null,
  error: null
};

function notificationReducer(state = initialState, action) {
  // Failure Handling
  if (action.type.substr(action.type.length - 4) === "FAIL") {
    return {
      ...state,
      error: action.error
    };
  }

  // Case Handling
  switch (action.type) {
    case types.NOTIFICATION_NAVIGATION_PROCESSED: {
      return {
        ...state,
        postId: action.payload
      };
    }
  }

  return state;
}

export default notificationReducer;
