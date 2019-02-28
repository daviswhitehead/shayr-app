import React, { Component } from 'react';
import { View, Text, Linking } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { subscribe } from 'redux-subscriber';
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
import { postAction } from '../../redux/postActions/actions';
import { startSignOut } from '../../redux/auth/actions';
import { postDetailView } from '../PostDetail/actions';
import Header from '../../components/Header';
import colors from '../../styles/Colors';
import { subscribeToSelf, subscribeToFriendships } from '../../redux/users/actions';
import { subscribeNotificationTokenRefresh } from '../../redux/notifications/actions';
import { navigateToRoute } from '../../redux/routing/actions';

const mapStateToProps = state => ({
  auth: state.auth,
  users: state.users,
  posts: state.posts,
  routing: state.routing,
});

const mapDispatchToProps = dispatch => ({
  postDetailView: post => dispatch(postDetailView(post)),
  loadPosts: (userId, query) => dispatch(loadPosts(userId, query)),
  paginatePosts: (userId, query, lastPost) => dispatch(paginatePosts(userId, query, lastPost)),
  refreshPosts: (userId, query) => dispatch(refreshPosts(userId, query)),
  postAction: (actionType, userId, postId) => dispatch(postAction(actionType, userId, postId)),
  startSignOut: () => dispatch(startSignOut()),
  subscribeToSelf: userId => dispatch(subscribeToSelf(userId)),
  subscribeToFriendships: userId => dispatch(subscribeToFriendships(userId)),
  subscribeNotificationTokenRefresh: userId => dispatch(subscribeNotificationTokenRefresh(userId)),
  navigateToRoute: payload => dispatch(navigateToRoute(payload)),
});

class Feed extends Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Object).isRequired,
    users: PropTypes.instanceOf(Object).isRequired,
    posts: PropTypes.instanceOf(Object).isRequired,
    navigation: PropTypes.instanceOf(Object).isRequired,
    subscribeToSelf: PropTypes.func.isRequired,
    subscribeToFriendships: PropTypes.func.isRequired,
    subscribeNotificationTokenRefresh: PropTypes.func.isRequired,
    navigateToRoute: PropTypes.func.isRequired,
  };

  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header backgroundColor={colors.YELLOW} statusBarStyle="dark-content" shadow title="feed" />
    ),
  });

  constructor() {
    super();
    this.subscriptions = [];
  }

  async componentDidMount() {
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

    // HOME - Listen to global datasets
    this.subscriptions.push(await this.props.subscribeToSelf(this.props.auth.user.uid));
    this.subscriptions.push(await this.props.subscribeToFriendships(this.props.auth.user.uid));

    // HOME - Listen to notification token changes
    this.subscriptions.push(
      await this.props.subscribeNotificationTokenRefresh(this.props.auth.user.uid),
    );

    // FEED - Listen to feed specific posts
    this.subscriptions.push(await this.props.loadPosts(this.props.auth.user.uid, 'feed'));
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((subscription) => {
      subscription();
    });
  }

  renderItem = item => (
    <ContentCard
      payload={item}
      friends={{
        ...this.props.users.self,
        ...this.props.users.friends,
      }}
      // onTap={() => openURL(item.url)}
      onTap={() => this.props.postDetailView(item)}
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
      <View style={styles.container}>
        <this.loading />
        <DynamicActionButton logout={this.signOut} feed={false} />
      </View>
    );
  }
  // render() {
  //   return (
  //     <View style={styles.container}>
  //       <this.loading />
  //       <DynamicActionButton
  //         logout={this._signOut}
  //         feed={false}
  //         queue={this.props.navigation.navigate('Queue')}
  //       />
  //     </View>
  //   );
  // }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Feed);
