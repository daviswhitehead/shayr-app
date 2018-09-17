import firebase from 'react-native-firebase';
import {
  ts,
  getUserId,
  getDocShares,
  getRefData
} from '../../lib/FirebaseHelpers';
import _ from 'lodash';

// Action Types
export const types = {
  LOAD_FRIENDS_START: 'LOAD_FRIENDS_START',
  LOAD_FRIENDS_SUCCESS: 'LOAD_FRIENDS_SUCCESS',
  LOAD_FRIENDS_FAIL: 'LOAD_FRIENDS_FAIL',
}

// Helper Functions
const getUserSubs = (userDoc, sub) => {
  return firebase.firestore()
    .collection('users')
    .doc(userDoc.id)
    .collection(sub)
    .get()
    .then((querySnapshot) => {
      const subData = {};
      querySnapshot.forEach((doc) => {
        subData[doc.id] = doc.data();
      });
      return subData
    });
}

const organize


// {
//   post: {
//     post: {...},
//     friendShares: {
//       user: {...}
//     },
//     friendAdds: {
//       user: {...}
//     },
//     friendDones: {
//       user: {...}
//     },
//     friendLikes: {
//       user: {...}
//     },
//   }
// }


// Action Creators
export function loadFriends() {
  return function(dispatch) {
    dispatch({ type: types.LOAD_FRIENDS_START });
    return firebase.firestore()
      .collection('users')
      .get()
      .then((querySnapshot) => {
        const friends = {};
        querySnapshot.forEach(async (doc) => {
          friends[doc.id] = doc.data();
          friends[doc.id]['shares'] = await getUserSubs(doc, 'shares');
          friends[doc.id]['adds'] = await getUserSubs(doc, 'adds');
          friends[doc.id]['dones'] = await getUserSubs(doc, 'dones');
          friends[doc.id]['likes'] = await getUserSubs(doc, 'likes');
        });
        dispatch({
          type: types.LOAD_FRIENDS_SUCCESS,
          payload: friends
        });
      })
      .catch((e) => {
        console.error(e);
        dispatch({
          type: types.LOAD_FRIENDS_FAIL,
          error: e
        });
      })
  }
}
