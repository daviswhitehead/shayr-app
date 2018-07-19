import firebase from 'react-native-firebase';

export const ts = firebase.firestore.FieldValue.serverTimestamp();

export const getUserId = (user) => {
  return user.uid;
}

export const getDocShares = (doc) => {
  return doc.collection('shares').get()
    .then((query) => {
      return query.docs
    })
    .catch((e) => {
      console.error(e);
      return false
    })
};

export const getRefData = (ref) => {
  return ref.get()
    .then((doc) => {
      return doc.data()
    })
    .catch((e) => {
      console.error(e);
      return false
    })
};
