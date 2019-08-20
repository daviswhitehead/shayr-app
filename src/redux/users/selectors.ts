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

const formatUserForPresentation = (user: User) => {
  return _.pick(user, [
    '_id',
    '_reference',
    'firstName',
    'lastName',
    'shortName',
    'facebookProfilePhoto'
  ]);
};

export const selectUserFromId = createCachedSelector(
  selectUser,
  (state, userId, isPresentational) => isPresentational,
  (user, isPresentational) => {
    if (!user) {
      return;
    }
    return isPresentational
      ? formatUserForPresentation(formatUserForClient(user))
      : formatUserForClient(user);
  }
)((state, userId, isPresentational) => `${userId}_${isPresentational}`);

export const selectUserActionCounts = createCachedSelector(
  selectUserFromId,
  (state, userId, isPresentational, action) => action,
  (user, action) => {
    if (!user || !action) {
      return;
    }
    return user[action] || 0;
  }
)((state, userId, action) => `${userId}_${action}`);

export const selectUsersFromList = createCachedSelector(
  selectUsers,
  selectUsersLists,
  (state, listKey, isPresentational) => isPresentational,
  (users, usersList, isPresentational) => {
    if (!users || !_.get(usersList, 'isLoaded', false)) {
      return;
    }

    if (!usersList.items) {
      return {};
    }

    return usersList.items.reduce((result: any, userId: string) => {
      return {
        ...result,
        [userId]: isPresentational
          ? formatUserForPresentation(
              formatUserForClient(_.get(users, userId, {}))
            )
          : formatUserForClient(_.get(users, userId, {}))
      };
    }, {});
  }
)((state, listKey, isPresentational) => `${listKey}_${isPresentational}`);
