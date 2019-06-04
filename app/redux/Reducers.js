import { combineReducers } from 'redux';
// import appReducer from './app/reducer';
import authReducer from './auth/reducer';
import usersReducer from './users/reducer';
// // import friendsReducer from './friends/reducer';
// // import friendshipsReducer from './friendships/reducer';
import postsReducer from './posts/reducer';
import routingReducer from './routing/reducer';

export const makeRootReducer = () => combineReducers({
  // app: appReducer,
  auth: authReducer,
  users: usersReducer,
  // friends: friendsReducer,
  // friendships: friendshipsReducer,
  posts: postsReducer,
  routing: routingReducer,
});

export default makeRootReducer;
