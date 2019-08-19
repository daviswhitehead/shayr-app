import { User, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Query } from 'react-native-firebase/database';
import {
  NavigationScreenProp,
  NavigationScreenProps,
  NavigationState
} from 'react-navigation';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import List from '../../components/List';
import PostCard from '../../components/PostCard';
import SegmentedControl from '../../components/SegmentedControl';
import SwipeCard from '../../components/SwipeCard';
import UserProfile from '../../components/UserProfile';
import { getQuery, queryTypes } from '../../lib/FirebaseQueries';
import { toggleAddDonePost as toggleAdds } from '../../redux/adds/actions';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { selectFlatListReadyDocuments } from '../../redux/documents/selectors';
import { toggleAddDonePost as toggleDones } from '../../redux/dones/actions';
import { subscribeToFriendships } from '../../redux/friendships/actions';
import { toggleLikePost } from '../../redux/likes/actions';
import { generateListKey } from '../../redux/lists/helpers';
import { selectListItems, selectListMeta } from '../../redux/lists/selectors';
import { getUser } from '../../redux/users/actions';
import {
  selectUserActionCounts,
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import { loadUsersPosts } from '../../redux/usersPosts/actions';
import Colors from '../../styles/Colors';
import styles from './styles';

interface StateProps {
  authAdds: Array<string>;
  authDones: Array<string>;
  authIsOwner?: boolean;
  authLikes: Array<string>;
  authShares: Array<string>;
  authUser?: User;
  authUserId: string;
  authFriends?: Array<User>;
  ownerAddsCount?: number;
  ownerDonesCount?: number;
  ownerFriends?: Array<User>;
  ownerLikesCount?: number;
  ownerSharesCount?: number;
  ownerUser?: User;
  ownerUserId: string;
  usersPostsListsData?: {
    [listKey: string]: Array<UsersPosts>;
  };
  usersPostsListsMeta?: {
    [listKey: string]: any; // TODO: meta type
  };
  usersPostsListsQueries: {
    [listKey: string]: Query;
  };
  usersPostsListsViews: {
    adds: string;
    dones: string;
    likes: string;
    shares: string;
  };
}

interface DispatchProps {
  getUser: typeof getUser;
  subscribeToFriendships: typeof subscribeToFriendships;
  loadUsersPosts: typeof loadUsersPosts;
  toggleAdds: typeof toggleAdds;
  toggleDones: typeof toggleDones;
  toggleLikePost: typeof toggleLikePost;
}

interface NavigationParams {
  ownerUserId?: string;
}

type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface OwnProps {
  navigation: Navigation;
}

interface OwnState {
  isProfileLoading: boolean;
  isSegmentedControlLoading: boolean;
  selectedIndex: number;
  activeView: string;
  isUsersPostsListsLoaded: {
    [listKey: string]: boolean;
  };
}

interface NavigationParams {}

type Props = OwnProps &
  StateProps &
  DispatchProps &
  NavigationScreenProps<NavigationParams>;

const mapStateToProps = (state: any, props: any) => {
  const authUserId = selectAuthUserId(state);
  const ownerUserId =
    _.get(props, ['navigation', 'state', 'params', 'ownerUserId'], undefined) ||
    authUserId;

  const usersPostsListsViews = {
    adds: generateListKey(ownerUserId, queryTypes.USERS_POSTS_ADDS),
    dones: generateListKey(ownerUserId, queryTypes.USERS_POSTS_DONES),
    likes: generateListKey(ownerUserId, queryTypes.USERS_POSTS_LIKES),
    shares: generateListKey(ownerUserId, queryTypes.USERS_POSTS_SHARES)
  };

  return {
    authAdds: selectListItems(
      state,
      'addsLists',
      generateListKey(authUserId, queryTypes.USER_ADDS)
    ),
    authDones: selectListItems(
      state,
      'donesLists',
      generateListKey(authUserId, queryTypes.USER_DONES)
    ),
    authIsOwner: authUserId === ownerUserId,
    authLikes: selectListItems(
      state,
      'likesLists',
      generateListKey(authUserId, queryTypes.USER_LIKES)
    ),
    authShares: selectListItems(
      state,
      'sharesLists',
      generateListKey(authUserId, queryTypes.USER_SHARES)
    ),
    authUser: selectUserFromId(state, authUserId, true),
    authUserId,
    authFriends: selectUsersFromList(state, `${authUserId}_Friends`, true),
    ownerAddsCount: selectUserActionCounts(
      state,
      ownerUserId,
      false,
      'addsCount'
    ),
    ownerDonesCount: selectUserActionCounts(
      state,
      ownerUserId,
      false,
      'donesCount'
    ),
    ownerFriends: selectUsersFromList(state, `${ownerUserId}_Friends`, true),
    ownerLikesCount: selectUserActionCounts(
      state,
      ownerUserId,
      false,
      'likesCount'
    ),
    ownerSharesCount: selectUserActionCounts(
      state,
      ownerUserId,
      false,
      'sharesCount'
    ),
    ownerUser: selectUserFromId(state, ownerUserId, true),
    ownerUserId,
    usersPostsListsData: {
      [usersPostsListsViews.adds]: selectFlatListReadyDocuments(
        state,
        'usersPosts',
        selectListItems(state, 'usersPostsLists', usersPostsListsViews.adds),
        usersPostsListsViews.adds,
        'updatedAt'
      ),
      [usersPostsListsViews.dones]: selectFlatListReadyDocuments(
        state,
        'usersPosts',
        selectListItems(state, 'usersPostsLists', usersPostsListsViews.dones),
        usersPostsListsViews.dones,
        'updatedAt'
      ),
      [usersPostsListsViews.likes]: selectFlatListReadyDocuments(
        state,
        'usersPosts',
        selectListItems(state, 'usersPostsLists', usersPostsListsViews.likes),
        usersPostsListsViews.likes,
        'updatedAt'
      ),
      [usersPostsListsViews.shares]: selectFlatListReadyDocuments(
        state,
        'usersPosts',
        selectListItems(state, 'usersPostsLists', usersPostsListsViews.shares),
        usersPostsListsViews.shares,
        'updatedAt'
      )
    },
    usersPostsListsMeta: {
      [usersPostsListsViews.adds]: selectListMeta(
        state,
        'usersPostsLists',
        usersPostsListsViews.adds
      ),
      [usersPostsListsViews.dones]: selectListMeta(
        state,
        'usersPostsLists',
        usersPostsListsViews.dones
      ),
      [usersPostsListsViews.likes]: selectListMeta(
        state,
        'usersPostsLists',
        usersPostsListsViews.likes
      ),
      [usersPostsListsViews.shares]: selectListMeta(
        state,
        'usersPostsLists',
        usersPostsListsViews.shares
      )
    },
    usersPostsListsQueries: {
      [usersPostsListsViews.adds]: getQuery(queryTypes.USERS_POSTS_ADDS)(
        ownerUserId
      ),
      [usersPostsListsViews.dones]: getQuery(queryTypes.USERS_POSTS_DONES)(
        ownerUserId
      ),
      [usersPostsListsViews.likes]: getQuery(queryTypes.USERS_POSTS_LIKES)(
        ownerUserId
      ),
      [usersPostsListsViews.shares]: getQuery(queryTypes.USERS_POSTS_SHARES)(
        ownerUserId
      )!
    },
    usersPostsListsViews
  };
};

const mapDispatchToProps = {
  getUser,
  subscribeToFriendships,
  loadUsersPosts,
  toggleAdds,
  toggleDones,
  toggleLikePost
};

class MyList extends Component<Props, OwnState> {
  static whyDidYouRender = true;

  subscriptions: Array<any>;
  constructor(props: Props) {
    super(props);
    const startingIndex = this.props.authIsOwner ? 1 : 0;

    this.state = {
      isProfileLoading: true,
      isSegmentedControlLoading: true,
      isUsersPostsListsLoaded: {},
      selectedIndex: startingIndex,
      activeView: this.mapIndexToView(startingIndex)
    };
    this.subscriptions = [];
  }

  componentDidMount() {
    // check loading status
    this.checkProfileLoading();
    this.checkSegmentedControlLoading();
    this.checkUsersPostsListsLoaded();

    // get owner user if not already loaded
    !this.props.ownerUser && this.props.getUser(this.props.ownerUserId);

    // get owner friends if not already loaded
    _.isEmpty(this.props.ownerFriends) &&
      this.subscriptions.push(
        this.props.subscribeToFriendships(this.props.ownerUserId)
      );

    // SOMEDAY: load list data in the right order and/or in advance
    // if (adds, shares, dones, likes) list doesnt exist yet, load initial posts
    if (
      !_.get(
        this.props,
        [
          'usersPostsListsMeta',
          this.props.usersPostsListsViews.adds,
          'isLoaded'
        ],
        undefined
      )
    ) {
      this.props.loadUsersPosts(
        this.props.usersPostsListsViews.adds,
        this.props.usersPostsListsQueries[this.props.usersPostsListsViews.adds]
      );
    }
    if (
      !_.get(
        this.props,
        [
          'usersPostsListsMeta',
          this.props.usersPostsListsViews.shares,
          'isLoaded'
        ],
        undefined
      )
    ) {
      this.props.loadUsersPosts(
        this.props.usersPostsListsViews.shares,
        this.props.usersPostsListsQueries[
          this.props.usersPostsListsViews.shares
        ]
      );
    }
    if (
      !_.get(
        this.props,
        [
          'usersPostsListsMeta',
          this.props.usersPostsListsViews.dones,
          'isLoaded'
        ],
        undefined
      )
    ) {
      this.props.loadUsersPosts(
        this.props.usersPostsListsViews.dones,
        this.props.usersPostsListsQueries[this.props.usersPostsListsViews.dones]
      );
    }
    if (
      !_.get(
        this.props,
        [
          'usersPostsListsMeta',
          this.props.usersPostsListsViews.likes,
          'isLoaded'
        ],
        undefined
      )
    ) {
      this.props.loadUsersPosts(
        this.props.usersPostsListsViews.likes,
        this.props.usersPostsListsQueries[this.props.usersPostsListsViews.likes]
      );
    }
  }

  componentDidUpdate(prevProps: Props) {
    // check loading status
    this.checkProfileLoading();
    this.checkSegmentedControlLoading();
    this.checkUsersPostsListsLoaded();
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((unsubscribe) => {
      unsubscribe();
    });
  }

  checkProfileLoading = () => {
    if (this.state.isProfileLoading && this.props.ownerUser) {
      this.setState({ isProfileLoading: false });
    }
  };

  checkSegmentedControlLoading = () => {
    if (
      this.state.isSegmentedControlLoading &&
      typeof this.props.ownerAddsCount === 'number' &&
      typeof this.props.ownerDonesCount === 'number' &&
      typeof this.props.ownerLikesCount === 'number' &&
      typeof this.props.ownerSharesCount === 'number'
    ) {
      this.setState({ isSegmentedControlLoading: false });
    }
  };

  checkUsersPostsListsLoaded = () => {
    if (
      !this.state.isUsersPostsListsLoaded[this.state.activeView] &&
      this.props.authUser &&
      this.props.ownerUser &&
      this.props.authFriends &&
      this.props.ownerFriends &&
      _.get(
        this.props,
        ['usersPostsListsMeta', this.state.activeView, 'isLoaded'],
        undefined
      )
    ) {
      this.setState((previousState) => ({
        ...previousState,
        isUsersPostsListsLoaded: {
          ...previousState.isUsersPostsListsLoaded,
          [this.state.activeView]: true
        }
      }));
    }
  };

  mapIndexToView = (index: number) => {
    const map = [
      this.props.usersPostsListsViews.shares,
      this.props.usersPostsListsViews.adds,
      this.props.usersPostsListsViews.dones,
      this.props.usersPostsListsViews.likes
    ];
    return map[index];
  };

  onSegmentedControlChange = (index: number) => {
    this.setState((previousState) => ({
      ...previousState,
      selectedIndex: index,
      activeView: this.mapIndexToView(index)
    }));
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

  renderPostCard = (item: UsersPosts) => {
    return (
      <PostCard
        key={item._id}
        isLoading={!this.state.isUsersPostsListsLoaded[this.state.activeView]}
        post={item}
        onPressParameters={{
          ownerUserId: item.userId,
          postId: item.postId
        }}
        onPress={this.onItemPress}
        users={{
          [this.props.authUserId]: this.props.authUser,
          [this.props.ownerUserId]: this.props.ownerUser,
          ...this.props.authFriends,
          ...this.props.ownerFriends
        }}
      />
    );
  };

  renderItem = ({ item }: { item: UsersPosts }) => {
    const addSwiping = _.includes(
      [
        this.props.usersPostsListsViews.adds,
        this.props.usersPostsListsViews.dones
      ],
      this.state.activeView
    );
    const isDonesView =
      this.state.activeView === this.props.usersPostsListsViews.dones;
    const isAddActive = _.includes(this.props.authAdds, item._id);
    const isDoneActive = _.includes(this.props.authDones, item._id);
    const isLikeActive = _.includes(this.props.authLikes, item._id);

    if (addSwiping) {
      return (
        <SwipeCard
          type={isDonesView ? 'like' : 'done'}
          isLeftAlreadyDone={isDonesView ? isLikeActive : isDoneActive}
          leftAction={
            isDonesView
              ? () =>
                  this.props.toggleLikePost(
                    false,
                    item.postId,
                    item.userId,
                    this.props.authUserId
                  )
              : () =>
                  this.props.toggleDones(
                    'dones',
                    false,
                    item.postId,
                    item.userId,
                    this.props.authUserId,
                    isAddActive
                  )
          }
          isRightAlreadyDone={isDonesView ? !isDoneActive : !isAddActive}
          rightAction={
            isDonesView
              ? () =>
                  this.props.toggleDones(
                    'dones',
                    true,
                    item.postId,
                    item.userId,
                    this.props.authUserId,
                    isAddActive
                  )
              : () =>
                  this.props.toggleAdds(
                    'adds',
                    true,
                    item.postId,
                    item.userId,
                    this.props.authUserId,
                    isDoneActive
                  )
          }
        >
          {this.renderPostCard(item, true)}
        </SwipeCard>
      );
    }
    return this.renderPostCard(item, true);
  };

  paginateList = () => {
    if (!this.props.usersPostsListsMeta[this.state.activeView]) {
      return;
    }
    return this.props.loadUsersPosts(
      this.state.activeView,
      this.props.usersPostsListsQueries[this.state.activeView],
      false,
      this.props.usersPostsListsMeta[this.state.activeView].isLoading,
      this.props.usersPostsListsMeta[this.state.activeView].lastItem
    );
  };

  refreshList = () => {
    if (!this.props.usersPostsListsMeta[this.state.activeView]) {
      return;
    }
    return this.props.loadUsersPosts(
      this.state.activeView,
      this.props.usersPostsListsQueries[this.state.activeView],
      true,
      this.props.usersPostsListsMeta[this.state.activeView].isLoading,
      this.props.usersPostsListsMeta[this.state.activeView].lastItem
    );
  };

  render() {
    const isListLoading = !this.state.isUsersPostsListsLoaded[
      this.state.activeView
    ];

    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={Colors.YELLOW}
          statusBarStyle='dark-content'
          shadow
          title={this.props.authIsOwner ? 'My List' : 'Their List'}
          // TODO: troubleshoot this
          back={
            this.props.navigation.state.key.slice(0, 3) === 'id-'
              ? undefined
              : () => this.props.navigation.goBack(null)
          }
        />
        <UserProfile
          isLoading={this.state.isProfileLoading}
          facebookProfilePhoto={_.get(
            this.props,
            ['ownerUser', 'facebookProfilePhoto'],
            null
          )}
          firstName={_.get(this.props, ['ownerUser', 'firstName'], null)}
          lastName={_.get(this.props, ['ownerUser', 'lastName'], null)}
        />
        <SegmentedControl
          isLoading={this.state.isSegmentedControlLoading}
          startingIndex={this.state.selectedIndex}
          onIndexChange={this.onSegmentedControlChange}
          sharesCount={this.props.ownerSharesCount}
          addsCount={this.props.ownerAddsCount}
          donesCount={this.props.ownerDonesCount}
          likesCount={this.props.ownerLikesCount}
        />
        <List
          data={this.props.usersPostsListsData[this.state.activeView]}
          renderItem={this.renderItem}
          onEndReached={this.paginateList}
          onRefresh={this.refreshList}
          isLoading={isListLoading}
          isRefreshing={
            isListLoading
              ? undefined
              : this.props.usersPostsListsMeta[this.state.activeView]
                  .isRefreshing
          }
          isPaginating={
            isListLoading
              ? undefined
              : this.props.usersPostsListsMeta[this.state.activeView].isLoading
          }
          isLoadedAll={
            isListLoading
              ? undefined
              : this.props.usersPostsListsMeta[this.state.activeView]
                  .isLoadedAll
          }
        />
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
)(MyList);
