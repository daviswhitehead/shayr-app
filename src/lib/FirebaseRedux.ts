import { documentId } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import {
  DocumentSnapshot,
  Query,
  QuerySnapshot,
  SnapshotError
} from 'react-native-firebase/firestore';
import { Dispatch } from 'redux';
import { formatDocumentSnapshot } from './FirebaseHelpers';

// Helpers
export type stateKey =
  | 'usersPostsLists'
  | 'usersPosts'
  | 'adds'
  | 'dones'
  | 'shares'
  | 'sharesLists'
  | 'likes';
export type dataActionTypes = 'GET_START' | 'GET_SUCCESS' | 'GET_FAIL';
export type listActionTypes =
  | 'LIST_REFRESHING'
  | 'LIST_LOADING'
  | 'LIST_ADD'
  | 'LIST_LOADED';

export const generateActionType = (
  stateKey: stateKey,
  actionType: dataActionTypes | listActionTypes
) => {
  return `${stateKey}_${actionType}`;
};

export const generateActionTypes = (
  stateKey: stateKey,
  actionTypes:
    | { [key in dataActionTypes]: dataActionTypes }
    | { [key in listActionTypes]: listActionTypes }
) => {
  return _.reduce(
    actionTypes,
    (result: any, value: dataActionTypes | listActionTypes) => {
      const action = generateActionType(stateKey, value);
      result[action] = action;
      return result;
    },
    {}
  );
};

// DATA
// // Action Types
export const dataActionTypes: { [key in dataActionTypes]: dataActionTypes } = {
  GET_START: 'GET_START',
  GET_SUCCESS: 'GET_SUCCESS',
  GET_FAIL: 'GET_FAIL'
};
export interface DataAction {
  type: string;
  documents: any;
  error: SnapshotError;
}

// // Actions
export const getStart = (stateKey: stateKey) => (dispatch: Dispatch) => {
  dispatch({
    type: generateActionType(stateKey, dataActionTypes.GET_START)
  });
};

export const getSuccess = (stateKey: stateKey, documents: any) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: generateActionType(stateKey, dataActionTypes.GET_SUCCESS),
    documents
  });
};

export const getFail = (stateKey: stateKey, error: SnapshotError) => (
  dispatch: Dispatch
) => {
  dispatch({
    type: generateActionType(stateKey, dataActionTypes.GET_FAIL),
    error
  });
};

export const getFeedOfDocuments = (
  STATE_KEY: stateKey,
  STATE_KEY_LIST: stateKey,
  ownerUserId: string,
  list: string,
  query: Query,
  shouldRefresh?: boolean,
  isLoading?: boolean,
  lastItem?: DocumentSnapshot | 'DONE'
) => async (dispatch: Dispatch) => {
  // prevent loading more items when the end is reached or data is loading
  if (!shouldRefresh && (lastItem === 'DONE' || isLoading)) {
    return;
  }

  if (shouldRefresh) {
    dispatch(listRefresh(STATE_KEY_LIST, ownerUserId, list));
  } else {
    dispatch(listLoading(STATE_KEY_LIST, ownerUserId, list));
  }

  dispatch(getStart(STATE_KEY));

  await query
    .get()
    .then((querySnapshot: QuerySnapshot) => {
      if (!querySnapshot.empty) {
        const documents = {};
        querySnapshot.forEach((document: DocumentSnapshot) => {
          documents[document.id] = formatDocumentSnapshot(document);
        });

        dispatch(getSuccess(STATE_KEY, documents));

        dispatch(listAdd(STATE_KEY_LIST, ownerUserId, list, _.keys(documents)));

        dispatch(
          listLoaded(
            STATE_KEY_LIST,
            ownerUserId,
            list,
            querySnapshot.docs.pop()
          )
        );
      } else {
        dispatch(listLoaded(STATE_KEY_LIST, ownerUserId, list, 'DONE'));
      }
    })
    .catch((error: SnapshotError) => {
      console.error(error);
      dispatch(getFail(STATE_KEY, error));
    });
};

export const getDocuments = (
  STATE_KEY: stateKey,
  query: Query,
  source?: 'default' | 'cache' | 'server'
) => async (dispatch: Dispatch) => {
  dispatch(getStart(STATE_KEY));

  await query
    .get({ source: source ? source : 'default' })
    .then((querySnapshot: QuerySnapshot) => {
      const documents = {};
      if (!querySnapshot.empty) {
        querySnapshot.forEach((document: DocumentSnapshot) => {
          documents[document.id] = formatDocumentSnapshot(document);
        });
      }
      dispatch(getSuccess(STATE_KEY, documents));
    })
    .catch((error: SnapshotError) => {
      console.error(error);
      dispatch(getFail(STATE_KEY, error));
    });
};

export const subscribeDocuments = (STATE_KEY: stateKey, query: Query) => async (
  dispatch: Dispatch
) => {
  dispatch(getStart(STATE_KEY));

  return query.onSnapshot(
    (querySnapshot: QuerySnapshot) => {
      if (!querySnapshot.empty) {
        const documents = {};
        querySnapshot.forEach((document: DocumentSnapshot) => {
          documents[document.id] = formatDocumentSnapshot(document);
        });
        dispatch(getSuccess(STATE_KEY, documents));
      }
    },
    (error: SnapshotError) => {
      console.error(error);
      dispatch(getFail(STATE_KEY, error));
    }
  );
};

export const subscribeToDocument = (
  STATE_KEY: stateKey,
  collection: string,
  documentId: documentId
) => async (dispatch: Dispatch) => {
  dispatch(getStart(STATE_KEY));

  return firebase
    .firestore()
    .collection(collection)
    .doc(documentId)
    .onSnapshot(
      (documentSnapshot: DocumentSnapshot) => {
        if (documentSnapshot.exists) {
          const documents = {
            [documentSnapshot.id]: formatDocumentSnapshot(documentSnapshot)
          };
          dispatch(getSuccess(STATE_KEY, documents));
        }
      },
      (error: SnapshotError) => {
        console.error(error);
        dispatch(getFail(STATE_KEY, error));
      }
    );
};

