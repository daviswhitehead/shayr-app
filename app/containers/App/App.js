import React, { Component } from "react";
import { Provider } from "react-redux";
import createStore from "../../redux/CreateStore";
import AppWithNavigation from "../AppWithNavigation";

const store = createStore();
console.log("store");
console.log(store);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigation />
      </Provider>
    );
  }
}
