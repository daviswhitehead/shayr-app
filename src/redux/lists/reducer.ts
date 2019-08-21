import _ from 'lodash';
import { Items, LastItem } from '../FirebaseRedux';
import { Actions, types } from './actions';

export interface State {
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

const initialState: State = {};

function reducer(state: State = initialState, action: Actions) {
  switch (action.type) {
    case types.LIST_ADD: {
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
      if (_.get(state, [action.listKey, 'isRefreshing'], undefined) === true) {
        return state;
      }

      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          isRefreshing: true
        }
      };
    }
    case types.LIST_LOADING: {
      if (_.get(state, [action.listKey, 'isLoading'], undefined) === true) {
        return state;
      }

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
          items: action.isEmpty
            ? []
            : _.get(state, [action.listKey, 'items'], []),
          isEmpty: !!action.isEmpty,
          isLoaded: true,
          isLoading: false,
          isRefreshing: false,
          isLoadedAll: action.lastItem === 'DONE' ? true : false,
          lastItem: action.lastItem
        }
      };
    }
    case types.TOGGLE_ITEM: {
      const items = _.get(state, [action.listKey, 'items'], []);
      if (
        (action.isNowActive && _.includes(items, action.item)) ||
        (!action.isNowActive && !_.includes(items, action.item))
      ) {
        return state;
      }

      return {
        ...state,
        [action.listKey]: {
          ..._.get(state, action.listKey, {}),
          items: action.isNowActive
            ? _.union([action.item], items)
            : _.pull(items, action.item)
        }
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
