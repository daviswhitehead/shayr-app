import { documentId, User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { DocumentSnapshot } from 'react-native-firebase/firestore';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import List from '../../components/List';
import PostCard from '../../components/PostCard';
import SegmentedControl from '../../components/SegmentedControl';
import UserProfile from '../../components/UserProfile';
import { queries, queryArguments, queryType } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { subscribeToFriendships } from '../../redux/friendships/actions';
import { getUser } from '../../redux/users/actions';
import {
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import { loadUsersPosts } from '../../redux/usersPosts/actions';
import {
  selectFlatListReadyUsersPostsFromList,
  selectUsersPostsMetadataFromList
} from '../../redux/usersPosts/selectors';
import Colors from '../../styles/Colors';
import styles from './styles';

interface NavigationParams {
  ownerUserId?: string;
}

type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

export interface Props {
  adds: Array<documentId>;
  authUser: User;
  authIsOwner: boolean;
  authFriends: any;
  authUserId: string;
  dones: Array<documentId>;
  likes: Array<documentId>;
  navigation: Navigation;
  ownerUser: User;
  ownerFriends: any;
  ownerUserId: string;
  shares: Array<documentId>;
  usersPostsViews: {
    [view: string]: string;
  };
  usersPostsData: {
    [view: string]: {
      data: any;
      [meta: string]: any;
    };
  };
  loadUsersPosts: (
    userId: string,
    requestType: RequestType,
    shouldRefresh: boolean,
    lastItem?: DocumentSnapshot | 'DONE',
    isLoading?: boolean
  ) => void;
}

export interface State {
  selectedIndex: number;
  activeView: RequestType;
}

const mapStateToProps = (state: any, props: any) => {
  const authUserId = selectAuthUserId(state);
  const ownerUserId =
    _.get(props, ['navigation', 'state', 'params', 'ownerUserId'], false) ||
    authUserId;

  const usersPostsViews = {
    [queries.USERS_POSTS_SHARES.type]: `${ownerUserId}_${
      queries.USERS_POSTS_SHARES.type
    }`,
    [queries.USERS_POSTS_ADDS.type]: `${ownerUserId}_${
      queries.USERS_POSTS_ADDS.type
    }`,
    [queries.USERS_POSTS_DONES.type]: `${ownerUserId}_${
      queries.USERS_POSTS_DONES.type
    }`,
    [queries.USERS_POSTS_LIKES.type]: `${ownerUserId}_${
      queries.USERS_POSTS_LIKES.type
    }`
  };

  const usersPostsData = {
    [usersPostsViews[queries.USERS_POSTS_SHARES.type]]: {
      data: selectFlatListReadyUsersPostsFromList(
        state,
        usersPostsViews[queries.USERS_POSTS_SHARES.type]
      ),
      ...selectUsersPostsMetadataFromList(
        state,
        usersPostsViews[queries.USERS_POSTS_SHARES.type]
      )
    },
    [usersPostsViews[queries.USERS_POSTS_ADDS.type]]: {
      data: selectFlatListReadyUsersPostsFromList(
        state,
        usersPostsViews[queries.USERS_POSTS_ADDS.type]
      ),
      ...selectUsersPostsMetadataFromList(
        state,
        usersPostsViews[queries.USERS_POSTS_ADDS.type]
      )
    },
    [usersPostsViews[queries.USERS_POSTS_DONES.type]]: {
      data: selectFlatListReadyUsersPostsFromList(
        state,
        usersPostsViews[queries.USERS_POSTS_DONES.type]
      ),
      ...selectUsersPostsMetadataFromList(
        state,
        usersPostsViews[queries.USERS_POSTS_DONES.type]
      )
    },
    [usersPostsViews[queries.USERS_POSTS_LIKES.type]]: {
      data: selectFlatListReadyUsersPostsFromList(
        state,
        usersPostsViews[queries.USERS_POSTS_LIKES.type]
      ),
      ...selectUsersPostsMetadataFromList(
        state,
        usersPostsViews[queries.USERS_POSTS_LIKES.type]
      )
    }
  };

  return {
    adds: state.adds,
    auth: state.auth,
    authIsOwner: authUserId === ownerUserId,
    authUser: selectUserFromId(state, authUserId),
    authUserId,
    authFriends: selectUsersFromList(state, `${authUserId}_Friends`),
    dones: state.dones,
    likes: state.likes,
    ownerUser: selectUserFromId(state, ownerUserId),
    ownerUserId,
    ownerFriends: selectUsersFromList(state, `${ownerUserId}_Friends`),
    shares: state.shares,
    usersPostsViews,
    usersPostsData,
    routing: state.routing,
    posts: state.posts
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getUser: userId => dispatch(getUser(userId)),
  subscribeToFriendships: userId => dispatch(subscribeToFriendships(userId)),
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
    )
});

class MyList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const startingIndex = this.props.authIsOwner ? 1 : 0;

    this.state = {
      selectedIndex: startingIndex,
      activeView: this.mapIndexToView(startingIndex)
    };
    this.subscriptions = [];
  }

  async componentDidMount() {
    this.props.ownerUser ? null : this.props.getUser(this.props.ownerUserId);

    _.isEmpty(this.props.ownerFriends)
      ? this.subscriptions.push(
          await this.props.subscribeToFriendships(this.props.ownerUserId)
        )
      : null;

    // if (shares, adds, dones, likes) list doesnt exist yet, load initial posts
    if (
      !this.props.usersPostsData[
        this.props.usersPostsViews[queries.USERS_POSTS_SHARES.type]
      ].isLoaded
    ) {
      await this.props.loadUsersPosts(
        this.props.ownerUserId,
        queries.USERS_POSTS_SHARES.type,
        { userId: this.props.ownerUserId },
        true,
        this.props.usersPostsData[
          this.props.usersPostsViews[queries.USERS_POSTS_SHARES.type]
        ].isLoading,
        this.props.usersPostsData[
          this.props.usersPostsViews[queries.USERS_POSTS_SHARES.type]
        ].lastItem
      );
    }

    if (
      !this.props.usersPostsData[
        this.props.usersPostsViews[queries.USERS_POSTS_ADDS.type]
      ].isLoaded
    ) {
      await this.props.loadUsersPosts(
        this.props.ownerUserId,
        queries.USERS_POSTS_ADDS.type,
        { userId: this.props.ownerUserId },
        true,
        this.props.usersPostsData[
          this.props.usersPostsViews[queries.USERS_POSTS_ADDS.type]
        ].isLoading,
        this.props.usersPostsData[
          this.props.usersPostsViews[queries.USERS_POSTS_ADDS.type]
        ].lastItem
      );
    }
    if (
      !this.props.usersPostsData[
        this.props.usersPostsViews[queries.USERS_POSTS_DONES.type]
      ].isLoaded
    ) {
      await this.props.loadUsersPosts(
        this.props.ownerUserId,
        queries.USERS_POSTS_DONES.type,
        { userId: this.props.ownerUserId },
        true,
        this.props.usersPostsData[
          this.props.usersPostsViews[queries.USERS_POSTS_DONES.type]
        ].isLoading,
        this.props.usersPostsData[
          this.props.usersPostsViews[queries.USERS_POSTS_DONES.type]
        ].lastItem
      );
    }
    if (
      !this.props.usersPostsData[
        this.props.usersPostsViews[queries.USERS_POSTS_LIKES.type]
      ].isLoaded
    ) {
      await this.props.loadUsersPosts(
        this.props.ownerUserId,
        queries.USERS_POSTS_LIKES.type,
        { userId: this.props.ownerUserId },
        true,
        this.props.usersPostsData[
          this.props.usersPostsViews[queries.USERS_POSTS_LIKES.type]
        ].isLoading,
        this.props.usersPostsData[
          this.props.usersPostsViews[queries.USERS_POSTS_LIKES.type]
        ].lastItem
      );
    }
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach(unsubscribe => {
      unsubscribe();
    });
  }

  mapIndexToView = (index: number) => {
    const map: {
      [number: string]: RequestType;
    } = {
      0: queries.USERS_POSTS_SHARES.type,
      1: queries.USERS_POSTS_ADDS.type,
      2: queries.USERS_POSTS_DONES.type,
      3: queries.USERS_POSTS_LIKES.type
    };
    return map[index];
  };

  addUserIdToView = (view: string) => {
    return `${this.props.ownerUserId}_${view}`;
  };

  render() {
    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={Colors.YELLOW}
          statusBarStyle='dark-content'
          shadow
          title={this.props.authIsOwner ? 'My List' : 'Their List'}
          back={
            this.props.navigation.state.key.slice(0, 3) === 'id-'
              ? null
              : () => this.props.navigation.goBack()
          }
        />
        <UserProfile
          facebookProfilePhoto={_.get(
            this.props,
            ['ownerUser', 'facebookProfilePhoto'],
            null
          )}
          firstName={_.get(this.props, ['ownerUser', 'firstName'], null)}
          lastName={_.get(this.props, ['ownerUser', 'lastName'], null)}
        />
        <SegmentedControl
          startingIndex={this.state.selectedIndex}
          onIndexChange={index =>
            this.setState(previousState => ({
              ...previousState,
              selectedIndex: index,
              activeView: this.mapIndexToView(index)
            }))
          }
          sharesCount={this.props.shares.length}
          addsCount={this.props.adds.length}
          donesCount={this.props.dones.length}
          likesCount={this.props.likes.length}
        />
        {this.props.usersPostsData[this.addUserIdToView(this.state.activeView)]
          .isLoaded &&
        this.props.ownerFriends &&
        this.props.authUser ? (
          <List
            data={
              this.props.usersPostsData[
                this.addUserIdToView(this.state.activeView)
              ].data
            }
            renderItem={(item: any) => (
              <PostCard
                key={item._id}
                post={item}
                ownerUserId={this.props.ownerUserId}
                users={{
                  [this.props.authUserId]: this.props.authUser,
                  [this.props.ownerUserId]: this.props.ownerUser,
                  ...this.props.authFriends,
                  ...this.props.ownerFriends
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
                this.props.ownerUserId,
                this.state.activeView,
                { userId: this.props.ownerUserId },
                false,
                this.props.usersPostsData[
                  this.addUserIdToView(this.state.activeView)
                ].isLoading,
                this.props.usersPostsData[
                  this.addUserIdToView(this.state.activeView)
                ].lastItem
              )
            }
            onRefresh={() =>
              this.props.loadUsersPosts(
                this.props.ownerUserId,
                this.state.activeView,
                { userId: this.props.ownerUserId },
                true,
                this.props.usersPostsData[
                  this.addUserIdToView(this.state.activeView)
                ].isLoading,
                this.props.usersPostsData[
                  this.addUserIdToView(this.state.activeView)
                ].lastItem
              )
            }
            refreshing={
              this.props.usersPostsData[
                this.addUserIdToView(this.state.activeView)
              ].isRefreshing
            }
            isLoading={
              this.props.usersPostsData[
                this.addUserIdToView(this.state.activeView)
              ].isLoading
            }
            isLoadedAll={
              this.props.usersPostsData[
                this.addUserIdToView(this.state.activeView)
              ].isLoadedAll
            }
          />
        ) : (
          <View style={styles.container}>
            <ActivityIndicator size='large' color={Colors.BLACK} />
          </View>
        )}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyList);
