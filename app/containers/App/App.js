import React, { Component } from 'react';
import { Provider } from 'react-redux';
import createStore from '../../config/CreateStore';
import AppWithNavigation from '../AppWithNavigation';

const store = createStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigation />
      </Provider>
    );
  }
}
