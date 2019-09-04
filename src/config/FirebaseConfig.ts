import firebase from 'react-native-firebase';

export const applyFirebaseSettings = () => {
  firebase.firestore().settings({
    persistence: true
  });
  // firebase.perf().setPerformanceCollectionEnabled(true);
  // firebase.config().enableDeveloperMode();
  // firebase.storage();
};
