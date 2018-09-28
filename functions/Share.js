const URL = require('url');
const utility = require('./Utility');
const _ = require('lodash');
const ogs = require('open-graph-scraper');

const normalizeUrl = (url) => {
  const urlData = URL.parse(url);

  return 'https://'.concat(
    urlData.hostname.replace(/^www\./,''),
    urlData.pathname
  )
};

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
          utility.addUpdatedAt(utility.addCreatedAt({url: normalUrl}))
        )
      }
    })
}

// onCreateShare({createdAt: null, updatedAt: null, url: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb', user: 'users/0'})
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
    post: null,
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
        utility.addUpdatedAt(utility.addCreatedAt(postSharePayload))
      );
      console.log('creating a new user share');
      batch.set(
        db.doc(shareData.user).collection('shares').doc(),
        utility.addUpdatedAt(utility.addCreatedAt({
          ...userSharePayload,
          post: `posts/${postId}`
        }))
      );
      return batch.commit()
    })

    .catch((e) => {
      console.error(e);
      return e
    });
}

const scrape = (url) => {
  const options = {'url': url};
  return ogs(options)
    .then((result) => {
      if (result.success) {
        console.log('scraping success');
        return {
          title: _.get(result.data, 'ogTitle', '') || _.get(result.data, 'twitterTitle', ''),
          publisher: {
            name: _.get(result.data, 'ogSiteName', '') || _.get(result.data, 'twitterSite', ''),
            logo: ''
          },
          description: _.get(result.data, 'ogDescription', '') || _.get(result.data, 'twitterDescription', ''),
          image: _.get(result.data, 'ogImage.url', '') || _.get(result.data, 'twitterImage.url', ''),
          medium: _.get(result.data, 'ogType', '')
        }
      }
      else {
        console.log('scraping failure');
        return null
      }

    })
    .catch((error) => {
      console.log('error:', error);
      return null
    });
}

// onCreatePostShare({createdAt: null, updatedAt: null, url: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb', user: 'users/0', share: 'shares/0', normalUrl: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb',})
exports._onCreatePostShare = (db, snap, context) => {
  // when a new share is created for a post, update the post information
  const postId = context.params.postId;
  const postRef = `posts/${postId}`;

  console.log('getting post data and scraping meta');
  return Promise.all([
      db.doc(postRef).get(),
      scrape(snap.data().url)
    ])
    .then((data) => {
      console.log('updating post with meta');
      const postData = data[0].data();
      const scrapedData = data[1];
      let payload = {
        title: _.get(postData, 'title', '') || _.get(scrapedData, 'title', ''),
        publisher: _.get(postData, 'publisher', '') || _.get(scrapedData, 'publisher', ''),
        description: _.get(postData, 'description', '') || _.get(scrapedData, 'description', ''),
        image: _.get(postData, 'image', '') || _.get(scrapedData, 'image', ''),
        medium: _.get(postData, 'medium', '') || _.get(scrapedData, 'medium', ''),
      };
      payload = postData ? payload : utility.addCreatedAt(payload);
      return db.doc(postRef).set(
        utility.addUpdatedAt(payload),
        {merge: true}
      )
    })
    .catch((e) => {
      console.error(e);
      return e
    })
}
