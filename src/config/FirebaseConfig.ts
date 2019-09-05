import firebase from 'react-native-firebase';

export const applyFirebaseSettings = () => {
  firebase.firestore().settings({
    persistence: false
  });
  // firebase.perf().setPerformanceCollectionEnabled(true);
  // firebase.config().enableDeveloperMode();
  // firebase.storage();
};
