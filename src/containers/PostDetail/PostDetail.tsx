import {
  documentId,
  getUserShortName,
  User,
  UsersPosts
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import {
  NavigationScreenProp,
  NavigationState,
  withNavigationFocus
} from 'react-navigation';
import { connect } from 'react-redux';
import ActionBar from '../../components/ActionBar';
import Header from '../../components/Header';
import Icon, { names } from '../../components/Icon';
import List from '../../components/List';
import PostCard from '../../components/PostCard';
import UserAvatarsScrollView from '../../components/UserAvatarsScrollView';
import UserTextDate from '../../components/UserTextDate';
import { getQuery, queryTypes } from '../../lib/FirebaseQueries';
import { openURL } from '../../lib/Utils';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { loadCommentsForUsersPosts } from '../../redux/comments/actions';
import {
  selectCommentsForPostDetail,
  selectCommentsMetadataForPostDetail
} from '../../redux/comments/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import {
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import { getUsersPostsDocument } from '../../redux/usersPosts/actions';
import { selectUsersPostFromId } from '../../redux/usersPosts/selectors';
import Colors from '../../styles/Colors';
import { actionTypeActivityFeature } from '../../styles/Copy';
import styles from './styles';

let RENDER_COUNT = 0;

interface StateProps {
  authUserId: string;
  authUser: User;
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
}

interface NavigationParams {
  ownerUserId: string;
  postId: string;
}

type Props = OwnProps &
  StateProps &
  DispatchProps &
  NavigationScreenProp<NavigationState, NavigationParams>;

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

  return {
    authUserId: selectAuthUserId(state),
    authUser: selectUserFromId(state, selectAuthUserId(state)),
    commentsData: selectCommentsForPostDetail(
      state,
      generateListKey(selectAuthUserId(state), postId)
    ),
    commentsMeta: selectCommentsMetadataForPostDetail(
      state,
      generateListKey(selectAuthUserId(state), postId)
    ),
    ownerUserId,
    postId,
    post: selectUsersPostFromId(state, generateListKey(ownerUserId, postId)),
    users: {
      [selectAuthUserId(state)]: selectUserFromId(
        state,
        selectAuthUserId(state)
      ),
      ...selectUsersFromList(state, `${selectAuthUserId(state)}_Friends`)
    }
  };
};

const mapDispatchToProps = {
  getUsersPostsDocument,
  loadCommentsForUsersPosts
};

class PostDetail extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.post) {
      this.props.getUsersPostsDocument(
        this.props.ownerUserId,
        this.props.postId
      );
    }
    this.props.loadCommentsForUsersPosts(
      this.props.ownerUserId,
      getQuery(queryTypes.USERS_POSTS_COMMENTS)!(
        this.props.ownerUserId,
        this.props.postId
      ),
      queryTypes.USERS_POSTS_COMMENTS
    );
  }

  componentWillUnmount() {}

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
      : `${featuredUser.firstName} ${featuredUser.lastName.charAt(0)}`;
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

  renderListHeader() {
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
          ownerUserId={this.props.ownerUserId}
          post={this.props.post}
          onCardPress={() => openURL(this.props.post.url)}
        />
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
          <View>
            <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>
              Comments
            </Text>
          </View>
        </View>
      </View>
    );
  }

  renderListItem = (item: any) => {
    const user = this.props.users[item.userId];

    return (
      <UserTextDate
        userName={user.shortName}
        profilePhoto={user.facebookProfilePhoto}
        text={item.text}
        createdAt={item.createdAt.toDate()}
      />
    );
  };

  render() {
    console.log(`PostDetail - Render Count: ${RENDER_COUNT}`);
    // console.log('this.props');
    // console.log(this.props);
    // console.log('this.state');
    // console.log(this.state);
    RENDER_COUNT += 1;

    if (!this.props.post) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.BLACK} />
        </View>
      );
    }

    return (
      <View style={styles.screen}>
        {this.props.isFocused ? (
          <Header
            backgroundColor={Colors.WHITE}
            statusBarStyle='dark-content'
            title=''
            back={() => this.props.navigation.goBack()}
          />
        ) : null}
        {/* <List
          showsVerticalScrollIndicator={false}
          overScrollMode='always'
          ListHeaderComponent={() => this.renderListHeader()}
          data={this.props.commentsData}
          renderItem={(item) => this.renderListItem(item)}
          noSeparator
          onEndReached={() =>
            this.props.loadCommentsForUsersPosts(
              this.props.ownerUserId,
              this.props.postId,
              false,
              _.get(this.props, ['commentsMeta', 'isLoading'], true),
              _.get(this.props, ['commentsMeta', 'lastItem'], undefined)
            )
          }
          onRefresh={() =>
            this.props.loadCommentsForUsersPosts(
              this.props.ownerUserId,
              this.props.postId,
              true,
              _.get(this.props, ['commentsMeta', 'isLoading'], true),
              _.get(this.props, ['commentsMeta', 'lastItem'], undefined)
            )
          }
          refreshing={_.get(
            this.props,
            ['commentsMeta', 'isRefreshing'],
            false
          )}
          isLoading={_.get(this.props, ['commentsMeta', 'isLoading'], true)}
          isLoadedAll={_.get(
            this.props,
            ['commentsMeta', 'isLoadedAll'],
            false
          )}
        /> */}
        <ActionBar
          authUser={this.props.authUser}
          ownerUserId={this.props.authUserId}
          usersPostsId={this.props.post._id}
          postId={this.props.post.postId}
        />
      </View>
    );
  }
}

export default withNavigationFocus(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PostDetail)
);
