import { Items, LastItem, ListKey, StateKeyLists } from '../FirebaseRedux';

export const types = {
  LIST_ADD: 'LIST_ADD',
  LIST_REFRESHING: 'LIST_REFRESHING',
  LIST_LOADING: 'LIST_LOADING',
  LIST_LOADED: 'LIST_LOADED'
};

interface ListAddAction {
  type: string;
  stateKey: StateKeyLists;
  listKey: ListKey;
  items: Items;
}

export const listAdd = (
  stateKey: StateKeyLists,
  listKey: ListKey,
  items: Items
) => {
  return {
    type: types.LIST_ADD,
    stateKey,
    listKey,
    items
  };
};

interface ListRefreshingAction {
  type: string;
  stateKey: StateKeyLists;
  listKey: ListKey;
}

export const listRefreshing = (stateKey: StateKeyLists, listKey: ListKey) => {
  return {
    type: types.LIST_REFRESHING,
    stateKey,
    listKey
  };
};

interface ListLoadingAction {
  type: string;
  stateKey: StateKeyLists;
  listKey: ListKey;
}

export const listLoading = (stateKey: StateKeyLists, listKey: ListKey) => {
  return {
    type: types.LIST_LOADING,
    stateKey,
    listKey
  };
};

interface ListLoadedAction {
  type: string;
  stateKey: StateKeyLists;
  listKey: ListKey;
  lastItem: LastItem;
}

export const listLoaded = (
  stateKey: StateKeyLists,
  listKey: ListKey,
  lastItem: LastItem
) => {
  return {
    type: types.LIST_LOADED,
    stateKey,
    listKey,
    lastItem
  };
};

export type ListAction =
  | ListAddAction
  | ListRefreshingAction
  | ListLoadingAction
  | ListLoadedAction;
