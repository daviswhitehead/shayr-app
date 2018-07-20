import { types } from './PostsActions';

const initialState = {
  posts: null,
  lastPost: null,
  refreshing: false,
  loadedPostMeta: false,
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
        posts: action.payload,
        refreshing: false
      }
    }
  }
  switch (action.type) {
    case types.PAGINATE_POSTS_SUCCESS: {
      return {
        ...state,
        posts: {
          ...state.posts,
          ...action.payload,
          refreshing: false
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
  switch (action.type) {
    case types.LOAD_POST_META_SUCCESS: {
      return {
        ...state,
        loadedPostMeta: true
      }
    }
  }
  switch (action.type) {
    case types.REFRESH: {
      console.log(state);
      return {
        ...state,
        refreshing: true
      }
    }
  }

  return state
}

export default feedReducer;
