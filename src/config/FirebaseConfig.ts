import firebase from 'react-native-firebase';

export const applyFirestoreSettings = () =>
  firebase.firestore().settings({
    persistence: true
  });
