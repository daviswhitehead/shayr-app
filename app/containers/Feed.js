import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import ShayrStatusBar from '../components/StatusBar'
import TitleBar from '../components/TitleBar'
import List from '../components/List'

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ShayrStatusBar/>
        <TitleBar>Feed</TitleBar>
        <List/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
