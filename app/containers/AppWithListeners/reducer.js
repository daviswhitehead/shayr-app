import { types } from './actions';

const initialState = {
  user: null,
  isAuthenticated: false,
  hasAccessToken: false,
  error: null,
};

function authenticationReducer(state = initialState, action) {
  // Failure Handling
  if (action.type.substr(action.type.length - 4) === 'FAIL') {
    return {
      ...state,
      error: action.error,
    };
  }

  // Case Handling
  switch (action.type) {
    case types.AUTH_STATUS: {
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        user: action.user,
      };
    }
    case types.ACCESS_TOKEN_STATUS: {
      return {
        ...state,
        hasAccessToken: action.hasAccessToken,
      };
    }
    default: {
      return state;
    }
  }
}

export default authenticationReducer;
