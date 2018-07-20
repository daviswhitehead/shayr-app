import { types } from './AuthenticationActions';

const initialState = {
  user: null,
  accessTokenSaved: false,
  error: null
}

function authenticationReducer(state = initialState, action) {
  // Failure Handling
  if (action.type.substr(action.type.length - 4) === 'FAIL') {
    return {
      ...state,
      error: action.payload
    }
  }

  // Case Handling
  switch (action.type) {
    case types.AUTH_SUCCESS: {
      return {
        ...state,
        user: action.payload
      }
    }
    case types.SIGN_OUT_USER: {
      return {
        ...state,
        user: null
      }
    }
    case types.ACCESS_TOKEN_STATUS: {
      return {
        ...state,
        accessTokenSaved: action.payload
      }
    }
    case types.ACCESS_TOKEN_SAVED: {
      return {
        ...state,
        accessTokenSaved: true
      }
    }
  }

  return state
}

export default authenticationReducer;
