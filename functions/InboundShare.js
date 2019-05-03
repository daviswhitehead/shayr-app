const URI = require('urijs');
const urlRegex = require('url-regex');
const _ = require('lodash');
const utility = require('./Utility');
const scraper = require('./lib/Scraper');

const matchShareToPost = (db, url) => {
  // queries existing posts for a matching share
  // returns post DocumentReference
  // creates a new post if no match
  // enforces matching single post

  // find posts matching url
  return (
    db
      .collection('posts')
      .where('url', '==', url)
      .get()

      // returns post DocumentReference
      .then(query => {
        // if there's more than one matching post
        if (query.size > 1) {
          console.log('more than one post found');
          return null;
          // if there's a single matching post
        } else if (query.size === 1) {
          console.log('existing post found');
          return query.docs[0].ref;
          // if there's not a matching post
        } else {
          console.log('no post found, creating a new post');
          return db
            .collection('posts')
            .add(utility.addUpdatedAt(utility.addCreatedAt({ url: url })));
        }
      })
  );
};

// v1. onCreateInboundShare({createdAt: null, updatedAt: null, url: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb'}, {params: {userId: '0', shareId: '0'}})
// v2a. onCreateInboundShare({createdAt: null, updatedAt: null, payload: 'Trump administration makes case to strike down Affordable Care Act entirely - CNN Politics https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb'}, {params: {userId: '0', shareId: '0'}})
// v2b. onCreateInboundShare({createdAt: null, updatedAt: null, payload: 'A Dark Consensus About Screens and Kids Begins to Emerge in Silicon Valley https://nyti.ms/2JkjOdJ'}, {params: {userId: '0', shareId: '0'}})
// v2c. onCreateInboundShare({createdAt: null, updatedAt: null, payload: 'https://www.youtube.com/watch?v=fdEinX2ngU4&feature=youtu.be'}, {params: {userId: '0', shareId: '0'}})
exports._onCreateInboundShare = async (db, snap, context) => {
  // "users/{userId}/inboundShares/{shareId}"
  const userId = context.params.userId;
  const inboundShareId = context.params.inboundShareId;
  const payload = snap.data().payload || snap.data().url; // handles v1 and v2, preferring v2

  var batch = db.batch();

  console.log('matching url from inboundShare data');
  const url = payload.match(urlRegex())[0];
  console.log('found url: ', url);

  console.log('scraping metadata from url');
  let scrapeData = await scraper.scrape(url);
  console.log('found metadata: ', scrapeData);

  console.log('match to Post or create a new Post');
  let postRef = await matchShareToPost(db, scrapeData.url);
  let postRefString = `posts/${postRef.id}`;

  console.log('get Post data');
  const postData = await utility.getDocument(
    db.doc(postRefString),
    postRefString
  );

  console.log('write Post with scraped data');
  let postPayload = {
    description:
      _.get(postData, 'description', '') ||
      _.get(scrapeData, 'description', ''),
    image: _.get(postData, 'image', '') || _.get(scrapeData, 'image', ''),
    medium: _.get(postData, 'medium', '') || _.get(scrapeData, 'medium', ''),
    publisher:
      _.get(postData, 'publisher', '') || _.get(scrapeData, 'publisher', ''),
    title: _.get(postData, 'title', '') || _.get(scrapeData, 'title', ''),
    url: _.get(postData, 'url', '') || _.get(scrapeData, 'url', '')
  };
  postPayload = postData ? postPayload : utility.addCreatedAt(postPayload);
  batch.set(db.doc(postRefString), utility.addUpdatedAt(postPayload), {
    merge: true
  });

  console.log('get share data for user post');
  const shareRefString = `shares/${userId}_${postRef.id}`;
  const shareData = await utility.getDocument(
    db.doc(shareRefString),
    shareRefString
  );

  console.log('write share for user post');
  let sharePayload = {
    active: true,
    postId: postRef.id,
    url,
    userId: userId
  };
  sharePayload = shareData ? sharePayload : utility.addCreatedAt(sharePayload);
  batch.set(db.doc(shareRefString), utility.addUpdatedAt(sharePayload));

  console.log('write Share with Post reference');
  batch.set(
    db.doc(`users/${userId}/inboundShares/${inboundShareId}`),
    utility.addUpdatedAt({
      postId: postRef.id
    }),
    { merge: true }
  );

  return utility.returnBatch(batch);
};
