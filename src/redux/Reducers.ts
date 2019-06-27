import { combineReducers } from 'redux';
import appReducer from './app/reducer';
import authReducer from './auth/reducer';
import friendshipsReducer from './friendships/reducer';
import friendshipsListsReducer from './friendshipsLists/reducer';
import routingReducer from './routing/reducer';
import uiReducer from './ui/reducer';
import usersReducer from './users/reducer';
import usersListsReducer from './usersLists/reducer';
import usersPostsReducer from './usersPosts/reducer';
import usersPostsListsReducer from './usersPostsLists/reducer';

export const makeRootReducer = () =>
  combineReducers({
    app: appReducer,
    auth: authReducer,
    friendships: friendshipsReducer,
    friendshipsLists: friendshipsListsReducer,
    routing: routingReducer,
    ui: uiReducer,
    users: usersReducer,
    usersLists: usersListsReducer,
    usersPosts: usersPostsReducer,
    usersPostsLists: usersPostsListsReducer
  });

export default makeRootReducer;
