import firebase from 'react-native-firebase';

// Sign In
export const getCurrentUser = credential => firebase.auth().signInWithCredential(credential);

// Sign Out
export const signOut = () => {
  firebase.auth().signOut();
};

// Providers
export const getFBAuthCredential = token => firebase.auth.FacebookAuthProvider.credential(token);
