import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import styles from './styles';
import DynamicActionButton from '../../components/DynamicActionButton';
import Toaster from '../../components/Toaster';
import List from '../../components/List';

import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import { LoginManager } from 'react-native-fbsdk';
import {
  loadFeedPosts,
  paginateFeedPosts,
  flattenPosts,
  refreshFeedPosts,
  loadQueuePosts,
} from '../../redux/posts/PostsActions';
import {
  signOutUser,
} from '../../redux/authentication/AuthenticationActions';
import { addPost } from '../../lib/FirebaseHelpers';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    posts: state.posts
  }
}

const mapDispatchToProps = (dispatch) => ({
  navQueue: () => dispatch(NavigationActions.navigate({ routeName: 'Queue' })),
  loadFeedPosts: () => dispatch(loadFeedPosts()),
  paginateFeedPosts: (lastPost) => dispatch(paginateFeedPosts(lastPost)),
  refreshFeedPosts: () => dispatch(refreshFeedPosts()),
  signOutUser: () => dispatch(signOutUser()),
  loadQueuePosts: (userId) => dispatch(loadQueuePosts(userId)),
});

class Feed extends Component {
  componentDidMount() {
    this.props.loadFeedPosts();
    this.unsubscribe = this.props.loadQueuePosts(this.props.auth.user.uid);
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  addToQueue = (payload) => {
    addPost(this.props.auth.user, payload['key']);
    let toast = Toaster('added to queue');
  }

  addToQueueUI = () => {
    return (
      <View style={styles.leftSwipeItem}>
        <Icon name='add' size={50} color='white' />
      </View>
    );
  }

  loading = () => {
    if (!this.props.posts.feedPosts || !this.props.posts.loadedPostMeta) {
      return (
        <Text>LOADING</Text>
      );
    }

    return (
      <List
        data={flattenPosts(this.props.posts.feedPosts)}
        swipeLeftToRightUI={this.addToQueueUI}
        swipeLeftToRightAction={this.addToQueue}
        onEndReached={() => this.props.paginateFeedPosts(this.props.posts.lastPost)}
        onRefresh={() => this.props.refreshFeedPosts()}
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
          feed={false}
          queue={this.props.navQueue}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
