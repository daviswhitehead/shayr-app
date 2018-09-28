// find all post refernces in the feeds collection
exports.findFeedPosts = (postId) => {
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
