import _ from 'lodash';
import { types } from './actions';

const initialState = {};

function usersListsReducer(state = initialState, action) {
  // Case Handling
  switch (action.type) {
    case types.ADD_TO_FRIENDS_LIST_SUCCESS: {
      return {
        ...state,
        [`${action.userId}_Friends`]: [
          ..._.get(state, `${action.userId}_Friends`, []),
          action.friendUserId
        ]
      };
    }
    default: {
      return state;
    }
  }
}

export default usersListsReducer;
