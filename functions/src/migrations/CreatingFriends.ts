import { db } from '../Config';
import { addCreatedAt, addUpdatedAt, returnBatch } from '../Utility';

const createFriends = (database: any) => database
  .collection('users')
  .get()
  .then((querySnapshot: any) => {
    const batch = database.batch();
    const users: { [key: string]: any } = {};

    querySnapshot.forEach((doc: any) => {
      const userId = doc.id;
      users[userId] = {
        ...doc.data(),
        ref: `users/${userId}`,
      };
    });

    for (const initiatingUserId in users) {
      if (users.hasOwnProperty(initiatingUserId)) {
        console.log(initiatingUserId);
        for (const receivingUserId in users) {
          if (users.hasOwnProperty(receivingUserId) && initiatingUserId !== receivingUserId) {
            const friendship = {
              initiatingUserId: `${initiatingUserId}`,
              receivingUserId: `${receivingUserId}`,
              status: 'accepted',
              userIds: [initiatingUserId, receivingUserId],
            };

            batch.set(
              database.collection('friends').doc(`${initiatingUserId}_${receivingUserId}`),
              addUpdatedAt(addCreatedAt(friendship)),
            );
            console.log(receivingUserId);
          }
        }
        delete users[initiatingUserId];
      }
    }

    return returnBatch(batch);
  });

createFriends(db);
