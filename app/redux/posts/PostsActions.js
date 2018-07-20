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
  LOAD_POSTS_START: 'LOAD_POSTS_START',
  LOAD_POSTS_SUCCESS: 'LOAD_POSTS_SUCCESS',
  LOAD_POSTS_FAIL: 'LOAD_POSTS_FAIL',
  PAGINATE_POSTS_START: 'PAGINATE_POSTS_START',
  PAGINATE_POSTS_SUCCESS: 'PAGINATE_POSTS_SUCCESS',
  PAGINATE_POSTS_FAIL: 'PAGINATE_POSTS_FAIL',
  REFRESH: 'REFRESH',
  LAST_POST: 'LAST_POST',
  LOAD_POST_SHARES_START: 'LOAD_POST_SHARES_START',
  LOAD_POST_SHARES_SUCCESS: 'LOAD_POST_SHARES_SUCCESS',
  LOAD_POST_SHARES_FAIL: 'LOAD_POST_SHARES_FAIL',
  LOAD_POST_SHARED_BY_START: 'LOAD_POST_SHARED_BY_START',
  LOAD_POST_SHARED_BY_SUCCESS: 'LOAD_POST_SHARED_BY_SUCCESS',
  LOAD_POST_SHARED_BY_FAIL: 'LOAD_POST_SHARED_BY_FAIL',
  LOAD_POST_META: 'LOAD_POST_META',
}

// Helper Functions
const pageLimter = 20

const firstPosts = (dispatch) => {
  dispatch({ type: types.LOAD_POSTS_START });
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
        type: types.LOAD_POSTS_SUCCESS,
        payload: posts
      });
    })
    .catch((e) => {
      console.error(e);
      dispatch({
        type: types.LOAD_POSTS_FAIL,
        payload: e
      });
    });
}
// const firstPosts = (dispatch) => {
//   dispatch({ type: types.LOAD_POSTS_START });
//   return firebase.firestore().collection('posts')
//     .orderBy('updatedAt', 'desc')
//     .limit(pageLimter)
//     .onSnapshot((querySnapshot) => {
//       const posts = {};
//       querySnapshot.forEach((doc) => {
//         getPostMeta(dispatch, posts, doc);
//       });
//       let newLastPost = 'done'
//       if (querySnapshot.docs.length - 1 === pageLimter - 1) {
//         newLastPost = querySnapshot.docs[querySnapshot.docs.length - 1];
//       }
//       dispatch({
//         type: types.LAST_POST,
//         payload: newLastPost
//       });
//       dispatch({
//         type: types.LOAD_POSTS_SUCCESS,
//         payload: posts
//       });
//     })
// }

const nextPosts = (dispatch, lastPost) => {
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
        type: types.PAGINATE_POSTS_SUCCESS,
        payload: posts
      });
    })
    .catch((e) => {
      console.error(e);
      dispatch({
        type: types.PAGINATE_POSTS_FAIL,
        payload: e
      });
    });
}

const getPostMeta = async (dispatch, posts, doc) => {
  posts[doc.id] = doc.data();

  try {
    dispatch({ type: types.LOAD_POST_SHARES_START });
    posts[doc.id]['shares'] = await getDocShares(doc.ref);
    dispatch({ type: types.LOAD_POST_SHARES_SUCCESS });
  } catch (e) {
    console.error(e);
    dispatch({
      type: types.LOAD_POST_SHARES_FAIL,
      payload: e
    });
  }

  posts[doc.id]['shareCount'] = posts[doc.id]['shares'].length;

  try {
    dispatch({ type: types.LOAD_POST_SHARED_BY_START });
    posts[doc.id]['sharedBy'] = await getRefData(
      posts[doc.id]['shares'][0].data()['user']
    )
    dispatch({ type: types.LOAD_POST_SHARED_BY_SUCCESS });
  } catch (e) {
    console.error(e);
    dispatch({
      type: types.LOAD_POST_SHARED_BY_FAIL,
      payload: e
    });
  }
  dispatch({
    type: types.LOAD_POST_META
  });
}


// Action Creators
export function loadPosts() {
  return function(dispatch) {
    firstPosts(dispatch);
  }
}

export function paginatePosts(lastPost) {
  return function(dispatch) {
    dispatch({ type: types.PAGINATE_POSTS_START });
    nextPosts(dispatch, lastPost)
  }
}

export const refreshPosts = () => {
  return function(dispatch) {
    dispatch({ type: types.REFRESH });
    firstPosts(dispatch);
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
