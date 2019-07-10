import { documentId, User } from '@daviswhitehead/shayr-resources';
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
import { queries, queryArguments, queryType } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import {
  toggleAddDonePost,
  toggleLikePost,
  toggleSharePost
} from '../../redux/postActions/actions';
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
  authUser: User;
  authIsOwner: boolean;
  authFriends: any;
  authUserId: string;
  navigation: Navigation;
  ownerUser: User;
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
  toggleLikePost: (
    isActive: boolean,
    postId: documentId,
    ownerUserId: documentId,
    userId: documentId
  ) => void;
  toggleSharePost: (
    isActive: boolean,
    postId: documentId,
    ownerUserId: documentId,
    userId: documentId
  ) => void;
  toggleAddDonePost: (
    type: 'adds' | 'dones',
    isActive: boolean,
    postId: documentId,
    ownerUserId: documentId,
    userId: documentId,
    isOtherActive: boolean
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
  toggleLikePost: (
    isActive: boolean,
    postId: documentId,
    ownerUserId: documentId,
    userId: documentId
  ) => dispatch(toggleLikePost(isActive, postId, ownerUserId, userId)),
  toggleSharePost: (
    isActive: boolean,
    postId: documentId,
    ownerUserId: documentId,
    userId: documentId
  ) => dispatch(toggleSharePost(isActive, postId, ownerUserId, userId)),
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
});

class MyList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const startingIndex = this.props.authIsOwner ? 0 : 1;

    this.state = {
      selectedIndex: startingIndex,
      activeView: this.mapIndexToView(startingIndex)
    };
  }

  async componentDidMount() {
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

  componentWillUnmount() {}

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
