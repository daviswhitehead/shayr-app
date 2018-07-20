import _ from 'lodash';

export const flattenPosts = (posts) => {
  const data = [];
  for (var postId in posts) {
    if (posts.hasOwnProperty(postId)) {
      console.log(posts[postId]);
      console.log(posts[postId]['sharedBy']);
      console.log(posts[postId]['shareCount']);
      data.push({
        key: postId,
        image: posts[postId]['image'],
        publisher: posts[postId]['publisher'],
        title: posts[postId]['title'],
        url: posts[postId]['url'],
        sharedBy: {
          firstName: _.get(posts[postId]['sharedBy'], 'firstName', ''),
          lastName: _.get(posts[postId]['sharedBy'], 'lastName', '')
        },
        shareCount: posts[postId]['shareCount'],
        updatedAt: posts[postId]['updatedAt']
      })
      console.log(data);
    }
  }

  // sort by updatedAt
  return data.sort(function(a,b) {return (a.updatedAt > b.updatedAt) ? -1 : ((b.updatedAt > a.updatedAt) ? 1 : 0);} );
}
