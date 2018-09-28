const config = require('./Config');
const share = require('./Share');
const counters = require('./Counters');
const post = require('./Post');
// const feed = require('./Feed');
// const social = require('./Social');
// const notifications = require('./Notifications');

exports.onCreateShare = config.functions.firestore.document('shares/{shareId}')
  .onCreate((snap, context) => {
    return share._onCreateShare(config.db, snap, context);
});

exports.onCreatePostShare = config.functions.firestore.document('posts/{postId}/shares/{shareId}')
  .onCreate((snap, context) => {
    return share._onCreatePostShare(config.db, snap, context);
});

exports.onWritePost = config.functions.firestore.document('posts/{postId}')
  .onWrite((snap, context) => {
    return post._onWritePost(config.db, snap, context);
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
