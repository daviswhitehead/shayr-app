import _ from 'lodash';
import {
  DocumentSnapshot,
  QuerySnapshot,
  SnapshotError
} from 'react-native-firebase/firestore';
import { Dispatch } from 'redux';
import { formatDocumentSnapshot } from '../../lib/FirebaseHelpers';
import {
  composeRequest,
  RequestType,
  requestTypes
} from '../../lib/FirebaseRequests';
import {
  addToUsersPostsList,
  refreshUsersPostsList,
  usersPostsListLoaded,
  usersPostsListLoading
} from '../usersPostsLists/actions';

export const types = {
  GET_USERS_POSTS_START: 'GET_USERS_POSTS_START',
  GET_USERS_POSTS_SUCCESS: 'GET_USERS_POSTS_SUCCESS',
  GET_USERS_POSTS_FAIL: 'GET_USERS_POSTS_FAIL'
};

const requestLimiter = 10;
export const loadUsersPosts = (
  userId: string,
  requestType: RequestType,
  shouldRefresh: boolean,
  lastItem?: DocumentSnapshot | 'DONE',
  isLoading?: boolean
) => async (dispatch: Dispatch) => {
  // prevent loading more items when the end is reached
  if (lastItem === 'DONE' || (isLoading && !shouldRefresh)) {
    return;
  }
  if (shouldRefresh) {
    dispatch(refreshUsersPostsList(userId, requestType));
  } else {
    dispatch(usersPostsListLoading(userId, requestType));
  }

  dispatch({ type: types.GET_USERS_POSTS_START });

  const request = composeRequest(
    requestTypes[requestType].request(userId),
    requestLimiter,
    lastItem
  );

  await request
    .get()
    .then((querySnapshot: any) => {
      if (!querySnapshot.empty) {
        const documents = {};
        querySnapshot.forEach((document: DocumentSnapshot) => {
          documents[document.id] = formatDocumentSnapshot(document);
        });

        dispatch({
          type: types.GET_USERS_POSTS_SUCCESS,
          usersPosts: documents
        });
        dispatch(addToUsersPostsList(userId, requestType, _.keys(documents)));

        dispatch(
          usersPostsListLoaded(userId, requestType, querySnapshot.docs.pop())
        );
      } else {
        dispatch(usersPostsListLoaded(userId, requestType, 'DONE'));
      }
    })
    .catch((error: SnapshotError) => {
      console.error(error);
      dispatch({ type: types.GET_USERS_POSTS_FAIL });
    });
};

export const subscribeUsersPosts = (
  userId: string,
  requestType: RequestType,
  shouldRefresh: boolean,
  lastItem?: DocumentSnapshot | 'DONE',
  isLoading?: boolean
) => async (dispatch: Dispatch) => {
  // prevent loading more items when the end is reached
  if (lastItem === 'DONE' || (isLoading && !shouldRefresh)) {
    return;
  }
  if (shouldRefresh) {
    dispatch(refreshUsersPostsList(userId, requestType));
  } else {
    dispatch(usersPostsListLoading(userId, requestType));
  }

  dispatch({ type: types.GET_USERS_POSTS_START });

  const request = composeRequest(
    requestTypes[requestType].request(userId),
    requestLimiter,
    lastItem
  );

  return request.onSnapshot(
    (querySnapshot: QuerySnapshot) => {
      if (!querySnapshot.empty) {
        const documents = {};
        querySnapshot.forEach((document: DocumentSnapshot) => {
          documents[document.id] = formatDocumentSnapshot(document);
        });

        dispatch({
          type: types.GET_USERS_POSTS_SUCCESS,
          usersPosts: documents
        });
        dispatch(addToUsersPostsList(userId, requestType, _.keys(documents)));

        dispatch(
          usersPostsListLoaded(userId, requestType, querySnapshot.docs.pop())
        );
      } else {
        dispatch(usersPostsListLoaded(userId, requestType, 'DONE'));
      }
    },
    (error: SnapshotError) => {
      console.error(error);
      dispatch({ type: types.GET_USERS_POSTS_FAIL });
    }
  );
};

export const loadSingleUsersPosts = (userId: string, postId: string) => async (
  dispatch: Dispatch
) => {
  dispatch({ type: types.GET_USERS_POSTS_START });

  const request = requestTypes.USERS_POSTS_SINGLE.request(userId, postId);

  await request
    .get()
    .then((querySnapshot: QuerySnapshot) => {
      if (!querySnapshot.empty) {
        const documents = {};
        querySnapshot.forEach((document: DocumentSnapshot) => {
          documents[document.id] = formatDocumentSnapshot(document);
        });

        dispatch({
          type: types.GET_USERS_POSTS_SUCCESS,
          usersPosts: documents
        });
      }
    })
    .catch((error: SnapshotError) => {
      console.error(error);
      dispatch({ type: types.GET_USERS_POSTS_FAIL });
    });
};

export const subscribeSingleUsersPosts = (
  userId: string,
  postId: string
) => async (dispatch: Dispatch) => {
  dispatch({ type: types.GET_USERS_POSTS_START });

  const request = requestTypes.USERS_POSTS_SINGLE.request(userId, postId);

  return request.onSnapshot(
    (querySnapshot: QuerySnapshot) => {
      if (!querySnapshot.empty) {
        const documents = {};
        querySnapshot.forEach((document: DocumentSnapshot) => {
          documents[document.id] = formatDocumentSnapshot(document);
        });

        dispatch({
          type: types.GET_USERS_POSTS_SUCCESS,
          usersPosts: documents
        });
      }
    },
    (error: SnapshotError) => {
      console.error(error);
      dispatch({ type: types.GET_USERS_POSTS_FAIL });
    }
  );
};
