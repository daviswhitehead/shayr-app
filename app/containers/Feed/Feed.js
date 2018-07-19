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
import { flattenPosts } from '../../transforms/Posts';

import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import { LoginManager } from 'react-native-fbsdk';
import {
  loadPosts,
  paginatePosts,
} from './FeedActions';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    feed: state.feed
  }
}

const mapDispatchToProps = (dispatch) => ({
  navQueue: () => dispatch(NavigationActions.navigate({ routeName: 'Queue' })),
  loadPosts: () => dispatch(loadPosts()),
  paginatePosts: (lastPost) => dispatch(paginatePosts(lastPost)),
});

class Feed extends Component {
  componentDidMount() {
    this.props.loadPosts()
  }

  addToQueue = (payload) => {
    savePostToUser(this.props.auth.user, payload['key']);
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
    if (!this.props.feed.posts || !this.props.feed.lastPost) {
      return (
        <Text>LOADING</Text>
      );
    }

    return (
      <List
        data={flattenPosts(this.props.feed.posts)}
        swipeLeftToRightUI={this.addToQueueUI}
        swipeLeftToRightAction={this.addToQueue}
        onEndReached={() => this.props.paginatePosts(this.props.feed.lastPost)}
      >
      </List>
    );
  }

  logout = async () => {
    try {
      await firebase.auth().signOut();
      await LoginManager.logOut();
      this.props.navigation.navigate('Login', this.state);
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <this.loading/>
        <DynamicActionButton
          logout={this.logout}
          feed={false}
          queue={this.props.navQueue}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
