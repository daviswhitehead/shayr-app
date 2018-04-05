import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import firebase from 'react-native-firebase';
import List from '../components/List';
import {
  getUsers,
  getUserShares,
  getPost,
  getPostShares,
} from '../functions/pull';
import {
  savePostToUser,
} from '../functions/push'
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from '../components/ActionButton';

export default class Feed extends Component {
  constructor() {
    super();
    this.state = {
      userId: 'testUser',
      loading: true,
      data: [],
      isActionButtonVisible: true
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
            console.log(post);
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

  componentWillMount() {
    this.loadData()
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
        data={this.state.data}
        swipeLeftToRightUI={this.addToQueueUI}
        swipeLeftToRightAction={this.addToQueue}
        onScroll={this._onScroll}
      >
      </List>
    );
  }

  render() {
    console.log(this.state);
    console.log(this.props);
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
    alignItems: 'center'
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
