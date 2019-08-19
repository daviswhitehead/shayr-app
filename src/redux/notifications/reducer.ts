import { types } from './actions';

const initialState = {
  error: null
};

function notificationsReducer(state = initialState, action) {
  // Failure Handling
  if (action.type.substr(action.type.length - 4) === 'FAIL') {
    return {
      ...state,
      error: action.error
    };
  }

  // Case Handling
  switch (action.type) {
    default: {
      return state;
    }
  }
}

export default notificationsReducer;
