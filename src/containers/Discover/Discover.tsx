import { Post, User, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
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

let RENDER_COUNT = 0;

export const getObjectDiff = (obj1: any, obj2: any) => {
  const diff = Object.keys(obj1).reduce((result, key) => {
    if (!obj2.hasOwnProperty(key)) {
      result.push(key);
    } else if (_.isEqual(obj1[key], obj2[key])) {
      const resultKeyIndex = result.indexOf(key);
      result.splice(resultKeyIndex, 1);
    }
    return result;
  }, Object.keys(obj2));

  return diff;
};

interface StateProps {
  addsCount: number;
  authUser: User;
  authUserId: string;
  donesCount: number;
  friends: Array<User>;
  likesCount: number;
  routing: any; // routing state
  sharesCount: number;
  usersPostsListsMeta: {
    [listKey: string]: any; // listKey and meta state
  };
  usersPostsListsData: {
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
  toggleAddDonePost: typeof subscribeNotificationTokenRefresh;
}

interface OwnProps {}

interface NavigationParams {}

type Props = OwnProps &
  StateProps &
  DispatchProps &
  NavigationScreenProps<NavigationParams>;

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);

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

class Discover extends PureComponent<Props> {
  static whyDidYouRender = true;

  subscriptions: Array<any>;
  // subscriptions: Array<() => void>;
  // subscriptions: Array<typeof subscribeToUser>;
  // subscriptions: Array<Partial<DispatchProps>>;
  constructor(props: Props) {
    super(props);
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

  componentDidUpdate(prevProps) {
    if (this.props.addsCount >= 0 && !prevProps.addsCount) {
      this.props.updateUserAdds(this.props.authUserId, this.props.addsCount);
    }
    if (this.props.donesCount >= 0 && !prevProps.donesCount) {
      this.props.updateUserDones(this.props.authUserId, this.props.donesCount);
    }
    if (this.props.likesCount >= 0 && !prevProps.likesCount) {
      this.props.updateUserLikes(this.props.authUserId, this.props.likesCount);
    }
    if (this.props.sharesCount >= 0 && !prevProps.sharesCount) {
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

  loading = () => {
    if (
      !this.props.authUser ||
      !this.props.friends ||
      !this.props.usersPostsListsMeta ||
      !this.props.usersPostsListsMeta[
        generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
      ].isLoaded
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
          this.props.usersPostsListsData[
            generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
          ]
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
            getQuery(queryTypes.USERS_POSTS_ALL)(this.props.authUserId),
            queryTypes.USERS_POSTS_ALL,
            false,
            this.props.usersPostsListsMeta[
              generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
            ].isLoading,
            this.props.usersPostsListsMeta[
              generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
            ].lastItem
          )
        }
        onRefresh={() =>
          this.props.loadUsersPosts(
            this.props.authUserId,
            getQuery(queryTypes.USERS_POSTS_ALL)(this.props.authUserId),
            queryTypes.USERS_POSTS_ALL,
            true,
            this.props.usersPostsListsMeta[
              generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
            ].isLoading,
            this.props.usersPostsListsMeta[
              generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
            ].lastItem
          )
        }
        refreshing={
          this.props.usersPostsListsMeta[
            generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
          ].isRefreshing
        }
        isLoading={
          this.props.usersPostsListsMeta[
            generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
          ].isLoading
        }
        isLoadedAll={
          this.props.usersPostsListsMeta[
            generateListKey(this.props.authUserId, queryTypes.USERS_POSTS_ALL)
          ].isLoadedAll
        }
      />
    );
  };

  render() {
    console.log(`Discover - Render Count: ${RENDER_COUNT}`);
    RENDER_COUNT += 1;
    console.log('this.props');
    console.log(this.props);

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

// export default Discover;
export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  {
    areStatePropsEqual: (next: any, prev: any) => {
      return _.isEqual(next, prev);
    }
  }
)(Discover);
