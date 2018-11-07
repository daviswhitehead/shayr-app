import firebase from "react-native-firebase";

// Action Types
export const types = {
  LOAD_FRIENDS_START: "LOAD_FRIENDS_START",
  LOAD_FRIENDS_SUCCESS: "LOAD_FRIENDS_SUCCESS",
  LOAD_FRIENDS_FAIL: "LOAD_FRIENDS_FAIL"
};

// Action Creators
export function loadFriends(userId) {
  return function(dispatch) {
    dispatch({ type: types.LOAD_FRIENDS_START });
    return firebase
      .firestore()
      .collection("friends")
      .where("userIds", "array-contains", userId)
      .where("status", "==", "accepted")
      .onSnapshot(
        querySnapshot => {
          const friends = {};
          querySnapshot.forEach(async doc => {
            const friendshipData = doc.data();
            const friendId =
              userId === friendshipData.initiatingUserId
                ? friendshipData.receivingUserId
                : friendshipData.initiatingUserId;
            const friend = await firebase
              .firestore()
              .collection("users")
              .doc(friendId)
              .get();
            friends[friendId] = friend.data();
          });
          dispatch({
            type: types.LOAD_FRIENDS_SUCCESS,
            payload: friends
          });
        },
        e => {
          console.error(e);
          dispatch({
            type: types.LOAD_FRIENDS_FAIL,
            error: e
          });
        }
      );
  };
}
