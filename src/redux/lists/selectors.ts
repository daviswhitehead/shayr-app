import _ from 'lodash';
import createCachedSelector, { ParametricSelector } from 're-reselect';
import { StateKeyLists } from '../FirebaseRedux';
import { State } from '../Reducers';
// https://github.com/toomuchdesign/re-reselect
// https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances

const selectListState = (state: State, stateKey: StateKeyLists) =>
  state[stateKey];
const selectListKey = (
  state: State,
  stateKey: StateKeyLists,
  listKey: string
) => listKey;

export const selectList: ParametricSelector<
  State,
  StateKeyLists,
  any | undefined
> = createCachedSelector(
  selectListState,
  selectListKey,
  (listState, listKey) => {
    if (!listState || !listKey) {
      return;
    }
    return listState[listKey];
  }
)((state, listState, listKey) => `${listState}_${listKey}`);

export const selectListItems = createCachedSelector(
  selectListState,
  selectListKey,
  selectList,
  (listState, listKey, list) => {
    if (!list) {
      return;
    }
    return list.items;
  }
)((state, listState, listKey) => `${listState}_${listKey}`);

export const selectListMeta = createCachedSelector(
  selectListState,
  selectListKey,
  selectList,
  (listState, listKey, list) => {
    if (!list) {
      return;
    }
    return _.omit(list, 'items');
  }
)((state, listState, listKey) => `${listState}_${listKey}`);

export const selectListCount: ParametricSelector<
  State,
  StateKeyLists,
  number | undefined
> = createCachedSelector(
  selectListState,
  selectListKey,
  selectList,
  (listState, listKey, list) => {
    if (!list || !list.items || !list.isLoaded) {
      return;
    }
    return list.items.length;
  }
)((state, listState, listKey) => `${listState}_${listKey}`);
