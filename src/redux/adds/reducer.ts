import _ from 'lodash';

import {
  DataAction,
  dataActionTypes,
  DataInitialState,
  generateActionType,
  getSuccessReducer
} from '../../lib/FirebaseRedux';
import { STATE_KEY, types } from './actions';

const initialState: DataInitialState = {
  hasUpdatedUser: false
};

function reducer(state = initialState, action: DataAction) {
  switch (action.type) {
    case types[generateActionType(STATE_KEY, dataActionTypes.GET_SUCCESS)]: {
      return getSuccessReducer(state, action);
    }
    case types.UPDATE_USER_ADDS_SUCCESS: {
      return {
        ...state,
        hasUpdatedUser: true
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
