import { applyMiddleware, compose, createStore } from 'redux';
import firebase from 'react-native-firebase';
import thunk from 'redux-thunk';
import makeRootReducer from './Reducers';
import { navMiddleware } from './ReduxNavigation';

export default (initialState = { }) => {

  const reduxConfig = {
    enableRedirectHandling: false
  }

  const middleware = [
    thunk,
    navMiddleware,
  ];

  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
     applyMiddleware(...middleware)
    )
  )

  return store
}
