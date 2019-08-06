import _ from 'lodash';

import {
  DataInitialState,
  generateActionType,
  ListAction,
  listActionTypes,
  listAddReducer,
  listLoadedReducer
} from '../../lib/FirebaseRedux';
import { STATE_KEY, types } from './actions';

const initialState: DataInitialState = {
  hasUpdatedUser: false
};

function reducer(state = initialState, action: ListAction) {
  switch (action.type) {
    case types[generateActionType(STATE_KEY, listActionTypes.LIST_ADD)]: {
      return listAddReducer(state, action);
    }
    case types[generateActionType(STATE_KEY, listActionTypes.LIST_LOADED)]: {
      return listLoadedReducer(state, action);
    }
    case types.UPDATE_USER_SHARES_SUCCESS: {
      return {
        ...state,
        [action.listKey]: {
          ...state[action.listKey],
          hasUpdatedUser: true
        }
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
