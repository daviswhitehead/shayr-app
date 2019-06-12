import { buildAppLink } from '@daviswhitehead/shayr-resources';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { subscribe } from 'redux-subscriber';
import ContentCard from '../../components/ContentCard';
import Header from '../../components/Header';
import List from '../../components/List';
import { startSignOut } from '../../redux/auth/actions';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { subscribeToFriendships } from '../../redux/friendships/actions';
import { subscribeNotificationTokenRefresh } from '../../redux/notifications/actions';
import { postAction } from '../../redux/postActions/actions';
import {
  loadPosts,
  paginatePosts,
  refreshPosts
} from '../../redux/posts/actions';
import { handleURLRoute, navigateToRoute } from '../../redux/routing/actions';
import { subscribeToUser } from '../../redux/users/actions';
import {
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import { loadUsersPosts } from '../../redux/usersPosts/actions';
import { selectFlatListReadyUsersPostsFromList } from '../../redux/usersPosts/selectors';
import colors from '../../styles/Colors';
import styles from './styles';

const mapStateToProps = state => {
  const authUserId = selectAuthUserId(state);

  return {
    authUserId,
    authUser: selectUserFromId(state, authUserId),
    friends: selectUsersFromList(state, `${authUserId}_Friends`),
    usersPosts: selectFlatListReadyUsersPostsFromList(
      state,
      `${authUserId}_all`
    ),
    routing: state.routing
  };
};

const mapDispatchToProps = dispatch => ({
  loadPosts: (userId, query) => dispatch(loadPosts(userId, query)),
  loadUsersPosts: (userId, query) => dispatch(loadUsersPosts(userId, query)),
  paginatePosts: (userId, query, lastPost) =>
    dispatch(paginatePosts(userId, query, lastPost)),
  refreshPosts: (userId, query) => dispatch(refreshPosts(userId, query)),
  postAction: (actionType, userId, postId) =>
    dispatch(postAction(actionType, userId, postId)),
  startSignOut: () => dispatch(startSignOut()),
  subscribeToUser: userId => dispatch(subscribeToUser(userId)),
  subscribeToFriendships: userId => dispatch(subscribeToFriendships(userId)),
  subscribeNotificationTokenRefresh: userId =>
    dispatch(subscribeNotificationTokenRefresh(userId)),
  navigateToRoute: payload => dispatch(navigateToRoute(payload)),
  handleURLRoute: payload => dispatch(handleURLRoute(payload))
});

class Discover extends Component {
  static propTypes = {
    routing: PropTypes.instanceOf(Object).isRequired,
    navigation: PropTypes.instanceOf(Object).isRequired,
    subscribeToUser: PropTypes.func.isRequired,
    subscribeToFriendships: PropTypes.func.isRequired,
    subscribeNotificationTokenRefresh: PropTypes.func.isRequired,
    navigateToRoute: PropTypes.func.isRequired,
    loadPosts: PropTypes.func.isRequired,
    loadUsersPosts: PropTypes.func.isRequired,
    handleURLRoute: PropTypes.func.isRequired,
    postAction: PropTypes.func.isRequired,
    paginatePosts: PropTypes.func.isRequired,
    refreshPosts: PropTypes.func.isRequired,
    startSignOut: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscriptions = [];
  }

  async componentDidMount() {
    this.subscriptions.push(
      await this.props.subscribeToUser(this.props.authUserId),
      await this.props.subscribeToFriendships(this.props.authUserId),
      await this.props.subscribeNotificationTokenRefresh(this.props.authUserId),
      await this.props.loadUsersPosts(this.props.authUserId, 'all')
    );

    // HOME - Respond to initial route and listen to routing updates
    if (this.props.routing.screen) {
      this.props.navigateToRoute(this.props.routing);
    }

    // HOME - Listen to routing updates
    this.subscriptions.push(
      subscribe('routing', state => {
        if (state.routing.screen) {
          this.props.navigateToRoute(state.routing);
        }
      })
    );
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach(unsubscribe => {
      unsubscribe();
    });
  }

  renderItem = item => {
    const routeURL = buildAppLink('shayr', 'shayr', 'PostDetail', {
      id: item.postId
    });

    return (
      <ContentCard
        payload={item}
        friends={{
          ...this.props.authUser,
          ...this.props.friends
        }}
        onTap={() => this.props.handleURLRoute(routeURL)}
        shareAction={{
          actionCount: item.shareCount,
          actionUser: item.shares
            ? item.shares.includes(this.props.authUserId)
            : false,
          onPress: () =>
            this.props.postAction('share', this.props.authUserId, item.postId)
        }}
        addAction={{
          actionCount: item.addCount,
          actionUser: item.adds
            ? item.adds.includes(this.props.authUserId)
            : false,
          onPress: () =>
            this.props.postAction('add', this.props.authUserId, item.postId)
        }}
        doneAction={{
          actionCount: item.doneCount,
          actionUser: item.dones
            ? item.dones.includes(this.props.authUserId)
            : false,
          onPress: () =>
            this.props.postAction('done', this.props.authUserId, item.postId)
        }}
        likeAction={{
          actionCount: item.likeCount,
          actionUser: item.likes
            ? item.likes.includes(this.props.authUserId)
            : false,
          onPress: () =>
            this.props.postAction('like', this.props.authUserId, item.postId)
        }}
      />
    );
  };

  paginate = () => {
    // const unsubscribe = this.props.paginatePosts(
    //   this.props.authUserId,
    //   'feed',
    //   this.props.posts.feedLastPost
    // );
    // if (unsubscribe) {
    //   this.subscriptions.push(unsubscribe);
    // }
  };

  refresh = () => {
    // const unsubscribe = this.props.refreshPosts(
    //   this.props.authUserId,
    //   'feed'
    // );
    // if (unsubscribe) {
    //   this.subscriptions.push(unsubscribe);
    // }
  };

  loading = () => {
    // if (this.props.posts.feedPosts) {
    //   flattenPosts(this.props.posts.feedPosts);
    // }

    if (!this.props.usersPosts || !this.props.friends || !this.props.authUser) {
      return <Text>LOADING</Text>;
    }

    return (
      <List
        data={this.props.usersPosts}
        renderItem={item => this.renderItem(item)}
        onEndReached={() => this.paginate()}
        onRefresh={() => this.refresh()}
        refreshing={false}
      />
    );
  };

  signOut = () => {
    this.props.startSignOut();
    this.props.navigation.navigate('Login');
  };

  render() {
    console.log(this.state);
    console.log(this.props);

    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={colors.YELLOW}
          statusBarStyle='dark-content'
          shadow
          title='Discover'
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
  mapDispatchToProps
)(Discover);
