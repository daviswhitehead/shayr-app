import firebase from "react-native-firebase";

// Action Types
export const types = {
  LOAD_SELF_START: "LOAD_SELF_START",
  LOAD_SELF_SUCCESS: "LOAD_SELF_SUCCESS",
  LOAD_SELF_FAIL: "LOAD_SELF_FAIL",
  LOAD_FRIENDSHIPS_START: "LOAD_FRIENDSHIPS_START",
  LOAD_FRIENDSHIPS_SUCCESS: "LOAD_FRIENDSHIPS_SUCCESS",
  LOAD_FRIENDSHIPS_FAIL: "LOAD_FRIENDSHIPS_FAIL",
  LOAD_FRIENDS_START: "LOAD_FRIENDS_START",
  LOAD_FRIENDS_SUCCESS: "LOAD_FRIENDS_SUCCESS",
  LOAD_FRIENDS_FAIL: "LOAD_FRIENDS_FAIL"
};

// Action Creators
export function loadFriendships(userId) {
  return function(dispatch) {
    dispatch({ type: types.LOAD_FRIENDSHIPS_START });
    return firebase
      .firestore()
      .collection("friends")
      .where("userIds", "array-contains", userId)
      .where("status", "==", "accepted")
      .onSnapshot(
        async querySnapshot => {
          // data on a users friendships status
          const friendships = {};
          // array of friend promises to get
          const friendsToGet = [];

          // fill in friendships and friendsToGet
          querySnapshot.forEach(doc => {
            const friendshipData = doc.data();
            friendships[doc.id] = friendshipData;
            const friendId =
              userId === friendshipData.initiatingUserId
                ? friendshipData.receivingUserId
                : friendshipData.initiatingUserId;
            friendsToGet.push(
              firebase
                .firestore()
                .collection("users")
                .doc(friendId)
                .get()
            );
          });

          // get friends
          dispatch({ type: types.LOAD_FRIENDS_START });
          const friends = await Promise.all(friendsToGet)
            .then(friendsList => {
              const friends = {};
              for (var friend in friendsList) {
                if (friendsList.hasOwnProperty(friend)) {
                  friends[friendsList[friend].id] = friendsList[friend].data();
                }
              }
              return friends;
            })
            .catch(e => {
              dispatch({
                type: types.LOAD_FRIENDS_FAIL,
                error: e
              });
              return e;
            });
          dispatch({
            type: types.LOAD_FRIENDSHIPS_SUCCESS,
            payload: friendships
          });
          dispatch({
            type: types.LOAD_FRIENDS_SUCCESS,
            payload: friends
          });
        },
        e => {
          console.error(e);
          dispatch({
            type: types.LOAD_FRIENDSHIPS_FAIL,
            error: e
          });
        }
      );
  };
}

export function loadSelf(userId) {
  return function(dispatch) {
    dispatch({ type: types.LOAD_SELF_START });
    return firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot(
        async documentSnapshot => {
          const self = {};
          self[userId] = await documentSnapshot.data();
          await dispatch({
            type: types.LOAD_SELF_SUCCESS,
            payload: self
          });
        },
        e => {
          console.error(e);
          dispatch({
            type: types.LOAD_SELF_FAIL,
            error: e
          });
        }
      );
  };
}
