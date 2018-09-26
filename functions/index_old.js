const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
var db = admin.firestore()
db.settings({timestampsInSnapshots: true})

const utility = require('./Utility');
const scraping = require('./Scraping');
const sharing = require('./Sharing');
const counters = require('./Counters');

const matchShareToPost = (normalUrl) => {
  // queries existing posts for a matching share
  // returns post DocumentReference
  // creates a new post if no match
  // enforces matching single post

  // find posts matching normalUrl
  return db.collection('posts')
    .where('url', '==', normalUrl)
    .get()

    // returns post DocumentReference
    .then((query) => {
      // if there's more than one matching post
      if (query.size > 1) {
          console.log('more than one post found');
          return null
        // if there's a single matching post
      } else if (query.size === 1) {
        console.log('existing post found');
        return query.docs[0].ref
      // if there's not a matching post
      } else {
        console.log('no post found, creating a new post');
        return db.collection('posts').add(
          sharing.createPost(normalUrl)
        )
      }
    })
}


// onCreateUserShare({ createdAt: null, updatedAt: null, url: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb' })
// whenever a user share is created
exports.onCreateUserShare = functions.firestore.document('users/{userId}/shares/{shareId}')
  .onCreate((snap, context) => {
    const userId = context.params.userId;
    const newShareRef = snap.ref;
    const newShareUrl = snap.data().url;
    const normalUrl = utility.normalizeUrl(newShareUrl);

    return matchShareToPost(normalUrl)

      // adds share to post
      // update post share counter
      // returns post ref
      .then((postRef) => {
        console.log('adding share to post');
        // return counters.updateCounter(change, context, db, 'shareCount')
        return postRef.collection('shares').add(
          sharing.createPostShare(newShareUrl, userId)
        )
      })

      // update the original share with post ref
      .then((postShare) => {
        console.log('adding post ref to original user share');
        return newShareRef.set(
          sharing.updateUserShareWithPost(postShare.parent.parent), { merge: true }
        )
      })

      // handle errors
      .catch((error) => {
        console.error(error);
        return null
      });
});

// whenever a post share is created
exports.createdPostShare = functions.firestore.document('posts/{postId}/shares/{shareId}')
  .onCreate(data => {
    // scrape url meta data and update post
    // add post to feed for all followers of original sharer


    // when a new share is created for a post, update the post information
    const newShareUrl = data.data().url;
    const postRef = data.ref.parent.parent;

    console.log('getting post data and scraping meta');
    return Promise.all([
        postRef.get(),
        scraping.scrape(newShareUrl)
      ])
      .then((data) => {
        console.log('updating post with meta');
        console.log(data);
        return postRef.set(
          sharing.updatePostWithMeta(data[0].data(), data[1]),
          { merge: true }
        )
      })
      .catch((err) => {
        console.log(err);
        return
      })
});

exports.sendNewShayrPushNotification = functions.firestore.document("posts/{postId}/shares/{shareId}")
  .onCreate(data => {
    // gets standard JavaScript object from the new write
    const writeData = data.data();
    // access data necessary for push notification
    writeData.user.get()
      .then((user) => {
        const senderName = user.data().firstName;
        // const senderName = sender.firstName;
        // the payload is what will be delivered to the device(s)
        let payload = {
          notification: {
            title: 'New Shayr',
            body: `${senderName} shayred something new!`,
            badge: "1",
            channelId: 'new-shayr-channel'
          }
        }
         // or collect them by accessing your database
        var pushToken = "";
        return admin
          .firestore()
          .collection("users")
          .where('pushToken', '>=', '')
          .get()
          .then(query => {
            return query
              .forEach(doc => {
                pushToken = doc.data().pushToken;
                // sendToDevice can also accept an array of push tokens
                return admin.messaging().sendToDevice(pushToken, payload);
              });
          })
       })
      .catch(error => {console.log(error)});
   });

// whenever a user (share, add, done, like) is written (created, updated, deleted)
// writtenUserShare({before: {}, after: {post: 'posts/jbMxqSSlgv5JcTBiO3jh', user: 'users/hD1cMtlBHZfvrrRjIcdTEyfqixG3', active: true}})
exports.writtenUserShare = functions.firestore.document('users/{userId}/shares/{shareId}')
  .onWrite((change, context) => {
    // update post action counter for original post
    // update post action counter for post in all user feeds
    return counters.updateCounter(change, context, db, 'shareCount')
  });

exports.writtenUserAdd = functions.firestore.document('users/{userId}/adds/{addId}')
  .onWrite((change, context) => {
    return counters.updateCounter(change, context, db, 'addCount')
  });

exports.writtenUserDone = functions.firestore.document('users/{userId}/dones/{doneId}')
  .onWrite((change, context) => {
    return counters.updateCounter(change, context, db, 'doneCount')
  });

exports.writtenUserLike = functions.firestore.document('users/{userId}/likes/{likeId}')
  .onWrite((change, context) => {
    return counters.updateCounter(change, context, db, 'likeCount')
  });