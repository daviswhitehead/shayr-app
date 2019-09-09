import _ from 'lodash';
import { types } from './actions';

const initialState = {};

function friendshipsReducer(state = initialState, action) {
  switch (action.type) {
    case types.SUBSCRIBE_FRIENDSHIPS_SUCCESS: {
      return {
        ...state,
        [action.friendshipId]: action.friendship
      };
    }
    default: {
      return state;
    }
  }
}

export default friendshipsReducer;
