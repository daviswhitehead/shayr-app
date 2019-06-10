import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { getUser } from '../users/actions';
import { addToFriendsList } from '../usersLists/actions';

export const types = {
  // FRIENDSHIPS
  SUBSCRIBE_FRIENDSHIPS_START: 'SUBSCRIBE_FRIENDSHIPS_START',
  SUBSCRIBE_FRIENDSHIPS_SUCCESS: 'SUBSCRIBE_FRIENDSHIPS_SUCCESS',
  SUBSCRIBE_FRIENDSHIP_DONE: 'SUBSCRIBE_FRIENDSHIP_DONE',
  SUBSCRIBE_FRIENDSHIPS_FAIL: 'SUBSCRIBE_FRIENDSHIPS_FAIL'
};

// FRIENDSHIPS
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
              await dispatch(addToFriendsList(userId, friendUserId));
            }
            return new Promise((resolve, reject) =>
              resolve(
                dispatch({
                  type: types.SUBSCRIBE_FRIENDSHIP_DONE,
                  userId,
                  friendshipId,
                  friendship
                })
              )
            );
          });
          await Promise.all(promises);
          dispatch({
            type: types.SUBSCRIBE_FRIENDSHIPS_SUCCESS,
            userId,
            isLoaded: true
          });
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
