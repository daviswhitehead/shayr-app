import { User, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import {
  NavigationScreenProps,
  NavigationState,
  withNavigationFocus
} from 'react-navigation';
import { connect } from 'react-redux';
import { threadId } from 'worker_threads';
import ActionBar from '../../components/ActionBar';
import Header from '../../components/Header';
import Icon, { names } from '../../components/Icon';
import List from '../../components/List';
import Loading from '../../components/Loading';
import PostCard from '../../components/PostCard';
import UserAvatarsScrollView from '../../components/UserAvatarsScrollView';
import UserTextDate from '../../components/UserTextDate';
import { getQuery, queryTypes } from '../../lib/FirebaseQueries';
import { openURL } from '../../lib/Utils';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { loadCommentsForUsersPosts } from '../../redux/comments/actions';
import {
  selectDocumentFromId,
  selectFlatListReadyDocuments
} from '../../redux/documents/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { selectListItems, selectListMeta } from '../../redux/lists/selectors';
import { subscribeToFriends } from '../../redux/users/actions';
import {
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import { getUsersPostsDocument } from '../../redux/usersPosts/actions';
import Colors from '../../styles/Colors';
import { actionTypeActivityFeature } from '../../styles/Copy';
import styles from './styles';

interface StateProps {
  authUser: User;
  authUserId: string;
  authFriends: Users;
  commentsData: Array<UsersPosts>;
  commentsMeta: any;
  ownerUserId: string;
  ownerFriends: Users;
  post: UsersPosts;
  postId: string;
  users: Users;
}

interface DispatchProps {
  getUsersPostsDocument: typeof getUsersPostsDocument;
  loadCommentsForUsersPosts: typeof loadCommentsForUsersPosts;
  subscribeToFriends: typeof subscribeToFriends;
}

interface OwnProps {
  isFocused: boolean;
}

interface OwnState {
  isLoading: boolean;
  isCommentsLoading: boolean;
}

interface NavigationParams {
  ownerUserId: string;
  postId: string;
}

type Props = OwnProps &
  StateProps &
  DispatchProps &
  NavigationScreenProps<NavigationState, NavigationParams>;

interface Users {
  [userId: string]: User;
}

type ActionType = 'shares' | 'adds' | 'dones' | 'comments';

const mapStateToProps = (
  state: any,
  { navigation }: NavigationScreenProps<NavigationState, NavigationParams>
) => {
  const ownerUserId = navigation.state.params.ownerUserId;
  const postId = navigation.state.params.postId;
  const authUserId = selectAuthUserId(state);
  const authUser = selectUserFromId(state, authUserId, 'presentation');
  const commentsListKey = generateListKey(
    ownerUserId,
    postId,
    queryTypes.COMMENTS_FOR_USERS_POSTS
  );
  const authFriends = selectUsersFromList(
    state,
    generateListKey(authUserId, queryTypes.USER_FRIENDS),
    'presentation'
  );
  const ownerFriends = selectUsersFromList(
    state,
    generateListKey(ownerUserId, queryTypes.USER_FRIENDS),
    'presentation'
  );

  return {
    authUserId,
    authUser,
    commentsData: selectFlatListReadyDocuments(
      state,
      'comments',
      selectListItems(state, 'commentsLists', commentsListKey),
      commentsListKey,
      { sortKeys: ['createdAt'], sortDirection: ['desc'] }
    ),
    commentsMeta: selectListMeta(state, 'commentsLists', commentsListKey),
    authFriends,
    ownerFriends,
    ownerUserId,
    postId,
    post: selectDocumentFromId(state, 'usersPosts', `${ownerUserId}_${postId}`),
    users: {
      [authUserId]: authUser,
      ...authFriends,
      ...ownerFriends
    }
  };
};

const mapDispatchToProps = {
  getUsersPostsDocument,
  loadCommentsForUsersPosts,
  subscribeToFriends
};

class PostDetail extends Component<Props, OwnState> {
  static whyDidYouRender = true;

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarVisible: false
    };
  };

  subscriptions: Array<any>;
  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: true,
      isCommentsLoading: true
    };

    this.subscriptions = [];
  }

  componentDidMount() {
    this.checkScreenLoading();
    this.checkCommentsLoading();

    if (!this.props.post) {
      this.props.getUsersPostsDocument(
        this.props.ownerUserId,
        this.props.postId
      );
    }

    if (this.state.isCommentsLoading) {
      this.props.loadCommentsForUsersPosts(
        generateListKey(
          this.props.ownerUserId,
          this.props.postId,
          queryTypes.COMMENTS_FOR_USERS_POSTS
        ),
        getQuery(queryTypes.COMMENTS_FOR_USERS_POSTS)!(
          this.props.ownerUserId,
          this.props.postId
        )
      );
    }
    // get owner friends if not already loaded
    _.isUndefined(this.props.ownerFriends) &&
      this.subscriptions.push(
        this.props.subscribeToFriends(this.props.ownerUserId)
      );
  }

  componentDidUpdate(prevProps: Props) {
    this.checkScreenLoading();
    this.checkCommentsLoading();
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((unsubscribe) => {
      unsubscribe();
    });
  }

  checkScreenLoading = () => {
    if (
      this.state.isLoading &&
      this.props.authUser &&
      this.props.authFriends &&
      this.props.post
    ) {
      this.setState({ isLoading: false });
    }
  };

  checkCommentsLoading = () => {
    if (
      this.state.isCommentsLoading &&
      this.props.authUser &&
      this.props.authFriends &&
      this.props.commentsMeta &&
      this.props.commentsMeta.isLoaded
    ) {
      this.setState({ isCommentsLoading: false });
    }
  };

  getFeaturedUsers = (type: ActionType, post: UsersPosts, users: Users) => {
    const featuredUserIds: Array<string> = _.get(post, [type], []);
    const featuredUsers = _.reduce(
      users,
      (result: any, value, key) => {
        if (_.includes(featuredUserIds, key)) {
          result[key] = value;
        }
        return result;
      },
      {}
    );
    const featuredUser = _.get(featuredUsers, [featuredUserIds[0]], {});
    const featuredUserName = _.isEmpty(featuredUser)
      ? ''
      : featuredUser.shortName;
    let featuredString = '';
    if (featuredUserIds.length === 1) {
      if (type === 'adds') {
        featuredString = `${actionTypeActivityFeature.add}`;
      } else {
        featuredString = `${actionTypeActivityFeature[type]}`;
      }
    } else if (featuredUserIds.length === 2) {
      featuredString = `and 1 other ${actionTypeActivityFeature[type]}`;
    } else if (featuredUserIds.length > 2) {
      featuredString = `and ${featuredUserIds.length} others ${
        actionTypeActivityFeature[type]
      }`;
    }

    return !_.isEmpty(featuredUsers) && featuredUserName && featuredString
      ? {
          featuredUsers,
          featuredUserName,
          featuredString
        }
      : {};
  };

  renderListHeader = () => {
    // get featured users
    const shareFeatured = this.getFeaturedUsers(
      'shares',
      this.props.post,
      this.props.users
    );
    const addFeatured = this.getFeaturedUsers(
      'adds',
      this.props.post,
      this.props.users
    );
    const doneFeatured = this.getFeaturedUsers(
      'dones',
      this.props.post,
      this.props.users
    );
    const commentFeatured = this.getFeaturedUsers(
      'comments',
      this.props.post,
      this.props.users
    );

    return (
      <View>
        <PostCard
          isLoading={this.state.isLoading}
          post={this.props.post}
          onPressParameters={
            this.state.isLoading ? undefined : this.props.post.url
          }
          onPress={openURL}
          noUser
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <View style={styles.headerContainer}>
            <View style={styles.sectionBox}>
              <Text style={styles.sectionHeader}>Summary</Text>
              <Text style={styles.body}> {this.props.post.description}</Text>
            </View>
            <View style={styles.sectionBox}>
              <Text style={styles.sectionHeader}>Activity</Text>
              {!_.isEmpty(shareFeatured) ? (
                <View style={styles.activityBox}>
                  <View style={styles.activityHeader}>
                    <Icon name={names.SHARE} />
                    <Text style={styles.boldBody}>
                      {shareFeatured.featuredUserName}
                    </Text>
                    <Text style={styles.body}>
                      {` ${shareFeatured.featuredString}`}
                    </Text>
                  </View>
                  <UserAvatarsScrollView users={shareFeatured.featuredUsers} />
                </View>
              ) : null}
              {!_.isEmpty(addFeatured) ? (
                <View style={styles.activityBox}>
                  <View style={styles.activityHeader}>
                    <Icon name={names.ADD} />
                    <Text style={styles.boldBody}>
                      {addFeatured.featuredUserName}
                    </Text>
                    <Text style={styles.body}>
                      {` ${addFeatured.featuredString}`}
                    </Text>
                  </View>
                  <UserAvatarsScrollView users={addFeatured.featuredUsers} />
                </View>
              ) : null}
              {!_.isEmpty(doneFeatured) ? (
                <View style={styles.activityBox}>
                  <View style={styles.activityHeader}>
                    <Icon name={names.DONE} />
                    <Text style={styles.boldBody}>
                      {doneFeatured.featuredUserName}
                    </Text>
                    <Text style={styles.body}>
                      {` ${doneFeatured.featuredString}`}
                    </Text>
                  </View>
                  <UserAvatarsScrollView users={doneFeatured.featuredUsers} />
                </View>
              ) : null}
              {!_.isEmpty(commentFeatured) ? (
                <View>
                  <View style={styles.activityHeader}>
                    <Icon name={names.REACTION} />
                    <Text style={styles.boldBody}>
                      {commentFeatured.featuredUserName}
                    </Text>
                    <Text style={styles.body}>
                      {` ${commentFeatured.featuredString}`}
                    </Text>
                  </View>
                  <UserAvatarsScrollView
                    users={commentFeatured.featuredUsers}
                  />
                </View>
              ) : null}
            </View>
            <View
              style={[
                styles.sectionBox,
                !_.isEmpty(shareFeatured) ||
                !_.isEmpty(addFeatured) ||
                !_.isEmpty(doneFeatured) ||
                !_.isEmpty(commentFeatured)
                  ? styles.commentsMargin
                  : {}
              ]}
            >
              <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>
                Comments
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  // TODO: add comment type definition
  renderItem = ({ item }: { item: any }) => {
    const user = this.state.isCommentsLoading
      ? undefined
      : this.props.users[item.userId];

    if (!user && !this.state.isCommentsLoading) {
      return;
    }

    return (
      <UserTextDate
        isLoading={this.state.isCommentsLoading}
        user={user}
        text={item.text}
        createdAt={
          this.state.isCommentsLoading ? undefined : item.createdAt.toDate()
        }
      />
    );
  };

  paginateList = () => {
    if (!this.props.commentsMeta) {
      return;
    }
    return this.props.loadCommentsForUsersPosts(
      generateListKey(
        this.props.ownerUserId,
        this.props.postId,
        queryTypes.COMMENTS_FOR_USERS_POSTS
      ),
      getQuery(queryTypes.COMMENTS_FOR_USERS_POSTS)!(
        this.props.ownerUserId,
        this.props.postId
      ),
      false,
      this.props.commentsMeta.isLoading,
      this.props.commentsMeta.lastItem
    );
  };

  refreshList = () => {
    if (!this.props.commentsMeta) {
      return;
    }
    return this.props.loadCommentsForUsersPosts(
      generateListKey(
        this.props.ownerUserId,
        this.props.postId,
        queryTypes.COMMENTS_FOR_USERS_POSTS
      ),
      getQuery(queryTypes.COMMENTS_FOR_USERS_POSTS)!(
        this.props.ownerUserId,
        this.props.postId
      ),
      true,
      this.props.commentsMeta.isLoading,
      this.props.commentsMeta.lastItem
    );
  };

  render() {
    return (
      <View style={styles.screen}>
        {this.props.isFocused ? (
          <Header
            backgroundColor={Colors.WHITE}
            statusBarStyle='dark-content'
            title=''
            back={() => this.props.navigation.goBack(null)}
          />
        ) : null}
        <List
          showsVerticalScrollIndicator={false}
          overScrollMode='always'
          // using an arrow function to force a re-render when screen state/props changes
          ListHeaderComponent={() => this.renderListHeader()}
          data={this.props.commentsData}
          renderItem={this.renderItem}
          noSeparator
          isLoading={this.state.isCommentsLoading}
          onEndReached={this.paginateList}
          onRefresh={this.refreshList}
          isRefreshing={
            this.state.isCommentsLoading
              ? false
              : this.props.commentsMeta.isRefreshing
          }
          isPaginating={
            this.state.isCommentsLoading
              ? false
              : this.props.commentsMeta.isLoading
          }
          isLoadedAll={
            this.state.isCommentsLoading
              ? false
              : this.props.commentsMeta.isLoadedAll
          }
        />
        <ActionBar
          isLoading={this.state.isLoading}
          authUser={this.props.authUser}
          ownerUserId={this.props.ownerUserId}
          usersPostsId={this.state.isLoading ? undefined : this.props.post._id}
          usersPostsAdds={
            this.state.isLoading ? undefined : this.props.post.adds
          }
          usersPostsComments={
            this.state.isLoading ? undefined : this.props.post.comments
          }
          usersPostsDones={
            this.state.isLoading ? undefined : this.props.post.dones
          }
          usersPostsShares={
            this.state.isLoading ? undefined : this.props.post.shares
          }
          postId={this.state.isLoading ? undefined : this.props.post.postId}
          url={this.state.isLoading ? undefined : this.props.post.url}
        />
      </View>
    );
  }
}

export default withNavigationFocus(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    undefined,
    {
      areStatePropsEqual: (next: any, prev: any) => {
        return _.isEqual(next, prev);
      }
    }
  )(PostDetail)
);
