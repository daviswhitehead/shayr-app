import firebase from 'react-native-firebase';

export const getUsers = () => {
  return firebase.firestore().collection('users').get()
    .then((query) => {
      return query.docs
    })
    .catch((err) => {
      console.error(err);
      return false
    })
};

export const getUserShares = (user) => {
  return user.ref.collection('shares').get()
    .then((query) => {
      return query.docs
    })
    .catch((err) => {
      console.error(err);
      return false
    })
};

export const getPost = (post) => {
  return post.get()
    .then((doc) => {
      return doc
    })
    .catch((err) => {
      console.error(err);
      return false
    })
};


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

export const getPostShares = (post) => {
  return post.collection('shares').get()
    .then((query) => {
      return query.docs
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
