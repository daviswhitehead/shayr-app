import { types } from './PostsActions';

const initialState = {
  feedPosts: null,
  queuePosts: null,
  lastPost: null,
  refreshing: false,
  loadedPostMeta: false,
  error: null,
}

function feedReducer(state = initialState, action) {
  // console.log(action.type);
  // Failure Handling
  if (action.type.substr(action.type.length - 4) === 'FAIL') {
    return {
      ...state,
      error: action.error
    }
  }

  // Case Handling
  switch (action.type) {
    case types.LOAD_QUEUE_POSTS_SUCCESS: {
      return {
        ...state,
        queuePosts: action.payload,
        refreshing: false
      }
    }
  }
  switch (action.type) {
    case types.LOAD_FEED_POSTS_SUCCESS: {
      return {
        ...state,
        feedPosts: action.payload,
        refreshing: false
      }
    }
  }
  switch (action.type) {
    case types.PAGINATE_FEED_POSTS_SUCCESS: {
      return {
        ...state,
        feedPosts: {
          ...state.feedPosts,
          ...action.payload,
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
      return {
        ...state,
        refreshing: true
      }
    }
  }

  return state
}

export default feedReducer;
