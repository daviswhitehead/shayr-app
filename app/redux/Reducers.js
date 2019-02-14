import { combineReducers } from 'redux';
import appListenerReducer from '../containers/AppWithListeners/reducer';
import authenticationReducer from '../containers/Login/reducer';
import postsReducer from './posts/PostsReducer';
import postActionsReducer from './postActions/PostActionsReducer';
import socialReducer from './social/SocialReducer';
import postDetailReducer from '../containers/PostDetail/reducer';

export const makeRootReducer = () => combineReducers({
  appListener: appListenerReducer,
  auth: authenticationReducer,
  posts: postsReducer,
  postActions: postActionsReducer,
  social: socialReducer,
  postDetail: postDetailReducer,
});

export default makeRootReducer;
