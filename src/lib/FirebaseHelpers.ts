import _ from 'lodash';
import firebase from 'react-native-firebase';
import { DocumentSnapshot } from 'react-native-firebase/firestore';

// https://firebase.google.com/docs/reference/js/firebase.firestore.FieldValue
export const ts = firebase.firestore.FieldValue.serverTimestamp();
export const arrayUnion = (item: any) => {
  if (_.isArray(item)) {
    return firebase.firestore.FieldValue.arrayUnion(...item);
  }
  return firebase.firestore.FieldValue.arrayUnion(item);
};
export const arrayRemove = (item: any) => {
  if (_.isArray(item)) {
    return firebase.firestore.FieldValue.arrayRemove(...item);
  }
  return firebase.firestore.FieldValue.arrayRemove(item);
};
export const increment = (item: number) =>
  firebase.firestore.FieldValue.increment(item);

export const formatDocumentSnapshot = (documentSnapshot: DocumentSnapshot) => {
  return {
    ...documentSnapshot.data(),
    _id: documentSnapshot.id,
    _reference: documentSnapshot.ref.path
  };
};
