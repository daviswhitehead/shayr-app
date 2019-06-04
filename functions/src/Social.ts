// const utility = require("./Utility");
// const atoms = require("./Atoms");
// // create
// // onWriteFriend({before: {}, after: {createdAt: null, status: 'pending', initiatingUser: 'users/0', receivingUser: 'users/1', updatedAt: null}})
//
// // update
// // onWriteFriend({before: {createdAt: null, status: 'pending', initiatingUser: 'users/0', receivingUser: 'users/1', updatedAt: null}, after: {createdAt: null, status: 'accepted', initiatingUser: 'users/0', receivingUser: 'users/1', updatedAt: null}})
//
// exports._onWriteFriend = async (db, change, context) => {
//   const friendshipId = context.params.friendshipId;
//   const afterData = change.after.data();
//   const beforeData = change.before.data();
//   const initiatingUser = await utility.getDocument(
//     db.doc(afterData.initiatingUser),
//     afterData.initiatingUser
//   );
//   const receivingUser = await utility.getDocument(db, afterData.receivingUser);
//
//   var payload = {
//     friendship: `friends/${friendshipId}`,
//     friendshipStatus: afterData.status
//   };
//
//   // add createdAt if new friendship
//   payload = beforeData ? payload : utility.addCreatedAt(payload);
//
//   var batch = db.batch();
//
//   batch.set(
//     db.doc(`/users/${initiatingUser.id}/friends/${receivingUser.id}`),
//     utility.addUpdatedAt({
//       ...payload,
//       ...atoms.createUserAtom(receivingUser)
//     }),
//     { merge: true }
//   );
//
//   batch.set(
//     db.doc(`/users/${receivingUser.id}/friends/${initiatingUser.id}`),
//     utility.addUpdatedAt({
//       ...payload,
//       ...atoms.createUserAtom(initiatingUser)
//     }),
//     { merge: true }
//   );
//
//   return utility.returnBatch(batch);
// };
