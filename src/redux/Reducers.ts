import { combineReducers } from 'redux';
import addsReducer from './adds/reducer';
import appReducer from './app/reducer';
import authReducer from './auth/reducer';
import documentsReducer from './documents/reducer';
import donesReducer from './dones/reducer';
import friendshipsReducer from './friendships/reducer';
import friendshipsListsReducer from './friendshipsLists/reducer';
import likesReducer from './likes/reducer';
import listsReducer from './lists/reducer';
import postsReducer from './posts/reducer';
import { createNamedWrapperReducer } from './ReducerHelpers';
import routingReducer from './routing/reducer';
import sharesReducer from './shares/reducer';
import sharesListsReducer from './sharesLists/reducer';
import usersReducer from './users/reducer';
import usersListsReducer from './usersLists/reducer';
import usersPostsReducer from './usersPosts/reducer';
import usersPostsListsReducer from './usersPostsLists/reducer';

export const makeRootReducer = () =>
  combineReducers({
    adds: addsReducer,
    addsLists: createNamedWrapperReducer(listsReducer, 'addsLists'),
    app: appReducer,
    auth: authReducer,
    comments: createNamedWrapperReducer(documentsReducer, 'comments'),
    commentsLists: createNamedWrapperReducer(listsReducer, 'commentsLists'),
    dones: donesReducer,
    donesLists: createNamedWrapperReducer(listsReducer, 'donesLists'),
    friendships: friendshipsReducer,
    friendshipsLists: friendshipsListsReducer,
    likes: likesReducer,
    likesLists: createNamedWrapperReducer(listsReducer, 'likesLists'),
    posts: postsReducer,
    routing: routingReducer,
    shares: sharesReducer,
    sharesLists: sharesListsReducer,
    users: usersReducer,
    usersLists: usersListsReducer,
    usersPosts: usersPostsReducer,
    usersPostsLists: usersPostsListsReducer
  });

export default makeRootReducer;
