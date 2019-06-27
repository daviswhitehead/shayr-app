import { types as routingTypes } from '../routing/actions';
import { types } from './actions';

const initialState = {
  postDetails: {
    ownerUserId: '',
    postId: ''
  }
};

function uiReducer(state = initialState, action) {
  switch (action.type) {
    case routingTypes.ROUTE_ADDED: {
      switch (action.screen) {
        case 'PostDetail': {
          return {
            ...state,
            postDetails: {
              ownerUserId: action.params.ownerUserId,
              postId: action.params.postId
            }
          };
        }
        default: {
          return state;
        }
      }
    }
    case types.RESET_POST_DETAIL: {
      return {
        ...state,
        postDetails: initialState.postDetails
      };
    }
    default: {
      return state;
    }
  }
}

export default uiReducer;
