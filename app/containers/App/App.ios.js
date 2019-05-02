import React, { Component } from 'react';
import { Provider } from 'react-redux';
import createStore from '../../redux/CreateStore';
import AppWithListeners from '../AppWithListeners';
import styles from './styles';
import codePush from "react-native-code-push";

const store = createStore();

class App extends Component {
  componentDidMount = () => {};

  render() {
    return (
      <Provider store={store} style={styles.container}>
        <AppWithListeners />
      </Provider>
    );
  }
}

export default codePush(App);
