import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import {
  addToFriendshipsList,
  friendshipsListLoaded
} from '../friendshipsLists/actions';
import { getUser } from '../users/actions';
import { addToUsersList, usersListLoaded } from '../usersLists/actions';

export const types = {
  SUBSCRIBE_FRIENDSHIPS_START: 'SUBSCRIBE_FRIENDSHIPS_START',
  SUBSCRIBE_FRIENDSHIPS_SUCCESS: 'SUBSCRIBE_FRIENDSHIPS_SUCCESS',
  SUBSCRIBE_FRIENDSHIPS_FAIL: 'SUBSCRIBE_FRIENDSHIPS_FAIL'
};

export const subscribeToFriendships = (userId: string) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: types.SUBSCRIBE_FRIENDSHIPS_START });
    return firebase
      .firestore()
      .collection('friends')
      .where('userIds', 'array-contains', userId)
      .onSnapshot(
        async querySnapshot => {
          const promises = querySnapshot.docs.map(async documentSnapshot => {
            const friendship = documentSnapshot.data();
            const friendshipId = documentSnapshot.id;
            const friendUserId =
              userId === friendship.initiatingUserId
                ? friendship.receivingUserId
                : friendship.initiatingUserId;

            if (friendship.status === 'accepted') {
              await dispatch(getUser(friendUserId));
              await dispatch(addToUsersList(userId, friendUserId, 'Friends'));
            }
            dispatch(addToFriendshipsList(userId, friendUserId));

            return new Promise((resolve, reject) =>
              resolve(
                dispatch({
                  type: types.SUBSCRIBE_FRIENDSHIPS_SUCCESS,
                  userId,
                  friendshipId,
                  friendship
                })
              )
            );
          });
          await Promise.all(promises);
          dispatch(usersListLoaded(userId, 'Friends'));
          dispatch(friendshipsListLoaded(userId));
        },
        error => {
          console.error(error);
          dispatch({
            type: types.SUBSCRIBE_FRIENDSHIPS_FAIL,
            error
          });
        }
      );
  };
};
