import { applyMiddleware, compose, createStore } from 'redux';
import { getFirebase, reactReduxFirebase } from 'react-redux-firebase';
import firebase from 'react-native-firebase';
import thunk from 'redux-thunk';
import { reduxFirestore } from 'redux-firestore';
import makeRootReducer from './Reducers';
// import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

export default (initialState = { firebase: {} }) => {

  const reduxConfig = {
    enableRedirectHandling: false
  }

  const middleware = [
    thunk.withExtraArgument({ getFirebase }),
  ];

  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
     reactReduxFirebase(firebase, reduxConfig),
     reduxFirestore(firebase),
     applyMiddleware(...middleware)
    )
  )

  return store
}
