import _ from 'lodash';

import {
  DataAction,
  dataActionTypes,
  DataInitialState,
  generateActionType,
  getSuccessReducer
} from '../../lib/FirebaseRedux';
import { STATE_KEY, types } from './actions';

const initialState: DataInitialState = {};

function usersReducer(state = initialState, action: DataAction) {
  switch (action.type) {
    case types[generateActionType(STATE_KEY, dataActionTypes.GET_SUCCESS)]: {
      return getSuccessReducer(state, action);
    }
    default: {
      return state;
    }
  }
}

export default usersReducer;
