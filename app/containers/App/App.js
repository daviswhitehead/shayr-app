import React from 'react';
import { Provider } from 'react-redux';
import createStore from '../../redux/CreateStore';
import Navigator from '../../Navigator';

const initialState = { firebase: {} };
const store = createStore(initialState);

const App = () => (
  <Provider store={store}>
    <Navigator/>
  </Provider>
);

export default App;
