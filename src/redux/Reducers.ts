import { combineReducers } from 'redux';
import appReducer from './app/reducer';
import authReducer from './auth/reducer';
import documentsReducer, { State as DocumentsState } from './documents/reducer';
import friendshipsReducer from './friendships/reducer';
import friendshipsListsReducer from './friendshipsLists/reducer';
import listsReducer, { State as ListsState } from './lists/reducer';
import postsReducer from './posts/reducer';
import { createNamedWrapperReducer } from './ReducerHelpers';
import routingReducer, { State as RoutingState } from './routing/reducer';
import usersReducer, { State as UsersState } from './users/reducer';
import usersListsReducer from './usersLists/reducer';

export interface State {
  adds: DocumentsState;
  addsLists: ListsState;
  comments: DocumentsState;
  commentsLists: ListsState;
  dones: DocumentsState;
  donesLists: ListsState;
  likes: DocumentsState;
  likesLists: ListsState;
  routing: RoutingState;
  shares: DocumentsState;
  sharesLists: ListsState;
  users: UsersState;
  usersPosts: DocumentsState;
  usersPostsLists: ListsState;
}

export const makeRootReducer = () =>
  combineReducers({
    adds: createNamedWrapperReducer(documentsReducer, 'adds'),
    addsLists: createNamedWrapperReducer(listsReducer, 'addsLists'),
    app: appReducer,
    auth: authReducer,
    comments: createNamedWrapperReducer(documentsReducer, 'comments'),
    commentsLists: createNamedWrapperReducer(listsReducer, 'commentsLists'),
    dones: createNamedWrapperReducer(documentsReducer, 'dones'),
    donesLists: createNamedWrapperReducer(listsReducer, 'donesLists'),
    friendships: friendshipsReducer,
    friendshipsLists: friendshipsListsReducer,
    likes: createNamedWrapperReducer(documentsReducer, 'likes'),
    likesLists: createNamedWrapperReducer(listsReducer, 'likesLists'),
    posts: postsReducer,
    routing: routingReducer,
    shares: createNamedWrapperReducer(documentsReducer, 'shares'),
    sharesLists: createNamedWrapperReducer(listsReducer, 'sharesLists'),
    users: usersReducer,
    usersLists: usersListsReducer,
    usersPosts: createNamedWrapperReducer(documentsReducer, 'usersPosts'),
    usersPostsLists: createNamedWrapperReducer(listsReducer, 'usersPostsLists')
  });
