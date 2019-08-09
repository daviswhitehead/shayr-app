import _ from 'lodash';
import createCachedSelector from 're-reselect';
import { stateKey } from '../../lib/FirebaseRedux';
// https://github.com/toomuchdesign/re-reselect
// https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances

const selectListState = (state, stateKey: stateKey) => state[stateKey];
const selectListKey = (state, stateKey, listKey) => listKey;

export const selectList = createCachedSelector(
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

export const selectListCount = createCachedSelector(
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
