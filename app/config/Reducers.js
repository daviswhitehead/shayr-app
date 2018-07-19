import { combineReducers } from 'redux';
import navigationReducer from '../containers/AppWithNavigation/NavigationReducer';
import authenticationReducer from '../containers/Login/AuthenticationReducer';
import feedReducer from '../containers/Feed/FeedReducer';

export const makeRootReducer = () => {
  return combineReducers({
    nav: navigationReducer,
    auth: authenticationReducer,
    feed: feedReducer,
  })
}

export default makeRootReducer;
