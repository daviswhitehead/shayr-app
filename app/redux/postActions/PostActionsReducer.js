import { types } from "./PostActionsActions";

const initialState = {
  error: null
};

function postActionsReducer(state = initialState, action) {
  // Failure Handling
  if (action.type.substr(action.type.length - 4) === "FAIL") {
    return {
      ...state,
      error: action.error
    };
  }

  switch (action.type) {
    case types.POST_ACTION_SUCCESS: {
      return {
        ...state
      };
    }
  }

  return state;
}

export default postActionsReducer;
