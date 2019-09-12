import {
  getUserFullName,
  getUserShortName,
  User
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import createCachedSelector from 're-reselect';
import { State } from '../Reducers';
// import { createSelector } from 'reselect';
// https://github.com/toomuchdesign/re-reselect
// https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances

const selectUsers = (state: State) => state.users;
const selectUser = (state: State, userId: string) => state.users[userId];
const selectUsersLists = (state: State, listKey: string) =>
  state.usersLists[listKey];

export const formatUserForClient = (user: User) => {
  return {
    ...user,
    shortName: getUserShortName(user),
    fullName: getUserFullName(user)
  };
};

export const formatUserForPresentation = (user: User) => {
  return _.pick(user, [
    '_id',
    '_reference',
    'firstName',
    'lastName',
    'shortName',
    'fullName',
    'facebookProfilePhoto'
  ]);
};

export const formatUserForProfile = (user: User) => {
  return _.pick(user, [
    '_id',
    '_reference',
    'addsCount',
    'commentsCount',
    'donesCount',
    'facebookProfilePhoto',
    'firstName',
    'friendsCount',
    'fullName',
    'lastName',
    'likesCount',
    'mentionsCount',
    'sharesCount',
    'shortName',
    'unreadNotificationsCount'
  ]);
};

export const selectAllUsers = createCachedSelector(
  selectUsers,
  (state: State, isPresentational: boolean) => isPresentational,
  (users, isPresentational) => {
    if (_.isEmpty(users)) {
      return;
    }
    return _.reduce(
      users,
      (result: any, value: any, key: string) => {
        return {
          ...result,
          [key]: isPresentational
            ? formatUserForPresentation(formatUserForClient(value))
            : formatUserForClient(value)
        };
      },
      {}
    );
  }
)((state, isPresentational) => `users_${isPresentational}`);

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

export const selectUserUnreadNotificationsCountFromId = createCachedSelector(
  selectUser,
  (state, userId) => userId,
  (user, userId) => {
    if (!user) {
      return;
    }
    return _.get(user, 'unreadNotificationsCount', 0);
  }
)((state, userId) => `${userId}`);

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
