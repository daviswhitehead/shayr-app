const utility = require("./Utility");
const counters = require("./Counters");
const _ = require("lodash");

// dev: onWriteUserShare({before: {}, after: {active: true, createdAt: null, post: "posts/S763xqGd9K6TDmWxi9mG", share: "shares/0", updatedAt: null}})
// prod: onWriteUserShare({before: {}, after: {active: true, createdAt: null, post: "posts/B75pXgl0XSrYD4FNdQSI", share: "shares/ogzffNhgI2Q7b66tDmN7", updatedAt: null}})
exports._onWriteUserShare = async (db, change, context) => {
  // "users/{userId}/shares/{shareId}"
  // const userId = context.params.userId;
  const userId = "SJzaNk4qlzaGI0xZq8k9mWMENyt2";
  const shareId = context.params.shareId;
  const shareRef = change.after.ref;
  const beforeData = change.before.data() ? change.before.data() : {};
  const afterData = change.after.data();
  const post = await utility.getDocument(db, afterData.post);
  const user = await utility.getDocument(db, `users/${userId}`);
  const friends = await utility.getDocumentsInCollection(
    db,
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

  postPayload = {
    ..._.omit(post, "createdAt", "updatedAt", "id", "ref"),
    post: `posts/${post.id}`
  };

  console.log("update userShare field for matching Post in self userPosts");
  selfPostPayload = {
    ...postPayload,
    userShare: afterData.active
  };
  console.log("write Post to userPosts for self");
  // if Post does not exists for user make the user the sharedBy
  let userPost = await utility.getDocument(
    db,
    `users/${user.id}/post/${post.id}`
  );
  if (Object.keys(_.omit(userPost, "id", "ref")).length === 0) {
    selfPostPayload = {
      ...postPayload,
      sharedByFirstName: user.firstName,
      sharedByLastName: user.lastName,
      sharedByFacebookProfilePhoto: user.facebookProfilePhoto
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
    user: user.ref,
    userFirstName: user.firstName,
    userLastName: user.lastName,
    userFacebookProfilePhoto: user.facebookProfilePhoto
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

      // if Post does not exists for user make the user the sharedBy
      userPost = await utility.getDocument(
        db,
        `/users/${friendId}/post/${post.id}`
      );
      friendPostPayload = _.omit(postPayload, "userShare");
      if (Object.keys(_.omit(userPost, "id", "ref")).length === 0) {
        friendPostPayload = {
          ...friendPostPayload,
          sharedByFirstName: user.firstName,
          sharedByLastName: user.lastName,
          sharedByFacebookProfilePhoto: user.facebookProfilePhoto
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

  // return utility.returnBatch(batch);
  return;
};

// onUpdateUserShare({before: {createdAt: null, updatedAt: null, url: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb', user: 'users/uoguUzphvgfwerXGFOfBifkqVYo1', active: true, post: 'posts/9fAQRSlT1cIrSe1BMEAw'}, after: {createdAt: null, updatedAt: null, url: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb', user: 'users/uoguUzphvgfwerXGFOfBifkqVYo1', active: false, post: 'posts/9fAQRSlT1cIrSe1BMEAw'}})
// const userId = "uoguUzphvgfwerXGFOfBifkqVYo1";
// exports._onUpdateUserShare = async (db, change, context) => {
//   const userId = context.params.userId;
//   const shareId = context.params.shareId;
//   const shareRef = change.after.ref;
//   const afterData = change.after.data();
//   const beforeData = change.before.data();
//
//   return db
//     .doc(afterData.post)
//     .get()
//     .then(async queryDocumentSnapshot => {
//       const postId = queryDocumentSnapshot.id;
//       const user = await getUser(db, userId);
//
//       var batch = db.batch();
//
//       console.log("update post with new count");
//       if (afterData.active !== beforeData.active) {
//         batch.set(
//           afterData.post,
//           await counters.getCount(postRef, afterData, "shareCount"),
//           { merge: true }
//         );
//       }
//
//       console.log("update user feed shares for friends with new info");
//       // get list of friends
//       const friends = await utility.getDocumentsInCollection(db, `users/${userId}/friends`);
//       for (var friendId in friends) {
//         if (friends.hasOwnProperty(friendId)) {
//           var friendRef = friends[friendId].user;
//           batch.set(
//             db.doc(`${friendRef}/feed/${postId}/shares/${shareId}`),
//             utility.addUpdatedAt({
//               post: `posts/${postId}`,
//               sharedByFirstName: user.firstName,
//               sharedByLastName: user.lastName,
//               sharedByFacebookProfilePhoto: user.facebookProfilePhoto
//             }),
//             { merge: true }
//           );
//         }
//       }
//
//       console.log("update post data in self feed");
//       // e.g. if a share becomes inactive, toggle the userShare boolean
//
//       batch.set(
//         db.doc(`users/${userId}/feed/${postId}`),
//         utility.addUpdatedAt({
//           post: `posts/${postId}`,
//           userShare: true,
//           sharedByFirstName: user.firstName,
//           sharedByLastName: user.lastName,
//           sharedByFacebookProfilePhoto: user.facebookProfilePhoto
//         }),
//         { merge: true }
//       );
//
//       console.log(queryDocumentSnapshot);
//       return;
//
//       const postId = postRef.id;
//       var batch = db.batch();
//
//       batch.set(
//         postRef.collection("shares").doc(),
//         utility.addUpdatedAt(utility.addCreatedAt(postSharePayload))
//       );
//
//       console.log("update post with new count");
//       batch.set(
//         postRef,
//         await counters.getCount(postRef, shareData, "shareCount"),
//         { merge: true }
//       );
//
//       console.log("updating original user share with post ref");
//       batch.set(
//         shareRef,
//         utility.addUpdatedAt({
//           post: `posts/${postId}`,
//           postShare: `posts/${postId}/`
//         }),
//         { merge: true }
//       );
//
//       console.log("add post data to feed for self and friends");
//       // get user info
//       const user = await getUser(db, userId);
//       batch.set(
//         db.doc(`users/${userId}/feed/${postId}`),
//         utility.addUpdatedAt({
//           post: `posts/${postId}`,
//           userShare: true,
//           sharedByFirstName: user.firstName,
//           sharedByLastName: user.lastName,
//           sharedByFacebookProfilePhoto: user.facebookProfilePhoto
//         }),
//         { merge: true }
//       );
//
//       // get list of friends
//       const friends = await utility.getDocumentsInCollection(db, `users/${userId}/friends`);
//       for (var friendId in friends) {
//         if (friends.hasOwnProperty(friendId)) {
//           var friendRef = friends[friendId].user;
//           batch.set(
//             db.doc(`${friendRef}/feed/${postId}`),
//             utility.addUpdatedAt({
//               post: `posts/${postId}`,
//               sharedByFirstName: user.firstName,
//               sharedByLastName: user.lastName,
//               sharedByFacebookProfilePhoto: user.facebookProfilePhoto
//             }),
//             { merge: true }
//           );
//         }
//       }
//
//       console.log("send a notification to followers");
//
//       return batch.commit();
//     })
//
//     .catch(e => {
//       console.error(e);
//       return e;
//     });
// };
