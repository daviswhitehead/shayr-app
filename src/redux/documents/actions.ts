import { SnapshotError } from 'react-native-firebase/firestore';
import { StateKey } from '../FirebaseRedux';

export const types = {
  GET_DOCUMENTS_START: 'GET_DOCUMENTS_START',
  GET_DOCUMENTS_SUCCESS: 'GET_DOCUMENTS_SUCCESS',
  GET_DOCUMENTS_FAIL: 'GET_DOCUMENTS_FAIL'
};

type Documents = any;
export type Error = SnapshotError;

interface GetDocumentsStartAction {
  type: string;
  stateKey: StateKey;
}

export const getDocumentsStart = (stateKey: StateKey) => {
  return {
    type: types.GET_DOCUMENTS_START,
    stateKey
  };
};

interface GetDocumentsSuccessAction {
  type: string;
  stateKey: StateKey;
  documents: Documents;
}

export const getDocumentsSuccess = (
  stateKey: StateKey,
  documents: Documents
) => {
  return {
    type: types.GET_DOCUMENTS_SUCCESS,
    stateKey,
    documents
  };
};

interface GetDocumentsFailAction {
  type: string;
  stateKey: StateKey;
  error: Error;
}

export const getDocumentsFail = (stateKey: StateKey, error: Error) => {
  return {
    type: types.GET_DOCUMENTS_FAIL,
    stateKey,
    error
  };
};

export type GetDocumentsAction =
  | GetDocumentsStartAction
  | GetDocumentsSuccessAction
  | GetDocumentsFailAction;
