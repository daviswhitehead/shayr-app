import { combineReducers } from 'redux';
import appListenersReducer from '../containers/AppWithListeners/reducer';
import postsReducer from './posts/PostsReducer';
import postActionsReducer from './postActions/PostActionsReducer';
import postDetailReducer from '../containers/PostDetail/reducer';

export const makeRootReducer = () => combineReducers({
  appListeners: appListenersReducer,
  posts: postsReducer,
  postActions: postActionsReducer,
  postDetail: postDetailReducer,
});

export default makeRootReducer;
