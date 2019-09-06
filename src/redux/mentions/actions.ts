import { Batcher, documentId } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { logEvent } from '../../lib/FirebaseAnalytics';
import { arrayUnion, ts } from '../../lib/FirebaseHelpers';
import { updateCounts } from '../../lib/FirebaseWrites';
import { refreshUsersPostsDocuments } from '../usersPosts/actions';

export const STATE_KEY = 'mentions';

export const types = {
  CREATE_MENTION_START: 'CREATE_MENTION_START',
  CREATE_MENTION_SUCCESS: 'CREATE_MENTION_SUCCESS',
  CREATE_MENTION_FAIL: 'CREATE_MENTION_FAIL'
};

export const createMention = (
  postId: documentId,
  userId: documentId,
  users: Array<documentId>,
  commentId: documentId = '',
  ownerUserId: documentId = userId,
  shareId: documentId = '',
  existingBatcher?: any
) => async (dispatch: Dispatch) => {
  dispatch({
    type: types.CREATE_MENTION_START
  });

  logEvent(types.CREATE_MENTION_START);

  try {
    const batcher = existingBatcher || new Batcher(firebase.firestore());
    const mentionId = await firebase
      .firestore()
      .collection('mentions')
      .add({
        active: true,
        commentId,
        createdAt: ts,
        postId,
        shareId,
        updatedAt: ts,
        userId,
        users: arrayUnion(users)
      })
      .then((ref) => {
        return ref.id;
      })
      .catch((error) => {
        console.error(error);
      });

    updateCounts(batcher, true, 'mentions', postId, ownerUserId, userId, users);

    if (!existingBatcher) {
      await batcher.write();
    }

    dispatch(refreshUsersPostsDocuments(postId, 'server'));
    // dispatch(refreshUsersPostsDocuments(postId, 'cache'));

    dispatch({
      type: types.CREATE_MENTION_SUCCESS
    });

    return mentionId;
  } catch (error) {
    console.error(error);
    dispatch({
      type: types.CREATE_MENTION_FAIL,
      error
    });
    return undefined;
  }
};
