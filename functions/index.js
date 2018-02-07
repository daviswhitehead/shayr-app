const functions = require('firebase-functions');  // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const admin = require('firebase-admin');  // The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp(functions.config().firebase);
const { URL } = require('url');


const normalizeUrl = (url) => {
  const urlData = new URL(url);

  return 'https://'.concat(
    urlData.hostname.replace(/^www\./,''),
    urlData.pathname
  )
};


const queryPosts = (url) => {
  admin.firestore().collection('posts')
    .where('url', '==', url)
    .get()
    .then((querySnapshot) => {
      console.log(querySnapshot);
      console.log(querySnapshot.size);
      return querySnapshot
    }).catch((error) => {
      console.error(error);
    });
}


const linkSharePosts = (url) => {
  console.log(url);
  const posts = queryPosts(url);
  console.log(posts);
  // const posts = admin.firestore().collection('posts')
  //   .where('url', '==', url)
  //   .get()
  //   .then((querySnapshot) => {
  //     if (querySnapshot.size == 1) {
  //       // updatePost
  //       console.log(querySnapshot.docs[0].data());
  //     } else if (querySnapshot.size > 1) {
  //       console.log('more than one post found');
  //     } else {
  //       // createPost
  //       // updatePost
  //       console.log('no doc');
  //     }
  //   }).catch((error) => {
  //     console.log('error', error);
  //   });
  // console.log(posts);
};


const createPost = () => {
  // create a new post object
};


const udpatePost = () => {
  // update post object with share reference
};


const managePosts = (url) => {
  // query posts collection looking for matching url
  // if post:
  // // updatePost
  // else:
  // // createPost
  // // updatePost
};

const updateShare = (url) => {
  // update share object with post reference
};


exports.helloWorld2 = functions.firestore
  .document('shares/{shareId}')
  .onCreate(event => {
    const newValue = event.data.data();
    console.log(newValue);
    const rawUrl = newValue.url;
    const normalUrl = normalizeUrl(rawUrl);
    console.log(normalUrl);
    linkSharePosts(normalUrl);
});


// {url: "https://www.nytimes.com/2017/12/10/us/politics/richard-shelby-roy-moore.html"}
// {url: "http://www.wired.com/story/apple-podcast-analytics-first-month/?utm=meow"}
// {url: "https://www.nytimes.com/2017/12/10/us/politics/richard-shelby-roy-moore.html"}



// OUTLINE
// take in a share object
// {
//   created_at: ts,
//   post: null,
//   updated_at: ts,
//   url: 'url',
//   user: /users/id,
// }
// search for existing post object by normalUrl
// if existing post:
// // update post object with share reference
// // update share object with post reference
// else:
// // create new post
// // // {
// // //   created_at: ts,
// // //   description: '',
// // //   image: 'image_url',
// // //   medium: '',
// // //   shares: {0: /shares/id},
// // //   title: '',
// // //   updated_at: '',
// // //   url: ''
// // // }
// // update post object with share reference
// // update share object with post reference
