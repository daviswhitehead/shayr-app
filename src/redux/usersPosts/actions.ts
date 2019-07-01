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
// type UsersPostsQueries = 'all' | 'shares' | 'adds' | 'dones' | 'likes';
// const composeRequest = (userId: string, query: UsersPostsQueries) => {
//   let request = firebase
//     .firestore()
//     .collection('users_posts')
//     .where('userId', '==', userId)
//     .limit(requestLimiter);

//   if (query === 'all') {
//     request = request.orderBy('createdAt', 'desc');
//   } else {
//     request = request
//       .where(query, 'array-contains', userId)
//       .orderBy('updatedAt', 'desc');
//   }

//   return request;
// };

// export const loadUsersPosts = (
//   userId: string,
//   query: UsersPostsQueries,
//   shouldRefresh: boolean,
//   lastItem?: string
// ) => async (dispatch: Dispatch) => {
//   // prevent loading more items when the end is reached
//   if (lastItem === 'done') {
//     return;
//   }
//   if (shouldRefresh) {
//     dispatch(refreshUsersPostsList(userId, query));
//   }

//   dispatch({ type: types.GET_USERS_POSTS_START });

//   // compose the database request
//   let request = composeRequest(userId, query);
//   if (lastItem) {
//     request = request.startAfter(lastItem);
//   }

//   const usersPosts = await getDocumentsInCollection(
//     request,
//     `users_posts`,
//     requestLimiter
//   );
//   if (usersPosts.documents) {
//     console.log(usersPosts.documents);

//     dispatch({
//       type: types.GET_USERS_POSTS_SUCCESS,
//       usersPosts: usersPosts.documents
//     });
//     dispatch(addToUsersPostsList(userId, query, _.keys(usersPosts.documents)));
//     console.log(usersPosts.lastDocument);

//     dispatch(usersPostsListLoaded(userId, query, usersPosts.lastDocument));
//   } else {
//     dispatch({ type: types.GET_USERS_POSTS_FAIL });
//   }
// };

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
