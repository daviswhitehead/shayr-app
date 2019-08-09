import { User, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
// @ts-ignore
import { subscribe } from 'redux-subscriber';
import Header from '../../components/Header';
import List from '../../components/List';
import PostCard from '../../components/PostCard';
import SwipeCard from '../../components/SwipeCard';
import { getQuery, queryTypes } from '../../lib/FirebaseQueries';
import {
  subscribeToAdds,
  toggleAddDonePost,
  updateUserAdds
} from '../../redux/adds/actions';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { subscribeToDones, updateUserDones } from '../../redux/dones/actions';
import { subscribeToFriendships } from '../../redux/friendships/actions';
import { subscribeToLikes, updateUserLikes } from '../../redux/likes/actions';
import { generateListKey } from '../../redux/lists/helpers';
import { selectListCount, selectListMeta } from '../../redux/lists/selectors';
import { subscribeNotificationTokenRefresh } from '../../redux/notifications/actions';
import { State } from '../../redux/Reducers';
import { navigateToRoute } from '../../redux/routing/actions';
import {
  subscribeToShares,
  updateUserShares
} from '../../redux/shares/actions';
import { subscribeToUser } from '../../redux/users/actions';
import {
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import { loadUsersPosts } from '../../redux/usersPosts/actions';
import { selectFlatListReadyUsersPosts } from '../../redux/usersPosts/selectors';
import colors from '../../styles/Colors';
import styles from './styles';

// const RENDER_COUNT = 0;

interface StateProps {
  addsCount?: number;
  authUser?: User;
  authUserId: string;
  donesCount?: number;
  friends?: Array<User>;
  likesCount?: number;
  routing?: any; // routing state
  sharesCount?: number;
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
  subscribeToAdds: typeof subscribeToAdds;
  updateUserAdds: typeof updateUserAdds;
  subscribeToDones: typeof subscribeToDones;
  updateUserDones: typeof updateUserDones;
  subscribeToLikes: typeof subscribeToLikes;
  updateUserLikes: typeof updateUserLikes;
  subscribeToShares: typeof subscribeToShares;
  updateUserShares: typeof updateUserShares;
  subscribeToFriendships: typeof subscribeToFriendships;
  subscribeNotificationTokenRefresh: typeof subscribeNotificationTokenRefresh;
  toggleAddDonePost: typeof toggleAddDonePost;
}

interface OwnProps {}

interface OwnState {
  isLoading: boolean;
}

interface NavigationParams {}

type Props = OwnProps &
  StateProps &
  DispatchProps &
  NavigationScreenProps<NavigationParams>;

const mapStateToProps = (state: State) => {
  const authUserId = selectAuthUserId(state);

  if (!authUserId) {
    return {};
  }

  return {
    addsCount: selectListCount(state, 'addsLists', `${authUserId}_USER_ADDS`),
    authUserId,
    authUser: selectUserFromId(state, authUserId),
    donesCount: selectListCount(
      state,
      'donesLists',
      `${authUserId}_USER_DONES`
    ),
    friends: selectUsersFromList(state, `${authUserId}_Friends`),
    likesCount: selectListCount(
      state,
      'likesLists',
      `${authUserId}_USER_LIKES`
    ),
    routing: state.routing,
    sharesCount: selectListCount(
      state,
      'sharesLists',
      `${authUserId}_USER_SHARES`
    ),
    usersPostsListsMeta: {
      [generateListKey(authUserId, queryTypes.USERS_POSTS_ALL)]: selectListMeta(
        state,
        'usersPostsLists',
        generateListKey(authUserId, queryTypes.USERS_POSTS_ALL)
      )
    },
    usersPostsListsData: {
      [generateListKey(
        authUserId,
        queryTypes.USERS_POSTS_ALL
      )]: selectFlatListReadyUsersPosts(
        state,
        'usersPostsLists',
        generateListKey(authUserId, queryTypes.USERS_POSTS_ALL),
        'createdAt'
      )
    }
  };
};

const mapDispatchToProps = {
  navigateToRoute,
  loadUsersPosts,
  subscribeToUser,
  subscribeToAdds,
  updateUserAdds,
  subscribeToDones,
  updateUserDones,
  subscribeToLikes,
  updateUserLikes,
  subscribeToShares,
  updateUserShares,
  subscribeToFriendships,
  subscribeNotificationTokenRefresh,
  toggleAddDonePost
};

class Discover extends PureComponent<Props, OwnState> {
  static whyDidYouRender = true;

  subscriptions: Array<any>;
  // subscriptions: Array<() => void>;
  // subscriptions: Array<typeof subscribeToUser>;
  // subscriptions: Array<Partial<DispatchProps>>;
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true
    };
    this.subscriptions = [];
  }

  componentDidMount() {
    // GLOBAL - REQUIRED
    // setup subscriptions
    this.subscriptions.push(
      this.props.subscribeToUser(this.props.authUserId),
      this.props.subscribeToFriendships(this.props.authUserId),
      this.props.subscribeNotificationTokenRefresh(this.props.authUserId),
      this.props.subscribeToAdds(this.props.authUserId),
      this.props.subscribeToDones(this.props.authUserId),
      this.props.subscribeToLikes(this.props.authUserId),
      this.props.subscribeToShares(this.props.authUserId)
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
      this.props.authUserId,
      getQuery(queryTypes.USERS_POSTS_ALL)(this.props.authUserId),
      queryTypes.USERS_POSTS_ALL
    );

    // DEVELOPMENT HELPERS
    // // this.props.navigation.navigate('FriendsTab', {});
    // // this.props.navigation.navigate('PostDetail', {
    // //   ownerUserId: this.props.authUserId,
    // //   postId: '48PKLyY71DHin1XuIPop'
    // // });
    // // this.props.navigation.navigate({
    // //   routeName: 'MyList',
    // //   params: {
    // //     // ownerUserId: 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2'
    // //     ownerUserId: this.props.authUserId
    // //   }
    // // });
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.state.isLoading &&
      this.props.authUser &&
      this.props.friends &&
      this.props.usersPostsListsData &&
      this.props.usersPostsListsMeta &&
      this.props.usersPostsListsMeta[
        generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
      ].isLoaded
    ) {
      this.setState({ isLoading: false });
    }

    if (this.props.addsCount && !prevProps.addsCount) {
      this.props.updateUserAdds(this.props.authUserId, this.props.addsCount);
    }
    if (this.props.donesCount && !prevProps.donesCount) {
      this.props.updateUserDones(this.props.authUserId, this.props.donesCount);
    }
    if (this.props.likesCount && !prevProps.likesCount) {
      this.props.updateUserLikes(this.props.authUserId, this.props.likesCount);
    }
    if (this.props.sharesCount && !prevProps.sharesCount) {
      this.props.updateUserShares(
        this.props.authUserId,
        this.props.sharesCount
      );
    }
  }

  // componentDidUpdate(prevProps) {
  //   // console.log('NEW COMPONENT_DID_UPDATE:');

  //   // console.log(
  //   //   `DIFF ${JSON.stringify(
  //   //     getObjectDiff(
  //   //       _.get(this.props, 'authUser', {}),
  //   //       _.get(prevProps, 'authUser', {})
  //   //     ),
  //   //     undefined,
  //   //     2
  //   //   )}`
  //   // );

  //   // const now = Object.entries(this.props);
  //   // const added = now.filter(([key, val]) => {
  //   //   if (prevProps[key] === undefined) return true;
  //   //   if (prevProps[key] !== val) {
  //   //     console.log(`
  //   //     CHANGED
  //   //     ${key}
  //   //       DIFF ${JSON.stringify(
  //   //         getObjectDiff(val, prevProps[key]),
  //   //         undefined,
  //   //         2
  //   //       )}
  //   //       NEW ${JSON.stringify(val, undefined, 2)}
  //   //       OLD ${JSON.stringify(prevProps[key], undefined, 2)}`);
  //   //   }
  //   //   return false;
  //   // });
  //   // added.forEach(([key, val]) =>
  //   //   console.log(`
  //   //   ADDED
  //   //   ${key}
  //   //       ${JSON.stringify(val, undefined, 2)}`)
  //   // );
  //   console.log();
  // }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((unsubscribe) => {
      unsubscribe();
    });
  }

  paginateList = () => {
    if (!this.props.usersPostsListsMeta) {
      return;
    }
    return this.props.loadUsersPosts(
      this.props.authUserId,
      getQuery(queryTypes.USERS_POSTS_ALL)!(this.props.authUserId),
      queryTypes.USERS_POSTS_ALL,
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
      this.props.authUserId,
      getQuery(queryTypes.USERS_POSTS_ALL)!(this.props.authUserId),
      queryTypes.USERS_POSTS_ALL,
      true,
      this.props.usersPostsListsMeta[
        generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
      ].isLoading,
      this.props.usersPostsListsMeta[
        generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
      ].lastItem
    );
  };

  renderItem = ({ item }: { item: UsersPosts }) => {
    return (
      <SwipeCard
        noSwiping={this.state.isLoading}
        type={'add'}
        isLeftAlreadyDone={_.includes(item.adds || [], this.props.authUserId)}
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
          isLoading={this.state.isLoading}
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
    );
  };

  render() {
    // console.log(`Discover - Render Count: ${RENDER_COUNT}`);
    // RENDER_COUNT += 1;
    // console.log('this.props');
    // console.log(this.props);

    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={colors.YELLOW}
          statusBarStyle='dark-content'
          shadow
          title='Discover'
        />
        <List
          data={
            this.props.usersPostsListsData![
              generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
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
      </View>
    );
  }
}

// export default Discover;
export default connect<StateProps, DispatchProps, {}, {}, State>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  {
    areStatePropsEqual: (next: any, prev: any) => {
      return _.isEqual(next, prev);
    }
  }
)(Discover);
