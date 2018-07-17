import { combineReducers } from 'redux';
import navigationReducer from './NavigationReducer';
import authenticationReducer from './AuthenticationReducer';

export const makeRootReducer = () => {
  return combineReducers({
    nav: navigationReducer,
    auth: authenticationReducer,
  })
}

export default makeRootReducer;
