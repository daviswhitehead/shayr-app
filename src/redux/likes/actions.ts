import { Batcher, documentId } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { Toaster } from '../../components/Toaster';
import { ts } from '../../lib/FirebaseHelpers';
import { queries } from '../../lib/FirebaseQueries';
import {
  dataActionTypes,
  generateActionTypes,
  subscribeDocumentsIds
} from '../../lib/FirebaseRedux';
import { updateCounts } from '../../lib/FirebaseWrites';
import {
  actionTypeActiveToasts,
  actionTypeInactiveToasts
} from '../../styles/Copy';
import { refreshUsersPostsDocuments } from '../usersPosts/actions';
import { toggleUsersPostsListsItem } from '../usersPostsLists/actions';

export const STATE_KEY = 'likes';

export const types = {
  ...generateActionTypes(STATE_KEY, dataActionTypes),
  TOGGLE_LIKE_POST_START: 'TOGGLE_LIKE_POST_START',
  TOGGLE_LIKE_POST_SUCCESS: 'TOGGLE_LIKE_POST_SUCCESS',
  TOGGLE_LIKE_POST_FAIL: 'TOGGLE_LIKE_POST_FAIL'
};

export const toggleLikePost = (
  isActive: boolean,
  postId: documentId,
  ownerUserId: documentId,
  userId: documentId
) => async (dispatch: Dispatch) => {
  dispatch({
    type: types.TOGGLE_LIKE_POST_START
  });

  firebase
    .analytics()
    .logEvent(`${types.TOGGLE_LIKE_POST_START}`.toUpperCase());

  try {
    // toast
    !isActive
      ? Toaster(actionTypeActiveToasts.likes)
      : Toaster(actionTypeInactiveToasts.likes);

    const batcher = new Batcher(firebase.firestore());

    // likes/{userId}_{postId}
    batcher.set(
      firebase
        .firestore()
        .collection('likes')
        .doc(`${userId}_${postId}`),
      {
        active: !isActive,
        postId,
        updatedAt: ts,
        userId
      },
      {
        merge: true
      }
    );

    updateCounts(batcher, !isActive, 'likes', postId, ownerUserId, userId);

    batcher.write();

    dispatch(refreshUsersPostsDocuments(postId, 'cache'));
    dispatch(
      toggleUsersPostsListsItem(
        userId,
        queries.USERS_POSTS_LIKES.type,
        postId,
        !isActive
      )
    );

    dispatch({
      type: types.TOGGLE_LIKE_POST_SUCCESS
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.TOGGLE_LIKE_POST_FAIL,
      error
    });
  }
};

export const subscribeToLikes = (userId: string) => {
  return (dispatch: Dispatch) => {
    return dispatch(
      subscribeDocumentsIds(
        STATE_KEY,
        queries.USER_LIKES.query({ userId }),
        'postId'
      )
    );
  };
};
