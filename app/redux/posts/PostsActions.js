import firebase from 'react-native-firebase';
import {
  ts,
  getUserId,
  getDocShares,
  getRefData
} from '../../lib/FirebaseHelpers';
import _ from 'lodash';

// Action Types
export const types = {
  LOAD_FEED_POSTS_START: 'LOAD_FEED_POSTS_START',
  LOAD_FEED_POSTS_SUCCESS: 'LOAD_FEED_POSTS_SUCCESS',
  LOAD_FEED_POSTS_FAIL: 'LOAD_FEED_POSTS_FAIL',
  LOAD_QUEUE_POSTS_START: 'LOAD_QUEUE_POSTS_START',
  LOAD_QUEUE_POSTS_SUCCESS: 'LOAD_QUEUE_POSTS_SUCCESS',
  LOAD_QUEUE_POSTS_FAIL: 'LOAD_QUEUE_POSTS_FAIL',
  PAGINATE_FEED_POSTS_START: 'PAGINATE_FEED_POSTS_START',
  PAGINATE_FEED_POSTS_SUCCESS: 'PAGINATE_FEED_POSTS_SUCCESS',
  PAGINATE_FEED_POSTS_FAIL: 'PAGINATE_FEED_POSTS_FAIL',
  REFRESH: 'REFRESH',
  LAST_POST: 'LAST_POST',
  LOAD_POST_SHARES_START: 'LOAD_POST_SHARES_START',
  LOAD_POST_SHARES_SUCCESS: 'LOAD_POST_SHARES_SUCCESS',
  LOAD_POST_SHARED_BY_START: 'LOAD_POST_SHARED_BY_START',
  LOAD_POST_SHARED_BY_SUCCESS: 'LOAD_POST_SHARED_BY_SUCCESS',
  LOAD_POST_META_START: 'LOAD_POST_META_START',
  LOAD_POST_META_SUCCESS: 'LOAD_POST_META_SUCCESS',
  LOAD_POST_META_FAIL: 'LOAD_POST_META_FAIL',
}

// Helper Functions
const pageLimter = 20

const firstFeedPosts = (dispatch) => {
  dispatch({ type: types.LOAD_FEED_POSTS_START });
  return firebase.firestore().collection('posts')
    .orderBy('updatedAt', 'desc')
    .limit(pageLimter)
    .get()
    .then((querySnapshot) => {
      const posts = {};
      querySnapshot.forEach((doc) => {
        getPostMeta(dispatch, posts, doc);
      });
      let newLastPost = 'done'
      if (querySnapshot.docs.length - 1 === pageLimter - 1) {
        newLastPost = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
      dispatch({
        type: types.LAST_POST,
        payload: newLastPost
      });
      dispatch({
        type: types.LOAD_FEED_POSTS_SUCCESS,
        payload: posts
      });
    })
    .catch((e) => {
      console.error(e);
      dispatch({
        type: types.LOAD_FEED_POSTS_FAIL,
        payload: e
      });
    });
}

const nextFeedPosts = (dispatch, lastPost) => {
  if (lastPost == 'done') {
    return
  }
  firebase.firestore().collection('posts')
    .orderBy('updatedAt', 'desc')
    .startAfter(lastPost)
    .limit(pageLimter)
    .get()
    .then((querySnapshot) => {
      const posts = {};
      querySnapshot.forEach((doc) => {
        getPostMeta(dispatch, posts, doc);
      });
      let newLastPost = 'done'
      if (querySnapshot.docs.length - 1 === pageLimter - 1) {
        newLastPost = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
      dispatch({
        type: types.LAST_POST,
        payload: newLastPost
      });
      dispatch({
        type: types.PAGINATE_FEED_POSTS_SUCCESS,
        payload: posts
      });
    })
    .catch((e) => {
      console.error(e);
      dispatch({
        type: types.PAGINATE_FEED_POSTS_FAIL,
        payload: e
      });
    });
}

const firstQueuePosts = (dispatch, userId) => {
  dispatch({ type: types.LOAD_QUEUE_POSTS_START });
  return firebase.firestore()
    .collection('users')
    .doc(userId)
    .collection('postsMeta')
    .where('addVisible', '==', true)
    .orderBy('addUpdatedAt', 'desc')
    .onSnapshot((querySnapshot) => {
      const posts = {};
      querySnapshot.forEach(async (doc) => {
        const post = await firebase.firestore().collection('posts').doc(doc.id).get()
        getPostMeta(dispatch, posts, post);
      });
      dispatch({
        type: types.LOAD_QUEUE_POSTS_SUCCESS,
        payload: posts
      });
    })
    // .catch((e) => {
    //   console.error(e);
    //   dispatch({
    //     type: types.LOAD_QUEUE_POSTS_FAIL,
    //     payload: e
    //   });
    // });
}

const getPostMeta = async (dispatch, posts, doc) => {
  dispatch({
    type: types.LOAD_POST_META_START
  });

  try {
    posts[doc.id] = doc.data();

    dispatch({ type: types.LOAD_POST_SHARES_START });
    posts[doc.id]['shares'] = await getDocShares(doc.ref);
    dispatch({ type: types.LOAD_POST_SHARES_SUCCESS });

    posts[doc.id]['shareCount'] = posts[doc.id]['shares'].length;

    dispatch({ type: types.LOAD_POST_SHARED_BY_START });
    posts[doc.id]['sharedBy'] = await getRefData(
      posts[doc.id]['shares'][0].data()['user']
    )
    dispatch({ type: types.LOAD_POST_SHARED_BY_SUCCESS });
  } catch (e) {
    console.error(e);
    dispatch({
      type: types.LOAD_POST_META_FAIL,
      payload: e
    });
  }

  dispatch({
    type: types.LOAD_POST_META_SUCCESS
  });
}

// Action Creators
export function loadFeedPosts() {
  return function(dispatch) {
    firstFeedPosts(dispatch);
  }
}

export function paginateFeedPosts(lastPost) {
  return function(dispatch) {
    dispatch({ type: types.PAGINATE_FEED_POSTS_START });
    nextFeedPosts(dispatch, lastPost)
  }
}

export const refreshFeedPosts = () => {
  return function(dispatch) {
    dispatch({ type: types.REFRESH });
    firstFeedPosts(dispatch);
  }
}

export function loadQueuePosts(userId) {
  return function(dispatch) {
    return firstQueuePosts(dispatch, userId);
  }
}

export const refreshQueuePosts = (userId) => {
  return function(dispatch) {
    dispatch({ type: types.REFRESH });
    firstQueuePosts(dispatch, userId);
  }
}

export const flattenPosts = (posts) => {
  const data = [];
  for (var postId in posts) {
    if (posts.hasOwnProperty(postId)) {
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
    }
  }

  // sort by updatedAt
  return data.sort(function(a,b) {return (a.updatedAt > b.updatedAt) ? -1 : ((b.updatedAt > a.updatedAt) ? 1 : 0);} );
}
