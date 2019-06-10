import _ from 'lodash';
import { types } from './actions';

const initialState = {};

function friendshipsReducer(state = initialState, action) {
  switch (action.type) {
    case types.SUBSCRIBE_FRIENDSHIP_DONE: {
      return {
        ...state,
        [action.userId]: {
          ..._.get(state, action.userId, {}),
          friendships: {
            ..._.get(state, [action.userId, 'friendships'], {}),
            [action.friendshipId]: action.friendship
          }
        }
      };
    }
    case types.SUBSCRIBE_FRIENDSHIPS_SUCCESS: {
      return {
        ...state,
        [action.userId]: {
          ..._.get(state, action.userId, {}),
          isLoaded: action.isLoaded
        }
      };
    }
    default: {
      return state;
    }
  }
}

export default friendshipsReducer;
