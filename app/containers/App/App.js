import React, { Component } from 'react';
import { Provider } from 'react-redux';
import createStore from '../../redux/CreateStore';
import Navigator from '../../Navigator';

const initialState = { firebase: {} };
const store = createStore(initialState);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigator/>
      </Provider>
    );
  }
}
