const utility = require("./Utility");
const counters = require("./Counters");
const _ = require("lodash");

// onWritePost({before: {}, after: {createdAt: null, description: "The question at the heart of this gamble is: are people really going to hang out in virtual reality?", image: "https://wp-assets.futurism.com/2018/06/realestate-600x315.png", medium: "article", publisher: {logo: "", name: "Futurism"}, title: "People are paying insane amounts of real money for 'virtual real estate'", updatedAt: null, url: 'https://futurism.com/virtual-real-estate/amp/'}}, {params: {postId: "Rmmw2Gh6Rb1OxAFTmUCD"}})
exports._onWritePost = async (db, change, context) => {
  // posts/{postId}
  // write Post updates to matching Posts in all userPosts
  const postId = context.params.postId;
  const postRef = `posts/${postId}`;

  // get all matching posts
  const userPosts = await utility.getDocumentsInCollection(
    db
      .collection(`users/${userId}/posts`)
      .where("post", "==", `posts/${postId}`),
    `users/${userId}/posts`
  );
  console.log(userPosts);
  return;

  // for each, write update
};
