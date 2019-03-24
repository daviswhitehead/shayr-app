import firebase from 'react-native-firebase';

// Action Types
export const types = {
  LOAD_POSTS_START: 'LOAD_POSTS_START',
  LOAD_POSTS_SUCCESS: 'LOAD_POSTS_SUCCESS',
  LOAD_POSTS_FAIL: 'LOAD_POSTS_FAIL',
  PAGINATE_POSTS_START: 'PAGINATE_POSTS_START',
  PAGINATE_POSTS_SUCCESS: 'PAGINATE_POSTS_SUCCESS',
  PAGINATE_POSTS_FAIL: 'PAGINATE_POSTS_FAIL',
  REFRESH: 'REFRESH',
  LAST_POST: 'LAST_POST',
  RESET_POST_DETAIL: 'RESET_POST_DETAIL',
};

// Helper Functions
const pageLimter = 10;
const feedQuery = userId => firebase
  .firestore()
  .collection('users_posts')
  .where('userId', '==', userId)
  .orderBy('createdAt', 'desc');
const queueQuery = userId => firebase
  .firestore()
  .collection('users_posts')
  .where('userId', '==', userId)
  .where('adds', 'array-contains', userId)
  .orderBy('updatedAt', 'desc');

const firstPosts = (dispatch, userId, query) => {
  dispatch({ type: types.LOAD_POSTS_START });
  const queries = {
    feed: feedQuery(userId),
    queue: queueQuery(userId),
  };
  return queries[query].limit(pageLimter).onSnapshot(
    (querySnapshot) => {
      const posts = {};
      querySnapshot.forEach((doc) => {
        posts[doc.id] = doc.data();
      });
      let newLastPost = 'done';
      if (querySnapshot.docs.length - 1 === pageLimter - 1) {
        newLastPost = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
      dispatch({
        type: types.LAST_POST,
        payload: newLastPost,
        query,
      });
      dispatch({
        type: types.LOAD_POSTS_SUCCESS,
        payload: posts,
        query,
      });
    },
    (e) => {
      console.error(e);
      dispatch({
        type: types.LOAD_POSTS_FAIL,
        error: e,
      });
    },
  );
};

const nextPosts = (dispatch, userId, query, lastPost) => {
  if (lastPost === 'done') {
    return;
  }
  dispatch({ type: types.PAGINATE_POSTS_START });
  const queries = {
    feed: feedQuery(userId),
    queue: queueQuery(userId),
  };
  return queries[query]
    .startAfter(lastPost)
    .limit(pageLimter)
    .onSnapshot(
      (querySnapshot) => {
        const posts = {};
        querySnapshot.forEach((doc) => {
          posts[doc.id] = doc.data();
        });
        let newLastPost = 'done';
        if (querySnapshot.docs.length - 1 === pageLimter - 1) {
          newLastPost = querySnapshot.docs[querySnapshot.docs.length - 1];
        }
        dispatch({
          type: types.LAST_POST,
          payload: newLastPost,
          query,
        });
        dispatch({
          type: types.PAGINATE_POSTS_SUCCESS,
          payload: posts,
          query,
        });
      },
      (e) => {
        console.error(e);
        dispatch({
          type: types.PAGINATE_POSTS_FAIL,
          error: e,
        });
      },
    );
};

export const loadPosts = (userId, query) => function _loadPosts(dispatch) {
  return firstPosts(dispatch, userId, query);
};

export const loadPostDetails = (userId, postId) => function _loadPostDetails(dispatch) {
  dispatch({ type: types.LOAD_POSTS_START });

  return firebase
    .firestore()
    .collection('users_posts')
    .where('userId', '==', userId)
    .where('postId', '==', postId)
    .onSnapshot(
      (querySnapshot) => {
        const post = {};
        querySnapshot.forEach((doc) => {
          post[doc.id] = doc.data();
        });
        dispatch({
          type: types.LOAD_POSTS_SUCCESS,
          payload: post,
          query: 'postDetail',
        });
      },
      (e) => {
        console.error(e);
        dispatch({
          type: types.LOAD_POSTS_FAIL,
          error: e,
        });
      },
    );
};

export const paginatePosts = (userId, query, lastPost) => function _paginatePosts(dispatch) {
  return nextPosts(dispatch, userId, query, lastPost);
};

export const refreshPosts = (userId, query) => function _refreshPosts(dispatch) {
  dispatch({ type: types.REFRESH });
  return firstPosts(dispatch, userId, query);
};

export const flattenPosts = (posts) => {
  const data = [];
  Object.keys(posts).forEach((postId) => {
    data.push({
      key: postId,
      ...posts[postId],
    });
  });

  return data;
};

export const resetPostDetail = () => ({
  type: types.RESET_POST_DETAIL,
});

export const flattenPostsQueue = (userId, posts) => {
  const data = [];
  Object.keys(posts).forEach((postId) => {
    if (!posts[postId].dones || !posts[postId].dones.includes(userId)) {
      data.push({
        key: postId,
        ...posts[postId],
      });
    }
  });

  return data;
};
