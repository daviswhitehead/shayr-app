import { Post, User, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { subscribe } from 'redux-subscriber';
import Header from '../../components/Header';
import Icon, { names } from '../../components/Icon';
import List from '../../components/List';
import PostCard from '../../components/PostCard';
import SwipeCard from '../../components/SwipeCard';
import withAdds from '../../higherOrderComponents/withAdds';
import { getQuery, queryTypes } from '../../lib/FirebaseQueries';
import { openURL } from '../../lib/Utils';
import { selectAuthUserId } from '../../redux/auth/selectors';
import {
  selectDocumentFromId,
  selectFlatListReadyDocuments
} from '../../redux/documents/selectors';
import { subscribeToFriendships } from '../../redux/friendships/actions';
import { generateListKey } from '../../redux/lists/helpers';
import { selectListItems, selectListMeta } from '../../redux/lists/selectors';
import { subscribeNotificationTokenRefresh } from '../../redux/notifications/actions';
import { getPost } from '../../redux/posts/actions';
import { State } from '../../redux/Reducers';
import { navigateToRoute } from '../../redux/routing/actions';
import { subscribeToFriends, subscribeToUser } from '../../redux/users/actions';
import {
  selectUserActionCount,
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import { loadUsersPosts } from '../../redux/usersPosts/actions';
import colors from '../../styles/Colors';
import styles from './styles';

const SHAYR_ONBOARDING_POST_ID = 'SHAYR_HOW_TO';

interface StateProps {
  authUser?: User;
  authUserId: string;
  friends: {
    [userId: string]: User;
  };
  onboardingPost: Post;
  routing?: any; // routing state
  unreadNotificationsCount?: number;
  usersPostsListsMeta?: {
    [listKey: string]: any; // listKey and meta state
  };
  usersPostsListsData?: {
    [listKey: string]: Array<UsersPosts>; // listKey
  };
}

interface DispatchProps {
  navigateToRoute: typeof navigateToRoute;
  loadUsersPosts: typeof loadUsersPosts;
  subscribeToUser: typeof subscribeToUser;
  subscribeToFriends: typeof subscribeToFriends;
  subscribeToFriendships: typeof subscribeToFriendships;
  subscribeNotificationTokenRefresh: typeof subscribeNotificationTokenRefresh;
  getPost: typeof getPost;
}

interface OwnProps {}

interface OwnState {
  isLoading: boolean;
  isLoadingOnboardingPost: boolean;
}

interface NavigationParams {}

type Props = OwnProps &
  StateProps &
  DispatchProps &
  NavigationScreenProps<NavigationParams>;

const mapStateToProps = (state: State) => {
  if (!selectAuthUserId(state)) {
    return {};
  }

  const authUserId = selectAuthUserId(state);

  return {
    authUserId,
    authUser: selectUserFromId(state, authUserId, 'presentation'),
    friends: selectUsersFromList(
      state,
      generateListKey(authUserId, queryTypes.USER_FRIENDS),
      'presentation'
    ),
    onboardingPost: selectDocumentFromId(
      state,
      'posts',
      SHAYR_ONBOARDING_POST_ID
    ),
    routing: state.routing,
    unreadNotificationsCount: selectUserActionCount(
      state,
      authUserId,
      'profile',
      'unreadNotificationsCount'
    ),
    usersPostsListsMeta: {
      [generateListKey(authUserId, queryTypes.USERS_POSTS_ALL)]: selectListMeta(
        state,
        'usersPostsLists',
        generateListKey(authUserId, queryTypes.USERS_POSTS_ALL)
      )
    },
    usersPostsListsData: []
    // usersPostsListsData: {
    //   [generateListKey(
    //     authUserId,
    //     queryTypes.USERS_POSTS_ALL
    //   )]: selectFlatListReadyDocuments(
    //     state,
    //     'usersPosts',
    //     selectListItems(
    //       state,
    //       'usersPostsLists',
    //       generateListKey(authUserId, queryTypes.USERS_POSTS_ALL)
    //     ),
    //     generateListKey(authUserId, queryTypes.USERS_POSTS_ALL),
    //     {
    //       sortKeys: ['createdAt'],
    //       sortDirection: ['desc']
    //     }
    //   )
    // }
  };
};

const mapDispatchToProps = {
  navigateToRoute,
  loadUsersPosts,
  subscribeToUser,
  subscribeToFriends,
  subscribeToFriendships,
  subscribeNotificationTokenRefresh,
  getPost
};

class Discover extends PureComponent<Props, OwnState> {
  static whyDidYouRender = true;

  subscriptions: Array<any>;
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingOnboardingPost: false
    };
    this.subscriptions = [];
  }

  componentDidMount() {
    this.checkLoading();
    // GLOBAL - REQUIRED
    // setup subscriptions
    this.subscriptions.push(
      this.props.subscribeToUser(this.props.authUserId),
      this.props.subscribeToFriends(this.props.authUserId),
      this.props.subscribeToFriendships(this.props.authUserId),
      this.props.subscribeNotificationTokenRefresh(this.props.authUserId)
    );

    // respond to initial route
    if (this.props.routing.screen) {
      this.props.navigateToRoute(this.props.routing);
    }

    // listen to routing updates from incoming notifications
    this.subscriptions.push(
      subscribe('routing', (state: any) => {
        if (state.routing.screen) {
          this.props.navigateToRoute(state.routing);
        }
      })
    );

    // SCREEN
    // load initial data
    this.props.loadUsersPosts(
      generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL),
      getQuery(queryTypes.USERS_POSTS_ALL)!(this.props.authUserId)
    );

    // DEVELOPMENT HELPERS
    // this.props.navigation.navigate('FindFriends', {});
    // this.props.navigation.navigate('Notifications', {});
    // this.props.navigation.navigate('FriendsTab', {});
    // this.props.navigation.navigate('PostDetail', {
    //   ownerUserId: this.props.authUserId,
    //   postId: '9JKOMIpbKdSCt4MRomPI'
    // });
    // this.props.navigation.navigate('PostDetail', {
    //   ownerUserId: this.props.authUserId,
    //   postId: '48PKLyY71DHin1XuIPop'
    // });
    // this.props.navigation.navigate({
    //   // routeName: 'MyList',
    //   routeName: 'MyListTab',
    //   params: {
    //     // ownerUserId: 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2'
    //     ownerUserId: this.props.authUserId
    //   }
    // });
  }

  componentDidUpdate(prevProps: Props) {
    this.checkLoading();
    this.loadOnboardingPost();
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((unsubscribe) => {
      unsubscribe();
    });
  }

  checkLoading = () => {
    if (
      this.state.isLoading &&
      this.props.authUser &&
      this.props.friends &&
      this.props.usersPostsListsMeta &&
      this.props.usersPostsListsMeta[
        generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
      ].isLoaded
    ) {
      this.setState({ isLoading: false });
    }
  };

  loadOnboardingPost = () => {
    if (
      this.state.isLoadingOnboardingPost &&
      !_.isUndefined(this.props.onboardingPost)
    ) {
      this.setState({ isLoadingOnboardingPost: false });
    }

    if (
      _.isEmpty(this.props.usersPostsListsData) &&
      !_.isUndefined(this.props.usersPostsListsData) &&
      _.isUndefined(this.props.onboardingPost) &&
      !this.state.isLoadingOnboardingPost
    ) {
      this.setState({ isLoadingOnboardingPost: true }, () => {
        this.props.getPost(SHAYR_ONBOARDING_POST_ID);
      });
    }
  };

  paginateList = () => {
    if (!this.props.usersPostsListsMeta) {
      return;
    }
    return this.props.loadUsersPosts(
      generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL),
      getQuery(queryTypes.USERS_POSTS_ALL)!(this.props.authUserId),
      false,
      this.props.usersPostsListsMeta[
        generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
      ].isLoading,
      this.props.usersPostsListsMeta[
        generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
      ].lastItem
    );
  };

  refreshList = () => {
    if (!this.props.usersPostsListsMeta) {
      return;
    }
    return this.props.loadUsersPosts(
      generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL),
      getQuery(queryTypes.USERS_POSTS_ALL)!(this.props.authUserId),
      true,
      this.props.usersPostsListsMeta[
        generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
      ].isLoading,
      this.props.usersPostsListsMeta[
        generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
      ].lastItem
    );
  };

  onItemPress = ({
    ownerUserId,
    postId
  }: {
    ownerUserId: string;
    postId: string;
  }) => {
    this.props.navigation.navigate({
      routeName: 'PostDetail',
      params: {
        ownerUserId,
        postId
      },
      key: `PostDetail:${ownerUserId}_${postId}`
    });
  };

  renderItem = ({ item }: { item: UsersPosts }) => {
    const actionProps = {
      // add/done props
      ownerUserId: item.userId,
      postId: item.postId,
      usersPostsAdds: item.adds,
      usersPostsDones: item.dones
    };

    return (
      <SwipeCard
        key={item._id}
        noSwiping={this.state.isLoading}
        type={'adds'}
        isLeftAlreadyDone={_.includes(item.adds || [], this.props.authUserId)}
        leftAction={withAdds}
        leftActionProps={{ side: 'left', ...actionProps }}
      >
        <PostCard
          key={item._id}
          isLoading={this.state.isLoading}
          post={item}
          onPressParameters={{
            ownerUserId: item.userId,
            postId: item.postId
          }}
          onPress={this.onItemPress}
          users={{
            [this.props.authUserId]: this.props.authUser,
            ...this.props.friends
          }}
        />
      </SwipeCard>
    );
  };

  onPressOnboardingPost = ({ url }: { url: string }) => {
    openURL(url);
  };

  renderOnboardingItem = ({ item }: { item: Post }) => {
    console.log('item');
    console.log(item);

    return (
      <PostCard
        key={item._id}
        isLoading={this.state.isLoadingOnboardingPost}
        post={item}
        onPressParameters={{
          url: item.url
        }}
        onPress={this.onPressOnboardingPost}
      />
    );
  };

  render() {
    // console.log(`Discover - Render`);
    // console.log('this.props');
    // console.log(this.props);
    // console.log('this.state');
    // console.log(this.state);

    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={colors.YELLOW}
          statusBarStyle='dark-content'
          shadow
          title='Discover'
          rightIcons={
            <Icon
              name={
                this.props.unreadNotificationsCount > 0
                  ? names.BELL_ACTIVE
                  : names.BELL
              }
              hasBadge={this.props.unreadNotificationsCount > 0}
              onPress={() =>
                this.props.navigation.navigate('Notifications', {})
              }
            />
          }
        />
        {this.props.onboardingPost ? (
          <List
            data={[this.props.onboardingPost]}
            renderItem={this.renderOnboardingItem}
            isLoading={this.state.isLoadingOnboardingPost}
          />
        ) : (
          <List
            data={
              this.props.usersPostsListsData![
                generateListKey(
                  this.props.authUserId,
                  queryTypes.USERS_POSTS_ALL
                )
              ]
            }
            renderItem={this.renderItem}
            onEndReached={this.paginateList}
            onRefresh={this.refreshList}
            isLoading={this.state.isLoading}
            isRefreshing={
              this.state.isLoading
                ? false
                : this.props.usersPostsListsMeta![
                    generateListKey(
                      this.props.authUserId,
                      queryTypes.USERS_POSTS_ALL
                    )
                  ].isRefreshing
            }
            isPaginating={
              this.state.isLoading
                ? false
                : this.props.usersPostsListsMeta![
                    generateListKey(
                      this.props.authUserId,
                      queryTypes.USERS_POSTS_ALL
                    )
                  ].isLoading
            }
            isLoadedAll={
              this.state.isLoading
                ? false
                : this.props.usersPostsListsMeta![
                    generateListKey(
                      this.props.authUserId,
                      queryTypes.USERS_POSTS_ALL
                    )
                  ].isLoadedAll
            }
          />
        )}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  {
    areStatePropsEqual: (next: any, prev: any) => {
      return _.isEqual(next, prev);
    }
  }
)(Discover);
