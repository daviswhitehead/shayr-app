import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/MaterialIcons";
import _ from "lodash";
import { LoginManager } from "react-native-fbsdk";
import styles from "./styles";
import DynamicActionButton from "../../components/DynamicActionButton";
import List from "../../components/List";
import ContentCard from "../../components/ContentCard";
import { openURL } from "../../lib/Utils";
import Header from "../../components/Header";
import { colors } from "../../styles/Colors";

import {
  loadPosts,
  paginatePosts,
  refreshPosts,
  flattenPosts
} from "../../redux/posts/PostsActions";
import { postAction } from "../../redux/postActions/PostActionsActions";
import { signOutUser } from "../../redux/authentication/AuthenticationActions";

const mapStateToProps = state => {
  return {
    auth: state.auth,
    posts: state.posts,
    social: state.social
  };
};

const mapDispatchToProps = dispatch => ({
  navFeed: () => dispatch(NavigationActions.navigate({ routeName: "Feed" })),
  navPostDetails: () =>
    dispatch(NavigationActions.navigate({ routeName: "PostDetails" })),
  loadPosts: (userId, query) => dispatch(loadPosts(userId, query)),
  paginatePosts: (userId, query, lastPost) =>
    dispatch(paginatePosts(userId, query, lastPost)),
  refreshPosts: (userId, query) => dispatch(refreshPosts(userId, query)),
  signOutUser: () => dispatch(signOutUser()),
  postAction: (actionType, userId, postId) =>
    dispatch(postAction(actionType, userId, postId))
});

class Queue extends Component {
  constructor() {
    super();
    this.subscriptions = [];
  }

  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header
          backgroundColor={colors.YELLOW}
          statusBarStyle="dark-content"
          shadow
          title="queue"
        />
      )
    };
  };

  componentDidMount() {
    this.subscriptions.push(
      this.props.loadPosts(this.props.auth.user.uid, "queue")
    );
  }

  componentWillUnmount() {
    for (var subscription in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(subscription)) {
        console.log(this.subscriptions[subscription]);
        this.subscriptions[subscription]();
      }
    }
  }

  renderItem = item => {
    return (
      <ContentCard
        payload={item}
        friends={{
          ...this.props.social.self,
          ...this.props.social.friends
        }}
        // onTap={() => openURL(item.url)}
        onTap={this.props.navPostDetails}
        shareAction={{
          actionCount: item.shareCount,
          actionUser: item.shares
            ? item.shares.includes(this.props.auth.user.uid)
            : false,
          onPress: () =>
            this.props.postAction(
              "share",
              this.props.auth.user.uid,
              item.postId
            )
        }}
        addAction={{
          actionCount: item.addCount,
          actionUser: item.adds
            ? item.adds.includes(this.props.auth.user.uid)
            : false,
          onPress: () =>
            this.props.postAction("add", this.props.auth.user.uid, item.postId)
        }}
        doneAction={{
          actionCount: item.doneCount,
          actionUser: item.dones
            ? item.dones.includes(this.props.auth.user.uid)
            : false,
          onPress: () =>
            this.props.postAction("done", this.props.auth.user.uid, item.postId)
        }}
        likeAction={{
          actionCount: item.likeCount,
          actionUser: item.likes
            ? item.likes.includes(this.props.auth.user.uid)
            : false,
          onPress: () =>
            this.props.postAction("like", this.props.auth.user.uid, item.postId)
        }}
      />
    );
  };

  loading = () => {
    if (
      !this.props.posts.queuePosts ||
      !this.props.social.friends ||
      !this.props.social.self
    ) {
      return <Text>LOADING</Text>;
    }
    return (
      <List
        data={flattenPosts(this.props.posts.queuePosts)}
        renderItem={item => this.renderItem(item)}
        onEndReached={() =>
          this.props.paginatePosts(
            this.props.auth.user.uid,
            "queue",
            this.props.posts.queueLastPost
          )
        }
        onRefresh={() =>
          this.props.refreshPosts(this.props.auth.user.uid, "queue")
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
          feed={this.props.navFeed}
          queue={false}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Queue);
