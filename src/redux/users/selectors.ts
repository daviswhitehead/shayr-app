import { getUserShortName, User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import createCachedSelector from 're-reselect';
// import { createSelector } from 'reselect';
// https://github.com/toomuchdesign/re-reselect
// https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances

const selectUsers = (state) => state.users;
const selectUser = (state, userId) => state.users[userId];
const selectUsersLists = (state, listKey) => state.usersLists[listKey];

const formatUserForClient = (user: User) => {
  return {
    ...user,
    shortName: getUserShortName(user)
  };
};

export const selectUserFromId = createCachedSelector(selectUser, (user) => {
  if (!user) {
    return;
  }
  return formatUserForClient(user);
})((state, userId) => userId);

export const selectUsersFromList = createCachedSelector(
  selectUsers,
  selectUsersLists,
  (users, usersList) => {
    if (!users || !_.get(usersList, 'isLoaded', false)) {
      return;
    }

    return usersList.items.reduce((result: any, userId: string) => {
      return {
        ...result,
        [userId]: formatUserForClient(_.get(users, userId, {}))
      };
    }, {});
  }
)((state, listKey) => listKey);
