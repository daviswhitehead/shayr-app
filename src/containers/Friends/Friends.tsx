import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import {
  NavigationScreenProp,
  NavigationScreenProps,
  NavigationState
} from 'react-navigation';
import { connect } from 'react-redux';
import FriendRequestRow from '../../components/FriendRequestRow';
import Header from '../../components/Header';
import Icon, { names } from '../../components/Icon';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import {
  createFriendship,
  updateFriendship
} from '../../redux/friendships/actions';
import { selectPendingFriendshipUserIds } from '../../redux/friendships/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { State } from '../../redux/Reducers';
import {
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import Colors from '../../styles/Colors';
import styles from './styles';

interface StateProps {
  authIsOwner?: boolean;
  authUser?: User;
  authUserId: string;
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

interface OwnState {}

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
    authUser: selectUserFromId(state, authUserId),
    friends: selectUsersFromList(
      state,
      generateListKey(authUserId, queryTypes.USER_FRIENDS),
      true
    ),
    pendingInitiatingFriendshipUserIds: selectPendingFriendshipUserIds(
      state,
      'initiating'
    ),
    pendingReceivingFriendshipUserIds: selectPendingFriendshipUserIds(
      state,
      'receiving'
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
  }

  componentDidMount() {}

  render() {
    console.log(`Friends - Render`);
    console.log('this.props');
    console.log(this.props);
    console.log('this.state');
    console.log(this.state);

    if (!this.props.authUser) {
      return <ActivityIndicator />;
    }

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
        <View style={styles.container}>
          <Button
            onPress={() =>
              this.props.createFriendship(
                this.props.authUserId,
                'lOnI91XOvdRnQe5Hmdrkf2TY5lH2'
              )
            }
            title='Send Friend Request'
          />
          <Button
            onPress={() =>
              this.props.updateFriendship(
                this.props.authUserId,
                'lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
                'accepted'
              )
            }
            title='Accept Friend Request'
          />
          <Button
            onPress={() =>
              this.props.updateFriendship(
                this.props.authUserId,
                'lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
                'rejected'
              )
            }
            title='Reject Friend Request'
          />
          <Button
            onPress={() =>
              this.props.updateFriendship(
                this.props.authUserId,
                'lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
                'deleted'
              )
            }
            title='Delete Friend Request'
          />
          <Button
            onPress={() =>
              this.props.updateFriendship(
                this.props.authUserId,
                'lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
                'removed'
              )
            }
            title='Remove Friend'
          />
          <FriendRequestRow
            {..._.get(
              this.props,
              ['friends', 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2'],
              {}
            )}
            // facebookProfilePhoto={''}
            // firstName={''}
            // lastName={''}
            friendStatus={
              (_.includes(
                this.props.pendingReceivingFriendshipUserIds,
                _.get(
                  this.props,
                  ['friends', 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2'],
                  ''
                )
              ) &&
                'can-accept-request') ||
              (_.includes(
                this.props.pendingInitiatingFriendshipUserIds,
                _.get(
                  this.props,
                  ['friends', 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2'],
                  ''
                )
              ) &&
                'needs-recipient-acceptance') ||
              'can-send-friend-request'
            }
          />
          <FriendRequestRow
            {..._.get(
              this.props,
              ['friends', 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2'],
              {}
            )}
            friendStatus={'can-accept-request'}
          />
          <FriendRequestRow
            {..._.get(
              this.props,
              ['friends', 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2'],
              {}
            )}
            friendStatus={'needs-recipient-acceptance'}
          />
          <FriendRequestRow
            {..._.get(
              this.props,
              ['friends', 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2'],
              {}
            )}
            friendStatus={'can-send-friend-request'}
          />
          <FriendRequestRow isLoading />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Friends);
