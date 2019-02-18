import { types } from './actions';

const initialState = {
  post: null,
  error: null,
};

function postDetailReducer(state = initialState, action) {
  if (action.type.substr(action.type.length - 4) === 'FAIL') {
    return {
      ...state,
      error: action.error,
    };
  }

  switch (action.type) {
    case types.POST_DETAIL_VIEW: {
      return {
        ...state,
        post: action.payload,
      };
    }
  }

  switch (action.type) {
    case types.POST_DETAIL_BACK: {
      return {
        ...state,
        post: null,
      };
    }
  }

  return state;
}

export default postDetailReducer;
