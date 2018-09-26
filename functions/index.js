const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
var db = admin.firestore()
db.settings({timestampsInSnapshots: true})

const share = require('./Share');
const counters = require('./Counters');
const post = require('./Post');
// const feed = require('./Feed');
// const social = require('./Social');
// const notifications = require('./Notifications');

exports.onCreateShare = functions.firestore.document('shares/{shareId}')
  .onCreate((snap, context) => {
    return share._onCreateShare(db, snap, context);
});

exports.onCreatePostShare = functions.firestore.document('posts/{postId}/shares/{shareId}')
  .onCreate((snap, context) => {
    return share._onCreatePostShare(db, snap, context);
});

exports.onWritePost = functions.firestore.document('posts/{postId}')
  .onWrite((snap, context) => {
    return post._onWritePost(db, snap, context);
});

// whenever a user (share, add, done, like) is written (created, updated, deleted)
// writtenUserShare({before: {}, after: {post: 'posts/jbMxqSSlgv5JcTBiO3jh', user: 'users/hD1cMtlBHZfvrrRjIcdTEyfqixG3', active: true}})
// exports.writtenUserShare = functions.firestore.document('users/{userId}/shares/{shareId}')
//   .onWrite((change, context) => {
//     return counters.updateCounter(change, context, db, 'shareCount')
//   });
//
// exports.writtenUserAdd = functions.firestore.document('users/{userId}/adds/{addId}')
//   .onWrite((change, context) => {
//     return counters.updateCounter(change, context, db, 'addCount')
//   });
//
// exports.writtenUserDone = functions.firestore.document('users/{userId}/dones/{doneId}')
//   .onWrite((change, context) => {
//     return counters.updateCounter(change, context, db, 'doneCount')
//   });
//
// exports.writtenUserLike = functions.firestore.document('users/{userId}/likes/{likeId}')
//   .onWrite((change, context) => {
//     return counters.updateCounter(change, context, db, 'likeCount')
//   });
