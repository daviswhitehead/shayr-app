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

// onCreateShare({createdAt: null, updatedAt: null, url: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb', user: 'users/uoguUzphvgfwerXGFOfBifkqVYo1'})
// const user = "users/uoguUzphvgfwerXGFOfBifkqVYo1";
exports._onCreateShare = async (db, snap, context) => {
  // "shares/{shareId}"
  const shareId = context.params.shareId;
  const shareRef = snap.ref;
  const shareData = snap.data();
  const userId = utility.getReferenceId(shareData.user, 1);

  var batch = db.batch();

  console.log("normalizing url");
  const normalUrl = normalizeUrl(shareData.url);

  console.log("scraping share data");
  let scrapeData = await scrape(normalUrl);

  console.log("match to Post or create a new Post");
  let postRef = await matchShareToPost(db, normalUrl);
  const postId = postRef.id;

  console.log("get Post data");
  const postData = await utility.getDocument(db, `posts/${postId}`);

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
  batch.set(postRef, utility.addUpdatedAt(postPayload), { merge: true });

  console.log("get userShare data");
  const userShareRef = `users/${userId}/shares/${shareId}`;
  const userShareData = await utility.getDocument(db, userShareRef);

  console.log("write userShare");
  let userSharePayload = {
    active: true,
    post: postRef,
    share: shareRef
  };
  userSharePayload = userShareData
    ? userSharePayload
    : utility.addCreatedAt(userSharePayload);
  batch.set(db.doc(userShareRef), utility.addUpdatedAt(userSharePayload));

  console.log("write Share with Post reference");
  batch.set(
    shareRef,
    utility.addUpdatedAt({
      post: postRef
    }),
    { merge: true }
  );

  return utility.returnBatch(batch);
};
