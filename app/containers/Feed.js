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
  getUsers,
  getUserShares,
  getPost,
  getPostShares,
} from '../functions/index';


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      data: []
    }
  }

  organizeData = (users, posts) => {
    const data = [];
    for (var postId in posts) {
      if (posts.hasOwnProperty(postId)) {
        posts[postId]['users'] = [];
        // console.log(posts[postId]);
        for (var userId in users) {
          if (users.hasOwnProperty(userId)) {
            for (var shareId in users[userId]['shares']) {
              if (users[userId]['shares'].hasOwnProperty(shareId)) {
                if (users[userId]['shares'][shareId].post &&
                users[userId]['shares'][shareId].post.id  == postId) {
                  posts[postId]['users'].push(users[userId])
                }
              }
            }
          }
        }
        let friend = posts[postId]['users'][Math.floor(Math.random() * posts[postId]['users'].length)];
        if (!friend) {
          friend = {
            firstName: '',
            lastName: ''
          }
        }
        data.push({
          key: postId,
          image: posts[postId]['image'],
          publisher: posts[postId]['publisher'],
          title: posts[postId]['title'],
          url: posts[postId]['url'],
          friend: {
            firstName: friend.firstName || '',
            lastName: friend.lastName || ''
          },
          shareCount: Object.keys(posts[postId]['shares']).length
        })
      }
    }

    return data
  }

  loadData = () => {
    const userData = {};
    const postData = {};

    // get users
    getUsers()
      .then((users) => {
        return Promise.all(
          users.map((user) => {
              userData[user.id] = user.data();
              userData[user.id]['shares'] = {};
              return getUserShares(user)
          })
        );
      })
      // get all user shares
      .then((users) => {
        const postRefs = {};
        users.map((userShares) => {
          userShares.map((share) => {
            userData[share.ref.parent.parent.id]['shares'][share.id] = share.data();

            // find all unique posts
            let post = share.data()['post']
            if (post && !postRefs.hasOwnProperty(post.id)) {
              postRefs[post.id] = share.data()['post'];
            }
          })
        })
        return Promise.all(
          Object.values(postRefs).map((post) => {
            return getPost(post)
          })
        )
      })
      // get all friend posts
      .then((posts) => {
        return Promise.all(
          posts.map((post) => {
            postData[post.id] = post.data();
            postData[post.id]['shares'] = {};
            return getPostShares(post.ref)
          })
        )
      })
      // get all shares associated with friend posts
      .then((posts) => {
        posts.map((postShares) => {
          postShares.map((share) => {
            postData[share.ref.parent.parent.id]['shares'][share.id] = share.data()
          })
        })
        this.setState((previousState) => {
          return {
            data: this.organizeData(userData, postData),
            loading: !previousState.loading
          }
        })
      })
      .catch((err) => {
        console.error(err);
      })

  }

  componentDidMount() {
    this.loadData()
  }

  render() {
    if (this.state.loading) {
      return (
        <Text>LOADING</Text>
      ) // placeholder for eventual loading visual
    }
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
