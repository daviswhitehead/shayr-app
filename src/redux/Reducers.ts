import { combineReducers } from 'redux';
import appReducer from './app/reducer';
import authReducer, { State as AuthState } from './auth/reducer';
import documentsReducer, { State as DocumentsState } from './documents/reducer';
import listsReducer, { State as ListsState } from './lists/reducer';
import onboardingReducer, {
  State as OnboardingState
} from './onboarding/reducer';
import { createNamedWrapperReducer } from './ReducerHelpers';
import routingReducer, { State as RoutingState } from './routing/reducer';

export interface State {
  adds: DocumentsState;
  addsLists: ListsState;
  auth: AuthState;
  comments: DocumentsState;
  commentsLists: ListsState;
  dones: DocumentsState;
  donesLists: ListsState;
  friendships: DocumentsState;
  friendshipsLists: ListsState;
  likes: DocumentsState;
  likesLists: ListsState;
  notifications: DocumentsState;
  notificationsLists: ListsState;
  posts: DocumentsState;
  routing: RoutingState;
  onboarding: OnboardingState;
  shares: DocumentsState;
  sharesLists: ListsState;
  users: DocumentsState;
  usersLists: ListsState;
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
    friendships: createNamedWrapperReducer(documentsReducer, 'friendships'),
    friendshipsLists: createNamedWrapperReducer(
      listsReducer,
      'friendshipsLists'
    ),
    likes: createNamedWrapperReducer(documentsReducer, 'likes'),
    likesLists: createNamedWrapperReducer(listsReducer, 'likesLists'),
    notifications: createNamedWrapperReducer(documentsReducer, 'notifications'),
    notificationsLists: createNamedWrapperReducer(
      listsReducer,
      'notificationsLists'
    ),
    posts: createNamedWrapperReducer(documentsReducer, 'posts'),
    routing: routingReducer,
    onboarding: onboardingReducer,
    shares: createNamedWrapperReducer(documentsReducer, 'shares'),
    sharesLists: createNamedWrapperReducer(listsReducer, 'sharesLists'),
    users: createNamedWrapperReducer(documentsReducer, 'users'),
    usersLists: createNamedWrapperReducer(listsReducer, 'usersLists'),
    usersPosts: createNamedWrapperReducer(documentsReducer, 'usersPosts'),
    usersPostsLists: createNamedWrapperReducer(listsReducer, 'usersPostsLists')
  });
