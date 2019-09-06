import { User, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { Alert, View } from 'react-native';
import { Query } from 'react-native-firebase/database';
import {
  NavigationScreenProp,
  NavigationScreenProps,
  NavigationState
} from 'react-navigation';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import Icon, { names } from '../../components/Icon';
import List from '../../components/List';
import PostCard from '../../components/PostCard';
import SegmentedControl from '../../components/SegmentedControl';
import SwipeCard from '../../components/SwipeCard';
import UserProfile from '../../components/UserProfile';
import withAdds from '../../higherOrderComponents/withAdds';
import withComments from '../../higherOrderComponents/withComments';
import withDones from '../../higherOrderComponents/withDones';
import withShares from '../../higherOrderComponents/withShares';
import { getQuery, queryTypes } from '../../lib/FirebaseQueries';
import { startSignOut } from '../../redux/auth/actions';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { selectFlatListReadyDocuments } from '../../redux/documents/selectors';
import { subscribeToFriendships } from '../../redux/friendships/actions';
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
  authIsOwner?: boolean;
  authUser?: User;
  authUserId: string;
  authFriends?: Array<User>;
  ownerAddsCount?: number;
  ownerCommentsCount?: number;
  ownerDonesCount?: number;
  ownerFriends?: Array<User>;
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
    comments: string;
    shares: string;
  };
}

interface DispatchProps {
  getUser: typeof getUser;
  subscribeToFriendships: typeof subscribeToFriendships;
  loadUsersPosts: typeof loadUsersPosts;
  startSignOut: typeof startSignOut;
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
    comments: generateListKey(ownerUserId, queryTypes.USERS_POSTS_COMMENTS),
    shares: generateListKey(ownerUserId, queryTypes.USERS_POSTS_SHARES)
  };

  return {
    authIsOwner: authUserId === ownerUserId,
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
    ownerCommentsCount: selectUserActionCounts(
      state,
      ownerUserId,
      false,
      'commentsCount'
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
      [usersPostsListsViews.comments]: selectFlatListReadyDocuments(
        state,
        'usersPosts',
        selectListItems(
          state,
          'usersPostsLists',
          usersPostsListsViews.comments
        ),
        usersPostsListsViews.comments,
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
      [usersPostsListsViews.comments]: selectListMeta(
        state,
        'usersPostsLists',
        usersPostsListsViews.comments
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
      [usersPostsListsViews.comments]: getQuery(
        queryTypes.USERS_POSTS_COMMENTS
      )(ownerUserId),
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
  startSignOut
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
    // if (adds, shares, dones, comments) list doesnt exist yet, load initial posts
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
          this.props.usersPostsListsViews.comments,
          'isLoaded'
        ],
        undefined
      )
    ) {
      this.props.loadUsersPosts(
        this.props.usersPostsListsViews.comments,
        this.props.usersPostsListsQueries[
          this.props.usersPostsListsViews.comments
        ]
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
      typeof this.props.ownerCommentsCount === 'number' &&
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
      this.props.usersPostsListsViews.comments
    ];
    return map[index];
  };

  mapViewToAction = (view: string) => {
    return _.invert(this.props.usersPostsListsViews)[view];
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
    const action = this.mapViewToAction(this.state.activeView);
    const actionTypeMap = {
      adds: 'dones',
      comments: 'comments',
      dones: 'adds',
      shares: 'shares'
    };
    const leftAction = {
      adds: withDones,
      comments: withComments,
      dones: withAdds,
      shares: withShares
    };
    const rightAction = {
      adds: withAdds,
      comments: undefined,
      dones: withDones,
      shares: undefined
    };
    const actionProps = {
      // add/done props
      ownerUserId: item.userId,
      postId: item.postId,
      usersPostsAdds: item.adds,
      usersPostsDones: item.dones,
      // comment props
      usersPostsComments: item.comments,
      // share props
      usersPostsId: item._id,
      usersPostsShares: item.shares,
      url: item.url
    };

    return (
      <SwipeCard
        key={`${item._id}-${action}`}
        type={actionTypeMap[action]}
        noSwiping={
          !this.state.isUsersPostsListsLoaded[this.state.activeView] ||
          !this.props.authIsOwner
        }
        leftAction={leftAction[action]}
        leftActionProps={{ side: 'left', ...actionProps }}
        rightAction={rightAction[action]}
        rightActionProps={{ side: 'right', ...actionProps }}
      >
        {this.renderPostCard(item)}
      </SwipeCard>
    );
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
          back={
            this.props.navigation.state.key.slice(0, 3) === 'id-'
              ? undefined
              : () => this.props.navigation.goBack(null)
          }
          rightIcons={
            <Icon
              name={names.SETTINGS}
              onPress={() =>
                Alert.alert('Log Out', 'Would you like to log out of Shayr?', [
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  },
                  { text: 'Yes', onPress: this.props.startSignOut }
                ])
              }
            />
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
          commentsCount={this.props.ownerCommentsCount}
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
