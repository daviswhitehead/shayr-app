const config = require("./Config");
const share = require("./Share");
const counters = require("./Counters");
const post = require("./Post");
// const feed = require('./Feed');
// const social = require('./Social');
// const notifications = require('./Notifications');

exports.onCreateShare = config.functions.firestore
  .document("users/{userId}/shares/{shareId}")
  .onCreate((snap, context) => {
    return share._onCreateShare(config.db, snap, context);
  });

exports.onCreatePostShare = config.functions.firestore
  .document("posts/{postId}/shares/{shareId}")
  .onCreate((snap, context) => {
    return share._onCreatePostShare(config.db, snap, context);
  });

exports.onWritePost = config.functions.firestore
  .document("posts/{postId}")
  .onWrite((snap, context) => {
    return post._onWritePost(config.db, snap, context);
  });
