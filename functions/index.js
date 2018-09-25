const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
var db = admin.firestore()
db.settings({timestampsInSnapshots: true})

const share = require('./Share');
const counters = require('./Counters');
// const post = require('./Post');
// const feed = require('./Feed');
// const social = require('./Social');
// const notifications = require('./Notifications');

exports.onCreateShare = functions.firestore.document('shares/{shareId}')
  .onCreate((snap, context) => {
    return share._onCreateShare(db, snap, context);
});

exports.onCreatePostShare = functions.firestore.document('posts/{postId}/shares/{shareId}')
  .onCreatePost((snap, context) => {
    return share._onCreatePostShare(db, snap, context);
});
