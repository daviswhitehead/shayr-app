import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import styles from './styles';
import DynamicActionButton from '../../components/DynamicActionButton';
import List from '../../components/List';
import ContentCard from '../../components/ContentCard';
import {
  loadPosts,
  paginatePosts,
  refreshPosts,
  flattenPosts,
} from '../../redux/posts/PostsActions';
import { postAction } from '../../redux/postActions/PostActionsActions';
import { postDetailView } from '../PostDetail/actions';
import { signOutUser } from '../Login/actions';
import Header from '../../components/Header';
import colors from '../../styles/Colors';

const mapStateToProps = state => ({
  appListeners: state.appListeners,
  posts: state.posts,
});

const mapDispatchToProps = dispatch => ({
  navQueue: () => dispatch(NavigationActions.navigate({ routeName: 'Queue' })),
  postDetailView: post => dispatch(postDetailView(post)),
  loadPosts: (userId, query) => dispatch(loadPosts(userId, query)),
  paginatePosts: (userId, query, lastPost) => dispatch(paginatePosts(userId, query, lastPost)),
  refreshPosts: (userId, query) => dispatch(refreshPosts(userId, query)),
  signOutUser: () => dispatch(signOutUser()),
  postAction: (actionType, userId, postId) => dispatch(postAction(actionType, userId, postId)),
});

class Feed extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header backgroundColor={colors.YELLOW} statusBarStyle="dark-content" shadow title="feed" />
    ),
  });

  constructor() {
    super();
    this.subscriptions = [];
  }

  componentDidMount() {
    this.subscriptions.push(this.props.loadPosts(this.props.appListeners.user.uid, 'feed'));
    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification) => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      // Process your notification as required
    });
  }

  componentWillUnmount() {
    for (const subscription in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(subscription)) {
        this.subscriptions[subscription]();
      }
    }
  }

  renderItem = item => (
    <ContentCard
      payload={item}
      friends={{
        ...this.props.appListeners.self,
        ...this.props.appListeners.friends,
      }}
      // onTap={() => openURL(item.url)}
      onTap={() => this.props.postDetailView(item)}
      shareAction={{
        actionCount: item.shareCount,
        actionUser: item.shares ? item.shares.includes(this.props.appListeners.user.uid) : false,
        onPress: () => this.props.postAction('share', this.props.appListeners.user.uid, item.postId),
      }}
      addAction={{
        actionCount: item.addCount,
        actionUser: item.adds ? item.adds.includes(this.props.appListeners.user.uid) : false,
        onPress: () => this.props.postAction('add', this.props.appListeners.user.uid, item.postId),
      }}
      doneAction={{
        actionCount: item.doneCount,
        actionUser: item.dones ? item.dones.includes(this.props.appListeners.user.uid) : false,
        onPress: () => this.props.postAction('done', this.props.appListeners.user.uid, item.postId),
      }}
      likeAction={{
        actionCount: item.likeCount,
        actionUser: item.likes ? item.likes.includes(this.props.appListeners.user.uid) : false,
        onPress: () => this.props.postAction('like', this.props.appListeners.user.uid, item.postId),
      }}
    />
  );

  loading = () => {
    if (
      !this.props.posts.feedPosts
      || !this.props.appListeners.friends
      || !this.props.appListeners.self
    ) {
      return <Text>LOADING</Text>;
    }
    return (
      <List
        data={flattenPosts(this.props.posts.feedPosts)}
        renderItem={item => this.renderItem(item)}
        onEndReached={() => this.props.paginatePosts(
          this.props.appListeners.user.uid,
          'feed',
          this.props.posts.feedLastPost,
        )
        }
        onRefresh={() => this.props.refreshPosts(this.props.appListeners.user.uid, 'feed')}
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
  mapDispatchToProps,
)(Feed);
