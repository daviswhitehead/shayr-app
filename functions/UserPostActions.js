const utility = require("./Utility");
const counters = require("./Counters");
const atoms = require("./Atoms");
const _ = require("lodash");

// dev: onWriteUserShare({before: {}, after: {active: true, createdAt: null, post: "posts/zdsFVQfOS20wu8pl6PkX", share: "shares/0", updatedAt: null}}, {params: {userId: '0', shareId: '0'}})
// prod: onWriteUserShare({before: {}, after: {active: true, createdAt: null, post: "posts/B75pXgl0XSrYD4FNdQSI", share: "shares/ogzffNhgI2Q7b66tDmN7", updatedAt: null}})
exports._onWriteUserShare = async (db, change, context) => {
  // "users/{userId}/shares/{shareId}"
  const userId = context.params.userId;
  const shareId = context.params.shareId;
  const shareRef = `users/${userId}/shares/${shareId}`;
  const beforeData = change.before.data() ? change.before.data() : {};
  const afterData = change.after.data();
  const post = await utility.getDocument(
    db.doc(afterData.post),
    afterData.post
  );
  const user = await utility.getDocument(
    db.doc(`users/${userId}`),
    `users/${userId}`
  );
  const friends = await utility.getDocumentsInCollection(
    db
      .collection(`users/${userId}/friends`)
      .where("friendshipStatus", "==", "accepted"),
    `users/${userId}/friends`
  );

  var batch = db.batch();

  // if active changed
  if (afterData.active !== beforeData.active) {
    console.log("write Post with new share count");
    batch.set(
      db.doc(afterData.post),
      await counters.getUpdatedCount(
        db,
        afterData.post,
        afterData.active,
        "shareCount"
      ),
      { merge: true }
    );
  }

  console.log("write Post to userPosts for self and friends");
  console.log(
    "create or update userPostsShares document to matching Post in userPosts for self and friends"
  );
  let postPayload = {};
  let selfPostPayload = {};
  let friendPostPayload = {};

  postPayload = atoms.createPostAtom(post);

  console.log("update userShare field for matching Post in self userPosts");
  selfPostPayload = {
    ...postPayload,
    userShare: afterData.active
  };
  console.log("write Post to userPosts for self");
  // if Post does not exists for user make the user the sharedBy
  let userPost = await utility.getDocument(
    db.doc(`users/${user.id}/post/${post.id}`),
    `users/${user.id}/post/${post.id}`
  );
  if (!userPost) {
    selfPostPayload = {
      ...postPayload,
      ...atoms.createUserAtom(user)
    };
  }

  batch.set(
    db.doc(`users/${userId}/posts/${post.id}`),
    utility.addUpdatedAt(selfPostPayload),
    { merge: true }
  );

  console.log(
    "create or update userPostsShares document to matching Post in userPosts for self"
  );
  let userPostsSharePayload = {
    active: afterData.active,
    ...atoms.createUserAtom(user)
  };

  batch.set(
    db.doc(`users/${userId}/posts/${post.id}/shares/${shareId}`),
    utility.addUpdatedAt(userPostsSharePayload),
    { merge: true }
  );

  console.log("write Post to userPosts for friends");
  console.log(
    "create or update userPostsShares document to matching Post in userPosts for friends"
  );
  for (var friendId in friends) {
    if (friends.hasOwnProperty(friendId)) {
      var friendRef = friends[friendId].user;

      // if Post does not exists for friend make the user the sharedBy
      // eslint-disable-next-line no-await-in-loop
      userPost = await utility.getDocument(
        db.doc(`/users/${friendId}/post/${post.id}`),
        `/users/${friendId}/post/${post.id}`
      );
      friendPostPayload = _.omit(postPayload, "userShare");
      if (!userPost) {
        friendPostPayload = {
          ...friendPostPayload,
          ...atoms.createUserAtom(user)
        };
      }

      batch.set(
        db.doc(`/users/${friendId}/posts/${post.id}`),
        utility.addUpdatedAt(postPayload),
        { merge: true }
      );

      batch.set(
        db.doc(`/users/${friendId}/posts/${post.id}/shares/${shareId}`),
        utility.addUpdatedAt(userPostsSharePayload),
        { merge: true }
      );
    }
  }

  console.log("send a notification to followers");

  return utility.returnBatch(batch);
};
