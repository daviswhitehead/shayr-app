const config = require("../Config");
const utility = require("../Utility");

const createFriends = db => {
  return db
    .collection("users")
    .get()
    .then(querySnapshot => {
      var batch = db.batch();
      var users = {};

      querySnapshot.forEach(doc => {
        const userId = doc.id;
        users[userId] = {
          ...doc.data(),
          ref: `users/${userId}`
        };
      });

      for (var initiatingUserId in users) {
        if (users.hasOwnProperty(initiatingUserId)) {
          for (var receivingUserId in users) {
            if (
              users.hasOwnProperty(receivingUserId) &&
              initiatingUserId !== receivingUserId
            ) {
              console.log("set");
              console.log(
                users[initiatingUserId].firstName,
                users[initiatingUserId].lastName
              );
              console.log(
                users[receivingUserId].firstName,
                users[receivingUserId].lastName
              );
              console.log("creating a new friendship");
              // {
              //   createdAt (timestamp),
              //   initiatingUser (reference),
              //   receivingUser (reference),
              //   status (string) [pending, accepted, rejected],
              //   updatedAt (timestamp),
              // }
              var friendship = {
                initiatingUser: `users/${initiatingUserId}`,
                receivingUser: `users/${receivingUserId}`,
                status: "accepted"
              };

              batch.set(
                db.collection("friends").doc(),
                utility.addUpdatedAt(utility.addCreatedAt(friendship))
              );
            }
          }
          delete users[initiatingUserId];
        }
      }

      return batch.commit();
    });
};

createFriends(config.db);
