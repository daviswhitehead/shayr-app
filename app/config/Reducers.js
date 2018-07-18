import { combineReducers } from 'redux';
import navigationReducer from '../containers/AppWithNavigation/NavigationReducer';
import authenticationReducer from '../containers/Login/AuthenticationReducer';

export const makeRootReducer = () => {
  return combineReducers({
    nav: navigationReducer,
    auth: authenticationReducer,
  })
}

export default makeRootReducer;
