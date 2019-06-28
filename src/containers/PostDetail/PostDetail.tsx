import { UsersPostsType, UserType } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { connect } from 'react-redux';
import ActionBar from '../../components/ActionBar';
import Header from '../../components/Header';
import Icon from '../../components/Icon';
import PostCard from '../../components/PostCard';
import UserAvatarsScrollView from '../../components/UserAvatarsScrollView';
import { openURL } from '../../lib/Utils';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { postAction } from '../../redux/postActions/actions';
import { resetPostDetail } from '../../redux/ui/actions';
import {
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import { selectUsersPostFromId } from '../../redux/usersPosts/selectors';
import colors from '../../styles/Colors';
import { actionTypeActivityFeature } from '../../styles/Copy';
import styles from './styles';

interface Users {
  [userId: string]: UserType;
}

interface Navigation {
  [state: string]: {
    [params: string]: {
      ownerUserId: string;
      postId: string;
    };
  };
}

type ActionType = 'shares' | 'adds' | 'dones' | 'likes';

export interface Props {
  authUserId: string;
  authUser: UserType;
  isFocused: boolean;
  navigation: Navigation;
  onActionPress: (
    actionType: ActionType,
    userId: string,
    postId: string
  ) => void;
  ownerUserId: string;
  post: UsersPostsType;
  users: Users;
}

const defaultProps = {
  authUserId: 'm592UXpes3azls6LnhN2VOf2PyT2',
  authUser: {
    lastName: 'Sanders',
    pushToken:
      'e0gF6cGPh-s:APA91bGSMqtBcJYfwgtZn1LzGKtOogUNuXDt6D_FOedcgh8tyFkPNOcDg7_EC4fw4wDZtk27_Dc7aCykgn-KGoIK4XFnxlGHT7ig6OKPapCzXiPawTUN1THj26FkK3jcv7OOh_UkNB3V',
    firstName: 'Bob',
    email: 'chillywilly.bootato@gmail.com',
    updatedAt: {
      seconds: 1561656601,
      nanoseconds: 535000000
    },
    createdAt: {
      seconds: 1555194524,
      nanoseconds: 785000000
    },
    facebookProfilePhoto:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=200&width=200&ext=1562954219&hash=AeR-cpouxuAFXJZd'
  },
  ownerUserId: 'm592UXpes3azls6LnhN2VOf2PyT2',
  post: {
    _id: 'm592UXpes3azls6LnhN2VOf2PyT2_FdY68W88MZxC58bVmLqh',
    _reference: 'users_posts/m592UXpes3azls6LnhN2VOf2PyT2_FdY68W88MZxC58bVmLqh',
    description: 'A brutal roast for a dark roast.',
    updatedAt: {
      seconds: 1557280501,
      nanoseconds: 641000000
    },
    url:
      'https://www.fastcompany.com/90344678/hey-hbo-adobe-fixed-the-starbucks-cup-in-game-of-thrones-for-you',
    title: 'Hey HBO, Adobe fixed the Starbucks cup in Game of Thrones for you',
    medium: 'text',
    image:
      'https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/wp-cms/uploads/2019/05/p-1-90344678-adobe-fixed-that-starbucks-cup-spotted-in-game-of-thrones.jpg',
    userId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    postId: 'FdY68W88MZxC58bVmLqh',
    publisher: {
      name: 'Fast Company',
      logo: 'https://logo.clearbit.com/www.fastcompany.com'
    },
    shareCount: 1,
    shares: ['m592UXpes3azls6LnhN2VOf2PyT2'],
    createdAt: {
      seconds: 1557280501,
      nanoseconds: 641000000
    }
  },
  users: {
    '0': {
      _id: '0',
      _reference: 'users/0',
      firstName: 'Bob',
      lastName: 'Sanders',
      email: 'chillywilly.bootato@gmail.com',
      updatedAt: {
        seconds: 1540758602,
        nanoseconds: 483000000
      },
      facebookProfilePhoto:
        'https://graph.facebook.com/255045858399396/picture',
      createdAt: {
        seconds: 1540758602,
        nanoseconds: 483000000
      }
    },
    '1': {
      _id: '1',
      _reference: 'users/1',
      firstName: 'blue',
      lastName: 'blue',
      email: 'blue@blue.com',
      updatedAt: {
        seconds: 1540758602,
        nanoseconds: 483000000
      },
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
      createdAt: {
        seconds: 1540758602,
        nanoseconds: 483000000
      }
    },
    '2': {
      _id: '2',
      _reference: 'users/2',
      firstName: 'yellow',
      lastName: 'yellow',
      email: 'yellow@yellow.com',
      updatedAt: {
        seconds: 1540758602,
        nanoseconds: 483000000
      },
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
      createdAt: {
        seconds: 1540758602,
        nanoseconds: 483000000
      }
    },
    '3': {
      _id: '3',
      _reference: 'users/3',
      firstName: 'red',
      lastName: 'red',
      email: 'red@red.com',
      updatedAt: {
        seconds: 1540758602,
        nanoseconds: 483000000
      },
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
      createdAt: {
        seconds: 1540758602,
        nanoseconds: 483000000
      }
    },
    '4': {
      _id: '4',
      _reference: 'users/4',
      firstName: 'green',
      lastName: 'green',
      email: 'green@green.com',
      updatedAt: {
        seconds: 1540758602,
        nanoseconds: 483000000
      },
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
      createdAt: {
        seconds: 1540758602,
        nanoseconds: 483000000
      }
    },
    m592UXpes3azls6LnhN2VOf2PyT2: {
      lastName: 'Sanders',
      pushToken:
        'e0gF6cGPh-s:APA91bGSMqtBcJYfwgtZn1LzGKtOogUNuXDt6D_FOedcgh8tyFkPNOcDg7_EC4fw4wDZtk27_Dc7aCykgn-KGoIK4XFnxlGHT7ig6OKPapCzXiPawTUN1THj26FkK3jcv7OOh_UkNB3V',
      firstName: 'Bob',
      email: 'chillywilly.bootato@gmail.com',
      updatedAt: {
        seconds: 1561656601,
        nanoseconds: 535000000
      },
      createdAt: {
        seconds: 1555194524,
        nanoseconds: 785000000
      },
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=200&width=200&ext=1562954219&hash=AeR-cpouxuAFXJZd'
    },
    lOnI91XOvdRnQe5Hmdrkf2TY5lH2: {
      _id: 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
      _reference: 'users/lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10211413843358157&height=200&width=200&ext=1562959850&hash=AeSVt4ldezG_RyXI',
      pushToken:
        'c0_dghp8syI:APA91bExKJBJx5tNiS3iJkrcXVGz71dBqNC0dqpnggE9neDp0Wm-aEx47IowxJ8kqRkYpUGaQofBeoorfZxc1a_2-FigeNSwkzDdBZvhb8tUDDUL4G8xYMjQcHN5W0YF7STvidxfIU1Z',
      firstName: 'Davis',
      email: 'whitehead.davis@gmail.com',
      updatedAt: {
        seconds: 1560374418,
        nanoseconds: 200000000
      },
      createdAt: {
        seconds: 1546814132,
        nanoseconds: 268000000
      },
      lastName: 'Whitehead'
    },
    myySXfLM5OS12lMpC39otvfXrwj2: {
      _id: 'myySXfLM5OS12lMpC39otvfXrwj2',
      _reference: 'users/myySXfLM5OS12lMpC39otvfXrwj2',
      lastName: 'Wang',
      firstName: 'Alex',
      email: 'awswim@gmail.com',
      updatedAt: {
        seconds: 1542584131,
        nanoseconds: 748000000
      },
      pushToken:
        'fMLby11tmoI:APA91bFNyh2Na2fWrpj8aToSBYOH36j8YxmpooGZ7WtpB9Hj2wXP81fnB3-2deW1fDttOXB76L9IQECKyGFVYWQCjhLRd31e7tToS_7tvUMT-YWJb9D_OfHV5XwpiSA-z5zdvwhbsC6W',
      createdAt: {
        seconds: 1542576506,
        nanoseconds: 304000000
      }
    },
    KhTuhl0T7WRx9dRspOanzvU4SHG3: {
      _id: 'KhTuhl0T7WRx9dRspOanzvU4SHG3',
      _reference: 'users/KhTuhl0T7WRx9dRspOanzvU4SHG3',
      facebookProfilePhoto:
        'https://graph.facebook.com/10216564267804764/picture',
      pushToken:
        'dQ1rAOKTWpU:APA91bEPc86I5u4xpkd8awDxliEepdHUi-7rKFUiAb-WJMn1QoCtQK9Tor4ZN_p6yA_Rn3QXpzk-hLSJ7ax1v7kzTt_um7Ccm5xLZqmxrO-YN4SDL0_1uFpcSOIDvK_PKx_zBeeqO14L',
      firstName: 'Erin',
      email: 'reaerin@gmail.com',
      updatedAt: {
        seconds: 1553226243,
        nanoseconds: 645000000
      },
      createdAt: {
        seconds: 1553051941,
        nanoseconds: 281000000
      },
      lastName: 'Rea'
    }
  }
};
// const defaultProps = {};

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
    ownerUserId: state.ui.postDetails.ownerUserId,
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
  onActionPress: (actionType: ActionType, userId: string, postId: string) =>
    dispatch(postAction(actionType, userId, postId))
});

