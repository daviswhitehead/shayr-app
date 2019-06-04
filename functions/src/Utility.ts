import * as _ from 'lodash';
import { firebase } from './Config';

export const ts = firebase.firestore.FieldValue.serverTimestamp();

export const addCreatedAt = (payload: any) => ({
  ...payload,
  createdAt: ts,
});

export const addUpdatedAt = (payload: any) => ({
  ...payload,
  updatedAt: ts,
});

export const addDeletedAt = (payload: any) => ({
  ...payload,
  deletedAt: ts,
});

export const getReferenceId = (reference: string, position: number) => reference.split('/')[position];

export const getDocument = (query: any, ref: string) => query.get().then((queryDocumentSnapshot: any) => {
  if (queryDocumentSnapshot.exists) {
    return {
      id: queryDocumentSnapshot.id,
      ref,
      ...queryDocumentSnapshot.data(),
    };
  }
  return false;
});
export const getDocumentsInCollection = (query: any, ref: string) => {
  // query = db.collection(ref).where("a", "==", "b")
  const obj: { [key: string]: any } = {};
  return query.get().then((querySnapshot: any) => {
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc: any) => {
        obj[doc.id] = {
          ref: `${ref}/${doc.id}`,
          ...doc.data(),
        };
      });
      return obj;
    }
    return false;
  });
};

export const organizeFriends = (userId: string, friends: any) => {
  for (const friendId in friends) {
    if (friends.hasOwnProperty(friendId)) {
      friends[friendId].userId = userId;
      friends[friendId].friendUserId = _.remove(friends[friendId].userIds, id => id !== userId)[0];
    }
  }
  return friends;
};

export const returnBatch = (batch: any) => batch
  .commit()
  .then((value: any) => {
    console.log('success');
    return value;
  })
  .catch((e: any) => {
    console.log('failure');
    console.error(e);
    return e;
  });
