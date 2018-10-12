const config = require("./Config");
const share = require("./Share");
const upa = require("./UserPostActions");
const post = require("./Post");
const social = require("./Social");
// const notifications = require('./Notifications');

// console.log(process.env.GCLOUD_PROJECT);
// console.log(process.env.FIREBASE_CONFIG);

exports.onCreateShare = config.functions.firestore
  .document("shares/{shareId}")
  .onCreate((snap, context) => {
    return share._onCreateShare(config.db, snap, context);
  });

exports.onWriteUserShare = config.functions.firestore
  .document("users/{userId}/shares/{shareId}")
  .onWrite((change, context) => {
    return upa._onWriteUserShare(config.db, change, context);
  });

exports.onWritePost = config.functions.firestore
  .document("posts/{postId}")
  .onWrite((snap, context) => {
    return post._onWritePost(config.db, snap, context);
  });

exports.onWriteFriend = config.functions.firestore
  .document("friends/{friendshipId}")
  .onWrite((change, context) => {
    return social._onWriteFriend(config.db, change, context);
  });
