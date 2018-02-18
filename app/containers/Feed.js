import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import ShayrStatusBar from '../components/StatusBar'
import TitleBar from '../components/TitleBar'
// import List from '../components/List'
import ContentCard from '../components/ContentCard'
import firebase from 'react-native-firebase'

const getPosts = (ref) => {
  const posts = []
  return ref
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get()
    .then((query) => {
      query.forEach((doc) => {
        posts.push(
          doc.data()
        );
      });
      return posts
    })
    .catch((error) => {
      console.error(error);
      return false
    });
}

export default class App extends Component {
  constructor() {
    super();
    this.postsRef = firebase.firestore().collection('posts');
    this.state = {
      posts: []
    }
  }

  componentDidMount() {
    this.setState((previousState) => {
      return {
        posts: previousState.posts.push(getPosts(this.postsRef))
      };
    });
  }

  render() {
    console.log(this.state.posts);
    return (
      <View style={styles.container}>
        <ShayrStatusBar/>
        <TitleBar>Feed</TitleBar>
        <ContentCard
          items={this.state.posts}
        ></ContentCard>
      </View>
    )
  }
  // render() {
  //   return (
  //     <View style={styles.container}>
  //       <ShayrStatusBar/>
  //       <TitleBar>Feed</TitleBar>
  //       <List
  //         items={this.state.posts}>
  //       </List>
  //     </View>
  //   )
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
