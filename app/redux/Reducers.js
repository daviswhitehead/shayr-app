import { combineReducers } from 'redux';
import navigationReducer from './navigation/NavigationReducer';
import authenticationReducer from './authentication/AuthenticationReducer';
import postsReducer from './posts/PostsReducer';

export const makeRootReducer = () => {
  return combineReducers({
    nav: navigationReducer,
    auth: authenticationReducer,
    posts: postsReducer,
  })
}

export default makeRootReducer;
