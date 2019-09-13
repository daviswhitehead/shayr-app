import { documentIds, User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { View } from 'react-native';
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
import {
  formatUserForClient,
  formatUserForProfile,
  selectUserFromId
} from '../../redux/users/selectors';
import Colors from '../../styles/Colors';
import styles from './styles';

interface StateProps {
  authIsOwner?: boolean;
  authUser?: User;
  authUserId: string;
  pendingFriendshipUserIds: documentIds;
  friends: Array<User>;
}

interface DispatchProps {
  createFriendship: typeof createFriendship;
  updateFriendship: typeof updateFriendship;
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

const mapStateToProps = (state: State) => {
  const authUserId = selectAuthUserId(state);
  const ownerUserId = authUserId;

  return {
    authIsOwner: authUserId === ownerUserId,
    authUserId,
    authUser: selectUserFromId(state, authUserId, 'presentation'),
    friends: selectFlatListReadyDocuments(
      state,
      'users',
      selectListItems(
        state,
        'usersLists',
        generateListKey(authUserId, queryTypes.USER_FRIENDS)
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
    pendingFriendshipUserIds: selectPendingFriendshipUserIds(
      state,
      authUserId,
      'all'
    )
  };
};

const mapDispatchToProps = {
  createFriendship,
  updateFriendship
};

class Friends extends PureComponent<Props, OwnState> {
  static whyDidYouRender = true;

  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.checkLoading();
  }
  componentDidUpdate() {
    this.checkLoading();
  }

  checkLoading = () => {
    if (
      this.state.isLoading &&
      this.props.authUser !== undefined &&
      this.props.friends !== undefined
    ) {
      this.setState({ isLoading: false });
    }
  };

  renderItem = ({ item }: { item: User }) => {
    return <FriendSummaryRow isLoading={this.state.isLoading} {...item} />;
  };

  renderListHeader = () => {
    return _.isEmpty(this.props.pendingFriendshipUserIds) ? null : (
      <ActionRow
        onPress={() => this.props.navigation.navigate('FindFriends', {})}
        iconName={names.ACCEPT_FRIEND}
        copy={`View your ${
          this.props.pendingFriendshipUserIds.length
        }pending friend requests!`}
      />
    );
  };

  render() {
    console.log(`Friends - Render`);
    console.log('this.props');
    console.log(this.props);
    console.log('this.state');
    console.log(this.state);

    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={Colors.YELLOW}
          statusBarStyle='dark-content'
          shadow
          title={this.props.authIsOwner ? 'My Friends' : 'Their Friends'}
          back={
            this.props.navigation.state.key.slice(0, 3) === 'id-'
              ? undefined
              : () => this.props.navigation.goBack(null)
          }
          rightIcons={
            this.props.authIsOwner ? (
              <Icon
                name={names.ADD_FRIEND}
                onPress={() =>
                  this.props.navigation.navigate('FindFriends', {})
                }
              />
            ) : (
              undefined
            )
          }
        />
        <List
          isLoading={this.state.isLoading}
          data={this.props.friends}
          renderItem={this.renderItem}
          ListHeaderComponent={() => this.renderListHeader()}
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
