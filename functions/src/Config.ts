import * as firebase from 'firebase-admin';

const env = null;
// env = 'dev';
// env = 'prod';
let initializeAppConfig = {};
let serviceAccount = '';

if (env === 'dev') {
  serviceAccount = require('../../shayr-internal/functions/shayr-dev-a72391b9cbe3.json');
  initializeAppConfig = {
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://shayr-dev.firebaseio.com',
  };
} else if (env === 'prod') {
  serviceAccount = require('../../shayr-internal/functions/shayr-a2346-422bfb9c604a.json');
  initializeAppConfig = {
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://shayr-a2346.firebaseio.com',
  };
}

firebase.initializeApp(initializeAppConfig);
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
const msg = firebase.messaging();

export { firebase, db, msg };
