const functions = require('firebase-functions');  // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const admin = require('firebase-admin');  // The Firebase Admin SDK to access the Firebase Realtime Database.
// const firestore = require('firebase-firestore');
admin.initializeApp(functions.config().firebase);
const URL = require('url');
// firebase experimental:functions:shell



// // share -- create a share
// admin.firestore().collection("users").doc("S7aL0EELXjFrF6nisiEQ")
//   .collection('shares').doc().set({
//     post: null, // admin.firestore().collection("posts").doc("3xtfqOiBzd3qcZOtr4Ys") /posts/3xtfqOiBzd3qcZOtr4Ys
//     url: "https://motherboard.vice.com/en_us/article/a34g9j/iphone-source-code-iboot-ios-leak",
//     createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     updatedAt: admin.firestore.FieldValue.serverTimestamp()
// })
// .then(function() {
//     console.log("Document successfully written!");
// })
// .catch(function(error) {
//     console.error("Error writing document: ", error);
// });


// share sent to server
// update or create a post
  // get post data from share url
  // update existing post or create a new one
// update share with post ref


// admin.firestore().collection("posts").doc("3xtfqOiBzd3qcZOtr4Ys").set({
//     title: "Liberal Outsiders Pour Into Alabama Senate Race, Treading Lightly",
//     url: "https://nytimes.com/2017/12/10/us/politics/richard-shelby-roy-moore.html",
//     description: "With only hours until the polls open in the unlikeliest of battleground states, Democrats are deploying a multimillion-dollar get-out-the-vote operation in an effort to steal away a Senate seat.",
//     image: "https://static01.nyt.com/images/2017/12/11/us/11alabama-alpha/11alabama-alpha-facebookJumbo.jpg",
//     medium: "article",
//     createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     updatedAt: admin.firestore.FieldValue.serverTimestamp()
// })
// .then(function() {
//     console.log("Document successfully written!");
// })
// .catch(function(error) {
//     console.error("Error writing document: ", error);
// });
// admin.firestore().collection("posts").doc("3xtfqOiBzd3qcZOtr4Ys").set({
//     title: "Liberal Outsiders Pour Into Alabama Senate Race, Treading Lightly",
//     url: "https://nytimes.com/2017/12/10/us/politics/richard-shelby-roy-moore.html",
//     description: "With only hours until the polls open in the unlikeliest of battleground states, Democrats are deploying a multimillion-dollar get-out-the-vote operation in an effort to steal away a Senate seat.",
//     image: "https://static01.nyt.com/images/2017/12/11/us/11alabama-alpha/11alabama-alpha-facebookJumbo.jpg",
//     medium: "article",
//     createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     updatedAt: admin.firestore.FieldValue.serverTimestamp()
// })
// .then(function() {
//     console.log("Document successfully written!");
// })
// .catch(function(error) {
//     console.error("Error writing document: ", error);
// });


const normalizeUrl = (url) => {
  const urlData = URL.parse(url);

  return 'https://'.concat(
    urlData.hostname.replace(/^www\./,''),
    urlData.pathname
  )
};

// whenever a new user share is added
// add the share to an existing or new post
exports.hi = functions.firestore.document('users/{userId}/shares/{shareId}')
  .onCreate(event => {
    const userId = event.params.userId;
    const newShare = event.data.data();
    const newSharePath = event.data.ref.path;
    const normalUrl = normalizeUrl(newShare.url);
    console.log(normalUrl);
    console.log(newSharePath);
    console.log(event.params.userId);

    return admin.firestore().collection('posts')
      .where('url', '==', normalUrl).get()
      .then((query) => {

        // if there's a single matching post
        if (query.size === 1) {
          const post = query.docs[0].ref;
          // return post.collection('shares').doc().set({
          //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
          //   updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          //   url: "https://motherboard.vice.com/en_us/article/a34g9j/iphone-source-code-iboot-ios-leak",
          //   user: admin.firestore().collection('users').doc(userId)
          // }, { merge: true });
          return 'test'

        // if there's more than one matching post
      } else if (query.size > 1) {
          console.log('more than one post found');
          return null

        // if there's not a matching post
        } else {
          // return posts.doc().collection('shares').doc().set({
          //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
          //   updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          //   url: "https://motherboard.vice.com/en_us/article/a34g9j/iphone-source-code-iboot-ios-leak",
          //   user: admin.firestore().collection('users').doc(userId)
          // }, { merge: true });
          return 'test'
        }
      })
      .catch((error) => {
        console.error(error);
        return null
      });
});

// whenever a new post share is added
// manage the post meta data
// update the user share with the post ref
exports.meow = functions.firestore.document('posts/{postId}/shares/{shareId}')
  .onCreate(event => {
    // when a new share is created for a post, update the post information
    // const postId = event.params.postId;
    const postId = 'postId2';
    const newShare = event.data.data();
    const userPath = event.data.ref.path;
    const normalUrl = normalizeUrl(newShare.url);

    console.log(postId);
    console.log(newShare);
    console.log(userPath);

    return admin.firestore().collection('posts').doc(postId).get()
      .then((post) => {

        if (
          post.data().description
          && post.data().image
          && post.data().medium
          && post.data().title
          && post.data().url
        ) {
          console.log('HELLO');
          // update createdAt
        } else {
          // pull post metadata
        }


        return 'test'
      })
      .catch((error) => {
        console.error(error);
        return null
      });

    // return null;
});


// {url: "https://www.nytimes.com/2017/12/10/us/politics/richard-shelby-roy-moore.html"}
// {url: "https://motherboard.vice.com/en_us/article/a34g9j/iphone-source-code-iboot-ios-leak"}
// {
//   url: "https://www.nytimes.com/2017/12/10/us/politics/richard-shelby-roy-moore.html",
//   updated_at: "ts",
//   post: "ts",
// }
