import { formatDocumentSnapshot } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import {
  DocumentReference,
  DocumentSnapshot,
  Query,
  QuerySnapshot,
  SnapshotError
} from 'react-native-firebase/firestore';
import { Dispatch } from 'redux';
import {
  getDocumentsFail,
  getDocumentsStart,
  getDocumentsSuccess
} from './documents/actions';
import {
  listAdd,
  listLoaded,
  listLoading,
  listRefreshing
} from './lists/actions';
import { generateListKey } from './lists/helpers';

export type StateKey =
  | 'users'
  | 'usersPosts'
  | 'adds'
  | 'dones'
  | 'posts'
  | 'shares'
  | 'comments'
  | 'likes';

export type StateKeyLists =
  | 'usersPostsLists'
  | 'addsLists'
  | 'donesLists'
  | 'sharesLists'
  | 'commentsLists'
  | 'likesLists';

export type ListKey = string;
export type Item = string;
export type Items = Array<Item>;
export type LastItem = DocumentSnapshot | 'DONE';

const generateStateKeyList = (stateKey: StateKey) => `${stateKey}Lists`;

export const getFeedOfDocuments = (
  dispatch: Dispatch,
  stateKey: StateKey,
  listKey: string,
  query: Query,
  shouldRefresh?: boolean,
  isLoading?: boolean,
  lastItem?: DocumentSnapshot | 'DONE'
) => {
  // prevent loading more items when the end is reached or data is loading
  if (!shouldRefresh && (lastItem === 'DONE' || isLoading)) {
    return;
  }

  const stateKeyList = generateStateKeyList(stateKey);

  if (shouldRefresh) {
    dispatch(listRefreshing(stateKeyList, listKey));
  } else {
    dispatch(listLoading(stateKeyList, listKey));
  }

  dispatch(getDocumentsStart(stateKey));

  return query
    .get()
    .then((querySnapshot: QuerySnapshot) => {
      if (!querySnapshot.empty) {
        const documents = {};
        querySnapshot.forEach((document: DocumentSnapshot) => {
          documents[document.id] = formatDocumentSnapshot(document);
        });

        dispatch(getDocumentsSuccess(stateKey, documents));

        dispatch(listAdd(stateKeyList, listKey, _.keys(documents)));

        dispatch(listLoaded(stateKeyList, listKey, querySnapshot.docs.pop()));
      } else {
        dispatch(listLoaded(stateKeyList, listKey, 'DONE'));
      }
    })
    .catch((error: SnapshotError) => {
      console.error(error);
      dispatch(getDocumentsFail(stateKey, error));
    });
};

export const subscribeToAllDocuments = (
  dispatch: Dispatch,
  stateKey: StateKey,
  query: Query,
  ownerUserId: string,
  listName: string
) => {
  const stateKeyList = generateStateKeyList(stateKey);

  return query.onSnapshot(
    (querySnapshot: QuerySnapshot) => {
      const listKey = generateListKey(ownerUserId, listName);

      dispatch(listRefreshing(stateKeyList, listKey));

      dispatch(getDocumentsStart(stateKey));

      if (!querySnapshot.empty) {
        const documents = {};
        querySnapshot.forEach((document: DocumentSnapshot) => {
          documents[document.id] = formatDocumentSnapshot(document);
        });

        dispatch(getDocumentsSuccess(stateKey, documents));

        dispatch(listAdd(stateKeyList, listKey, _.keys(documents)));

        dispatch(listLoaded(stateKeyList, listKey, querySnapshot.docs.pop()));
      } else {
        dispatch(listLoaded(stateKeyList, listKey, 'DONE'));
      }
    },
    (error: SnapshotError) => {
      console.error(error);
      dispatch(getDocumentsFail(stateKey, error));
    }
  );
};

export const subscribeToDocument = (
  dispatch: Dispatch,
  stateKey: StateKey,
  reference: DocumentReference
) => {
  dispatch(getDocumentsStart(stateKey));

  return reference.onSnapshot(
    (documentSnapshot: DocumentSnapshot) => {
      if (documentSnapshot.exists) {
        const documents = {
          [documentSnapshot.id]: formatDocumentSnapshot(documentSnapshot)
        };
        dispatch(getDocumentsSuccess(stateKey, documents));
      }
    },
    (error: SnapshotError) => {
      console.error(error);
      dispatch(getDocumentsFail(stateKey, error));
    }
  );
};

export const getDocuments = (
  dispatch: Dispatch,
  stateKey: StateKey,
  query: Query,
  source?: 'default' | 'cache' | 'server'
) => {
  dispatch(getDocumentsStart(stateKey));

  return query
    .get({ source: source ? source : 'default' })
    .then((querySnapshot: QuerySnapshot) => {
      const documents = {};
      if (!querySnapshot.empty) {
        querySnapshot.forEach((document: DocumentSnapshot) => {
          documents[document.id] = formatDocumentSnapshot(document);
        });
      }
      dispatch(getDocumentsSuccess(stateKey, documents));
    })
    .catch((error: SnapshotError) => {
      console.error(error);
      dispatch(getDocumentsFail(stateKey, error));
    });
};

export const getDocument = (
  dispatch: Dispatch,
  stateKey: StateKey,
  reference: DocumentReference,
  source?: 'default' | 'cache' | 'server'
) => {
  dispatch(getDocumentsStart(stateKey));

  return reference
    .get({ source: source ? source : 'default' })
    .then((documentSnapshot: DocumentSnapshot) => {
      if (documentSnapshot.exists) {
        const documents = {
          [documentSnapshot.id]: formatDocumentSnapshot(documentSnapshot)
        };
        dispatch(getDocumentsSuccess(stateKey, documents));
      }
      return documentSnapshot.id;
    })
    .catch((error: SnapshotError) => {
      console.error(error);
      dispatch(getDocumentsFail(stateKey, error));
    });
};
