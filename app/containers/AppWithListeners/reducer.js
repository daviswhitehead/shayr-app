import { types } from './actions';
import { types as loginTypes } from '../Login/actions';

const initialState = {
  user: null,
  isAuthenticated: false,
  hasAccessToken: false,
  listenersReady: false,
  self: null,
  friendships: null,
  friends: null,
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
    case loginTypes.ACCESS_TOKEN_SAVED: {
      return {
        ...state,
        hasAccessToken: action.hasAccessToken,
      };
    }
    case types.ARE_LISTENERS_READY: {
      return {
        ...state,
        listenersReady: action.listenersReady,
      };
    }
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

export default appListenerReducer;
