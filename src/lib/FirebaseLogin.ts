import firebase, { AuthCredential } from 'react-native-firebase';

// Sign In
export const getCurrentUser = (credential: AuthCredential) =>
  firebase.auth().signInWithCredential(credential);

// Sign Out
export const signOut = () => {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }
};

// Providers
export const getFBAuthCredential = (token: string) =>
  firebase.auth.FacebookAuthProvider.credential(token);
