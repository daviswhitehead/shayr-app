import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, LayoutAnimation
} from 'react-native';
import firebase from 'react-native-firebase';
import List from '../components/List';
import {
  getUsers, getUserShares, getPost, getPostShares
} from '../functions/pull';
import {
  savePostToUser,
} from '../functions/push'
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from '../components/ActionButton';
import _ from 'lodash';

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 'testUser',
      isActionButtonVisible: true
    }

    const navigationParams = _.get(this.props, 'navigation.state.params', null)
    if (navigationParams) {
      this.state = {...this.state, ...navigationParams};
      if (navigationParams.feedData) {
        this.state = {...this.state, loading: false};
      } else {
        this.state = {...this.state, loading: true};
      }
    } else {
      this.state = {...this.state, loading: true};
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: 'FEED'
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
              userData[user.id] = {
                ...user.data(),
                doc: user,
                shares: {}
              };
              return getUserShares(user)
          })
        );
      })
      // get all user shares
      .then((users) => {
        const postRefs = {};
        users.map((userShares) => {
          userShares.map((share) => {
            userData[share.ref.parent.parent.id]['shares'][share.id] = {
              ...share.data(),
              doc: share
            };

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
            postData[post.id] = {
              ...post.data(),
              doc: post,
              shares: {}
            };
            return getPostShares(post.ref)
          })
        )
      })
      // get all shares associated with friend posts
      .then((posts) => {
        posts.map((postShares) => {
          postShares.map((share) => {
            postData[share.ref.parent.parent.id]['shares'][share.id] = {
              ...share.data(),
              doc: share
            };
          })
        })
        this.setState((previousState) => {
          return {
            ...previousState,
            feedData: this.organizeData(userData, postData),
            loading: false,
            userData: userData,
            postData: postData
          }
        })
      })
      .catch((err) => {
        console.error(err);
      })

  }

  componentWillMount() {
    if (!this.state.feedData) {
      this.loadData()
    }
  }

  addToQueue = (payload) => {
    // build function to add content to queue
    savePostToUser(this.state.userId, payload['key'])
  }

  addToQueueUI = () => {
    return (
      <View style={styles.leftSwipeItem}>
        <Icon name='add' size={50} color='white' />
      </View>
    );
  }

  _listViewOffset = 0

  _onScroll = (event) => {
    // Simple fade-in / fade-out animation
    const CustomLayoutLinear = {
      duration: 100,
      create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
    }
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = event.nativeEvent.contentOffset.y
    const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
      ? 'down'
      : 'up'
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionButtonVisible = direction === 'up'
    if (isActionButtonVisible !== this.state.isActionButtonVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear)
      this.setState({ isActionButtonVisible })
    }
    // Update your scroll position
    this._listViewOffset = currentOffset
  }

  loading = () => {
    if (this.state.loading) {
      return (
        <Text>LOADING</Text>
      ); // placeholder for eventual loading visual
    }
    return (
      <List
        data={this.state.feedData}
        swipeLeftToRightUI={this.addToQueueUI}
        swipeLeftToRightAction={this.addToQueue}
        onScroll={this._onScroll}
      >
      </List>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <this.loading/>
        {
          this.state.isActionButtonVisible ?
          <ActionButton
            action={() => this.props.navigation.navigate('Queue', this.state)}
          /> :
          null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftSwipeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 25,
    backgroundColor: '#27AE60',
  },
})
