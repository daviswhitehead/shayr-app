import { Dispatch } from 'redux';
import { references, referenceTypes } from '../../lib/FirebaseQueries';
import { getDocument } from '../FirebaseRedux';

export const STATE_KEY = 'posts';

export const getPost = (postId: string) => {
  return (dispatch: Dispatch) => {
    return getDocument(
      dispatch,
      STATE_KEY,
      references.get(referenceTypes.GET_DOCUMENT)(`posts/${postId}`)
    );
  };
};
