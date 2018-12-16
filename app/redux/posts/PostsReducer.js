import { types } from "./PostsActions";

const initialState = {
  feedPosts: null,
  queuePosts: null,
  feedLastPost: null,
  queueLastPost: null,
  feedRefreshing: false,
  queueRefreshing: false,
  error: null
};

function feedReducer(state = initialState, action) {
  if (action.type.substr(action.type.length - 4) === "FAIL") {
    return {
      ...state,
      error: action.error
    };
  }

  switch (action.type) {
    case types.LOAD_POSTS_SUCCESS: {
      if (action.query === "feed") {
        return {
          ...state,
          feedPosts: action.payload,
          refreshing: false
        };
      }
      if (action.query === "queue") {
        return {
          ...state,
          queuePosts: action.payload,
          refreshing: false
        };
      }
    }
  }
  switch (action.type) {
    case types.PAGINATE_POSTS_SUCCESS: {
      if (action.query === "feed") {
        return {
          ...state,
          feedPosts: {
            ...state.feedPosts,
            ...action.payload
          }
        };
      }
      if (action.query === "queue") {
        return {
          ...state,
          queuePosts: {
            ...state.queuePosts,
            ...action.payload
          }
        };
      }
    }
  }
  switch (action.type) {
    case types.LAST_POST: {
      if (action.query === "feed") {
        return {
          ...state,
          feedLastPost: action.payload
        };
      }
      if (action.query === "queue") {
        return {
          ...state,
          queueLastPost: action.payload
        };
      }
    }
  }
  switch (action.type) {
    case types.REFRESH: {
      return {
        ...state,
        refreshing: true
      };
    }
  }

  return state;
}

export default feedReducer;
