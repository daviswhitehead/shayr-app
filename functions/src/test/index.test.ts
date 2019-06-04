// const test = require("firebase-functions-test")(
//   {
//     databaseURL: "https://shayr-dev.firebaseio.com",
//     projectId: "shayr-dev",
//     storageBucket: "shayr-dev.appspot.com"
//   },
//   "../../shayr-internal/functions/shayr-dev-a72391b9cbe3.json"
// );
//
// functions = require("../index.js");
// const admin = require("firebase-admin");
// const assert = require("chai").assert;
// const db = admin.firestore();
// const ts = admin.firestore.FieldValue.serverTimestamp();
// const samples = require("./Samples.js");
//
// describe("cloud functions", () => {
//   before(done => {
//     Promise.all(
//       [
//         samples.writeSample(db, samples.users(ts)),
//         samples.writeSample(db, samples.userZeroShares(ts)),
//         samples.writeSample(db, samples.userOneShares(ts)),
//         samples.writeSample(db, samples.userZeroFriends(ts)),
//         samples.writeSample(db, samples.userOneFriends(ts)),
//         samples.writeSample(db, samples.posts(ts))
//       ].reduce((acc, val) => acc.concat(val))
//     )
//       .then(value => {
//         done();
//         return value;
//       })
//       .catch(err => {
//         console.error(err);
//         return err;
//       });
//   });
//
//   after(done => {
//     // Do cleanup tasks.
//     test.cleanup();
//     // Reset the database.
//     Promise.all([
//       db
//         .collection("users")
//         .get()
//         .then(querySnapshot => {
//           querySnapshot.forEach(doc => {
//             db.collection("users")
//               .doc(doc.id)
//               .collection("shares")
//               .get()
//               .then(querySnapshot => {
//                 querySnapshot.forEach(doc => {
//                   doc.ref.delete();
//                 });
//               });
//             db.collection("users")
//               .doc(doc.id)
//               .collection("friends")
//               .get()
//               .then(querySnapshot => {
//                 querySnapshot.forEach(doc => {
//                   doc.ref.delete();
//                 });
//               });
//             doc.ref.delete();
//           });
//         }),
//       db
//         .collection("posts")
//         .get()
//         .then(querySnapshot => {
//           querySnapshot
//             .forEach(doc => {
//               db.collection("posts")
//                 .doc(doc.id)
//                 .collection("shares")
//                 .get()
//                 .then(querySnapshot => {
//                   querySnapshot.forEach(doc => {
//                     doc.ref.delete();
//                   });
//                   return;
//                 })
//                 .catch(err => {
//                   console.error(err);
//                   return err;
//                 });
//               doc.ref.delete();
//             })
//             .catch(err => {
//               console.error(err);
//               return err;
//             });
//           return;
//         })
//     ]).then(value => {
//       done();
//       return;
//     });
//   });
//
//   describe("createdUserShare", () => {
//     // exports.createdUserShare = functions.firestore.document('users/{userId}/shares/{shareId}')
//     it("create a new share", async () => {
//       const wrapped = test.wrap(functions.createdUserShare);
//
//       var potentialShares = samples.potentialShares(ts);
//       const results = [];
//
//       for (var share in potentialShares) {
//         if (potentialShares.hasOwnProperty(share)) {
//           const snap = test.firestore.makeDocumentSnapshot(
//             potentialShares[share].payload,
//             potentialShares[share].path
//           );
//           results.push(wrapped(snap));
//           // assert.equal(1, 1);
//         }
//       }
//       await Promise.all(results);
//     });
//   });
//
//   describe("writtenUserAdd", () => {
//     // exports.writtenUserAdd = functions.firestore.document('users/{userId}/adds/{addId}')
//     //   .onWrite((change, context) => {
//     //     return counters.updateCounter(change, context, db, 'addCount')
//     //   });
//     it("should update associated post counter", async () => {
//       const wrapped = test.wrap(functions.writtenUserAdd);
//
//       const addPath = "users/0/adds/0";
//       const postPath = "posts/0";
//
//       const beforeSnap = test.firestore.makeDocumentSnapshot({}, addPath);
//       const afterSnap = test.firestore.makeDocumentSnapshot(
//         {
//           active: true,
//           post: postPath
//         },
//         addPath
//       );
//       const change = test.makeChange(beforeSnap, afterSnap);
//
//       const originalPost = await db
//         .doc(postPath)
//         .get()
//         .then(doc => {
//           return doc.data();
//         })
//         .catch(e => {
//           return e;
//         });
//
//       await wrapped(change);
//       const updatedPost = await db
//         .doc(postPath)
//         .get()
//         .then(doc => {
//           return doc.data();
//         })
//         .catch(e => {
//           return e;
//         });
//       assert.equal(
//         originalPost.addCount ? originalPost.addCount : 0,
//         updatedPost.addCount - 1
//       );
//     });
//   });
// });
//
// // For Firestore onCreate or onDelete functions
// // const snap = test.firestore.exampleDocumentSnapshot();
// // console.log(snap);
// // For Firestore onUpdate or onWrite functions
// // const change = test.firestore.exampleDocumentSnapshotChange();
// // console.log(change);
