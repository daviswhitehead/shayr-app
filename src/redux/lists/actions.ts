import {
  Item,
  Items,
  LastItem,
  ListKey,
  StateKeyLists
} from '../FirebaseRedux';

// Types
export enum types {
  LIST_ADD = 'LIST_ADD',
  LIST_REFRESHING = 'LIST_REFRESHING',
  LIST_LOADING = 'LIST_LOADING',
  LIST_LOADED = 'LIST_LOADED',
  TOGGLE_ITEM = 'TOGGLE_ITEM'
}

// Actions
interface ListAddAction {
  type: types.LIST_ADD;
  stateKey: StateKeyLists;
  listKey: ListKey;
  items: Items;
}
interface ListRefreshingAction {
  type: types.LIST_REFRESHING;
  stateKey: StateKeyLists;
  listKey: ListKey;
}
interface ListLoadingAction {
  type: types.LIST_LOADING;
  stateKey: StateKeyLists;
  listKey: ListKey;
}
interface ListLoadedAction {
  type: types.LIST_LOADED;
  stateKey: StateKeyLists;
  listKey: ListKey;
  lastItem: LastItem;
  isEmpty?: boolean;
}
interface ToggleItemAction {
  type: types.TOGGLE_ITEM;
  stateKey: StateKeyLists;
  listKey: ListKey;
  item: Item;
  isNowActive: boolean;
}
export type Actions =
  | ListAddAction
  | ListRefreshingAction
  | ListLoadingAction
  | ListLoadedAction
  | ToggleItemAction;

// Action Creators
export const listAdd = (
  stateKey: StateKeyLists,
  listKey: ListKey,
  items: Items
): ListAddAction => {
  return {
    type: types.LIST_ADD,
    stateKey,
    listKey,
    items
  };
};

export const listRefreshing = (
  stateKey: StateKeyLists,
  listKey: ListKey
): ListRefreshingAction => {
  return {
    type: types.LIST_REFRESHING,
    stateKey,
    listKey
  };
};

export const listLoading = (
  stateKey: StateKeyLists,
  listKey: ListKey
): ListLoadingAction => {
  return {
    type: types.LIST_LOADING,
    stateKey,
    listKey
  };
};

export const listLoaded = (
  stateKey: StateKeyLists,
  listKey: ListKey,
  lastItem: LastItem,
  isEmpty?: boolean
): ListLoadedAction => {
  return {
    type: types.LIST_LOADED,
    stateKey,
    listKey,
    lastItem,
    isEmpty
  };
};

export const toggleItem = (
  stateKey: StateKeyLists,
  listKey: ListKey,
  item: Item,
  isNowActive: boolean
): ToggleItemAction => {
  return {
    type: types.TOGGLE_ITEM,
    stateKey,
    listKey,
    item,
    isNowActive
  };
};
