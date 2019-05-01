import React, { Component } from 'react';
import { Provider } from 'react-redux';
import createStore from '../../redux/CreateStore';
import AppWithListeners from '../AppWithListeners';
import HelloWorld from '../HelloWorld';
import styles from './styles';
import codePush from "react-native-code-push";

const store = createStore();

class App extends Component {
  componentDidMount = () => {};

  render() {
    return (
      <Provider store={store} style={styles.container}>
        {/* <AppWithListeners /> */}
        <HelloWorld />
      </Provider>
    );
  }
}

export default codePush(App);
