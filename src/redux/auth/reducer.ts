import { types } from './actions';

const initialState = {
  user: {},
  isAuthenticated: false,
  hasAccessToken: false,
  isSigningOut: false
};

function appListenerReducer(state = initialState, action) {
  // Case Handling
  switch (action.type) {
    case types.AUTH_STATUS: {
      return {
        ...state,
        user: action.user,
        isAuthenticated: action.isAuthenticated,
        isSigningOut: action.isSigningOut
      };
    }
    case types.ACCESS_TOKEN_STATUS: {
      return {
        ...state,
        hasAccessToken: action.hasAccessToken
      };
    }
    case types.ACCESS_TOKEN_SAVED: {
      return {
        ...state,
        hasAccessToken: action.hasAccessToken
      };
    }
    case types.SIGN_OUT_START: {
      return {
        ...state,
        isSigningOut: action.isSigningOut
      };
    }
    default: {
      return state;
    }
  }
}

export default appListenerReducer;
