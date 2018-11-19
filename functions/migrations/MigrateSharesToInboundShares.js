const config = require("../Config");
const utility = require("../Utility");

const getShares = db => {
  return db
    .collection("users")
    .get()
    .then(async querySnapshot => {
      var batch = db.batch();
      var users = {};
      var sharesToGet = [];

      querySnapshot.forEach(doc => {
        const userId = doc.id;
        users[userId] = {
          ...doc.data(),
          ref: `users/${userId}`
        };
        sharesToGet.push(db.collection(`users/${userId}/shares`).get());
      });

      const shares = await Promise.all(sharesToGet)
        .then(snapshots => {
          var shares = {};
          snapshots.forEach(querySnapshot => {
            querySnapshot.forEach(doc => {
              const data = doc.data();
              batch.set(
                db
                  .collection(`users/${doc.ref.parent.parent.id}/inboundShares`)
                  .doc(),
                {
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                  url: data.url
                }
              );
            });
          });
          return true;
        })
        .catch(e => {
          console.error(e);
          return e;
        });

      return utility.returnBatch(batch);
    });
};

getShares(config.db);
