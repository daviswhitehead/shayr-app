const utility = require("./Utility");
const counters = require("./Counters");
const atoms = require("./Atoms");
const notifications = require("./Notifications");
const _ = require("lodash");

const createUserPostPayload = async (
  db,
  postAtom,
  userId,
  action,
  actionUserId,
  active
) => {
  const user_postRefString = `users_posts/${userId}_${postAtom.postId}`;
  const user_post = await utility.getDocument(
    db.doc(user_postRefString),
    user_postRefString
  );
  let user_postPayload = utility.addUpdatedAt({
    ...postAtom,
    userId: userId
  });

  var actionUsers = [];
  if (active) {
    actionUsers = _.union(_.get(user_post, action, []), [actionUserId]);
  } else {
    actionUsers = _.remove(
      _.get(user_post, action, []),
      id => id !== actionUserId
    );
  }
  user_postPayload[action] = actionUsers;
  user_postPayload = user_post
    ? user_postPayload
    : utility.addCreatedAt(user_postPayload);

  return [
    db.doc(user_postRefString),
    user_postPayload,
    {
      merge: true
    }
  ];
};

const sharedActionResources = async (db, change, context) => {
  const beforeData = change.before.data() ? change.before.data() : {};
  const newAction = beforeData === {} ? true : false;
  const afterData = change.after.data();
  const post = await utility.getDocument(
    db.doc(`posts/${afterData.postId}`),
    `posts/${afterData.postId}`
  );
  const user = await utility.getDocument(
    db.doc(`users/${afterData.userId}`),
    `users/${afterData.userId}`
  );
  let friends = await utility.getDocumentsInCollection(
    db
      .collection("friends")
      .where("userIds", "array-contains", afterData.userId)
      .where("status", "==", "accepted"),
    "friends"
  );
  friends = utility.organizeFriends(afterData.userId, friends);

  return {
    beforeData: beforeData,
    newAction: newAction,
    afterData: afterData,
    post: post,
    user: user,
    friends: friends
  };
};

const sharedActionWrites = async (db, resources, action) => {
  var batch = db.batch();

  // if active changed
  if (resources.afterData.active !== resources.beforeData.active) {
    console.log("write Post with new count");
    batch.set(
      db.doc(`posts/${resources.post.id}`),
      await counters.getUpdatedCount(
        db,
        `posts/${resources.post.id}`,
        resources.afterData.active,
        `${action}Count`
      ),
      { merge: true }
    );
  }

  console.log("write Post to users_posts for self and friends");
  console.log(
    "update array of users sharing the matching Posts in users_posts object"
  );
  const postAtom = atoms.createPostAtom(resources.post);

  let user_post = await createUserPostPayload(
    db,
    postAtom,
    resources.user.id,
    `${action}s`,
    resources.user.id,
    resources.afterData.active
  );
  batch.set(user_post[0], user_post[1], user_post[2]);

  for (var friendId in resources.friends) {
    if (resources.friends.hasOwnProperty(friendId)) {
      // eslint-disable-next-line no-await-in-loop
      user_post = await createUserPostPayload(
        db,
        postAtom,
        resources.friends[friendId].friendUserId,
        `${action}s`,
        resources.user.id,
        resources.afterData.active
      );
      batch.set(user_post[0], user_post[1], user_post[2]);
    }
  }

  return utility.returnBatch(batch);
};

// onWriteAdd({before: {}, after: {active: true, createdAt: null, postId: "JA81g0b9mPUp8FmchL9M", updatedAt: null, url: "https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb", userId: "0"}}, {params: {addId: "0_JA81g0b9mPUp8FmchL9M"}})
exports._onWriteAdd = async (db, change, context) => {
  // "adds/{addId}" where addId equals `${userId}_${postId}`
  const resources = await sharedActionResources(db, change, context);

  return sharedActionWrites(db, resources, "add");
};

// onWriteDone({before: {}, after: {active: true, createdAt: null, postId: "JA81g0b9mPUp8FmchL9M", updatedAt: null, url: "https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb", userId: "0"}}, {params: {doneId: "0_JA81g0b9mPUp8FmchL9M"}})
exports._onWriteDone = async (db, change, context) => {
  // "dones/{doneId}" where doneId equals `${userId}_${postId}`
  const resources = await sharedActionResources(db, change, context);

  return sharedActionWrites(db, resources, "done");
  // todo: need to add done push notifications
};

// onWriteLike({before: {}, after: {active: true, createdAt: null, postId: "JA81g0b9mPUp8FmchL9M", updatedAt: null, url: "https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb", userId: "0"}}, {params: {likeId: "0_JA81g0b9mPUp8FmchL9M"}})
exports._onWriteLike = async (db, change, context) => {
  // "likes/{likeId}" where likeId equals `${userId}_${postId}`
  const resources = await sharedActionResources(db, change, context);

  return sharedActionWrites(db, resources, "like");
  // todo: need to add like push notifications
};

// onWriteShare({before: {}, after: {active: true, createdAt: null, postId: "JA81g0b9mPUp8FmchL9M", updatedAt: null, url: "https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb", userId: "0"}}, {params: {shareId: "0_JA81g0b9mPUp8FmchL9M"}})
exports._onWriteShare = async (db, change, context) => {
  // "shares/{shareId}" where shareId equals `${userId}_${postId}`
  const resources = await sharedActionResources(db, change, context);

  return sharedActionWrites(db, resources, "share")
    .then(value => {
      if (resources.newAction) {
        console.log("send a notification to followers");
        return notifications.sendNewSharePushNotificationToFriends(resources);
      } else {
        console.log("not sending notification due to old action");
        return value;
      }
    })
    .then(value => {
      console.log("success");
      return value;
    })
    .catch(err => {
      console.error(err);
      return err;
    });
};
