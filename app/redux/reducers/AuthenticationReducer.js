import { authenticationActionTypes, authenticationActions } from '../Actions';

const initialState = {
  user: false,
  hasToken: false,
}

function authReducer(state = initialState, action) {
  switch (action.type) {
    case authenticationActionTypes.SIGN_IN: {
      console.log('hello world');
      return {
        ...state
      }
    }
  }

  return state
}

export default authReducer;
