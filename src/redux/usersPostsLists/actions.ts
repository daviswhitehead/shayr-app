import { documentId } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import { usersPostsLists } from '../../lib/FirebaseQueries';
import { generateActionTypes, listActionTypes } from '../../lib/FirebaseRedux';

export const STATE_KEY = 'usersPostsLists';

export const types = {
  ...generateActionTypes(STATE_KEY, listActionTypes),
  TOGGLE_USERS_POSTS_LISTS_ITEM: 'TOGGLE_USERS_POSTS_LISTS_ITEM'
};

export const toggleUsersPostsListsItem = (
  userId: documentId,
  list: usersPostsLists,
  postId: documentId,
  isNowActive: boolean
) => {
  return {
    type: types.TOGGLE_USERS_POSTS_LISTS_ITEM,
    listKey: `${userId}_${list}`,
    item: `${userId}_${postId}`,
    isNowActive
  };
};
