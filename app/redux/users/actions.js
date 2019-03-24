import firebase from 'react-native-firebase';

export const types = {
  // SELF
  SUBSCRIBE_SELF_START: 'SUBSCRIBE_SELF_START',
  SUBSCRIBE_SELF_SUCCESS: 'SUBSCRIBE_SELF_SUCCESS',
  SUBSCRIBE_SELF_FAIL: 'SUBSCRIBE_SELF_FAIL',

  // FRIENDSHIPS
  SUBSCRIBE_FRIENDSHIPS_START: 'SUBSCRIBE_FRIENDSHIPS_START',
  SUBSCRIBE_FRIENDSHIPS_SUCCESS: 'SUBSCRIBE_FRIENDSHIPS_SUCCESS',
  SUBSCRIBE_FRIENDSHIPS_FAIL: 'SUBSCRIBE_FRIENDSHIPS_FAIL',

  // FRIENDS
  SUBSCRIBE_FRIENDS_START: 'SUBSCRIBE_FRIENDS_START',
  SUBSCRIBE_FRIENDS_SUCCESS: 'SUBSCRIBE_FRIENDS_SUCCESS',
  SUBSCRIBE_FRIENDS_FAIL: 'SUBSCRIBE_FRIENDS_FAIL',
};

// SELF
export const subscribeToSelf = userId => function _subscribeToSelf(dispatch) {
  dispatch({ type: types.SUBSCRIBE_SELF_START });
  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .onSnapshot(
      async (documentSnapshot) => {
        const self = {};
        self[userId] = await documentSnapshot.data();
        await dispatch({
          type: types.SUBSCRIBE_SELF_SUCCESS,
          self,
        });
      },
      (error) => {
        console.error(error);
        dispatch({
          type: types.SUBSCRIBE_SELF_FAIL,
          error,
        });
      },
    );
};

// FRIENDSHIPS & FRIENDS
export const subscribeToFriendships = userId => function _subscribeToFriendships(dispatch) {
  dispatch({ type: types.SUBSCRIBE_FRIENDSHIPS_START });
  return firebase
    .firestore()
    .collection('friends')
    .where('userIds', 'array-contains', userId)
    .where('status', '==', 'accepted')
    .onSnapshot(
      async (querySnapshot) => {
        // data on a users friendships status
        const friendships = {};
        // array of friend promises to get
        const friendsToGet = [];

        // fill in friendships and friendsToGet
        querySnapshot.forEach((doc) => {
          const friendshipData = doc.data();
          friendships[doc.id] = friendshipData;
          const friendId = userId === friendshipData.initiatingUserId
            ? friendshipData.receivingUserId
            : friendshipData.initiatingUserId;
          friendsToGet.push(
            firebase
              .firestore()
              .collection('users')
              .doc(friendId)
              .get(),
          );
        });

        // get friends
        dispatch({ type: types.SUBSCRIBE_FRIENDS_START });
        const friends = await Promise.all(friendsToGet)
          .then((friendsList) => {
            const friendsData = {};
            Object.values(friendsList).forEach((friend) => {
              friendsData[friend.id] = friend.data();
            });

            return friendsData;
          })
          .catch((error) => {
            dispatch({
              type: types.SUBSCRIBE_FRIENDS_FAIL,
              error,
            });
            return false;
          });
        dispatch({
          type: types.SUBSCRIBE_FRIENDSHIPS_SUCCESS,
          friendships,
        });
        dispatch({
          type: types.SUBSCRIBE_FRIENDS_SUCCESS,
          friends,
        });
      },
      (error) => {
        console.error(error);
        dispatch({
          type: types.SUBSCRIBE_FRIENDSHIPS_FAIL,
          error,
        });
      },
    );
};
