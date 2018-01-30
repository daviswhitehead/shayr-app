import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import ShayrStatusBar from '../components/StatusBar'
import TitleBar from '../components/TitleBar'
import List from '../components/List'
import firebase from 'react-native-firebase'

export default class App extends Component {
  constructor() {
    super();
    this.posts = firebase.firestore().collection('posts');
    console.log(this.posts);
    console.log(this.posts.orderBy('created_at').limit(1).get());
  }

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
