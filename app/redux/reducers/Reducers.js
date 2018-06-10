import { combineReducers } from 'redux';
import { firebaseStateReducer } from 'react-redux-firebase';
import { reducer as firestoreReducer} from 'redux-firestore';
import nav from './NavReducer';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    firebase: firebaseStateReducer,
    firestore: firestoreReducer,
    nav: nav,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer;
