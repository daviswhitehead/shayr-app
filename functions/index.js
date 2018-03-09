const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const utility = require('./Utility');
const scraping = require('./Scraping');
const sharing = require('./Sharing');

// whenever a new user share is created
exports.newShareResponse = functions.firestore.document('users/{userId}/shares/{shareId}')
  .onCreate(event => {
    const userRef = event.data.ref.parent.parent;
    const newShareRef = event.data.ref;
    const newShareUrl = event.data.data().url;
    const normalUrl = utility.normalizeUrl(newShareUrl);

    // find posts matching normalUrl
    return admin.firestore().collection('posts')
      .where('url', '==', normalUrl).get()

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
          return admin.firestore().collection('posts').add(
            sharing.createPost(normalUrl)
          )
        }
      })

      // adds share to post and returns post ref
      .then((post) => {
        console.log('adding share to post');
        return post.collection('shares').add(
          sharing.createPostShare(newShareUrl, userRef)
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

// whenever a new post share is added
exports.newPostShareResponse = functions.firestore.document('posts/{postId}/shares/{shareId}')
  .onCreate(event => {
    // when a new share is created for a post, update the post information
    const newShareUrl = event.data.data().url;
    const postRef = event.data.ref.parent.parent;

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
