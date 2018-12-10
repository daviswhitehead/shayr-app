import { types } from "./PostActionsActions";

const initialState = {
  postDetail: null,
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

  switch (action.type) {
    case types.POST_DETAILS_VIEW: {
      return {
        ...state,
        postDetail: action.payload
      };
    }
  }

  switch (action.type) {
    case types.POST_DETAILS_BACK: {
      return {
        ...state,
        postDetail: null
      };
    }
  }

  return state;
}

export default postActionsReducer;
