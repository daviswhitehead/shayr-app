import { Batcher } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { Dispatch } from 'redux';
import { queries } from '../../lib/FirebaseQueries';
import {
  generateActionTypes,
  listActionTypes,
  subscribeDocumentsIds
} from '../../lib/FirebaseRedux';
import { overwriteUserCounts } from '../../lib/FirebaseWrites';

export const STATE_KEY = 'sharesLists';

export const types = {
  ...generateActionTypes(STATE_KEY, listActionTypes),
  UPDATE_USER_SHARES_START: 'UPDATE_USER_SHARES_START',
  UPDATE_USER_SHARES_SUCCESS: 'UPDATE_USER_SHARES_SUCCESS',
  UPDATE_USER_SHARES_FAIL: 'UPDATE_USER_SHARES_FAIL'
};

export const subscribeToShares = (userId: string) => {
  return (dispatch: Dispatch) => {
    return dispatch(
      subscribeDocumentsIds(
        STATE_KEY,
        queries.USER_SHARES.query({ userId }),
        'postId',
        userId,
        queries.USER_SHARES.type
      )
    );
  };
};

export const updateUserShares = (userId: string, value: number) => (
  dispatch: Dispatch
) => {
  dispatch({ type: types.UPDATE_USER_SHARES_START });

  const batcher = new Batcher(firebase.firestore());

  overwriteUserCounts(batcher, 'shares', userId, value);

  batcher.write();

  dispatch({
    type: types.UPDATE_USER_SHARES_SUCCESS,
    listKey: `${userId}_${queries.USER_SHARES.type}`
  });
};
