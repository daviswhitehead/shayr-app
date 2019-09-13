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

type FormatType = 'presentation' | 'profile';
const handleFormatting = (user: User, formatType?: FormatType) => {
  const formattedUser = formatUserForClient(user);
  if (formatType === 'presentation') {
    return formatUserForPresentation(formattedUser);
  }
  if (formatType === 'profile') {
    return formatUserForProfile(formattedUser);
  }
  return formattedUser;
};

export const selectAllUsers = createCachedSelector(
  selectUsers,
  (state: State, formatType: FormatType) => formatType,
  (users, formatType) => {
    if (_.isEmpty(users)) {
      return;
    }
    return _.reduce(
      users,
      (result: any, value: any, key: string) => {
        return {
          ...result,
          [key]: handleFormatting(value, formatType)
        };
      },
      {}
    );
  }
)((state, formatType) => `users_${formatType}`);

export const selectUserFromId = createCachedSelector(
  selectUser,
  (state, userId, formatType = 'client') => formatType,
  (user, formatType) => {
    if (!user) {
      return;
    }
    return handleFormatting(user, formatType);
  }
)((state, userId, formatType) => `${userId}_${formatType}`);

export const selectUserActionCount = createCachedSelector(
  selectUserFromId,
  (state, userId, formatType, actionCountKey) => actionCountKey,
  (user, actionCountKey) => {
    if (!user || !actionCountKey) {
      return;
    }
    return user[actionCountKey] || 0;
  }
)((state, userId, actionCountKey) => `${userId}_${actionCountKey}`);

export const selectUsersFromList = createCachedSelector(
  selectUsers,
  selectUsersLists,
  (state, listKey, formatType) => formatType,
  (users, usersList, formatType) => {
    if (!users || !_.get(usersList, 'isLoaded', false)) {
      return;
    }

    if (!usersList.items) {
      return {};
    }

    return usersList.items.reduce((result: any, userId: string) => {
      return {
        ...result,
        [userId]: handleFormatting(_.get(users, userId, {}), formatType)
      };
    }, {});
  }
)((state, listKey, formatType) => `${listKey}_${formatType}`);
