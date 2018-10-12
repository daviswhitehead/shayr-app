const utility = require("./Utility");
// create
// onWriteFriend({before: {}, after: {createdAt: null, deletedAt: null, deletedAt: null, status: 'pending', initiatingUser: 'users/00c3vWoNKJhfthqOkjhzkdZt7jh2', receivingUser: 'users/3SmsEEJByNPACcAcvAcinmNSXmC2', updatedAt: null}})

// update
// onWriteFriend({before: {createdAt: null, deletedAt: null, deletedAt: null, status: 'pending', initiatingUser: 'users/00c3vWoNKJhfthqOkjhzkdZt7jh2', receivingUser: 'users/3SmsEEJByNPACcAcvAcinmNSXmC2', updatedAt: null}, after: {createdAt: null, deletedAt: null, deletedAt: null, status: 'accepted', initiatingUser: 'users/00c3vWoNKJhfthqOkjhzkdZt7jh2', receivingUser: 'users/3SmsEEJByNPACcAcvAcinmNSXmC2', updatedAt: null}})

exports._onWriteFriend = (db, change, context) => {
  const friendshipId = context.params.friendshipId;
  const afterData = change.after.data();
  const beforeData = change.before.data();

  // create function to add/update userFriends
  const userFriendUpdate = (userA, userB) => {
    return db
      .doc(userA)
      .get()
      .then(querySnapshot => {
        // get userA atom data
        const userAId = querySnapshot.id;
        const userAData = querySnapshot.data();

        // build payload
        var payload = {
          friendshipDeletedAt: afterData.deletedAt,
          friendship: `friends/${friendshipId}`,
          friendshipStatus: afterData.status,
          friendshipUpdatedAt: afterData.updatedAt,
          user: `users/${userAId}`,
          userFirstName: userAData.firstName,
          userLastName: userAData.lastName,
          userFacebookProfilePhoto: userAData.facebookProfilePhoto
        };

        // add createdAt if new friendship
        payload = beforeData ? payload : utility.addCreatedAt(payload);

        // update document
        return db
          .doc(userB)
          .collection("friends")
          .doc(friendshipId)
          .set(utility.addUpdatedAt(payload), {
            merge: true
          });
      });
  };

  // run function for both members of friendship
  return Promise.all([
    userFriendUpdate(afterData.initiatingUser, afterData.receivingUser),
    userFriendUpdate(afterData.receivingUser, afterData.initiatingUser)
  ]);
};
