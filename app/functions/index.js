import firebase from 'react-native-firebase';

export const getShareUser = (share) => {
  return share.data().user.get()
    .then((doc) => {
      return doc.data()
    })
    .catch((err) => {
      console.error(err);
      return false
    })
};

export const getPostShares = (post, getUser) => {
  return post.collection('shares')
    .get()
    .then((query) => {
      const shares = {};
      query.forEach((share) => {
        shares[ share.id ] = share.data()
        if (getUser) {
          shares[ share.id ][ 'user' ] = getShareUser(share);
        }
      })
      return shares
    })
    .catch((err) => {
      console.error(err);
      return false
    })
};

export const getPosts = (getShares) => {
  return firebase.firestore().collection('posts')
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get()
    .then((query) => {
      const posts = {};
      query.forEach((doc) => {
        posts[ doc.id ] = doc.data();
        if (getShares) {
            posts[ doc.id ][ 'shares' ] = getPostShares(doc.ref, true);
        }
      });
      return posts
    })
    .catch((err) => {
      console.error(err);
      return false
    });
};
