import { UsersPostsType, UserType } from '@daviswhitehead/shayr-resources';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { DocumentSnapshot } from 'react-native-firebase/firestore';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import List from '../../components/List';
import PostCard from '../../components/PostCard';
import { RequestType } from '../../lib/FirebaseRequests';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { subscribeToFriendships } from '../../redux/friendships/actions';
import { subscribeNotificationTokenRefresh } from '../../redux/notifications/actions';
import { handleURLRoute } from '../../redux/routing/actions';
import { navigateToRoute } from '../../redux/routing/actions';
import { subscribeToUser } from '../../redux/users/actions';
import {
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import { subscribeUsersPosts } from '../../redux/usersPosts/actions';
import {
  selectFlatListReadyUsersPostsFromList,
  selectUsersPostsMetadataFromList
} from '../../redux/usersPosts/selectors';
import colors from '../../styles/Colors';
import styles from './styles';

type ActionType = 'shares' | 'adds' | 'dones' | 'likes';

export interface Props {
  authUserId: string;
  authUser: UserType;
  isFocused: boolean;
  navigation: any;
  onActionPress: (
    actionType: ActionType,
    userId: string,
    postId: string
  ) => void;
  ownerUserId: string;
  post: UsersPostsType;
  users: Users;
  onCardPress: (url: string) => void | undefined;
}

// routing: PropTypes.instanceOf(Object).isRequired,
// navigation: PropTypes.instanceOf(Object).isRequired,
// subscribeToUser: PropTypes.func.isRequired,
// subscribeToFriendships: PropTypes.func.isRequired,
// subscribeNotificationTokenRefresh: PropTypes.func.isRequired,
// navigateToRoute: PropTypes.func.isRequired,
// loadPosts: PropTypes.func.isRequired,
// loadUsersPosts: PropTypes.func.isRequired,
// postAction: PropTypes.func.isRequired,
// paginatePosts: PropTypes.func.isRequired,
// refreshPosts: PropTypes.func.isRequired,
// startSignOut: PropTypes.func.isRequired

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);
  const usersPostsViews = {
    USERS_POSTS_ALL: `${authUserId}_USERS_POSTS_ALL`
  };
  const usersPostsData = {
    [usersPostsViews.USERS_POSTS_ALL]: {
      data: selectFlatListReadyUsersPostsFromList(
        state,
        usersPostsViews.USERS_POSTS_ALL
      ),
      ...selectUsersPostsMetadataFromList(
        state,
        usersPostsViews.USERS_POSTS_ALL
      )
    }
  };

  return {
    auth: state.auth,
    authUserId,
    authUser: selectUserFromId(state, authUserId),
    friends: selectUsersFromList(state, `${authUserId}_Friends`),
    usersPostsViews,
    usersPostsData,
    routing: state.routing,
    posts: state.posts
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  subscribeUsersPosts: (
    userId: string,
    requestType: RequestType,
    shouldRefresh: boolean,
    lastItem: DocumentSnapshot | 'DONE'
  ) =>
    dispatch(subscribeUsersPosts(userId, requestType, shouldRefresh, lastItem)),
  loadUsersPosts: (userId, query, shouldRefresh, lastItem) =>
    dispatch(loadUsersPosts(userId, query, shouldRefresh, lastItem)),
  paginatePosts: (userId, query, lastPost) =>
    dispatch(paginatePosts(userId, query, lastPost)),
  refreshPosts: (userId, query) => dispatch(refreshPosts(userId, query)),
  subscribeToUser: userId => dispatch(subscribeToUser(userId)),
  subscribeToFriendships: userId => dispatch(subscribeToFriendships(userId)),
  subscribeNotificationTokenRefresh: userId =>
    dispatch(subscribeNotificationTokenRefresh(userId)),
  navigateToRoute: payload => dispatch(navigateToRoute(payload)),
  onCardPress: (url: string) => dispatch(handleURLRoute(url))
});

class Discover extends Component<Props> {
  constructor(props) {
    super(props);
    this.subscriptions = [];
  }

  async componentDidMount() {
    // setup subscriptions
    this.subscriptions.push(
      await this.props.subscribeToUser(this.props.authUserId),
      await this.props.subscribeToFriendships(this.props.authUserId),
      await this.props.subscribeNotificationTokenRefresh(this.props.authUserId)
    );

    // HOME - Respond to initial route and listen to routing updates
    if (this.props.routing.screen) {
      this.props.navigateToRoute(this.props.routing);
    }

    // load initial data
    await this.props.subscribeUsersPosts(
      this.props.authUserId,
      'USERS_POSTS_ALL',
      true
    );
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach(unsubscribe => {
      unsubscribe();
    });
  }

  loading = () => {
    if (
      !this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_ALL]
        .isLoaded ||
      !this.props.friends ||
      !this.props.authUser
    ) {
      return (
        <View style={styles.container}>
          <Text>LOADING</Text>
        </View>
      );
    }

    return (
      <List
        data={
          this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_ALL]
            .data
        }
        renderItem={(item: any) => (
          <PostCard
            key={item._id}
            post={item}
            ownerUserId={this.props.authUserId}
            users={{
              [this.props.authUserId]: this.props.authUser,
              ...this.props.friends
            }}
            onCardPress={() =>
              this.props.navigation.navigate('PostDetail', {
                ownerUserId: item.userId,
                postId: item.postId
              })
            }
          />
        )}
        onEndReached={() =>
          this.subscriptions.push(
            this.props.subscribeUsersPosts(
              this.props.authUserId,
              'USERS_POSTS_ALL',
              false,
              this.props.usersPostsData[
                this.props.usersPostsViews.USERS_POSTS_ALL
              ].lastItem
            )
          )
        }
        onRefresh={() =>
          this.subscriptions.push(
            this.props.subscribeUsersPosts(
              this.props.authUserId,
              'USERS_POSTS_ALL',
              true
            )
          )
        }
        refreshing={
          this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_ALL]
            .isRefreshing
        }
      />
    );
  };

  render() {
    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={colors.YELLOW}
          statusBarStyle='dark-content'
          shadow
          title='Discover'
        />
        {this.loading()}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Discover);
