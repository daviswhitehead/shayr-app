import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './styles';
import DynamicActionButton from '../../components/DynamicActionButton';
import List from '../../components/List';
import ContentCard from '../../components/ContentCard';
import Header from '../../components/Header';
import colors from '../../styles/Colors';
import {
  loadPosts, paginatePosts, refreshPosts, flattenPostsQueue,
} from '../../redux/posts/actions';
import { postAction } from '../../redux/postActions/actions';
import { handleURLRoute } from '../../redux/routing/actions';
import { buildAppLink } from '../../lib/DeepLinks';
import { startSignOut } from '../../redux/auth/actions';

const mapStateToProps = state => ({
  auth: state.auth,
  users: state.users,
  posts: state.posts,
});

const mapDispatchToProps = dispatch => ({
  loadPosts: (userId, query) => dispatch(loadPosts(userId, query)),
  paginatePosts: (userId, query, lastPost) => dispatch(paginatePosts(userId, query, lastPost)),
  refreshPosts: (userId, query) => dispatch(refreshPosts(userId, query)),
  postAction: (actionType, userId, postId) => dispatch(postAction(actionType, userId, postId)),
  startSignOut: () => dispatch(startSignOut()),
  handleURLRoute: payload => dispatch(handleURLRoute(payload)),
});

class Queue extends Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Object).isRequired,
    users: PropTypes.instanceOf(Object).isRequired,
    posts: PropTypes.instanceOf(Object).isRequired,
    navigation: PropTypes.instanceOf(Object).isRequired,
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

  componentDidMount() {
    this.subscriptions.push(this.props.loadPosts(this.props.auth.user.uid, 'queue'));
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
      'queue',
      this.props.posts.queueLastPost,
    );
    if (unsubscribe) {
      this.subscriptions.push(unsubscribe);
    }
  };

  refresh = () => {
    const unsubscribe = this.props.refreshPosts(this.props.auth.user.uid, 'queue');
    if (unsubscribe) {
      this.subscriptions.push(unsubscribe);
    }
  };

  loading = () => {
    if (!this.props.posts.queuePosts || !this.props.users.friends || !this.props.users.self) {
      return <Text>LOADING</Text>;
    }
    return (
      <List
        data={flattenPostsQueue(this.props.auth.user.uid, this.props.posts.queuePosts)}
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
        <Header backgroundColor={colors.YELLOW} statusBarStyle="dark-content" shadow title="queue" />
        <View style={styles.container}>
          <this.loading />
          <DynamicActionButton
            logout={this.signOut}
            feed={() => this.props.navigation.navigate('Feed')}
            queue={false}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Queue);
