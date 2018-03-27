import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import firebase from 'react-native-firebase';
import ShayrStatusBar from '../components/StatusBar';
import TitleBar from '../components/TitleBar';
import List from '../components/List';
import {
  getShareUser,
  getPostShares,
  getPosts,
} from '../functions/index';


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      data: []
    }
  }

  organizePosts = (posts) => {
    const data = [];
    return posts
      .then((posts) => {
        for (var postKey in posts) {
          if (posts.hasOwnProperty(postKey)) {

            const postData = {
              key: postKey,
              image: posts[ postKey ][ 'image' ],
              publisher: posts[ postKey ][ 'publisher' ],
              title: posts[ postKey ][ 'title' ],
              url: posts[ postKey ][ 'url' ],
              updatedAt: posts[ postKey ][ 'updatedAt' ]
            }

            posts[ postKey ][ 'shares' ]
              .then((value) => {
                const keys = Object.keys(value)
                postData[ 'shareCount' ] = keys.length

                // value[keys[ Math.round(keys.length * Math.random())]]
                //   .user
                //   .then((value) => {
                //     postData[ 'shareUser' ] = value
                //   })
                //   .catch((err) => {
                //     console.error(err);
                //   })
              })
              .catch((err) => {
                console.error(err);
              })

            data.push(postData)
          }
        }
        console.log(data);
        this.setState((previousState) => {
          return {
            data: data,
            loading: !previousState.loading
          }
        })
        console.log(this.state);
      })
      .catch((err) => {
        console.error(err);
      })
  }

  componentDidMount() {
    this.organizePosts(getPosts(true));
  }

  render() {
    if (this.state.loading) {
      return (
        <Text>LOADING</Text>
      ) // placeholder for eventual loading visual
    }
    console.log(this.state.data);

    return (
      <View style={styles.container}>
        <ShayrStatusBar/>
        <TitleBar>FEED</TitleBar>
        <List
          data={this.state.data}>
        </List>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