export const getDocument = (STATE_KEY: stateKey, reference: string) => async (
  dispatch: Dispatch
) => {
  dispatch(getStart(STATE_KEY));

  return firebase
    .firestore()
    .doc(reference)
    .get()
    .then((documentSnapshot: DocumentSnapshot) => {
      if (documentSnapshot.exists) {
        const documents = {
          [documentSnapshot.id]: formatDocumentSnapshot(documentSnapshot)
        };
        dispatch(getSuccess(STATE_KEY, documents));
      }
      return documentSnapshot.id;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const subscribeDocumentsIds = (
  STATE_KEY: stateKey,
  query: Query,
  documentIdField: string,
  ownerUserId: documentId,
  list: string
) => async (dispatch: Dispatch) => {
  dispatch(getStart(STATE_KEY));

  return query.onSnapshot(
    (querySnapshot: QuerySnapshot) => {
      const documents: Array<string> = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((document: DocumentSnapshot) => {
          const documentId = _.get(document.data(), [documentIdField], '');
          if (documentId) {
            documents.push(documentId);
          }
        });
      }
      dispatch(listAdd(STATE_KEY, ownerUserId, list, documents));
      dispatch(listLoaded(STATE_KEY, ownerUserId, list, 'DONE'));
    },
    (error: SnapshotError) => {
      console.error(error);
      dispatch(getFail(STATE_KEY, error));
    }
  );
};

// // Reducers
export interface DataInitialState {
  [documentId: string]: any;
}

export const getSuccessReducer = (state: any, action: DataAction) => {
  const documents = action.documents;
  return _.isArray(documents)
    ? documents
    : {
        ...state,
        ...action.documents
      };
};

// LISTS

// // Action Types
export const listActionTypes: { [key in listActionTypes]: listActionTypes } = {
  LIST_REFRESHING: 'LIST_REFRESHING',
  LIST_LOADING: 'LIST_LOADING',
  LIST_ADD: 'LIST_ADD',
  LIST_LOADED: 'LIST_LOADED'
};

// // Actions
export interface ListAction {
  type: string;
  listKey: string;
  documentIds?: Array<string>;
  lastItem?: DocumentSnapshot | 'DONE';
}

export const listAdd = (
  stateKey: stateKey,
  ownerUserId: string,
  list: string,
  documentIds: Array<string>
) => (dispatch: Dispatch) => {
  dispatch({
    type: generateActionType(stateKey, listActionTypes.LIST_ADD),
    listKey: `${ownerUserId}_${list}`,
    documentIds
  });
};

export const listRefresh = (
  stateKey: stateKey,
  ownerUserId: string,
  list: string
) => (dispatch: Dispatch) => {
  dispatch({
    type: generateActionType(stateKey, listActionTypes.LIST_REFRESHING),
    listKey: `${ownerUserId}_${list}`
  });
};

export const listLoading = (
  stateKey: stateKey,
  ownerUserId: string,
  list: string
) => (dispatch: Dispatch) => {
  dispatch({
    type: generateActionType(stateKey, listActionTypes.LIST_LOADING),
    listKey: `${ownerUserId}_${list}`
  });
};

export const listLoaded = (
  stateKey: stateKey,
  ownerUserId: string,
  list: string,
  lastItem: DocumentSnapshot | 'DONE'
) => (dispatch: Dispatch) => {
  dispatch({
    type: generateActionType(stateKey, listActionTypes.LIST_LOADED),
    listKey: `${ownerUserId}_${list}`,
    lastItem
  });
};

// // Reducers
export interface ListInitialState {
  [listKey: string]: {
    isRefreshing?: boolean;
    isLoading?: boolean;
    isLoaded?: boolean;
    isLoadedAll?: boolean;
    items?: Array<string>;
    isEmpty?: boolean;
    lastItem?: DocumentSnapshot | 'DONE';
  };
}

export const listRefreshReducer = (
  state: any,
  action: {
    listKey: string;
  }
) => {
  return {
    ...state,
    [action.listKey]: {
      ..._.get(state, action.listKey, {}),
      isRefreshing: true
    }
  };
};

export const listLoadingReducer = (
  state: any,
  action: {
    listKey: string;
  }
) => {
  return {
    ...state,
    [action.listKey]: {
      ..._.get(state, action.listKey, {}),
      isLoading: true
    }
  };
};

export const listAddReducer = (
  state: any,
  action: {
    listKey: string;
    documentIds: Array<string>;
    lastItem: DocumentSnapshot | 'DONE';
  }
) => {
  const items = _.get(state, [action.listKey, 'isRefreshing'], false)
    ? [...action.documentIds]
    : _.uniq([
        ..._.get(state, [action.listKey, 'items'], []),
        ...action.documentIds
      ]);

  return {
    ...state,
    [action.listKey]: {
      ..._.get(state, action.listKey, {}),
      items,
      isEmpty: _.isEmpty(items) ? true : false
    }
  };
};

export const listLoadedReducer = (
  state: any,
  action: {
    listKey: string;
    lastItem: DocumentSnapshot | 'DONE';
  }
) => {
  return {
    ...state,
    [action.listKey]: {
      ..._.get(state, action.listKey, {}),
      items: _.get(state, [action.listKey, 'items'], []),
      isLoaded: true,
      isLoading: false,
      isRefreshing: false,
      isLoadedAll: action.lastItem === 'DONE' ? true : false,
      lastItem: action.lastItem
    }
  };
};
