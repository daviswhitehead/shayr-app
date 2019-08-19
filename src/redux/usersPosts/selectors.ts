import _ from 'lodash';
import createCachedSelector from 're-reselect';
import { selectListItems } from '../lists/selectors';
import { State } from '../Reducers';
// https://github.com/toomuchdesign/re-reselect
// https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances

const selectUsersPosts = (state: State) => state.usersPosts;
const selectUsersPost = (state: State, userPostId: string) =>
  state.usersPosts[userPostId];

export const selectUsersPostFromId = createCachedSelector(
  selectUsersPost,
  (usersPost) => usersPost
)((state, userPostId) => userPostId);

export const selectUsersPostsFromItems = createCachedSelector(
  selectUsersPosts,
  selectListItems,
  (usersPosts, items) => {
    if (!usersPosts || !items) {
      return;
    }
    return _.pick(usersPosts, items);
  }
)((state, listState, listKey) => `${listState}_${listKey}`);

export const selectFlatListReadyUsersPosts = createCachedSelector(
  selectUsersPostsFromItems,
  (state, listState, listKey, sortKey) => sortKey,
  (usersPosts, sortKey) => {
    if (!usersPosts || !sortKey) {
      return;
    }
    return _.reverse(_.sortBy(usersPosts, (value) => value[sortKey]));
  }
)((state, listState, listKey, sortKey) => `${listState}_${listKey}_${sortKey}`);
