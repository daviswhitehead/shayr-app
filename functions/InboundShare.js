const utility = require("./Utility");
const URL = require("url");
const _ = require("lodash");
const ogs = require("open-graph-scraper");

const normalizeUrl = url => {
  const urlData = URL.parse(url);

  return "https://".concat(
    urlData.hostname.replace(/^www\./, ""),
    urlData.pathname
  );
};

const scrape = url => {
  const options = { url: url };
  return ogs(options)
    .then(result => {
      if (result.success) {
        console.log("scraping success");
        return {
          title:
            _.get(result.data, "ogTitle", "") ||
            _.get(result.data, "twitterTitle", ""),
          publisher: {
            name:
              _.get(result.data, "ogSiteName", "") ||
              _.get(result.data, "twitterSite", ""),
            logo: ""
          },
          description:
            _.get(result.data, "ogDescription", "") ||
            _.get(result.data, "twitterDescription", ""),
          image:
            _.get(result.data, "ogImage.url", "") ||
            _.get(result.data, "twitterImage.url", ""),
          medium: _.get(result.data, "ogType", "")
        };
      } else {
        console.log("scraping failure");
        return null;
      }
    })
    .catch(error => {
      console.log("error:", error);
      return null;
    });
};

const matchShareToPost = (db, normalUrl) => {
  // queries existing posts for a matching share
  // returns post DocumentReference
  // creates a new post if no match
  // enforces matching single post

  // find posts matching normalUrl
  return (
    db
      .collection("posts")
      .where("url", "==", normalUrl)
      .get()

      // returns post DocumentReference
      .then(query => {
        // if there's more than one matching post
        if (query.size > 1) {
          console.log("more than one post found");
          return null;
          // if there's a single matching post
        } else if (query.size === 1) {
          console.log("existing post found");
          return query.docs[0].ref;
          // if there's not a matching post
        } else {
          console.log("no post found, creating a new post");
          return db
            .collection("posts")
            .add(
              utility.addUpdatedAt(utility.addCreatedAt({ url: normalUrl }))
            );
        }
      })
  );
};

// onCreateInboundShare({createdAt: null, updatedAt: null, url: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb'}, {params: {userId: '0', shareId: '0'}})

exports._onCreateInboundShare = async (db, snap, context) => {
  // "users/{userId}/inboundShares/{shareId}"
  const userId = context.params.userId;
  const inboundShareId = context.params.inboundShareId;
  const url = snap.data().url;

  var batch = db.batch();

  console.log("normalizing url");
  const normalUrl = normalizeUrl(url);

  console.log("scraping share data");
  let scrapeData = await scrape(normalUrl);

  console.log("match to Post or create a new Post");
  let postRef = await matchShareToPost(db, normalUrl);
  let postRefString = `posts/${postRef.id}`;

  console.log("get Post data");
  const postData = await utility.getDocument(
    db.doc(postRefString),
    postRefString
  );

  console.log("write Post with scraped data");
  let postPayload = {
    title: _.get(postData, "title", "") || _.get(scrapeData, "title", ""),
    publisher:
      _.get(postData, "publisher", "") || _.get(scrapeData, "publisher", ""),
    description:
      _.get(postData, "description", "") ||
      _.get(scrapeData, "description", ""),
    image: _.get(postData, "image", "") || _.get(scrapeData, "image", ""),
    medium: _.get(postData, "medium", "") || _.get(scrapeData, "medium", "")
  };
  postPayload = postData ? postPayload : utility.addCreatedAt(postPayload);
  batch.set(db.doc(postRefString), utility.addUpdatedAt(postPayload), {
    merge: true
  });

  console.log("get share data for user post");
  const shareRefString = `shares/${userId}_${postRef.id}`;
  const shareData = await utility.getDocument(
    db.doc(shareRefString),
    shareRefString
  );

  console.log("write share for user post");
  let sharePayload = {
    active: true,
    postId: postRef.id,
    url: normalUrl,
    userId: userId
  };
  sharePayload = shareData ? sharePayload : utility.addCreatedAt(sharePayload);
  batch.set(db.doc(shareRefString), utility.addUpdatedAt(sharePayload));

  console.log("write Share with Post reference");
  batch.set(
    db.doc(`users/${userId}/inboundShares/${inboundShareId}`),
    utility.addUpdatedAt({
      postId: postRef.id
    }),
    { merge: true }
  );

  return utility.returnBatch(batch);
};
