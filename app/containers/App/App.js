import React, { Component } from "react";
import { Provider } from "react-redux";
import createStore from "../../redux/CreateStore";
import AppWithListeners from "../AppWithListeners";

const store = createStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithListeners />
      </Provider>
    );
  }
}
