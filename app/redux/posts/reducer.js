import { types } from './actions';
import { types as routingTypes } from '../routing/actions';

const initialState = {
  feedPosts: null,
  queuePosts: null,
  feedLastPost: null,
  queueLastPost: null,
  postDetailId: null,
  postDetail: null,
  error: null,
};

function feedReducer(state = initialState, action) {
  if (action.type.substr(action.type.length - 4) === 'FAIL') {
    return {
      ...state,
      error: action.error,
    };
  }

  switch (action.type) {
    case types.LOAD_POSTS_SUCCESS: {
      switch (action.query) {
        case 'feed': {
          return {
            ...state,
            feedPosts: action.payload,
            refreshing: false,
          };
        }
        case 'queue': {
          return {
            ...state,
            queuePosts: action.payload,
            refreshing: false,
          };
        }
        case 'postDetail': {
          return {
            ...state,
            postDetail: action.payload,
          };
        }
        default: {
          return state;
        }
      }
    }
    case types.PAGINATE_POSTS_SUCCESS: {
      switch (action.query) {
        case 'feed': {
          return {
            ...state,
            feedPosts: {
              ...state.feedPosts,
              ...action.payload,
            },
          };
        }
        case 'queue': {
          return {
            ...state,
            queuePosts: {
              ...state.queuePosts,
              ...action.payload,
            },
          };
        }
        default: {
          return state;
        }
      }
    }
    case types.LAST_POST: {
      switch (action.query) {
        case 'feed': {
          return {
            ...state,
            feedLastPost: action.payload,
          };
        }
        case 'queue': {
          return {
            ...state,
            queueLastPost: action.payload,
          };
        }
        default: {
          return state;
        }
      }
    }
    case types.REFRESH: {
      return {
        ...state,
        refreshing: true,
      };
    }
    case types.RESET_POST_DETAIL: {
      return {
        ...state,
        postDetail: null,
      };
    }
    case routingTypes.ROUTE_ADDED: {
      switch (action.screen) {
        case 'PostDetail': {
          return {
            ...state,
            postDetailId: action.params.id,
          };
        }
        default: {
          return state;
        }
      }
    }
    default: {
      return state;
    }
  }
}

export default feedReducer;
