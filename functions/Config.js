const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
var db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

exports.db = db;
exports.admin = admin;
exports.functions = functions;
