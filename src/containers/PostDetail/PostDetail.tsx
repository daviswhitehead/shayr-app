import { documentId, User, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  withNavigationFocus
} from 'react-navigation';
import { connect } from 'react-redux';
import ActionBar from '../../components/ActionBar';
import Header from '../../components/Header';
import Icon from '../../components/Icon';
import PostCard from '../../components/PostCard';
import UserAvatarsScrollView from '../../components/UserAvatarsScrollView';
import { queries } from '../../lib/FirebaseQueries';
import { getDocuments } from '../../lib/FirebaseRedux';
import { openURL } from '../../lib/Utils';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { loadCommentsForUsersPosts } from '../../redux/comments/actions';
import { LastItem } from '../../redux/FirebaseRedux';
import {
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import { STATE_KEY } from '../../redux/usersPosts/actions';
import { selectUsersPostFromId } from '../../redux/usersPosts/selectors';
import Colors from '../../styles/Colors';
import { actionTypeActivityFeature } from '../../styles/Copy';
import styles from './styles';

interface NavigationParams {
  ownerUserId: string;
  postId: string;
}

type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Users {
  [userId: string]: User;
}

type ActionType = 'shares' | 'adds' | 'dones' | 'likes';

export interface Props {
  authUserId: string;
  authUser: User;
  isFocused: boolean;
  navigation: Navigation;
  onActionPress: (
    userId: string,
    postId: string,
    actionType: ActionType,
    isNowActive: boolean
  ) => void;
  ownerUserId: string;
  post: UsersPosts;
  postId: string;
  users: Users;
  toggleLikePost: (
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
  loadCommentsForUsersPosts: (
    ownerUserId: string,
    shouldRefresh?: boolean,
    isLoading?: boolean,
    lastItem?: LastItem
  ) => void;
}

const defaultProps = {};

const mapStateToProps = (state: any, props: any) => {
  const authUserId = selectAuthUserId(state);
  const authUser = selectUserFromId(state, authUserId);
  const post = selectUsersPostFromId(
    state,
    `${props.navigation.state.params.ownerUserId}_${
      props.navigation.state.params.postId
    }`
  );

  return {
    authUserId,
    authUser,
    ownerUserId: props.navigation.state.params.ownerUserId,
    postId: props.navigation.state.params.postId,
    post,
    routing: state.routing,
    users: {
      [authUserId]: authUser,
      ...selectUsersFromList(state, `${authUserId}_Friends`)
    }
  };
};

const mapDispatchToProps = (dispatch: any, props: any) => {
  const query = queries.USERS_POSTS_SINGLE.query({
    userId: props.navigation.state.params.ownerUserId,
    postId: props.navigation.state.params.postId
  });

  return {
    getPostDetailDocument: () => dispatch(getDocuments(STATE_KEY, query)),
    toggleLikePost: (
      isActive: boolean,
      postId: documentId,
      ownerUserId: documentId,
      userId: documentId
    ) => dispatch(toggleLikePost(isActive, postId, ownerUserId, userId)),
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
      ),
    loadCommentsForUsersPosts: (
      ownerUserId: string,
      shouldRefresh?: boolean,
      isLoading?: boolean,
      lastItem?: LastItem
    ) =>
      dispatch(
        loadCommentsForUsersPosts(
          ownerUserId,
          shouldRefresh,
          isLoading,
          lastItem
        )
      )
  };
};

class PostDetail extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {
    if (!this.props.post) {
      await this.props.getPostDetailDocument();
    }
    await this.props.loadCommentsForUsersPosts(
      this.props.ownerUserId,
      true,
      false,
      undefined
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

  render() {
    if (!this.props.post) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.BLACK} />
        </View>
      );
    }

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
      <View style={styles.screen}>
        {this.props.isFocused ? (
          <Header
            backgroundColor={Colors.WHITE}
            statusBarStyle='dark-content'
            title=''
            back={() => this.props.navigation.goBack()}
          />
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode='always'
          style={styles.scrollView}
        >
          <PostCard
            ownerUserId={this.props.ownerUserId}
            post={this.props.post}
            onCardPress={() => openURL(this.props.post.url)}
          />
          <View style={styles.container}>
            <View style={styles.sectionBox}>
              <Text style={styles.sectionHeader}>Summary</Text>
              <Text style={styles.body}> {this.props.post.description}</Text>
            </View>
            <View style={styles.sectionBox}>
              <Text style={styles.sectionHeader}>Activity</Text>
              {!_.isEmpty(shareFeatured) ? (
                <View style={styles.activityBox}>
                  <View style={styles.activityHeader}>
                    <Icon.default name={'share'} />
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
                    <Icon.default name={'add'} />
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
                    <Icon.default name={'done'} />
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
                <View style={styles.activityBox}>
                  <View style={styles.activityHeader}>
                    <Icon.default name={'like'} />
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
          </View>
        </ScrollView>
        <ActionBar
          authUser={this.props.authUser}
          post={this.props.post}
          ownerUserId={this.props.ownerUserId}
        />
      </View>
    );
  }
}

PostDetail.defaultProps = defaultProps;

export default withNavigationFocus(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PostDetail)
);
