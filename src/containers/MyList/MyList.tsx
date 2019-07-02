import { UsersPostsType, UserType } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { DocumentSnapshot } from 'react-native-firebase/firestore';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import List from '../../components/List';
import PostCard from '../../components/PostCard';
import SegmentedControl from '../../components/SegmentedControl';
import UserProfile from '../../components/UserProfile';
import { RequestType } from '../../lib/FirebaseRequests';
import { selectAuthUserId } from '../../redux/auth/selectors';
// import { postAction } from '../../redux/postActions/actions';
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

interface NavigationParams {
  ownerUserId: string;
}

type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

export interface Props {
  authUser: UserType;
  authIsOwner: boolean;
  authFriends: any;
  authUserId: string;
  navigation: Navigation;
  ownerUser: UserType;
  ownerFriends: any;
  ownerUserId: string;
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
  const ownerUserId = props.navigation.state.params.ownerUserId;
  const usersPostsViews = {
    USERS_POSTS_SHARES: `${ownerUserId}_USERS_POSTS_SHARES`,
    USERS_POSTS_ADDS: `${ownerUserId}_USERS_POSTS_ADDS`,
    USERS_POSTS_DONES: `${ownerUserId}_USERS_POSTS_DONES`,
    USERS_POSTS_LIKES: `${ownerUserId}_USERS_POSTS_LIKES`
  };
  const usersPostsData = {
    [usersPostsViews.USERS_POSTS_SHARES]: {
      data: selectFlatListReadyUsersPostsFromList(
        state,
        usersPostsViews.USERS_POSTS_SHARES
      ),
      ...selectUsersPostsMetadataFromList(
        state,
        usersPostsViews.USERS_POSTS_SHARES
      )
    },
    [usersPostsViews.USERS_POSTS_ADDS]: {
      data: selectFlatListReadyUsersPostsFromList(
        state,
        usersPostsViews.USERS_POSTS_ADDS
      ),
      ...selectUsersPostsMetadataFromList(
        state,
        usersPostsViews.USERS_POSTS_ADDS
      )
    },
    [usersPostsViews.USERS_POSTS_DONES]: {
      data: selectFlatListReadyUsersPostsFromList(
        state,
        usersPostsViews.USERS_POSTS_DONES
      ),
      ...selectUsersPostsMetadataFromList(
        state,
        usersPostsViews.USERS_POSTS_DONES
      )
    },
    [usersPostsViews.USERS_POSTS_LIKES]: {
      data: selectFlatListReadyUsersPostsFromList(
        state,
        usersPostsViews.USERS_POSTS_LIKES
      ),
      ...selectUsersPostsMetadataFromList(
        state,
        usersPostsViews.USERS_POSTS_LIKES
      )
    }
  };

  return {
    auth: state.auth,
    authIsOwner: authUserId === ownerUserId,
    authUser: selectUserFromId(state, authUserId),
    authUserId,
    authFriends: selectUsersFromList(state, `${authUserId}_Friends`),
    ownerUser: selectUserFromId(state, ownerUserId),
    ownerUserId,
    ownerFriends: selectUsersFromList(state, `${ownerUserId}_Friends`),
    usersPostsViews,
    usersPostsData,
    routing: state.routing,
    posts: state.posts
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  loadUsersPosts: (
    userId: string,
    requestType: RequestType,
    shouldRefresh: boolean,
    lastItem: DocumentSnapshot | 'DONE',
    isLoading: boolean
  ) =>
    dispatch(
      loadUsersPosts(userId, requestType, shouldRefresh, lastItem, isLoading)
    )
});

class MyList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const startingIndex = this.props.authIsOwner ? 0 : 1;

    this.state = {
      selectedIndex: startingIndex,
      activeView: this.mapIndexToView(startingIndex)
    };

    this.subscriptions = [];
  }

  async componentDidMount() {
    // this.subscriptions.push();
    // if (shares, adds, dones, likes) list doesnt exist yet, load initial posts
    if (
      !this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_SHARES]
        .isLoaded
    ) {
      await this.props.loadUsersPosts(
        this.props.ownerUserId,
        'USERS_POSTS_SHARES',
        true,
        this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_SHARES]
          .lastItem,
        this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_SHARES]
          .isLoading
      );
    }

    if (
      !this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_ADDS]
        .isLoaded
    ) {
      await this.props.loadUsersPosts(
        this.props.ownerUserId,
        'USERS_POSTS_ADDS',
        true,
        this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_ADDS]
          .lastItem,
        this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_ADDS]
          .isLoading
      );
    }
    if (
      !this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_DONES]
        .isLoaded
    ) {
      await this.props.loadUsersPosts(
        this.props.ownerUserId,
        'USERS_POSTS_DONES',
        true,
        this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_DONES]
          .lastItem,
        this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_DONES]
          .isLoading
      );
    }
    if (
      !this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_LIKES]
        .isLoaded
    ) {
      await this.props.loadUsersPosts(
        this.props.ownerUserId,
        'USERS_POSTS_LIKES',
        true,
        this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_LIKES]
          .lastItem,
        this.props.usersPostsData[this.props.usersPostsViews.USERS_POSTS_LIKES]
          .isLoading
      );
    }
  }

  componentWillUnmount() {
    // Object.values(this.subscriptions).forEach(subscription => {
    //   subscription();
    // });
  }

  mapIndexToView = (index: number) => {
    const map: {
      [number: string]: RequestType;
    } = {
      0: 'USERS_POSTS_SHARES',
      1: 'USERS_POSTS_ADDS',
      2: 'USERS_POSTS_DONES',
      3: 'USERS_POSTS_LIKES'
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
          backgroundColor={colors.YELLOW}
          statusBarStyle='dark-content'
          shadow
          title={this.props.authIsOwner ? 'My List' : 'Their List'}
        />
        <UserProfile />
        <SegmentedControl
          startingIndex={this.state.selectedIndex}
          onIndexChange={index =>
            this.setState(previousState => ({
              ...previousState,
              selectedIndex: index,
              activeView: this.mapIndexToView(index)
            }))
          }
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
                false,
                this.props.usersPostsData[
                  this.addUserIdToView(this.state.activeView)
                ].lastItem,
                this.props.usersPostsData[
                  this.addUserIdToView(this.state.activeView)
                ].isLoading
              )
            }
            onRefresh={() =>
              this.props.loadUsersPosts(
                this.props.ownerUserId,
                this.state.activeView,
                true,
                this.props.usersPostsData[
                  this.addUserIdToView(this.state.activeView)
                ].lastItem,
                this.props.usersPostsData[
                  this.addUserIdToView(this.state.activeView)
                ].isLoading
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
            <Text>LOADING</Text>
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
