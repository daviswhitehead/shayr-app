import _ from 'lodash';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
// https://github.com/toomuchdesign/re-reselect
// https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances

const selectCountItems = (state, type, listKey) => {
  return state[`${type}Lists`][listKey].items || [];
  // if (_.has(state, [`${type}Lists`, listKey, 'items'])) {
  //   return state[`${type}Lists`][listKey].items;
  // }
  // return [];
};

// _.get(state, [`${type}Lists`, listKey, 'items'], []);
// const selectCountItems = (state, type, listKey) => state[`${type}Lists`];
// state[`${type}Lists`][listKey].items || [];
const selectCountIsLoaded = (state, type, listKey) => state[`${type}Lists`];
// state[`${type}Lists`][listKey].isLoaded || false;
// const selectCountIsLoaded = (state, type, listKey) =>
//   _.get(state, [`${type}Lists`, listKey, 'isLoaded'], false);

export interface CountData {
  hasUpdatedUser: boolean;
  items: Array<string>;
  isLoaded: boolean;
}
export const selectCountData = createCachedSelector(
  selectCountItems,
  selectCountIsLoaded,
  (items, isLoaded) => {
    return {
      hasUpdatedUser: updateStatus,
      items,
      isLoaded
    };
  }
);
