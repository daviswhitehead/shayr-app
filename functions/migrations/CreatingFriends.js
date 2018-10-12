const config = require("../Config");
const utility = require("../Utility");

const createFriends = db => {
  return (
    db
      .collection("users")
      // .limit(3)
      .get()
      .then(querySnapshot => {
        var batch = db.batch();
        var users = {};
        querySnapshot.forEach(doc => {
          const uid = doc.id;
          users[uid] = {
            ...doc.data(),
            ref: `users/${uid}`
          };
        });
        // console.log(users);
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
                //   deletedAt (timestamp),
                //   initiatingUser (reference),
                //   receivingUser (reference),
                //   status (string) [pending, accepted, rejected],
                //   updatedAt (timestamp),
                // }
                var friendship = {
                  deletedAt: null,
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
      })
  );
  // return db.runTransaction(transaction => {
  //   return transaction
  //     .collection("users")
  //     .get()
  //     .then(value => {
  //       console.log(value);
  //       return value;
  //     });
  // });
};

createFriends(config.db);
