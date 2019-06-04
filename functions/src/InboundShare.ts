import * as _ from 'lodash';
import {
  getDocument, addCreatedAt, addUpdatedAt, returnBatch,
} from './Utility';
import { scrape } from './lib/Scraper';

import urlRegex = require('url-regex');

const matchShareToPost = (db: any, url: string) => db
  .collection('posts')
  .where('url', '==', url)
  .get()

// returns post DocumentReference
  .then((query: any) => {
    // if there's more than one matching post
    if (query.size > 1) {
      console.log('more than one post found');
      return null;
      // if there's a single matching post
    }
    if (query.size === 1) {
      console.log('existing post found');
      return query.docs[0].ref;
      // if there's not a matching post
    }
    console.log('no post found, creating a new post');
    return db.collection('posts').add(addUpdatedAt(addCreatedAt({ url })));
  });

// v1. onCreateInboundShare({createdAt: null, updatedAt: null, url: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb'}, {params: {userId: '0', shareId: '0'}})
// v2a. onCreateInboundShare({createdAt: null, updatedAt: null, payload: 'Trump administration makes case to strike down Affordable Care Act entirely - CNN Politics https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb'}, {params: {userId: '0', shareId: '0'}})
// v2b. onCreateInboundShare({createdAt: null, updatedAt: null, payload: 'A Dark Consensus About Screens and Kids Begins to Emerge in Silicon Valley https://nyti.ms/2JkjOdJ'}, {params: {userId: '0', shareId: '0'}})
// v2c. onCreateInboundShare({createdAt: null, updatedAt: null, payload: 'https://www.youtube.com/watch?v=fdEinX2ngU4&feature=youtu.be'}, {params: {userId: '0', shareId: '0'}})
export const _onCreateInboundShare = async (db: any, snap: any, context: any) => {
  // "users/{userId}/inboundShares/{shareId}"
  const userId = context.params.userId;
  const inboundShareId = context.params.inboundShareId;
  const payload = snap.data().payload || snap.data().url; // handles v1 and v2, preferring v2

  const batch = db.batch();

  console.log('matching url from inboundShare data');
  const url = payload.match(urlRegex())[0];
  console.log('found url: ', url);

  console.log('scraping metadata from url');
  const scrapeData = await scrape(url);
  console.log('found metadata: ', scrapeData);

  console.log('match to Post or create a new Post');
  const postRef = await matchShareToPost(db, scrapeData.url);
  const postRefString = `posts/${postRef.id}`;

  console.log('get Post data');
  const postData = await getDocument(db.doc(postRefString), postRefString);

  console.log('write Post with scraped data');
  let postPayload = {
    description: _.get(postData, 'description', '') || _.get(scrapeData, 'description', ''),
    image: _.get(postData, 'image', '') || _.get(scrapeData, 'image', ''),
    medium: _.get(postData, 'medium', '') || _.get(scrapeData, 'medium', ''),
    publisher: _.get(postData, 'publisher', '') || _.get(scrapeData, 'publisher', ''),
    title: _.get(postData, 'title', '') || _.get(scrapeData, 'title', ''),
    url: _.get(postData, 'url', '') || _.get(scrapeData, 'url', ''),
  };
  postPayload = postData ? postPayload : addCreatedAt(postPayload);
  batch.set(db.doc(postRefString), addUpdatedAt(postPayload), {
    merge: true,
  });

  console.log('get share data for user post');
  const shareRefString = `shares/${userId}_${postRef.id}`;
  const shareData = await getDocument(db.doc(shareRefString), shareRefString);

  console.log('write share for user post');
  let sharePayload = {
    active: true,
    postId: postRef.id,
    url,
    userId,
  };
  sharePayload = shareData ? sharePayload : addCreatedAt(sharePayload);
  batch.set(db.doc(shareRefString), addUpdatedAt(sharePayload));

  console.log('write Share with Post reference');
  batch.set(
    db.doc(`users/${userId}/inboundShares/${inboundShareId}`),
    addUpdatedAt({
      postId: postRef.id,
    }),
    { merge: true },
  );

  return returnBatch(batch);
};
