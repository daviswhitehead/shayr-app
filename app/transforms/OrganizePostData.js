export const organizeData = (users, posts) => {
  const data = [];
  for (var postId in posts) {
    if (posts.hasOwnProperty(postId)) {
      posts[postId]['users'] = [];
      for (var userId in users) {
        if (users.hasOwnProperty(userId)) {
          for (var shareId in users[userId]['shares']) {
            if (users[userId]['shares'].hasOwnProperty(shareId)) {
              if (users[userId]['shares'][shareId].post &&
              users[userId]['shares'][shareId].post.id  == postId) {
                posts[postId]['users'].push(users[userId])
              }
            }
          }
        }
      }
      let friend = posts[postId]['users'][Math.floor(Math.random() * posts[postId]['users'].length)];
      if (!friend) {
        friend = {
          firstName: '',
          lastName: ''
        }
      }
      data.push({
        key: postId,
        image: posts[postId]['image'],
        publisher: posts[postId]['publisher'],
        title: posts[postId]['title'],
        url: posts[postId]['url'],
        friend: {
          firstName: friend.firstName || '',
          lastName: friend.lastName || ''
        },
        shareCount: Object.keys(posts[postId]['shares']).length,
        updatedAt: posts[postId]['updatedAt']
      })
    }
  }

  return data.sort(function(a,b) {return (a.updatedAt > b.updatedAt) ? -1 : ((b.updatedAt > a.updatedAt) ? 1 : 0);} );

}
