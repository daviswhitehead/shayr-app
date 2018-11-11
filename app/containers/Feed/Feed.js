import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Linking,
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
  loadPosts,
  paginatePosts,
  refreshPosts,
  flattenPosts
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
  loadPosts: (userId, query) => dispatch(loadPosts(userId, query)),
  paginatePosts: (userId, query, lastPost) =>
    dispatch(paginatePosts(userId, query, lastPost)),
  refreshPosts: (userId, query) => dispatch(refreshPosts(userId, query)),
  signOutUser: () => dispatch(signOutUser()),
  newAction: (actionType, userId, postId) =>
    dispatch(newAction(actionType, userId, postId)),
  toggleAction: (actionType, userId, postId) =>
    dispatch(toggleAction(actionType, userId, postId))
});

class Feed extends Component {
  constructor() {
    super();
    this.subscriptions = [];
  }

  componentDidMount() {
    this.subscriptions.push(
      this.props.loadPosts(this.props.auth.user.uid, "feed")
    );
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
    for (var subscription in this.subscriptions) {
      if (object.hasOwnProperty(subscription)) {
        this.subscriptions.subscription();
      }
    }
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

  contentCardTap = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error("An error occurred", err));
  };

  renderItem = item => {
    return (
      <Swipeable
        leftActionActivationDistance={100}
        leftContent={this.addToQueueUI()}
        onLeftActionRelease={() => this.addToQueue(item)}
      >
        <ContentCard
          payload={item}
          friends={this.props.social.friends}
          onTap={() => this.contentCardTap(item.url)}
          shareAction={{
            actionCount: item.shareCount,
            actionUser: item.shares
              ? item.shares.includes(this.props.auth.user.uid)
              : false,
            onTap: () => console.log("i was tapped")
          }}
          addAction={{
            actionCount: item.addCount,
            actionUser: item.adds
              ? item.adds.includes(this.props.auth.user.uid)
              : false
          }}
          doneAction={{
            actionCount: item.doneCount,
            actionUser: item.dones
              ? item.dones.includes(this.props.auth.user.uid)
              : false
          }}
          likeAction={{
            actionCount: item.likeCount,
            actionUser: item.likes
              ? item.likes.includes(this.props.auth.user.uid)
              : false
          }}
        />
      </Swipeable>
    );
  };

  loading = () => {
    if (!this.props.posts.feedPosts || !this.props.social.friends) {
      return <Text>LOADING</Text>;
    }
    return (
      <List
        data={flattenPosts(this.props.posts.feedPosts)}
        renderItem={item => this.renderItem(item)}
        // onEndReached={() =>
        //   this.props.paginatePosts(
        //     this.props.auth.user.uid,
        //     "feed",
        //     this.props.posts.feedLastPost
        //   )
        // }
        onRefresh={() =>
          this.props.refreshPosts(this.props.auth.user.uid, "feed")
        }
        refreshing={this.props.posts.refreshing}
      />
    );
  };

  render() {
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
