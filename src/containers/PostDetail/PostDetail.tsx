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
  commentsData: Array<UsersPosts>;
  commentsMeta: any;
  ownerUserId: string;
  post: UsersPosts;
  postId: string;
  users: Users;
}

interface DispatchProps {
  getUsersPostsDocument: typeof getUsersPostsDocument;
  loadCommentsForUsersPosts: typeof loadCommentsForUsersPosts;
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

type ActionType = 'shares' | 'adds' | 'dones' | 'likes';

const mapStateToProps = (
  state: any,
  { navigation }: NavigationScreenProps<NavigationState, NavigationParams>
) => {
  const ownerUserId = navigation.state.params.ownerUserId;
  const postId = navigation.state.params.postId;
  const authUserId = selectAuthUserId(state);
  const authUser = selectUserFromId(state, authUserId, true);
  const commentsListKey = generateListKey(
    ownerUserId,
    postId,
    queryTypes.USERS_POSTS_COMMENTS
  );

  return {
    authUserId,
    authUser,
    commentsData: selectFlatListReadyDocuments(
      state,
      'comments',
      selectListItems(state, 'commentsLists', commentsListKey),
      commentsListKey,
      'createdAt'
    ),
    commentsMeta: selectListMeta(state, 'commentsLists', commentsListKey),
    ownerUserId,
    postId,
    post: selectDocumentFromId(state, 'usersPosts', `${ownerUserId}_${postId}`),
    users: {
      [authUserId]: authUser,
      ...selectUsersFromList(state, `${authUserId}_Friends`, true)
    }
  };
};

const mapDispatchToProps = {
  getUsersPostsDocument,
  loadCommentsForUsersPosts
};

class PostDetail extends Component<Props, OwnState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      isCommentsLoading: true
    };
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
          queryTypes.USERS_POSTS_COMMENTS
        ),
        getQuery(queryTypes.USERS_POSTS_COMMENTS)!(
          this.props.ownerUserId,
          this.props.postId
        )
      );
    }
  }

  componentDidUpdate(prevProps: Props) {
    this.checkScreenLoading();
    this.checkCommentsLoading();
  }

  componentWillUnmount() {}

  checkScreenLoading = () => {
    if (
      this.state.isLoading &&
      this.props.authUser &&
      this.props.users &&
      this.props.post
    ) {
      this.setState({ isLoading: false });
    }
  };

  checkCommentsLoading = () => {
    if (
      this.state.isCommentsLoading &&
      this.props.authUser &&
      this.props.users &&
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
    const likeFeatured = this.getFeaturedUsers(
      'likes',
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
              {!_.isEmpty(likeFeatured) ? (
                <View>
                  <View style={styles.activityHeader}>
                    <Icon name={names.LIKE} />
                    <Text style={styles.boldBody}>
                      {likeFeatured.featuredUserName}
                    </Text>
                    <Text style={styles.body}>
                      {` ${likeFeatured.featuredString}`}
                    </Text>
                  </View>
                  <UserAvatarsScrollView users={likeFeatured.featuredUsers} />
                </View>
              ) : null}
            </View>
            <View
              style={[
                styles.sectionBox,
                !_.isEmpty(shareFeatured) ||
                !_.isEmpty(addFeatured) ||
                !_.isEmpty(doneFeatured) ||
                !_.isEmpty(likeFeatured)
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
    const user = this.props.users[item.userId];

    return (
      <UserTextDate
        isLoading={this.state.isCommentsLoading}
        user={this.state.isCommentsLoading ? undefined : user}
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
        queryTypes.USERS_POSTS_COMMENTS
      ),
      getQuery(queryTypes.USERS_POSTS_COMMENTS)!(
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
        queryTypes.USERS_POSTS_COMMENTS
      ),
      getQuery(queryTypes.USERS_POSTS_COMMENTS)!(
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
          ownerUserId={this.props.authUserId}
          usersPostsId={this.state.isLoading ? undefined : this.props.post._id}
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
