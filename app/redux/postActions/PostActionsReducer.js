import { types } from './PostsActionsActions';

const initialState = {
  error: null,
}

function postActionsReducer(state = initialState, action) {
  console.log(action.type);
  // Failure Handling
  if (action.type.substr(action.type.length - 4) === 'FAIL') {
    return {
      ...state,
      error: action.error
    }
  }

  // Case Handling
  // switch (action.type) {
  //   case types.LOAD_QUEUE_POSTS_SUCCESS: {
  //     return {
  //       ...state,
  //       queuePosts: action.payload,
  //       refreshing: false
  //     }
  //   }
  // }

  return state
}

export default postActionsReducer;
