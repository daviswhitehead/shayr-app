import { types } from '../actions/Authentication';

const initialState = {
  user: false,
  accessTokenStored: false,
  authenticated: false,
  error: null
}

function authReducer(state = initialState, action) {
  switch (action.type) {
    case types.AUTH_USER: {
      return {
        ...state,
        authenticated: true,
        error: null
      }
    }
    case types.ACCESS_TOKEN_STORED: {
      console.log(action.payload);
      return {
        ...state,
        accessTokenStored: action.payload,
        error: null
      }
    }
    case types.FACEBOOK_TOKEN_REQUEST: {
      console.log('fbook request started');
      return {
        ...state,
        fbtoken: true,
      }
    }
  }

  return state
}

export default authReducer;
