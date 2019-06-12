import { getDocumentsInCollection } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import {
  addToUsersPostsList,
  usersPostsListLoaded
} from '../usersPostsLists/actions';

export const types = {
  GET_USERS_POSTS_START: 'GET_USERS_POSTS_START',
  GET_USERS_POSTS_SUCCESS: 'GET_USERS_POSTS_SUCCESS',
  GET_USERS_POSTS_FAIL: 'GET_USERS_POSTS_FAIL'
};

type UsersPostsQueries = 'all' | 'shares' | 'adds' | 'dones' | 'likes';
const requestLimiter = 10;
const composeRequest = (userId: string, query: UsersPostsQueries) => {
  let request = firebase
    .firestore()
    .collection('users_posts')
    .where('userId', '==', userId)
    .limit(requestLimiter);

  if (query === 'all') {
    request = request.orderBy('createdAt', 'desc');
  } else {
    request = request
      .where(query, 'array-contains', userId)
      .orderBy('updatedAt', 'desc');
  }

  return request;
};

const getLastItem = (items, requestLimiter) => {
  const itemKeys = Object.keys(items);
  return itemKeys.length === requestLimiter
    ? items[itemKeys[requestLimiter - 1]]._id
    : 'done';
};

export const loadUsersPosts = (
  userId: string,
  query: UsersPostsQueries,
  lastItem?: string
) => async (dispatch: Dispatch) => {
  // prevent loading more items when the end is reached
  if (lastItem === 'done') {
    return;
  }

  dispatch({ type: types.GET_USERS_POSTS_START });

  // compose the database request
  let request = composeRequest(userId, query);
  if (lastItem) {
    request = request.startAfter(lastItem);
  }

  const usersPosts = await getDocumentsInCollection(request, `users_posts`);
  if (usersPosts) {
    dispatch({ type: types.GET_USERS_POSTS_SUCCESS, usersPosts });

    _.forOwn(usersPosts, key => {
      dispatch(addToUsersPostsList(userId, query, key));
    });

    dispatch(
      usersPostsListLoaded(
        userId,
        query,
        getLastItem(usersPosts, requestLimiter)
      )
    );
  } else {
    dispatch({ type: types.GET_USERS_POSTS_FAIL });
  }
};
