import { UsersPostsType, UserType } from '@daviswhitehead/shayr-resources';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { DocumentSnapshot } from 'react-native-firebase/firestore';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import List from '../../components/List';
import PostCard from '../../components/PostCard';
import { queries, queryArguments, queryType } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { subscribeToFriendships } from '../../redux/friendships/actions';
import { subscribeNotificationTokenRefresh } from '../../redux/notifications/actions';
import { navigateToRoute } from '../../redux/routing/actions';
import { subscribeToUser } from '../../redux/users/actions';
import {
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import { loadUsersPosts } from '../../redux/usersPosts/actions';
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

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);
  const usersPostsViews = {
    [queries.USERS_POSTS_ALL.type]: `${authUserId}_${
      queries.USERS_POSTS_ALL.type
    }`
  };
  const usersPostsData = {
    [usersPostsViews[queries.USERS_POSTS_ALL.type]]: {
      data: selectFlatListReadyUsersPostsFromList(
        state,
        usersPostsViews[queries.USERS_POSTS_ALL.type]
      ),
      ...selectUsersPostsMetadataFromList(
        state,
        usersPostsViews[queries.USERS_POSTS_ALL.type]
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

const mapDispatchToProps = (dispatch: any, props: any) => {
  return {
    loadUsersPosts: (
      ownerUserId: string,
      queryType: queryType,
      queryArguments: queryArguments,
      shouldRefresh?: boolean,
      isLoading?: boolean,
      lastItem?: DocumentSnapshot | 'DONE'
    ) =>
      dispatch(
        loadUsersPosts(
          ownerUserId,
          queryType,
          queryArguments,
          shouldRefresh,
          isLoading,
          lastItem
        )
      ),
    subscribeToUser: userId => dispatch(subscribeToUser(userId)),
    subscribeToFriendships: userId => dispatch(subscribeToFriendships(userId)),
    subscribeNotificationTokenRefresh: userId =>
      dispatch(subscribeNotificationTokenRefresh(userId)),
    navigateToRoute: payload => dispatch(navigateToRoute(payload))
  };
};

class Discover extends Component<Props> {
  constructor(props: Props) {
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
    await this.props.loadUsersPosts(
      this.props.authUserId,
      queries.USERS_POSTS_ALL.type,
      { userId: this.props.authUserId },
      true,
      this.props.usersPostsData[
        this.props.usersPostsViews[queries.USERS_POSTS_ALL.type]
      ].isLoading,
      this.props.usersPostsData[
        this.props.usersPostsViews[queries.USERS_POSTS_ALL.type]
      ].lastItem
    );

    // this.props.navigation.navigate('PostDetail', {
    //   ownerUserId: this.props.authUserId,
    //   postId: 'cd2qGlHClQvzHnO1m5xY'
    // });
    this.props.navigation.navigate('MyList', {
      ownerUserId: this.props.authUserId
    });
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach(unsubscribe => {
      unsubscribe();
    });
  }

  loading = () => {
    if (
      !this.props.usersPostsData[
        this.props.usersPostsViews[queries.USERS_POSTS_ALL.type]
      ].isLoaded ||
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
          this.props.usersPostsData[
            this.props.usersPostsViews[queries.USERS_POSTS_ALL.type]
          ].data
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
          this.props.loadUsersPosts(
            this.props.authUserId,
            queries.USERS_POSTS_ALL.type,
            { userId: this.props.authUserId },
            false,
            this.props.usersPostsData[
              this.props.usersPostsViews[queries.USERS_POSTS_ALL.type]
            ].isLoading,
            this.props.usersPostsData[
              this.props.usersPostsViews[queries.USERS_POSTS_ALL.type]
            ].lastItem
          )
        }
        onRefresh={() =>
          this.props.loadUsersPosts(
            this.props.authUserId,
            queries.USERS_POSTS_ALL.type,
            { userId: this.props.authUserId },
            true,
            this.props.usersPostsData[
              this.props.usersPostsViews[queries.USERS_POSTS_ALL.type]
            ].isLoading,
            this.props.usersPostsData[
              this.props.usersPostsViews[queries.USERS_POSTS_ALL.type]
            ].lastItem
          )
        }
        refreshing={
          this.props.usersPostsData[
            this.props.usersPostsViews[queries.USERS_POSTS_ALL.type]
          ].isRefreshing
        }
        isLoading={
          this.props.usersPostsData[
            this.props.usersPostsViews[queries.USERS_POSTS_ALL.type]
          ].isLoading
        }
        isLoadedAll={
          this.props.usersPostsData[
            this.props.usersPostsViews[queries.USERS_POSTS_ALL.type]
          ].isLoadedAll
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
