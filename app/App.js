import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import Feed from './containers/Feed';

export default class App extends Component {
  render() {
    return (
      <Feed/>
    )
  }
}
