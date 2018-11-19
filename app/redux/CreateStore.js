import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import Config from "react-native-config";
import makeRootReducer from "./Reducers";
import { navMiddleware } from "./ReduxNavigation";

export default (initialState = {}) => {
  let composeEnhancers;
  if (Config.ENV_NAME === "prod" || Config.ENV_NAME === "alpha") {
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
