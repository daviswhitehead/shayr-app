import { combineReducers } from 'redux';
import navigationReducer from './navigation/NavigationReducer';
import authenticationReducer from './authentication/AuthenticationReducer';
import postsReducer from './posts/PostsReducer';
import socialReducer from './social/SocialReducer';

export const makeRootReducer = () => {
  return combineReducers({
    nav: navigationReducer,
    auth: authenticationReducer,
    posts: postsReducer,
    social: socialReducer,
  })
}

export default makeRootReducer;