class PostDetail extends Component<Props> {
  async componentDidMount() {}

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

  getActionActiveStatus = (
    type: ActionType,
    post: UsersPostsType,
    userId: string
  ) => {
    const userIds: Array<string> = _.get(post, [type], []);
    return _.includes(userIds, userId);
  };

  render() {
    console.log(this.props);

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
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
            <Text>hello world</Text>
          </ScrollView>
        </View>
        <ActionBar
          authUserId={this.props.authUserId}
          authUser={this.props.authUser}
          onAvatarPress={undefined}
          // onAvatarPress={() => this.props.onAvatarPress(postDetailsRoute())}
          onSharePress={() =>
            this.props.onActionPress(
              'shares',
              this.props.authUserId,
              this.props.post.postId
            )
          }
          isShareActive={this.getActionActiveStatus(
            'shares',
            this.props.post,
            this.props.authUserId
          )}
          onAddPress={() =>
            this.props.onActionPress(
              'adds',
              this.props.authUserId,
              this.props.post.postId
            )
          }
          isAddActive={this.getActionActiveStatus(
            'adds',
            this.props.post,
            this.props.authUserId
          )}
          onDonePress={() =>
            this.props.onActionPress(
              'dones',
              this.props.authUserId,
              this.props.post.postId
            )
          }
          isDoneActive={this.getActionActiveStatus(
            'dones',
            this.props.post,
            this.props.authUserId
          )}
          onLikePress={() =>
            this.props.onActionPress(
              'likes',
              this.props.authUserId,
              this.props.post.postId
            )
          }
          isLikeActive={this.getActionActiveStatus(
            'likes',
            this.props.post,
            this.props.authUserId
          )}
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
