import { types } from './actions';

const initialState = {
  isAppReady: false,
  error: null
};

function appReducer(state = initialState, action) {
  // Failure Handling
  if (action.type.substr(action.type.length - 4) === 'FAIL') {
    return {
      ...state,
      error: action.error
    };
  }

  // Case Handling
  switch (action.type) {
    case types.IS_APP_READY: {
      return {
        ...state,
        isAppReady: action.isAppReady
      };
    }
    default: {
      return state;
    }
  }
}

export default appReducer;
