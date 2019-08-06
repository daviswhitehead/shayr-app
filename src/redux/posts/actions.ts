import { documentId } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import { Dispatch } from 'redux';
import {
  dataActionTypes,
  generateActionTypes,
  getDocument
} from '../../lib/FirebaseRedux';

export const STATE_KEY = 'posts';

export const types = {
  ...generateActionTypes(STATE_KEY, dataActionTypes)
};

export const getPost = (postId: documentId) => {
  return (dispatch: Dispatch) => {
    return dispatch(getDocument(STATE_KEY, `posts/${postId}`));
  };
};
