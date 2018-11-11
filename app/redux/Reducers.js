import { combineReducers } from "redux";
import navigationReducer from "./navigation/NavigationReducer";
import authenticationReducer from "./authentication/AuthenticationReducer";
import postsReducer from "./posts/PostsReducer";
import postActionsReducer from "./postActions/PostActionsReducer";
import socialReducer from "./social/SocialReducer";

export const makeRootReducer = () => {
  return combineReducers({
    nav: navigationReducer,
    auth: authenticationReducer,
    posts: postsReducer,
    postActions: postActionsReducer,
    social: socialReducer
  });
};

export default makeRootReducer;
