import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Notification
} from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";

import styles from "./styles";
import DynamicActionButton from "../../components/DynamicActionButton";
import Toaster from "../../components/Toaster";
import List from "../../components/List";
import listStyles from "../../components/List/styles";
// import SwipeCard from '../SwipeCard';
import Swipeable from "react-native-swipeable";
import ContentCard from "../../components/ContentCard";

import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/MaterialIcons";
import _ from "lodash";
import { LoginManager } from "react-native-fbsdk";
import {
  loadFeedPosts,
  paginateFeedPosts,
  flattenPosts,
  refreshFeedPosts
} from "../../redux/posts/PostsActions";
import {
  newAction,
  toggleAction
} from "../../redux/postActions/PostActionsActions";
import { signOutUser } from "../../redux/authentication/AuthenticationActions";

const mapStateToProps = state => {
  return {
    auth: state.auth,
    posts: state.posts,
    social: state.social
  };
};

const mapDispatchToProps = dispatch => ({
  navQueue: () => dispatch(NavigationActions.navigate({ routeName: "Queue" })),
  loadFeedPosts: () => dispatch(loadFeedPosts()),
  paginateFeedPosts: lastPost => dispatch(paginateFeedPosts(lastPost)),
  refreshFeedPosts: () => dispatch(refreshFeedPosts()),
  signOutUser: () => dispatch(signOutUser()),
  newAction: (actionType, userId, postId) =>
    dispatch(newAction(actionType, userId, postId)),
  toggleAction: (actionType, userId, postId) =>
    dispatch(toggleAction(actionType, userId, postId))
});

class Feed extends Component {
  componentDidMount() {
    this.props.loadFeedPosts();
    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        // Process your notification as required
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  addToQueue = payload => {
    this.props.newAction("add", this.props.auth.user.uid, payload["key"]);
    let toast = Toaster("added to queue");
  };

  addToQueueUI = () => {
    return (
      <View style={styles.leftSwipeItem}>
        <Icon name="add" size={50} color="white" />
      </View>
    );
  };

  renderItem = ({ item }) => {
    const test = {
      actionCount: 10,
      actionUser: true
    };
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
    );
  };

  loading = () => {
    if (!this.props.posts.feedPosts || !this.props.posts.loadedPostMeta) {
      return <Text>LOADING</Text>;
    }

    return (
      <List
        data={flattenPosts(this.props.posts.feedPosts)}
        renderItem={item => this.renderItem(item)}
        onEndReached={() =>
          this.props.paginateFeedPosts(this.props.posts.lastPost)
        }
        onRefresh={() => this.props.refreshFeedPosts()}
        refreshing={this.props.posts.refreshing}
      />
    );
  };

  render() {
    console.log(this.state);
    console.log(this.props);
    return (
      <View style={styles.container}>
        <this.loading />
        <DynamicActionButton
          logout={this.props.signOutUser}
          feed={false}
          queue={this.props.navQueue}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feed);
