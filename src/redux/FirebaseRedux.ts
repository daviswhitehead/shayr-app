import { formatDocumentSnapshot } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import {
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

export type StateKey =
  | 'usersPosts'
  | 'adds'
  | 'dones'
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
export type Items = Array<string>;
export type LastItem = DocumentSnapshot | 'DONE';

const generateStateKeyList = (stateKey: StateKey) => `${stateKey}Lists`;

const generateListKey = (id: string, listName: string) => `${id}_${listName}`;

export const getFeedOfDocuments = (
  stateKey: StateKey,
  ownerUserId: string,
  listName: string,
  query: Query,
  shouldRefresh?: boolean,
  isLoading?: boolean,
  lastItem?: DocumentSnapshot | 'DONE'
) => async (dispatch: Dispatch) => {
  // prevent loading more items when the end is reached or data is loading
  if (!shouldRefresh && (lastItem === 'DONE' || isLoading)) {
    return;
  }

  const stateKeyList = generateStateKeyList(stateKey);
  const listKey = generateListKey(ownerUserId, listName);

  if (shouldRefresh) {
    dispatch(listRefreshing(stateKeyList, listKey));
  } else {
    dispatch(listLoading(stateKeyList, listKey));
  }

  dispatch(getDocumentsStart(stateKey));

  await query
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
  stateKey: StateKey,
  query: Query,
  ownerUserId: string,
  listName: string
) => async (dispatch: Dispatch) => {
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
