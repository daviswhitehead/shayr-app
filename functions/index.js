const config = require("./Config");
const inboundShare = require("./InboundShare");
const postActions = require("./PostActions");
const post = require("./Post");

exports.onCreateInboundShare = config.functions.firestore
  .document("users/{userId}/inboundShares/{inboundShareId}")
  .onCreate((snap, context) => {
    return inboundShare._onCreateInboundShare(config.db, snap, context);
  });

exports.onWriteAdd = config.functions.firestore
  .document("adds/{addId}")
  .onWrite((change, context) => {
    return postActions._onWriteAdd(config.db, change, context);
  });

exports.onWriteDone = config.functions.firestore
  .document("dones/{doneId}")
  .onWrite((change, context) => {
    return postActions._onWriteDone(config.db, change, context);
  });

exports.onWriteLike = config.functions.firestore
  .document("likes/{likeId}")
  .onWrite((change, context) => {
    return postActions._onWriteLike(config.db, change, context);
  });

exports.onWritePost = config.functions.firestore
  .document("posts/{postId}")
  .onWrite((change, context) => {
    return post._onWritePost(config.db, change, context);
  });

exports.onWriteShare = config.functions.firestore
  .document("shares/{shareId}")
  .onWrite((change, context) => {
    return postActions._onWriteShare(config.db, change, context);
  });
