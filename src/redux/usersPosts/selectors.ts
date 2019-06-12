import _ from 'lodash';
import createCachedSelector from 're-reselect';
// https://github.com/toomuchdesign/re-reselect
// https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances

const selectUsersPosts = state => state.usersPosts;
const selectusersPost = (state, userPostId) => state.usersPosts[userPostId];
const selectUsersPostsLists = (state, listKey) =>
  state.usersPostsLists[listKey];

export const selectUsersPostFromId = createCachedSelector(
  selectusersPost,
  usersPost => usersPost
)((state, userPostId) => userPostId);

export const selectUsersPostsFromList = createCachedSelector(
  selectUsersPosts,
  selectUsersPostsLists,
  (usersPosts, usersPostsList) => {
    if (!usersPosts || !_.get(usersPostsList, 'isLoaded', false)) {
      return;
    }

    return usersPostsList.items.reduce((result: any, usersPostsId: string) => {
      return {
        ...result,
        [usersPostsId]: _.get(usersPosts, usersPostsId, {})
      };
    }, {});
  }
)((state, listKey) => listKey);

export const selectFlatListReadyUsersPostsFromList = createCachedSelector(
  selectUsersPosts,
  selectUsersPostsLists,
  (usersPosts, usersPostsList) => {
    if (!usersPosts || !_.get(usersPostsList, 'isLoaded', false)) {
      return;
    }

    return usersPostsList.items.reduce((result: any, usersPostsId: string) => {
      return [
        ...result,
        {
          _key: usersPostsId,
          ..._.get(usersPosts, usersPostsId, {})
        }
      ];
    }, []);
  }
)((state, listKey) => listKey);
