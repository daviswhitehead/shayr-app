import _ from 'lodash';
import { types as postActionTypes } from '../postActions/actions';
import { types } from './actions';

const initialState = {};

function usersReducer(state = initialState, action: any) {
  switch (action.type) {
    case types.GET_USERS_POSTS_SUCCESS: {
      return {
        ...state,
        ...action.usersPosts
      };
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
