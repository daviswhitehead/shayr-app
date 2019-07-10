import {
  generateActionType,
  ListAction,
  listActionTypes,
  listAddReducer,
  ListInitialState,
  listLoadedReducer,
  listLoadingReducer,
  listRefreshReducer
} from '../../lib/FirebaseRedux';
import { STATE_KEY, types } from './actions';

const initialState: ListInitialState = {};

function usersListsReducer(state = initialState, action: ListAction) {
  switch (action.type) {
    case types[generateActionType(STATE_KEY, listActionTypes.LIST_ADD)]: {
      return listAddReducer(state, action);
    }
    case types[
      generateActionType(STATE_KEY, listActionTypes.LIST_REFRESHING)
    ]: {
      return listRefreshReducer(state, action);
    }
    case types[generateActionType(STATE_KEY, listActionTypes.LIST_LOADING)]: {
      return listLoadingReducer(state, action);
    }
    case types[generateActionType(STATE_KEY, listActionTypes.LIST_LOADED)]: {
      return listLoadedReducer(state, action);
    }
    default: {
      return state;
    }
  }
}

export default usersListsReducer;
