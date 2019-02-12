import { combineReducers } from "redux";
import navigationReducer from "./navigation/NavigationReducer";
import authenticationReducer from "../containers/Login/reducer";
import postsReducer from "./posts/PostsReducer";
import postActionsReducer from "./postActions/PostActionsReducer";
import socialReducer from "./social/SocialReducer";
import postDetailReducer from "../containers/PostDetail/reducer";
import notificationReducer from "../containers/AppWithListeners/reducer";

export const makeRootReducer = () => {
  return combineReducers({
    nav: navigationReducer,
    auth: authenticationReducer,
    posts: postsReducer,
    postActions: postActionsReducer,
    social: socialReducer,
    postDetail: postDetailReducer,
    postDetail: postDetailReducer
  });
};

export default makeRootReducer;
