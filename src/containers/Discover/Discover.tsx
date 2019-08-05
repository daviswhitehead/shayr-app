import {
  documentId,
  UsersPostsType,
  UserType
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { DocumentSnapshot } from 'react-native-firebase/firestore';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { connect } from 'react-redux';
import { subscribe } from 'redux-subscriber';
import Header from '../../components/Header';
import List from '../../components/List';
import PostCard from '../../components/PostCard';
import SwipeCard from '../../components/SwipeCard';
import { queries, queryArguments, queryType } from '../../lib/FirebaseQueries';
import {
  subscribeToAdds,
  toggleAddDonePost,
  updateUserAdds
} from '../../redux/adds/actions';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { subscribeToDones, updateUserDones } from '../../redux/dones/actions';
import { subscribeToFriendships } from '../../redux/friendships/actions';
import { subscribeToLikes, updateUserLikes } from '../../redux/likes/actions';
import { subscribeNotificationTokenRefresh } from '../../redux/notifications/actions';
import { navigateToRoute } from '../../redux/routing/actions';
import {
  subscribeToShares,
  updateUserShares
} from '../../redux/sharesLists/actions';
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
    adds: state.adds,
    auth: state.auth,
    authShares: _.get(
      state,
      ['sharesLists', `${authUserId}_${queries.USER_SHARES.type}`],
      []
    ),
    authUserId,
    authUser: selectUserFromId(state, authUserId),
    dones: state.dones,
    friends: selectUsersFromList(state, `${authUserId}_Friends`),
    likes: state.likes,
    posts: state.posts,
    routing: state.routing,
    usersPostsViews,
    usersPostsData
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
    subscribeToUser: (userId) => dispatch(subscribeToUser(userId)),
    subscribeToAdds: (userId) => dispatch(subscribeToAdds(userId)),
    updateUserAdds: (userId, value) => dispatch(updateUserAdds(userId, value)),
    subscribeToDones: (userId) => dispatch(subscribeToDones(userId)),
    updateUserDones: (userId, value) =>
      dispatch(updateUserDones(userId, value)),
    subscribeToLikes: (userId) => dispatch(subscribeToLikes(userId)),
    updateUserLikes: (userId, value) =>
      dispatch(updateUserLikes(userId, value)),
    subscribeToShares: (userId) => dispatch(subscribeToShares(userId)),
    updateUserShares: (userId, value) =>
      dispatch(updateUserShares(userId, value)),
    subscribeToFriendships: (userId) => dispatch(subscribeToFriendships(userId)),
    subscribeNotificationTokenRefresh: (userId) =>
      dispatch(subscribeNotificationTokenRefresh(userId)),
    navigateToRoute: (payload) => dispatch(navigateToRoute(payload)),
    toggleAddDonePost: (
      type: 'adds' | 'dones',
      isActive: boolean,
      postId: documentId,
      ownerUserId: documentId,
      userId: documentId,
      isOtherActive: boolean
    ) =>
      dispatch(
        toggleAddDonePost(
          type,
          isActive,
          postId,
          ownerUserId,
          userId,
          isOtherActive
        )
      )
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
      await this.props.subscribeNotificationTokenRefresh(this.props.authUserId),
      await this.props.subscribeToAdds(this.props.authUserId),
      await this.props.subscribeToDones(this.props.authUserId),
      await this.props.subscribeToLikes(this.props.authUserId),
      await this.props.subscribeToShares(this.props.authUserId)
    );

    // HOME - Respond to initial route
    if (this.props.routing.screen) {
      this.props.navigateToRoute(this.props.routing);
    }

    // HOME - Listen to routing updates from incoming notifications
    this.subscriptions.push(
      subscribe('routing', (state) => {
        if (state.routing.screen) {
          this.props.navigateToRoute(state.routing);
        }
      })
    );

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

    // this.props.navigation.navigate('FriendsTab', {});
    this.props.navigation.navigate('PostDetail', {
      ownerUserId: this.props.authUserId,
      postId: '48PKLyY71DHin1XuIPop'
    });
    // this.props.navigation.navigate({
    //   routeName: 'MyList',
    //   params: {
    //     // ownerUserId: 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2'
    //     ownerUserId: this.props.authUserId
    //   }
    // });
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.adds.hasUpdatedUser &&
      this.props.authUserId &&
      this.props.adds.length >= 0
    ) {
      this.props.updateUserAdds(this.props.authUserId, this.props.adds.length);
    }
    if (
      !this.props.dones.hasUpdatedUser &&
      this.props.authUserId &&
      this.props.dones.length >= 0
    ) {
      this.props.updateUserDones(
        this.props.authUserId,
        this.props.dones.length
      );
    }
    if (
      !this.props.likes.hasUpdatedUser &&
      this.props.authUserId &&
      this.props.likes.length >= 0
    ) {
      this.props.updateUserLikes(
        this.props.authUserId,
        this.props.likes.length
      );
    }
    if (
      !this.props.authShares.hasUpdatedUser &&
      this.props.authUserId &&
      _.get(this.props, ['authShares', 'items'], false)
    ) {
      this.props.updateUserShares(
        this.props.authUserId,
        _.get(this.props, ['authShares', 'items'], []).length
      );
    }
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((unsubscribe) => {
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
          <SwipeCard
            type={'add'}
            isLeftAlreadyDone={_.includes(
              item.adds || [],
              this.props.authUserId
            )}
            leftAction={() =>
              this.props.toggleAddDonePost(
                'adds',
                false,
                item.postId,
                this.props.authUserId,
                this.props.authUserId,
                _.includes(item.dones || [], this.props.authUserId)
              )
            }
          >
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
          </SwipeCard>
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
