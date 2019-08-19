import { SnapshotError } from 'react-native-firebase/firestore';
import { StateKey } from '../FirebaseRedux';

// Types
export enum types {
  GET_DOCUMENTS_START = 'GET_DOCUMENTS_START',
  GET_DOCUMENTS_SUCCESS = 'GET_DOCUMENTS_SUCCESS',
  GET_DOCUMENTS_FAIL = 'GET_DOCUMENTS_FAIL'
}
interface Documents {
  [id: string]: any;
}
export type Error = SnapshotError;

// Actions
interface GetDocumentsStartAction {
  type: types.GET_DOCUMENTS_START;
  stateKey: StateKey;
}

interface GetDocumentsSuccessAction {
  type: types.GET_DOCUMENTS_SUCCESS;
  stateKey: StateKey;
  documents: Documents;
}

interface GetDocumentsFailAction {
  type: types.GET_DOCUMENTS_FAIL;
  stateKey: StateKey;
  error: Error;
}

export type Actions =
  | GetDocumentsStartAction
  | GetDocumentsSuccessAction
  | GetDocumentsFailAction;

// Action Creators
export const getDocumentsStart = (
  stateKey: StateKey
): GetDocumentsStartAction => {
  return {
    type: types.GET_DOCUMENTS_START,
    stateKey
  };
};

export const getDocumentsSuccess = (
  stateKey: StateKey,
  documents: Documents
): GetDocumentsSuccessAction => {
  return {
    type: types.GET_DOCUMENTS_SUCCESS,
    stateKey,
    documents
  };
};

export const getDocumentsFail = (
  stateKey: StateKey,
  error: Error
): GetDocumentsFailAction => {
  return {
    type: types.GET_DOCUMENTS_FAIL,
    stateKey,
    error
  };
};
