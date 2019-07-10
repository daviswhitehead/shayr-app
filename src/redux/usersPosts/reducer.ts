import _ from 'lodash';
import { types as postActionTypes } from '../postActions/actions';

import {
  DataAction,
  dataActionTypes,
  DataInitialState,
  generateActionType,
  getSuccessReducer
} from '../../lib/FirebaseRedux';
import { STATE_KEY, types } from './actions';

const initialState: DataInitialState = {};

function usersReducer(state = initialState, action: DataAction) {
  switch (action.type) {
    case types[generateActionType(STATE_KEY, dataActionTypes.GET_SUCCESS)]: {
      return getSuccessReducer(state, action);
    }
    case postActionTypes.POST_ACTION_CLIENT_UPDATE: {
      const newPost = _.get(state, [`${action.userId}_${action.postId}`], {});
      newPost[action.actionType] = action.isNowActive
        ? [...newPost[action.actionType], action.userId]
        : _.pull(newPost[action.actionType], action.userId);
      newPost[`${action.actionType.slice(0, -1)}Count`] = Math.max(
        0,
        newPost[`${action.actionType.slice(0, -1)}Count`] +
          (action.isNowActive ? +1 : -1)
      );

      return {
        ...state,
        [`${action.userId}_${action.postId}`]: newPost
      };
    }
    default: {
      return state;
    }
  }
}

export default usersReducer;
