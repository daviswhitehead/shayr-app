import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import Config from 'react-native-config';
import initSubscriber from 'redux-subscriber';
import { makeRootReducer } from './Reducers';

export default (initialState = {}) => {
  let composeEnhancers;
  // if (Config.ENV_NAME === 'prod' || Config.ENV_NAME === 'alpha') {
  if (Config.ENV_NAME === 'prod') {
    composeEnhancers = compose();
  } else {
    composeEnhancers = composeWithDevTools({});
  }

  const middleware = [thunk];

  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(applyMiddleware(...middleware)),
  );

  initSubscriber(store);

  return store;
};
