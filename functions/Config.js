const functions = require("firebase-functions");
const admin = require("firebase-admin");

var env = null;
// env = 'dev';
// env = 'prod';
var initializeAppConfig = {};
var serviceAccount = "";

if (env === "dev") {
  serviceAccount = require("/Users/dwhitehead/Documents/github/shayr-internal/functions/shayr-dev-a72391b9cbe3.json");
  initializeAppConfig = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://shayr-dev.firebaseio.com"
  };
} else if (env === "prod") {
  serviceAccount = require("/Users/dwhitehead/Documents/github/shayr-internal/functions/shayr-a2346-422bfb9c604a.json");
  initializeAppConfig = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://shayr-a2346.firebaseio.com"
  };
}

admin.initializeApp(initializeAppConfig);
var db = admin.firestore();
db.settings({ timestampsInSnapshots: true });
var msg = admin.messaging();

exports.admin = admin;
exports.db = db;
exports.msg = msg;
exports.functions = functions;
