import { documentIds } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { SFC } from 'react';
import { Alert, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import {
  createFriendship,
  updateFriendship
} from '../../redux/friendships/actions';
import {
  awaitingRecipientAcceptance,
  friendRequestStatusIconMap,
  friendshipStatusIconMap,
  getFriendshipIdOrder,
  getFriendshipStatus
} from '../../redux/friendships/helpers';
import { selectPendingFriendshipUserIds } from '../../redux/friendships/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { selectUsersFromList } from '../../redux/users/selectors';

interface StateProps {
  authUserId: string;
  existingFriendIds: Array<documentIds>;
  pendingInitiatingFriendshipUserIds: Array<documentIds>;
  pendingReceivingFriendshipUserIds: Array<documentIds>;
}

interface DispatchProps {
  createFriendship: typeof createFriendship;
  updateFriendship: typeof updateFriendship;
}

interface OwnProps {
  userId: string;
  screen?: 'FindFriends';
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);
  const authFriends = selectUsersFromList(
    state,
    generateListKey(authUserId, queryTypes.USER_FRIENDS),
    'presentation'
  );
  return {
    authUserId,
    existingFriendIds: _.keys(authFriends),
    pendingInitiatingFriendshipUserIds: selectPendingFriendshipUserIds(
      state,
      authUserId,
      'initiating'
    ),
    pendingReceivingFriendshipUserIds: selectPendingFriendshipUserIds(
      state,
      authUserId,
      'receiving'
    )
  };
};

const mapDispatchToProps = {
  createFriendship,
  updateFriendship
};

const withFriendshipActions = (WrappedComponent: SFC) => (props: Props) => {
  const {
    // state
    authUserId,
    existingFriendIds = [],
    pendingInitiatingFriendshipUserIds = [],
    pendingReceivingFriendshipUserIds = [],
    // dispatch
    createFriendship,
    updateFriendship,
    // own
    userId,
    screen,
    ...passThroughProps
  } = props;

  const friendshipStatus = getFriendshipStatus(
    existingFriendIds,
    pendingReceivingFriendshipUserIds,
    pendingInitiatingFriendshipUserIds,
    userId
  );

  const friendshipIdOrder = getFriendshipIdOrder(
    pendingInitiatingFriendshipUserIds,
    authUserId,
    userId
  );

  let onFriendshipStatusPress;
  if (authUserId === userId) {
    onFriendshipStatusPress = undefined;
  } else if (friendshipStatus === 'is-friends') {
    onFriendshipStatusPress = () =>
      Alert.alert(
        'Remove Friend',
        'Would you like to remove this person from your friends list?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Yes',
            onPress: () =>
              updateFriendship(
                friendshipIdOrder[0],
                friendshipIdOrder[1],
                'removed'
              )
          }
        ]
      );
  } else if (friendshipStatus === 'can-accept-request') {
    onFriendshipStatusPress = () =>
      updateFriendship(friendshipIdOrder[0], friendshipIdOrder[1], 'accepted');
  } else if (friendshipStatus === 'needs-recipient-acceptance') {
    onFriendshipStatusPress = () => awaitingRecipientAcceptance();
  } else if (friendshipStatus === 'can-send-friend-request') {
    onFriendshipStatusPress = () =>
      createFriendship(friendshipIdOrder[0], friendshipIdOrder[1]);
  }

  return (
    <WrappedComponent
      friendshipStatus={friendshipStatus}
      onPress={onFriendshipStatusPress}
      isActive={friendshipStatus === 'is-friends'}
      name={
        screen === 'FindFriends'
          ? friendRequestStatusIconMap[friendshipStatus]
          : friendshipStatusIconMap[friendshipStatus]
      }
      {...passThroughProps}
    />
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    undefined,
    {
      areStatesEqual: (next, prev) => {
        const prevAuthUserId = selectAuthUserId(prev);
        const nextAuthUserId = selectAuthUserId(prev);

        return (
          nextAuthUserId === prevAuthUserId &&
          selectUsersFromList(
            next,
            generateListKey(nextAuthUserId, queryTypes.USER_FRIENDS),
            'presentation'
          ) ===
            selectUsersFromList(
              prev,
              generateListKey(prevAuthUserId, queryTypes.USER_FRIENDS),
              'presentation'
            ) &&
          selectPendingFriendshipUserIds(next, nextAuthUserId, 'initiating') ===
            selectPendingFriendshipUserIds(
              prev,
              prevAuthUserId,
              'initiating'
            ) &&
          selectPendingFriendshipUserIds(next, nextAuthUserId, 'receiving') ===
            selectPendingFriendshipUserIds(prev, prevAuthUserId, 'receiving')
        );
      }
    }
  ),
  withFriendshipActions
);
