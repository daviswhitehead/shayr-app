import { types } from './actions';

const initialState = {
  user: null,
  isAuthenticated: false,
  hasAccessToken: false,
  isSigningOut: false,
  listenersReady: false,
  error: null,
};

function appListenerReducer(state = initialState, action) {
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
        user: action.user,
        isAuthenticated: action.isAuthenticated,
        authListenersGo: action.isAuthenticated,
        isSigningOut: action.isSigningOut,
      };
    }
    case types.ACCESS_TOKEN_STATUS: {
      return {
        ...state,
        hasAccessToken: action.hasAccessToken,
      };
    }
    case types.ACCESS_TOKEN_SAVED: {
      return {
        ...state,
        hasAccessToken: action.hasAccessToken,
      };
    }
    case types.SIGN_OUT_START: {
      return {
        ...state,
        isSigningOut: action.isSigningOut,
      };
    }
    case types.ARE_LISTENERS_READY: {
      return {
        ...state,
        listenersReady: action.listenersReady,
      };
    }
    default: {
      return state;
    }
  }
}

export default appListenerReducer;
