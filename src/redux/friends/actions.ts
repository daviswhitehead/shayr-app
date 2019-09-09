import {
  arrayRemove,
  arrayUnion,
  Batcher,
  increment,
  status,
  ts
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { Toaster } from '../../components/Toaster';
import { logEvent } from '../../lib/FirebaseAnalytics';
import { friending } from '../../styles/Copy';

export const types = {
  // CREATE_FRIENDSHIP
  CREATE_FRIENDSHIP_START: 'CREATE_FRIENDSHIP_START',
  CREATE_FRIENDSHIP_SUCCESS: 'CREATE_FRIENDSHIP_SUCCESS',
  CREATE_FRIENDSHIP_FAIL: 'CREATE_FRIENDSHIP_FAIL',
  // UPDATE_FRIENDSHIP
  UPDATE_FRIENDSHIP_START: 'UPDATE_FRIENDSHIP_START',
  UPDATE_FRIENDSHIP_SUCCESS: 'UPDATE_FRIENDSHIP_SUCCESS',
  UPDATE_FRIENDSHIP_FAIL: 'UPDATE_FRIENDSHIP_FAIL'
};

export const updateFriendship = (
  initiatingUserId: string,
  receivingUserId: string,
  status: status
) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: types.UPDATE_FRIENDSHIP_START, status });
    logEvent(`${types.UPDATE_FRIENDSHIP_START}__${status}`.toUpperCase());

    try {
      const batcher = new Batcher(firebase.firestore());

      // toast
      Toaster(friending[status]);

      // create new friendship
      batcher.set(
        firebase
          .firestore()
          .collection('friendships')
          .doc(`${initiatingUserId}_${receivingUserId}`),
        {
          status,
          updatedAt: ts(firebase.firestore)
        },
        { merge: true }
      );

      // update user.friends array
      if (_.includes(['accepted', 'removed'], status)) {
        const isStatusAccepted = status === 'accepted';

        // update initiating user
        batcher.set(
          firebase
            .firestore()
            .collection('users')
            .doc(initiatingUserId),
          {
            friends: isStatusAccepted
              ? arrayUnion(firebase.firestore, receivingUserId)
              : arrayRemove(firebase.firestore, receivingUserId),
            friendsCount: isStatusAccepted
              ? increment(firebase.firestore, 1)
              : increment(firebase.firestore, -1),
            updatedAt: ts(firebase.firestore)
          },
          { merge: true }
        );

        // update receiving user user
        batcher.set(
          firebase
            .firestore()
            .collection('users')
            .doc(receivingUserId),
          {
            friends: isStatusAccepted
              ? arrayUnion(firebase.firestore, initiatingUserId)
              : arrayRemove(firebase.firestore, initiatingUserId),
            friendsCount: isStatusAccepted
              ? increment(firebase.firestore, 1)
              : increment(firebase.firestore, -1),
            updatedAt: ts(firebase.firestore)
          },
          { merge: true }
        );
      }

      batcher.write();

      dispatch({
        type: types.UPDATE_FRIENDSHIP_SUCCESS,
        status
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: types.UPDATE_FRIENDSHIP_FAIL,
        status,
        error
      });
    }
  };
};

export const createFriendship = (
  initiatingUserId: string,
  receivingUserId: string
) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: types.CREATE_FRIENDSHIP_START });
    logEvent(types.CREATE_FRIENDSHIP_START);

    try {
      const status = 'pending';
      const batcher = new Batcher(firebase.firestore());

      // toast
      Toaster(friending[status]);

      // create new friendship
      batcher.set(
        firebase
          .firestore()
          .collection('friendships')
          .doc(`${initiatingUserId}_${receivingUserId}`),
        {
          createdAt: ts(firebase.firestore),
          initiatingUserId,
          receivingUserId,
          status,
          updatedAt: ts(firebase.firestore),
          userIds: arrayUnion(firebase.firestore, [
            initiatingUserId,
            receivingUserId
          ])
        }
      );
      batcher.write();

      dispatch({
        type: types.CREATE_FRIENDSHIP_SUCCESS
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: types.CREATE_FRIENDSHIP_FAIL,
        error
      });
    }
  };
};
