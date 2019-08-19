import Config from 'react-native-config';
import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import initSubscriber from 'redux-subscriber';
import thunk from 'redux-thunk';
import { makeRootReducer } from './Reducers';

export default (initialState = {}) => {
  let composeEnhancers;
  if (Config.ENV_NAME === 'prod') {
    composeEnhancers = compose();
  } else {
    composeEnhancers = composeWithDevTools({
      maxAge: 100
    });
  }

  const middleware = [thunk];

  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  initSubscriber(store);

  return store;
};
