import { db } from '../Config';
import { returnBatch } from '../Utility';

const getShares = (database: any) => database
  .collection('users')
  .get()
  .then(async (usersQuerySnapshot: any) => {
    const batch = database.batch();
    const users: { [key: string]: any } = {};
    const sharesToGet: any = [];

    usersQuerySnapshot.forEach((doc: any) => {
      const userId = doc.id;
      users[userId] = {
        ...doc.data(),
        ref: `users/${userId}`,
      };
      sharesToGet.push(database.collection(`users/${userId}/shares`).get());
    });

    await Promise.all(sharesToGet)
      .then((snapshots) => {
        snapshots.forEach((sharesQuerySnapshot: any) => {
          sharesQuerySnapshot.forEach((doc: any) => {
            const data = doc.data();
            batch.set(
              database.collection(`users/${doc.ref.parent.parent.id}/inboundShares`).doc(),
              {
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                url: data.url,
              },
            );
          });
        });
        return true;
      })
      .catch((e) => {
        console.error(e);
        return e;
      });

    return returnBatch(batch);
  });

getShares(db);
