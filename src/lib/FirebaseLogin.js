import firebase from 'react-native-firebase';

// Sign In
export const getCurrentUser = credential => firebase.auth().signInWithCredential(credential);

// Sign Out
export const signOut = () => {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }
};

// Providers
export const getFBAuthCredential = token => firebase.auth.FacebookAuthProvider.credential(token);
