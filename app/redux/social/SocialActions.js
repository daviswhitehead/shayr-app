import firebase from "react-native-firebase";

// Action Types
export const types = {
  LOAD_SELF_START: "LOAD_SELF_START",
  LOAD_SELF_SUCCESS: "LOAD_SELF_SUCCESS",
  LOAD_SELF_FAIL: "LOAD_SELF_FAIL",
  LOAD_FRIENDSHIPS_START: "LOAD_FRIENDSHIPS_START",
  LOAD_FRIENDSHIPS_SUCCESS: "LOAD_FRIENDSHIPS_SUCCESS",
  LOAD_FRIENDSHIPS_FAIL: "LOAD_FRIENDSHIPS_FAIL",
  LOAD_FRIEND_START: "LOAD_FRIEND_START",
  LOAD_FRIEND_SUCCESS: "LOAD_FRIEND_SUCCESS",
  LOAD_FRIEND_FAIL: "LOAD_FRIEND_FAIL"
};

// Helpers
const getFriend = async (dispatch, friends, doc, userId) => {
  dispatch({ type: types.LOAD_FRIEND_START });

  try {
    const friendshipData = doc.data();
    const friendId =
      userId === friendshipData.initiatingUserId
        ? friendshipData.receivingUserId
        : friendshipData.initiatingUserId;
    friend = await firebase
      .firestore()
      .collection("users")
      .doc(friendId)
      .get();
    friends[friendId] = friend.data();
    dispatch({ type: types.LOAD_FRIEND_SUCCESS, payload: friends });
  } catch (e) {
    console.error(e);
    dispatch({
      type: types.LOAD_FRIEND_FAIL,
      payload: e
    });
  }
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
        querySnapshot => {
          const friendships = {};
          const friends = {};
          querySnapshot.forEach(doc => {
            friendships[doc.id] = doc.data();
            getFriend(dispatch, friends, doc, userId);
          });
          dispatch({
            type: types.LOAD_FRIENDSHIPS_SUCCESS,
            payload: friendships
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
        documentSnapshot => {
          const self = {};
          self[userId] = documentSnapshot.data();
          dispatch({
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
