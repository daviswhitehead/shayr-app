import firebase from 'react-native-firebase';

export const subscribeToSelf = userId => firebase
  .firestore()
  .collection('users')
  .doc(userId)
  .onSnapshot(
    async (documentSnapshot) => {
      const self = {};
      self[userId] = await documentSnapshot.data();
      return self;
    },
    (error) => {
      console.error(error);
      return false;
    },
  );

// export function loadFriendships(userId) {
//   return function (dispatch) {
//     dispatch({ type: types.LOAD_FRIENDSHIPS_START });
//     return firebase
//       .firestore()
//       .collection('friends')
//       .where('userIds', 'array-contains', userId)
//       .where('status', '==', 'accepted')
//       .onSnapshot(
//         async (querySnapshot) => {
//           // data on a users friendships status
//           const friendships = {};
//           // array of friend promises to get
//           const friendsToGet = [];

//           // fill in friendships and friendsToGet
//           querySnapshot.forEach((doc) => {
//             const friendshipData = doc.data();
//             friendships[doc.id] = friendshipData;
//             const friendId = userId === friendshipData.initiatingUserId
//               ? friendshipData.receivingUserId
//               : friendshipData.initiatingUserId;
//             friendsToGet.push(
//               firebase
//                 .firestore()
//                 .collection('users')
//                 .doc(friendId)
//                 .get(),
//             );
//           });

//           // get friends
//           dispatch({ type: types.LOAD_FRIENDS_START });
//           const friends = await Promise.all(friendsToGet)
//             .then((friendsList) => {
//               const friends = {};
//               for (const friend in friendsList) {
//                 if (friendsList.hasOwnProperty(friend)) {
//                   friends[friendsList[friend].id] = friendsList[friend].data();
//                 }
//               }
//               return friends;
//             })
//             .catch((e) => {
//               dispatch({
//                 type: types.LOAD_FRIENDS_FAIL,
//                 error: e,
//               });
//               return e;
//             });
//           dispatch({
//             type: types.LOAD_FRIENDSHIPS_SUCCESS,
//             payload: friendships,
//           });
//           dispatch({
//             type: types.LOAD_FRIENDS_SUCCESS,
//             payload: friends,
//           });
//         },
//         (e) => {
//           console.error(e);
//           dispatch({
//             type: types.LOAD_FRIENDSHIPS_FAIL,
//             error: e,
//           });
//         },
//       );
//   };
// }
