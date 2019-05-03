import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { subscribe } from 'redux-subscriber';
import styles from './styles';
import DynamicActionButton from '../../components/DynamicActionButton';
import List from '../../components/List';
import ContentCard from '../../components/ContentCard';
import {
  loadPosts, paginatePosts, refreshPosts, flattenPosts,
} from '../../redux/posts/actions';
import { postAction } from '../../redux/postActions/actions';
import { startSignOut } from '../../redux/auth/actions';
import Header from '../../components/Header';
import colors from '../../styles/Colors';
import { subscribeToSelf, subscribeToFriendships } from '../../redux/users/actions';
import { subscribeNotificationTokenRefresh } from '../../redux/notifications/actions';
import { handleURLRoute, navigateToRoute } from '../../redux/routing/actions';
import { buildAppLink } from '../../lib/DeepLinks';
import { userAnalytics } from '../../lib/FirebaseAnalytics';

const mapStateToProps = state => ({
  auth: state.auth,
  users: state.users,
  posts: state.posts,
  routing: state.routing,
});

const mapDispatchToProps = dispatch => ({
  loadPosts: (userId, query) => dispatch(loadPosts(userId, query)),
  paginatePosts: (userId, query, lastPost) => dispatch(paginatePosts(userId, query, lastPost)),
  refreshPosts: (userId, query) => dispatch(refreshPosts(userId, query)),
  postAction: (actionType, userId, postId) => dispatch(postAction(actionType, userId, postId)),
  startSignOut: () => dispatch(startSignOut()),
  subscribeToSelf: userId => dispatch(subscribeToSelf(userId)),
  subscribeToFriendships: userId => dispatch(subscribeToFriendships(userId)),
  subscribeNotificationTokenRefresh: userId => dispatch(subscribeNotificationTokenRefresh(userId)),
  navigateToRoute: payload => dispatch(navigateToRoute(payload)),
  handleURLRoute: payload => dispatch(handleURLRoute(payload)),
});

class Discover extends Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Object).isRequired,
    users: PropTypes.instanceOf(Object).isRequired,
    posts: PropTypes.instanceOf(Object).isRequired,
    routing: PropTypes.instanceOf(Object).isRequired,
    navigation: PropTypes.instanceOf(Object).isRequired,
    subscribeToSelf: PropTypes.func.isRequired,
    subscribeToFriendships: PropTypes.func.isRequired,
    subscribeNotificationTokenRefresh: PropTypes.func.isRequired,
    navigateToRoute: PropTypes.func.isRequired,
    loadPosts: PropTypes.func.isRequired,
    handleURLRoute: PropTypes.func.isRequired,
    postAction: PropTypes.func.isRequired,
    paginatePosts: PropTypes.func.isRequired,
    refreshPosts: PropTypes.func.isRequired,
    startSignOut: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.subscriptions = [];
  }

  async componentDidMount() {
    // HOME - Track user
    userAnalytics(this.props.auth.user.uid);

    // HOME - Listen to global datasets
    this.subscriptions.push(await this.props.subscribeToSelf(this.props.auth.user.uid));
    this.subscriptions.push(await this.props.subscribeToFriendships(this.props.auth.user.uid));

    // HOME - Listen to notification token changes
    this.subscriptions.push(
      await this.props.subscribeNotificationTokenRefresh(this.props.auth.user.uid),
    );

    // HOME - Respond to initial route and listen to routing updates
    if (this.props.routing.screen) {
      this.props.navigateToRoute(this.props.routing);
    }
    // HOME - Listen to routing updates
    this.subscriptions.push(
      subscribe('routing', (state) => {
        if (state.routing.screen) {
          this.props.navigateToRoute(state.routing);
        }
      }),
    );

    // FEED - Listen to feed specific posts
    this.subscriptions.push(await this.props.loadPosts(this.props.auth.user.uid, 'feed'));
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((subscription) => {
      subscription();
    });
  }

  renderItem = (item) => {
    const routeURL = buildAppLink('shayr', 'shayr', 'PostDetail', { id: item.postId });

    return (
      <ContentCard
        payload={item}
        friends={{
          ...this.props.users.self,
          ...this.props.users.friends,
        }}
        onTap={() => this.props.handleURLRoute(routeURL)}
        shareAction={{
          actionCount: item.shareCount,
          actionUser: item.shares ? item.shares.includes(this.props.auth.user.uid) : false,
          onPress: () => this.props.postAction('share', this.props.auth.user.uid, item.postId),
        }}
        addAction={{
          actionCount: item.addCount,
          actionUser: item.adds ? item.adds.includes(this.props.auth.user.uid) : false,
          onPress: () => this.props.postAction('add', this.props.auth.user.uid, item.postId),
        }}
        doneAction={{
          actionCount: item.doneCount,
          actionUser: item.dones ? item.dones.includes(this.props.auth.user.uid) : false,
          onPress: () => this.props.postAction('done', this.props.auth.user.uid, item.postId),
        }}
        likeAction={{
          actionCount: item.likeCount,
          actionUser: item.likes ? item.likes.includes(this.props.auth.user.uid) : false,
          onPress: () => this.props.postAction('like', this.props.auth.user.uid, item.postId),
        }}
      />
    );
  };

  paginate = () => {
    const unsubscribe = this.props.paginatePosts(
      this.props.auth.user.uid,
      'feed',
      this.props.posts.feedLastPost,
    );
    if (unsubscribe) {
      this.subscriptions.push(unsubscribe);
    }
  };

  refresh = () => {
    const unsubscribe = this.props.refreshPosts(this.props.auth.user.uid, 'feed');
    if (unsubscribe) {
      this.subscriptions.push(unsubscribe);
    }
  };

  loading = () => {
    if (!this.props.posts.feedPosts || !this.props.users.friends || !this.props.users.self) {
      return <Text>LOADING</Text>;
    }
    return (
      <List
        data={flattenPosts(this.props.posts.feedPosts)}
        renderItem={item => this.renderItem(item)}
        onEndReached={() => this.paginate()}
        onRefresh={() => this.refresh()}
        refreshing={this.props.posts.refreshing}
      />
    );
  };

  signOut = () => {
    this.props.startSignOut();
    this.props.navigation.navigate('Login');
  };

  render() {
    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={colors.YELLOW}
          statusBarStyle="dark-content"
          shadow
          title="Discover"
        />
        <View style={styles.container}>
          <this.loading />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Discover);
