const admin = require('firebase-admin');
const URL = require('url');
const utility = require('./Utility');

const normalizeUrl = (url) => {
  const urlData = URL.parse(url);

  return 'https://'.concat(
    urlData.hostname.replace(/^www\./,''),
    urlData.pathname
  )
};

const createPost = (url) => {
  return {
    createdAt: ts,
    updatedAt: ts,
    url: url
  }
}

const matchShareToPost = (db, normalUrl) => {
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
          createPost(normalUrl)
        )
      }
    })
}

// onCreateShare({ createdAt: null, updatedAt: null, url: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb', user: 'users/0' })
exports._onCreateShare = (db, snap, context) => {
  const shareId = context.params.shareId;
  const shareRef = snap.ref;
  const shareData = snap.data();
  const normalUrl = normalizeUrl(shareData.url);

  const postSharePayload = {
    normalUrl: normalUrl,
    share: `shares/${shareId}`,
    url: shareData.url,
    user: shareData.user,
  };

  const userSharePayload = {
    normalUrl: normalUrl,
    share: `shares/${shareId}`,
    url: shareData.url,
  };

  console.log('matching share to existing posts');
  return matchShareToPost(db, normalUrl)
    .then((postRef) => {
      const postId = postRef.id;
      var batch = db.batch()
      console.log('updating original share doc');
      batch.set(
        shareRef,
        {post: `posts/${postId}`},
        {merge: true}
      );
      console.log('creating a new post share');
      batch.set(
        postRef.collection('shares').doc(),
        utility.addTs(postSharePayload)
      );
      console.log('creating a new user share');
      batch.set(
        db.doc(shareData.user).collection('shares').doc(),
        utility.addTs({
          ...userSharePayload,
          post: `posts/${postId}`
        })
      );
      return batch.commit()
    })

    .catch((e) => {
      console.error(e);
      return e
    });
}

// onCreatePostShare({ createdAt: null, updatedAt: null, url: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb', user: 'users/0' })
exports._onCreatePostShare = (db, snap, context) => {
  // fill in here
}
