import React, { Component } from "react";
import { Provider } from "react-redux";
import createStore from "../../redux/CreateStore";
import AppWithListeners from "../AppWithListeners";
import styles from "./styles";

const store = createStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store} style={styles.container}>
        <AppWithListeners />
      </Provider>
    );
  }
}
