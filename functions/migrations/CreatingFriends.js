const config = require('../Config');
const utility = require('../Utility');

const createFriends = db => {
  return db
    .collection('users')
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
          console.log(initiatingUserId);
          for (var receivingUserId in users) {
            if (
              users.hasOwnProperty(receivingUserId) &&
              initiatingUserId !== receivingUserId
            ) {
              var friendship = {
                initiatingUserId: `${initiatingUserId}`,
                receivingUserId: `${receivingUserId}`,
                status: 'accepted',
                userIds: [initiatingUserId, receivingUserId]
              };

              batch.set(
                db
                  .collection('friends')
                  .doc(`${initiatingUserId}_${receivingUserId}`),
                utility.addUpdatedAt(utility.addCreatedAt(friendship))
              );
              console.log(receivingUserId);
            }
          }
          delete users[initiatingUserId];
        }
      }

      return utility.returnBatch(batch);
    });
};

createFriends(config.db);
