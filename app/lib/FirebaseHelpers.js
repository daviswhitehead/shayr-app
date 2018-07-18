import firebase from 'react-native-firebase';

export const ts = firebase.firestore.FieldValue.serverTimestamp();

export const getUserId = (user) => {
  return user.uid;
}
