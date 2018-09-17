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
import listStyles from '../../components/List/styles';
// import SwipeCard from '../SwipeCard';
import Swipeable from 'react-native-swipeable';
import ContentCard from '../../components/ContentCard';

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
  loadFriends,
} from '../../redux/social/SocialActions';
import {
  newAction,
  toggleAction,
} from '../../redux/postActions/PostActionsActions';
import {
  signOutUser,
} from '../../redux/authentication/AuthenticationActions';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    posts: state.posts,
    social: state.social
  }
}

const mapDispatchToProps = (dispatch) => ({
  navQueue: () => dispatch(NavigationActions.navigate({ routeName: 'Queue' })),
  loadFeedPosts: () => dispatch(loadFeedPosts()),
  paginateFeedPosts: (lastPost) => dispatch(paginateFeedPosts(lastPost)),
  refreshFeedPosts: () => dispatch(refreshFeedPosts()),
  signOutUser: () => dispatch(signOutUser()),
  loadQueuePosts: (userId) => dispatch(loadQueuePosts(userId)),
  newAction: (actionType, userId, postId) => dispatch(newAction(actionType, userId, postId)),
  toggleAction: (actionType, userId, postId) => dispatch(toggleAction(actionType, userId, postId)),
  loadFriends: () => dispatch(loadFriends()),
});

class Feed extends Component {
  componentDidMount() {
    this.props.loadFriends();
    this.props.loadFeedPosts();
    this.unsubscribe = this.props.loadQueuePosts(this.props.auth.user.uid);
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  addToQueue = (payload) => {
    this.props.newAction('add', this.props.auth.user.uid, payload['key']);
    let toast = Toaster('added to queue');
  }

  addToQueueUI = () => {
    return (
      <View style={styles.leftSwipeItem}>
        <Icon name='add' size={50} color='white' />
      </View>
    );
  }

  renderItem = ({item}) => {
    const test = {
      actionCount: 10,
      actionUser: true
    }
    return (
        <Swipeable
          leftActionActivationDistance={100}
          leftContent={this.addToQueueUI()}
          onLeftActionRelease={() => this.addToQueue(item)}
        >
          <ContentCard
            payload={item}
            shareAction={test}
            addAction={test}
            doneAction={test}
            likeAction={test}
          />
        </Swipeable>
    )
  };

  loading = () => {
    if (!this.props.posts.feedPosts || !this.props.posts.loadedPostMeta) {
      return (
        <Text>LOADING</Text>
      );
    }

    return (
      <List
        data={flattenPosts(this.props.posts.feedPosts)}
        renderItem={(item) => this.renderItem(item)}
        onEndReached={() => this.props.paginateFeedPosts(this.props.posts.lastPost)}
        onRefresh={() => this.props.refreshFeedPosts()}
        refreshing={this.props.posts.refreshing}
      />
    );
  }

  render() {
    console.log(this.state);
    console.log(this.props);
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
