import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, LayoutAnimation
} from 'react-native';
import firebase from 'react-native-firebase';
import List from '../components/List';
import {
  getUserSavedPosts, getPost, getPostShares
} from '../functions/pull';
import {
  markSavedPostAsDone,
  deleteSavedPost
} from '../functions/push'
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from '../components/ActionButton';
import _ from 'lodash';

export default class Queue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 'testUser',
      isActionButtonVisible: true
    }

    const navigationParams = _.get(this.props, 'navigation.state.params', null)

    if (navigationParams) {
      this.state = {...this.state, ...navigationParams};
      delete this.state.postData['Tw7Q8oDMniF8Y9s3UuPQ']
      if (navigationParams.queueData) {
        this.state = {...this.state, loading: false};
      } else {
        this.state = {...this.state, loading: true};
      }
    } else {
      this.state = {...this.state, loading: true};
    }

    this.ref = firebase.firestore().collection('users').doc(this.state.userId).collection('savedPosts')
      .where('doneAt', '==', null)
      // .orderBy('updatedAt', 'desc')
    console.log(this.ref);
    this.unsubscribe = null;
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: 'QUEUE'
    }
  }

  organizeData = (users, posts) => {
    const data = [];
    for (var postId in posts) {
      if (posts.hasOwnProperty(postId)) {
        posts[postId]['users'] = [];
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

  onCollectionUpdate = (querySnapshot) => {
    console.log('here');
    const savedPostData = {};
    const queuePostData = {};

    querySnapshot.forEach((doc) => {
      savedPostData[doc.id] = {
        ...doc.data(),
        doc: doc
      };
    });

    Promise.all(
      Object.keys(savedPostData).map((item) => {
        return getPost(item)
      })
      // get all posts
    ).then((documentSnapshots) => {
      return Promise.all(
        documentSnapshots.map((doc) => {
          queuePostData[doc.id] = {
            ...doc.data(),
            doc: doc,
            shares: {}
          };
          return getPostShares(doc.ref)
        })
      )
    })
    // get all shares associated with friend posts
    .then((postShares) => {
      postShares.map((documentSnapshots) => {
        documentSnapshots.map((doc) => {
          queuePostData[doc.ref.parent.parent.id]['shares'][doc.id] = {
            ...doc.data(),
            doc: doc
          };
        })
      })
      this.setState((previousState) => {
        return {
          ...previousState,
          queueData: this.organizeData(previousState.userData, queuePostData),
          loading: false,
          savedPostData: savedPostData,
          queuePostData: queuePostData
        }
      })
    })
    .catch((err) => {
      console.error(err);
    })
  }

  componentWillMount() {
    this.unsubscribe = this.ref.onSnapshot(
      // options={includeDocumentMetadataChanges: true},
      this.onCollectionUpdate
    )
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  markAsDone = (payload) => {
    // build function to add content to queue
    markSavedPostAsDone(this.state.userId, payload['key'])
  }

  markAsDoneUI = () => {
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
        data={this.state.queueData}
        swipeLeftToRightUI={this.markAsDoneUI}
        swipeLeftToRightAction={this.markAsDone}
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
            action={() => this.props.navigation.navigate('Feed', this.state)}
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
});
