import { types } from './actions';

export interface State {
  user: {
    uid?: string;
    [any: string]: any;
  };
  hasAccessToken: boolean;
  isSigningOut: boolean;
}

const initialState: State = {
  user: {},
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
