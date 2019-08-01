import _ from 'lodash';
import { Items, LastItem } from '../FirebaseRedux';
import { ListAction, types } from './actions';

interface ListInitialState {
  [listKey: string]: {
    isRefreshing?: boolean;
    isLoading?: boolean;
    isLoaded?: boolean;
    isLoadedAll?: boolean;
    items?: Items;
    isEmpty?: boolean;
    lastItem?: LastItem;
  };
}

const initialState: ListInitialState = {};

function reducer(state = initialState, action: ListAction) {
  switch (action.type) {
    case types.LIST_ADD: {
      console.log('types.LIST_ADD');
      console.log(action);

      const items = _.get(state, [action.listKey, 'isRefreshing'], false)
        ? [...action.items]
        : _.uniq([
            ..._.get(state, [action.listKey, 'items'], []),
            ...action.items
          ]);

      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          items,
          isEmpty: _.isEmpty(items) ? true : false
        }
      };
    }
    case types.LIST_REFRESHING: {
      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          isRefreshing: true
        }
      };
    }
    case types.LIST_LOADING: {
      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          isLoading: true
        }
      };
    }
    case types.LIST_LOADED: {
      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          items: _.get(state, [action.listKey, 'items'], []),
          isLoaded: true,
          isLoading: false,
          isRefreshing: false,
          isLoadedAll: action.lastItem === 'DONE' ? true : false,
          lastItem: action.lastItem
        }
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
