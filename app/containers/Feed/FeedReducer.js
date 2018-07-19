import { types } from './FeedActions';

const initialState = {
  posts: null,
  lastPost: null,
  error: null,
}

function feedReducer(state = initialState, action) {
  console.log(action.type);
  // Failure Handling
  if (action.type.substr(action.type.length - 4) === 'FAIL') {
    return {
      ...state,
      error: action.payload
    }
  }

  // Case Handling
  switch (action.type) {
    case types.LOAD_POSTS_SUCCESS: {
      return {
        ...state,
        posts: action.payload
      }
    }
  }
  switch (action.type) {
    case types.PAGINATE_POSTS_SUCCESS: {
      return {
        ...state,
        posts: {
          ...state.posts,
          ...action.payload
        }
      }
    }
  }
  switch (action.type) {
    case types.LAST_POST: {
      return {
        ...state,
        lastPost: action.payload
      }
    }
  }

  return state
}

export default feedReducer;
