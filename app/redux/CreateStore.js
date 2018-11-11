import { applyMiddleware, compose, createStore } from "redux";
import firebase from "react-native-firebase";
import thunk from "redux-thunk";
import makeRootReducer from "./Reducers";
import { navMiddleware } from "./ReduxNavigation";
import { composeWithDevTools } from "redux-devtools-extension";
import Config from "react-native-config";

export default (initialState = {}) => {
  const reduxConfig = {
    enableRedirectHandling: false
  };

  let composeEnhancers;
  if (Config.ENV_NAME === "prod") {
    composeEnhancers = compose();
  } else {
    composeEnhancers = composeWithDevTools({});
  }

  const middleware = [thunk, navMiddleware];

  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  return store;
};
