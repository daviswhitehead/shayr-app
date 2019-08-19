import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import { Actions, types } from './actions';

export interface State {
  [userId: string]: User;
}
const initialState = {};

function reducer(state: State = initialState, action: Actions) {
  switch (action.type) {
    case types.GET_USER_SUCCESS:
    case types.SUBSCRIBE_USER_SUCCESS: {
      // omit any fields that aren't used
      const user = _.omit(action.user, ['updatedAt']);

      if (_.isEqual(state[action.userId], user)) {
        return state;
      }
      return {
        ...state,
        [action.userId]: user
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
