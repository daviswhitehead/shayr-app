import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  LayoutAnimation
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import styles from './styles';
import DynamicActionButton from '../../components/DynamicActionButton';
import Toaster from '../../components/Toaster';
import List from '../../components/List';
import {
  markSavedPostAsDone,
  deleteSavedPost
} from '../../lib/push';
import {
  donePost,
  removeAddedPost
} from '../../lib/FirebaseHelpers';
import {
  loadQueuePosts,
  flattenPosts,
  refreshQueuePosts,
} from '../../redux/posts/PostsActions';
import {
  signOutUser,
} from '../../redux/authentication/AuthenticationActions';

import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import { LoginManager } from 'react-native-fbsdk';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    posts: state.posts
  }
}

const mapDispatchToProps = (dispatch) => ({
  navQueue: () => dispatch(NavigationActions.navigate({ routeName: 'Feed' })),
  loadQueuePosts: (userId) => dispatch(loadQueuePosts(userId)),
  refreshQueuePosts: (userId) => dispatch(refreshQueuePosts(userId)),
  signOutUser: () => dispatch(signOutUser()),
});

class Queue extends Component {
  markAsDone = (payload) => {
    donePost(this.state.user, payload['key']);
    let toast = Toaster('marked as done');
  }

  markAsDoneUI = () => {
    return (
      <View style={styles.leftSwipeItem}>
        <Icon name='check' size={50} color='white' />
      </View>
    );
  }

  removeFromQueue = (payload) => {
    removeAddedPost(this.state.user, payload['key']);
    let toast = Toaster('deleted');
  }

  removeFromQueueUI = () => {
    return (
      <View style={styles.rightSwipeItem}>
        <Icon name='close' size={50} color='white' />
      </View>
    );
  }

  loading = () => {
    if (!this.props.posts.queuePosts || !this.props.posts.loadedPostMeta) {
      return (
        <Text>LOADING</Text>
      );
    }

    return (
      <List
        data={flattenPosts(this.props.posts.queuePosts)}
        swipeLeftToRightUI={this.markAsDoneUI}
        swipeLeftToRightAction={this.markAsDone}
        swipeRightToLeftUI={this.removeFromQueueUI}
        swipeRightToLeftAction={this.removeFromQueue}
        onRefresh={() => this.props.refreshQueuePosts(this.props.auth.user.uid)}
        refreshing={this.props.posts.refreshing}
      >
      </List>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <this.loading/>
        <DynamicActionButton
          logout={this.props.signOutUser}
          feed={this.props.navQueue}
          queue={false}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Queue);
