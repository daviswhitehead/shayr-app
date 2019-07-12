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

export const STATE_KEY = 'adds';

export const types = {
  ...generateActionTypes(STATE_KEY, dataActionTypes),
  TOGGLE_ADD_DONE_POST_START: 'TOGGLE_ADD_DONE_POST_START',
  TOGGLE_ADD_DONE_POST_SUCCESS: 'TOGGLE_ADD_DONE_POST_SUCCESS',
  TOGGLE_ADD_DONE_POST_FAIL: 'TOGGLE_ADD_DONE_POST_FAIL'
};

export const toggleAddDonePost = (
  type: 'adds' | 'dones',
  isActive: boolean,
  postId: documentId,
  ownerUserId: documentId,
  userId: documentId,
  isOtherActive: boolean
) => async (dispatch: Dispatch) => {
  dispatch({
    type: types.TOGGLE_ADD_DONE_POST_START
  });

  firebase
    .analytics()
    .logEvent(`${types.TOGGLE_ADD_DONE_POST_START}`.toUpperCase());

  try {
    // toast
    !isActive
      ? Toaster(actionTypeActiveToasts[type])
      : Toaster(actionTypeInactiveToasts[type]);

    const batcher = new Batcher(firebase.firestore());
    const collection = type === 'adds' ? 'adds' : 'dones';
    const otherCollection = type === 'adds' ? 'dones' : 'adds';

    // {collection}/{userId}_{postId}
    batcher.set(
      firebase
        .firestore()
        .collection(collection)
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

    updateCounts(batcher, !isActive, collection, postId, ownerUserId, userId);

    if (!isActive && isOtherActive) {
      // {otherCollection}/{userId}_{postId}
      batcher.set(
        firebase
          .firestore()
          .collection(otherCollection)
          .doc(`${userId}_${postId}`),
        {
          active: !isOtherActive,
          postId,
          updatedAt: ts,
          userId
        },
        {
          merge: true
        }
      );
      updateCounts(
        batcher,
        !isOtherActive,
        otherCollection,
        postId,
        ownerUserId,
        userId
      );
    }

    batcher.write();

    dispatch(refreshUsersPostsDocuments(postId, 'cache'));

    dispatch({
      type: types.TOGGLE_ADD_DONE_POST_SUCCESS
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.TOGGLE_ADD_DONE_POST_FAIL,
      error
    });
  }
};

export const subscribeToAdds = (userId: string) => {
  return (dispatch: Dispatch) => {
    return dispatch(
      subscribeDocumentsIds(
        STATE_KEY,
        queries.USER_ADDS.query({ userId }),
        'postId'
      )
    );
  };
};
