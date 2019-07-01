import { UsersPostsType, UserType } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { withNavigationFocus } from 'react-navigation';
import { connect } from 'react-redux';
import ActionBar from '../../components/ActionBar';
import Header from '../../components/Header';
import Icon from '../../components/Icon';
import PostCard from '../../components/PostCard';
import UserAvatarsScrollView from '../../components/UserAvatarsScrollView';
import { getActionActiveStatus } from '../../lib/StateHelpers';
import { openURL } from '../../lib/Utils';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { postAction } from '../../redux/postActions/actions';
import { resetPostDetail } from '../../redux/ui/actions';
import {
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import { subscribeSingleUsersPosts } from '../../redux/usersPosts/actions';
import { selectUsersPostFromId } from '../../redux/usersPosts/selectors';
import colors from '../../styles/Colors';
import { actionTypeActivityFeature } from '../../styles/Copy';
import styles from './styles';

interface NavigationParams {
  ownerUserId: string;
  postId: string;
}

type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Users {
  [userId: string]: UserType;
}

type ActionType = 'shares' | 'adds' | 'dones' | 'likes';

export interface Props {
  authUserId: string;
  authUser: UserType;
  isFocused: boolean;
  navigation: Navigation;
  onActionPress: (
    userId: string,
    post: UsersPostsType,
    actionType: ActionType,
    isNowActive: boolean
  ) => void;
  ownerUserId: string;
  post: UsersPostsType;
  postId: string;
  users: Users;
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

const mapDispatchToProps = (dispatch: any) => ({
  resetPostDetail: () => dispatch(resetPostDetail()),
  onActionPress: (
    userId: string,
    post: UsersPostsType,
    actionType: ActionType,
    isNowActive: boolean
  ) => dispatch(postAction(userId, post, actionType, isNowActive)),
  subscribeSingleUsersPosts: (userId: string, postId: string) =>
    dispatch(subscribeSingleUsersPosts(userId, postId))
});

class PostDetail extends Component<Props> {
  constructor(props) {
    super(props);
    this.subscriptions = [];
  }

  async componentDidMount() {
    if (!this.props.post) {
      this.subscriptions.push(
        await this.props.subscribeSingleUsersPosts(
          this.props.ownerUserId,
          this.props.postId
        )
      );
    }
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach(unsubscribe => {
      unsubscribe();
    });
  }

  getFeaturedUsers = (type: ActionType, post: UsersPostsType, users: Users) => {
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
      featuredString = `${actionTypeActivityFeature[type]}`;
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
        <View style={styles.container}>
          <Text>LOADING</Text>
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

    // get icon active status
    const isShareActive = getActionActiveStatus(
      this.props.authUserId,
      this.props.post,
      'shares'
    );
    const isAddActive = getActionActiveStatus(
      this.props.authUserId,
      this.props.post,
      'adds'
    );
    const isDoneActive = getActionActiveStatus(
      this.props.authUserId,
      this.props.post,
      'dones'
    );
    const isLikeActive = getActionActiveStatus(
      this.props.authUserId,
      this.props.post,
      'likes'
    );

    return (
      <View style={styles.screen}>
        {this.props.isFocused ? (
          <Header
            backgroundColor={colors.WHITE}
            statusBarStyle='dark-content'
            title=''
            back={() => this.props.navigation.goBack()}
          />
        ) : null}
        <PostCard
          ownerUserId={this.props.ownerUserId}
          post={this.props.post}
          onCardPress={() => openURL(this.props.post.url)}
        />
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
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
          </ScrollView>
        </View>
        <ActionBar
          authUserId={this.props.authUserId}
          authUser={this.props.authUser}
          onAvatarPress={undefined}
          // onAvatarPress={() => this.props.onAvatarPress(postDetailsRoute())}
          onSharePress={() =>
            this.props.onActionPress(
              this.props.authUserId,
              this.props.post,
              'shares',
              !isShareActive
            )
          }
          isShareActive={isShareActive}
          onAddPress={() =>
            this.props.onActionPress(
              this.props.authUserId,
              this.props.post,
              'adds',
              !isAddActive
            )
          }
          isAddActive={isAddActive}
          onDonePress={() =>
            this.props.onActionPress(
              this.props.authUserId,
              this.props.post,
              'dones',
              !isDoneActive
            )
          }
          isDoneActive={isDoneActive}
          onLikePress={() =>
            this.props.onActionPress(
              this.props.authUserId,
              this.props.post,
              'likes',
              !isLikeActive
            )
          }
          isLikeActive={isLikeActive}
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
