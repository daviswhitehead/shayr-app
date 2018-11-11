import firebase from "react-native-firebase";
import {
  ts,
  getUserId,
  getDocShares,
  getRefData
} from "../../lib/FirebaseHelpers";
import _ from "lodash";

// Action Types
export const types = {
  LOAD_POSTS_START: "LOAD_POSTS_START",
  LOAD_POSTS_SUCCESS: "LOAD_POSTS_SUCCESS",
  LOAD_POSTS_FAIL: "LOAD_POSTS_FAIL",
  PAGINATE_POSTS_START: "PAGINATE_POSTS_START",
  PAGINATE_POSTS_SUCCESS: "PAGINATE_POSTS_SUCCESS",
  PAGINATE_POSTS_FAIL: "PAGINATE_POSTS_FAIL",
  REFRESH: "REFRESH",
  LAST_POST: "LAST_POST"
};

// Helper Functions
const pageLimter = 1;
const feedQuery = userId => {
  return firebase
    .firestore()
    .collection("users_posts")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc");
};
const queueQuery = userId => {
  return firebase
    .firestore()
    .collection("users_posts")
    .where("userId", "==", userId)
    .where("adds", "array-contains", userId)
    .orderBy("updatedAt", "desc");
};

const firstPosts = (dispatch, userId, query) => {
  dispatch({ type: types.LOAD_POSTS_START });
  const queries = {
    feed: feedQuery(userId),
    queue: queueQuery(userId)
  };
  return queries[query].limit(pageLimter).onSnapshot(
    querySnapshot => {
      const posts = {};
      querySnapshot.forEach(doc => {
        posts[doc.id] = doc.data();
      });
      let newLastPost = "done";
      if (querySnapshot.docs.length - 1 === pageLimter - 1) {
        newLastPost = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
      dispatch({
        type: types.LAST_POST,
        payload: newLastPost,
        query: query
      });
      dispatch({
        type: types.LOAD_POSTS_SUCCESS,
        payload: posts,
        query: query
      });
    },
    e => {
      console.error(e);
      dispatch({
        type: types.LOAD_POSTS_FAIL,
        error: e
      });
    }
  );
};

const nextPosts = (dispatch, userId, query, lastPost) => {
  if (lastPost == "done") {
    return;
  }
  dispatch({ type: types.PAGINATE_POSTS_START });
  const queries = {
    feed: feedQuery(userId),
    queue: queueQuery(userId)
  };
  return queries[query]
    .startAfter(lastPost)
    .limit(pageLimter)
    .onSnapshot(
      querySnapshot => {
        const posts = {};
        querySnapshot.forEach(doc => {
          posts[doc.id] = doc.data();
        });
        let newLastPost = "done";
        if (querySnapshot.docs.length - 1 === pageLimter - 1) {
          newLastPost = querySnapshot.docs[querySnapshot.docs.length - 1];
        }
        dispatch({
          type: types.LAST_POST,
          payload: newLastPost,
          query: query
        });
        dispatch({
          type: types.PAGINATE_POSTS_SUCCESS,
          payload: posts,
          query: query
        });
      },
      e => {
        console.error(e);
        dispatch({
          type: types.PAGINATE_POSTS_FAIL,
          error: e
        });
      }
    );
};

// Action Creators
export const loadPosts = (userId, query) => {
  return function(dispatch) {
    firstPosts(dispatch, userId, query);
  };
};

export const paginatePosts = (userId, query, lastPost) => {
  return function(dispatch) {
    nextPosts(dispatch, userId, query, lastPost);
  };
};

export const refreshPosts = (userId, query) => {
  return function(dispatch) {
    dispatch({ type: types.REFRESH });
    firstPosts(dispatch, userId, query);
  };
};

export const flattenPosts = posts => {
  const data = [];
  for (var postId in posts) {
    if (posts.hasOwnProperty(postId)) {
      data.push({
        key: postId,
        ...posts[postId]
      });
    }
  }

  return data;
};
