import { documentIds, User, UsersPosts } from '@daviswhitehead/shayr-resources';
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
import EmptyMyAdds from '../../components/EmptyMyAdds';
import EmptyMyComments from '../../components/EmptyMyComments';
import EmptyMyDones from '../../components/EmptyMyDones';
import EmptyMyShayrs from '../../components/EmptyMyShayrs';
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
import { sendFeedbackEmail } from '../../lib/SharingHelpers';
import { startSignOut } from '../../redux/auth/actions';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { selectFlatListReadyDocuments } from '../../redux/documents/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { selectListItems, selectListMeta } from '../../redux/lists/selectors';
import { selectListNeedsOnboarding } from '../../redux/onboarding/selectors';
import { subscribeToFriends, subscribeToUser } from '../../redux/users/actions';
import {
  selectUserActionCount,
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
  SHAYR_ONBOARDING_POST_ID: string;
  usersPostsListsData?: {
    [listKey: string]: Array<UsersPosts>;
  };
  usersPostsListsMeta?: {
    [listKey: string]: any; // TODO: meta type
  };
  usersPostsListsNeedsOnboarding?: {
    [listKey: string]: boolean;
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
  subscribeToUser: typeof subscribeToUser;
  subscribeToFriends: typeof subscribeToFriends;
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

  const authFriends = selectUsersFromList(
    state,
    generateListKey(authUserId, queryTypes.USER_FRIENDS),
    'presentation'
  );

  const SHAYR_ONBOARDING_POST_ID = state.onboarding.SHAYR_ONBOARDING_POST_ID;

  return {
    authIsOwner: authUserId === ownerUserId,
    authUser: selectUserFromId(state, authUserId, 'presentation'),
    authUserId,
    authFriends,
    ownerAddsCount: selectUserActionCount(
      state,
      ownerUserId,
      'profile',
      'addsCount'
    ),
    ownerDonesCount: selectUserActionCount(
      state,
      ownerUserId,
      'profile',
      'donesCount'
    ),
    ownerFriends: selectUsersFromList(
      state,
      generateListKey(ownerUserId, queryTypes.USER_FRIENDS),
      'presentation'
    ),
    ownerCommentsCount: selectUserActionCount(
      state,
      ownerUserId,
      'profile',
      'commentsCount'
    ),
    ownerSharesCount: selectUserActionCount(
      state,
      ownerUserId,
      'profile',
      'sharesCount'
    ),
    ownerUser: selectUserFromId(state, ownerUserId, 'profile'),
    ownerUserId,
    SHAYR_ONBOARDING_POST_ID,
    usersPostsListsNeedsOnboarding: {
      [usersPostsListsViews.adds]: selectListNeedsOnboarding(
        state,
        'usersPostsLists',
        usersPostsListsViews.adds,
        SHAYR_ONBOARDING_POST_ID
      ),
      [usersPostsListsViews.dones]: selectListNeedsOnboarding(
        state,
        'usersPostsLists',
        usersPostsListsViews.dones,
        SHAYR_ONBOARDING_POST_ID
      ),
      [usersPostsListsViews.comments]: selectListNeedsOnboarding(
        state,
        'usersPostsLists',
        usersPostsListsViews.comments,
        SHAYR_ONBOARDING_POST_ID
      ),
      [usersPostsListsViews.shares]: selectListNeedsOnboarding(
        state,
        'usersPostsLists',
        usersPostsListsViews.shares,
        SHAYR_ONBOARDING_POST_ID
      )
    },
    usersPostsListsData: {
      [usersPostsListsViews.adds]: selectFlatListReadyDocuments(
        state,
        'usersPosts',
        selectListItems(state, 'usersPostsLists', usersPostsListsViews.adds),
        usersPostsListsViews.adds,
        { sortKeys: ['updatedAt'], sortDirection: ['desc'] }
      ),
      [usersPostsListsViews.dones]: selectFlatListReadyDocuments(
        state,
        'usersPosts',
        selectListItems(state, 'usersPostsLists', usersPostsListsViews.dones),
        usersPostsListsViews.dones,
        { sortKeys: ['updatedAt'], sortDirection: ['desc'] }
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
        { sortKeys: ['updatedAt'], sortDirection: ['desc'] }
      ),
      [usersPostsListsViews.shares]: selectFlatListReadyDocuments(
        state,
        'usersPosts',
        selectListItems(state, 'usersPostsLists', usersPostsListsViews.shares),
        usersPostsListsViews.shares,
        { sortKeys: ['updatedAt'], sortDirection: ['desc'] }
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
  subscribeToUser,
  subscribeToFriends,
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
    _.isUndefined(this.props.ownerUser) &&
      this.subscriptions.push(
        this.props.subscribeToUser(this.props.ownerUserId)
      );

    // get owner friends if not already loaded
    _.isUndefined(this.props.ownerFriends) &&
      this.subscriptions.push(
        this.props.subscribeToFriends(this.props.ownerUserId)
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

  mapIndexToFooter = (index: number) => {
    const map = [EmptyMyShayrs, EmptyMyAdds, EmptyMyDones, EmptyMyComments];
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

    const onboardingListProps =
      this.props.usersPostsListsNeedsOnboarding[this.state.activeView] &&
      this.props.authIsOwner
        ? {
            ListFooterComponent: this.mapIndexToFooter(this.state.selectedIndex)
          }
        : {};

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
          leftIcons={
            this.props.navigation.state.key.slice(0, 3) === 'id-' ? (
              <Icon name={names.FEEDBACK} onPress={sendFeedbackEmail} />
            ) : (
              undefined
            )
          }
          rightIcons={
            this.props.authIsOwner ? (
              <Icon
                name={names.SETTINGS}
                onPress={() =>
                  Alert.alert(
                    'Log Out',
                    'Would you like to log out of Shayr?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel'
                      },
                      { text: 'Yes', onPress: this.props.startSignOut }
                    ]
                  )
                }
              />
            ) : (
              undefined
            )
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
          friendsCount={_.get(this.props, ['ownerUser', 'friendsCount'], 0)}
          authIsOwner={this.props.authIsOwner}
          ownerUserId={this.props.ownerUserId}
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
          {...onboardingListProps}
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
