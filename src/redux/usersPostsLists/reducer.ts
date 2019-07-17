import _ from 'lodash';
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
    case types.TOGGLE_USERS_POSTS_LISTS_ITEM: {
      const previousItems = _.get(state, [action.listKey, 'items'], []);
      const newItems = action.isNowActive
        ? _.union([action.item], previousItems)
        : _.pull(previousItems, action.item);

      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, [action.listKey], {}),
          items: newItems
        }
      };
    }
    default: {
      return state;
    }
  }
}

export default usersListsReducer;
