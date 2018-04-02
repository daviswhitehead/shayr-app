import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

// import ShareModal from './containers/ShareModal';
import Navigator from './Navigator';

export default class App extends Component {
  render() {
    return (
      <Navigator/>
    );
  }
}
