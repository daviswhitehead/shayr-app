import { combineReducers } from 'redux';
import authReducer from './auth/reducer';
import usersReducer from './users/reducer';
import notificationsReducer from './notifications/reducer';
import postsReducer from './posts/reducer';
import routingReducer from './routing/reducer';

export const makeRootReducer = () => combineReducers({
  auth: authReducer,
  users: usersReducer,
  notifications: notificationsReducer,
  posts: postsReducer,
  routing: routingReducer,
});

export default makeRootReducer;
