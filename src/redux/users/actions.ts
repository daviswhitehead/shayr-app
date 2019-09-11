import { documentId } from '@daviswhitehead/shayr-resources';
import { Dispatch } from 'redux';
import {
  getQuery,
  queryTypes,
  references,
  referenceTypes
} from '../../lib/FirebaseQueries';
import {
  getDocument,
  getDocuments,
  subscribeToAllDocuments,
  subscribeToDocument
} from '../FirebaseRedux';

export const STATE_KEY = 'users';

export const subscribeToUser = (userId: documentId) => {
  return (dispatch: Dispatch) => {
    return subscribeToDocument(
      dispatch,
      STATE_KEY,
      references.get(referenceTypes.GET_DOCUMENT)(`users/${userId}`)
    );
  };
};

export const subscribeToFriends = (userId: documentId) => {
  return (dispatch: Dispatch) => {
    return subscribeToAllDocuments(
      dispatch,
      STATE_KEY,
      getQuery(queryTypes.USER_FRIENDS)(userId),
      userId,
      queryTypes.USER_FRIENDS
    );
  };
};

export const getUser = (userId: documentId) => {
  return (dispatch: Dispatch) => {
    getDocument(
      dispatch,
      STATE_KEY,
      references.get(referenceTypes.GET_DOCUMENT)(`users/${userId}`)
    );
  };
};

export const getAllUsers = () => {
  return (dispatch: Dispatch) => {
    getDocuments(dispatch, STATE_KEY, getQuery(queryTypes.ALL_USERS)());
  };
};
