import firebase from 'react-native-firebase';
import {
  ts,
  getUserId,
  getDocShares,
  getRefData
} from '../../lib/FirebaseHelpers';

// Action Types
export const types = {
  LOAD_POSTS_START: 'LOAD_POSTS_START',
  LOAD_POSTS_SUCCESS: 'LOAD_POSTS_SUCCESS',
  LOAD_POSTS_FAIL: 'LOAD_POSTS_FAIL',
  PAGINATE_POSTS_START: 'PAGINATE_POSTS_START',
  PAGINATE_POSTS_SUCCESS: 'PAGINATE_POSTS_SUCCESS',
  PAGINATE_POSTS_FAIL: 'PAGINATE_POSTS_FAIL',
  LOAD_POST_SHARES_START: 'LOAD_POST_SHARES_START',
  LOAD_POST_SHARES_SUCCESS: 'LOAD_POST_SHARES_SUCCESS',
  LOAD_POST_SHARES_FAIL: 'LOAD_POST_SHARES_FAIL',
  LOAD_POST_SHARED_BY_START: 'LOAD_POST_SHARED_BY_START',
  LOAD_POST_SHARED_BY_SUCCESS: 'LOAD_POST_SHARED_BY_SUCCESS',
  LOAD_POST_SHARED_BY_FAIL: 'LOAD_POST_SHARED_BY_FAIL',
  LAST_POST: 'LAST_POST',
}

// Helper Functions
const pageLimter = 20

const firstPosts = firebase.firestore().collection('posts')
  .orderBy('updatedAt', 'desc')
  .limit(pageLimter)

const nextPosts = (lastPost) => {
  return firebase.firestore().collection('posts')
  .orderBy('updatedAt', 'desc')
  .startAfter(lastPost)
  .limit(pageLimter)
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
}


// Action Creators
export function loadPosts() {
  return function(dispatch) {
    dispatch({ type: types.LOAD_POSTS_START });
    firstPosts.get()
      .then((querySnapshot) => {
        const posts = {};
        querySnapshot.forEach((doc) => {
          getPostMeta(dispatch, posts, doc);
        });
        dispatch({
          type: types.LAST_POST,
          payload: querySnapshot.docs[querySnapshot.docs.length - 1]
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
}

export function paginatePosts(lastPost) {
  return function(dispatch) {
    dispatch({ type: types.PAGINATE_POSTS_START });
    if (lastPost == 'done') {
      return
    }
    nextPosts(lastPost).get()
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
}
