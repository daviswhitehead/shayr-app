import firebase from 'react-native-firebase';
import { DocumentSnapshot } from 'react-native-firebase/firestore';

// https://firebase.google.com/docs/reference/js/firebase.firestore.FieldValue
export const ts = firebase.firestore.FieldValue.serverTimestamp();
export const arrayUnion = (item: any) =>
  firebase.firestore.FieldValue.arrayUnion(item);
export const arrayRemove = (item: any) =>
  firebase.firestore.FieldValue.arrayRemove(item);
export const increment = (item: number) =>
  firebase.firestore.FieldValue.increment(item);

export const formatDocumentSnapshot = (documentSnapshot: DocumentSnapshot) => {
  return {
    ...documentSnapshot.data(),
    _id: documentSnapshot.id,
    _reference: documentSnapshot.ref.path
  };
};

export const createShare = (ref, payload) =>
  ref
    .collection('inboundShares')
    .add({
      createdAt: ts,
      updatedAt: ts,
      payload
    })
    .then(ref => {
      console.log('createShare success');
      return true;
    })
    .catch(error => {
      console.error(error);
    });
