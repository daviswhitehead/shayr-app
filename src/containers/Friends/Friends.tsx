import { documentIds, User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { Button, View } from 'react-native';
import {
  NavigationScreenProp,
  NavigationScreenProps,
  NavigationState
} from 'react-navigation';
import { connect } from 'react-redux';
import ActionRow from '../../components/ActionRow';
import FriendSummaryRow from '../../components/FriendSummaryRow';
import Header from '../../components/Header';
import Icon, { names } from '../../components/Icon';
import List from '../../components/List';
import globalRouter from '../../components/TempRouter/RouterSingleton';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { selectFlatListReadyDocuments } from '../../redux/documents/selectors';
import {
  createFriendship,
  updateFriendship
} from '../../redux/friendships/actions';
import { selectPendingFriendshipUserIds } from '../../redux/friendships/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { selectListItems } from '../../redux/lists/selectors';
import { State } from '../../redux/Reducers';
import { subscribeToFriends } from '../../redux/users/actions';
import {
  formatUserForClient,
  formatUserForProfile
} from '../../redux/users/selectors';
import Colors from '../../styles/Colors';
import FindFriends from '../FindFriends';
import styles from './styles';

interface StateProps {
  authIsOwner: boolean;
  friends?: Array<User>;
  ownerUserId: string;
  pendingFriendshipUserIds?: documentIds;
}

interface DispatchProps {
  createFriendship: typeof createFriendship;
  updateFriendship: typeof updateFriendship;
  subscribeToFriends: typeof subscribeToFriends;
}

interface NavigationParams {
  ownerUserId?: string;
}

type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface OwnProps {
  navigation: Navigation;
}

interface OwnState {
  isLoading: boolean;
}

type Props = OwnProps &
  StateProps &
  DispatchProps &
  NavigationScreenProps<NavigationParams>;

const mapStateToProps = (state: State, props: OwnProps & Navigation) => {
  const authUserId = selectAuthUserId(state);
  const ownerUserId =
    _.get(props, ['navigation', 'state', 'params', 'ownerUserId'], undefined) ||
    authUserId;
  const authIsOwner = authUserId === ownerUserId;

  return {
    authIsOwner,
    friends: selectFlatListReadyDocuments(
      state,
      'users',
      selectListItems(
        state,
        'usersLists',
        generateListKey(ownerUserId, queryTypes.USER_FRIENDS)
      ),
      'friends',
      {
        sortKeys: ['sharesCount'],
        sortDirection: ['desc'],
        formatting: (user: User) => {
          return formatUserForProfile(formatUserForClient(user));
        }
      }
    ),
    ownerUserId,
    pendingFriendshipUserIds: selectPendingFriendshipUserIds(
      state,
      ownerUserId,
      'all'
    )
  };
};

const mapDispatchToProps = {
  createFriendship,
  updateFriendship,
  subscribeToFriends
};

class Friends extends PureComponent<Props, OwnState> {
  static whyDidYouRender = true;

  subscriptions: Array<any>;
  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: true
    };

    this.subscriptions = [];
  }

  componentDidMount() {
    this.checkLoading();
    // get owner friends if not already loaded
    _.isUndefined(this.props.friends) &&
      this.subscriptions.push(
        this.props.subscribeToFriends(this.props.ownerUserId)
      );
  }

  componentDidUpdate() {
    this.checkLoading();
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((unsubscribe) => {
      unsubscribe();
    });
  }

  checkLoading = () => {
    if (this.state.isLoading && this.props.friends !== undefined) {
      this.setState({ isLoading: false });
    }
  };

  renderItem = ({ item }: { item: User }) => {
    return <FriendSummaryRow isLoading={this.state.isLoading} {...item} />;
  };

  renderListHeader = () => {
    return _.isEmpty(this.props.pendingFriendshipUserIds) ? null : (
      <ActionRow
        // onPress={() => this.props.navigation.navigate('FindFriends', {})}
        iconName={names.ACCEPT_FRIEND}
        copy={`View your ${
          this.props.pendingFriendshipUserIds.length
        } pending friend requests!`}
      />
    );
  };

  render() {
    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={Colors.YELLOW}
          statusBarStyle='dark-content'
          shadow
          title={this.props.authIsOwner ? 'My Friends' : 'Their Friends'}
          back={globalRouter.back}
          rightIcons={
            this.props.authIsOwner ? (
              <Icon
                name={names.ADD_FRIEND}
                onPress={() => globalRouter.push(FindFriends)}
              />
            ) : (
              undefined
            )
          }
        />
        {/* <Button
          onPress={() =>
            this.props.createFriendship(
              'lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
              '96sTGJfd7RP24MhHslRVryAEkQ72'
            )
          }
          title='Send Friend Request'
        /> */}
        <List
          isLoading={this.state.isLoading}
          data={this.props.friends}
          renderItem={this.renderItem}
          ListHeaderComponent={() => this.renderListHeader()}
          noSeparator
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
)(Friends);

// {/* <Button
//             onPress={() =>
//               this.props.createFriendship(
//                 this.props.authUserId,
//                 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2'
//               )
//             }
//             title='Send Friend Request'
//           />
//           <Button
//             onPress={() =>
//               this.props.updateFriendship(
//                 this.props.authUserId,
//                 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
//                 'accepted'
//               )
//             }
//             title='Accept Friend Request'
//           />
//           <Button
//             onPress={() =>
//               this.props.updateFriendship(
//                 this.props.authUserId,
//                 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
//                 'rejected'
//               )
//             }
//             title='Reject Friend Request'
//           />
//           <Button
//             onPress={() =>
//               this.props.updateFriendship(
//                 this.props.authUserId,
//                 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
//                 'deleted'
//               )
//             }
//             title='Delete Friend Request'
//           />
//           <Button
//             onPress={() =>
//               this.props.updateFriendship(
//                 this.props.authUserId,
//                 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
//                 'removed'
//               )
//             }
//             title='Remove Friend'
//           /> */}
